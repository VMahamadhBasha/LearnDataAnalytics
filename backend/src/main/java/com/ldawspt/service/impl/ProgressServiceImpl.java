package com.ldawspt.service.impl;

import com.ldawspt.dto.CourseProgressSummaryDto;
import com.ldawspt.dto.LessonProgressRequest;
import com.ldawspt.dto.StudentDashboardDto;
import com.ldawspt.dto.UserProgressDto;
import com.ldawspt.entity.*;
import com.ldawspt.exception.ResourceNotFoundException;
import com.ldawspt.repository.*;
import com.ldawspt.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressServiceImpl implements ProgressService {

    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final BookmarkRepository bookmarkRepository;
    private final CertificateRepository certificateRepository;

    @Autowired
    public ProgressServiceImpl(UserProgressRepository userProgressRepository, UserRepository userRepository,
                               LessonRepository lessonRepository, CourseRepository courseRepository,
                               BookmarkRepository bookmarkRepository, CertificateRepository certificateRepository) {
        this.userProgressRepository = userProgressRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.certificateRepository = certificateRepository;
    }

    @Override
    @Transactional
    public void updateLessonProgress(Long userId, Long lessonId, LessonProgressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        UserProgress progress = userProgressRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElseGet(() -> {
                    UserProgress newProgress = new UserProgress();
                    newProgress.setUser(user);
                    newProgress.setLesson(lesson);
                    newProgress.setCompleted(false);
                    return newProgress;
                });

        boolean wasCompleted = progress.isCompleted();
        progress.setResumePositionSeconds(request.getResumePositionSeconds());
        progress.setCompleted(request.isCompleted());
        progress.setLastAccessedAt(LocalDateTime.now());

        if (request.isCompleted() && !wasCompleted) {
            progress.setCompletedAt(LocalDateTime.now());
            
            /*
             * TODO: Email & Push Notifications Integration
             * - Why: Sending dynamic notifications keeps users motivated and confirms completion.
             * - Files to Change/Create:
             *   - Create EmailService.java: Inject JavaMailSender to dispatch HTML emails.
             *   - Create PushNotificationService.java: Integrate Firebase Admin SDK.
             *   - Add NotificationController.java: Let users toggle settings.
             * - Database Tables to Add:
             *   - `notifications`: id, user_id, title, message, status (unread/read), sent_at.
             * - APIs Required:
             *   - GET /api/notifications: Fetch recent notifications.
             *   - PUT /api/notifications/read: Mark as read.
             * - Implementation Approach:
             *   - Hook into progress updates. If course progress reaches 100%, trigger a background thread to:
             *     1. Send a congratulations email with the certificate attached or linked.
             *     2. Push a FCM alert to the mobile application.
             */
        }

        userProgressRepository.save(progress);
    }

    @Override
    public UserProgressDto getLessonProgress(Long userId, Long lessonId) {
        Optional<UserProgress> progressOpt = userProgressRepository.findByUserIdAndLessonId(userId, lessonId);
        return progressOpt.map(UserProgressDto::new).orElse(new UserProgressDto());
    }

    @Override
    public StudentDashboardDto getStudentDashboard(Long userId) {
        List<Course> courses = courseRepository.findByIsPublishedTrue();
        List<CourseProgressSummaryDto> summaries = new ArrayList<>();
        
        int inProgressCount = 0;
        int completedCount = 0;
        int totalWatched = 0;
        int totalDurationWatched = 0;

        for (Course course : courses) {
            long totalLessons = lessonRepository.countByCourseId(course.getId());
            if (totalLessons == 0) continue;

            List<UserProgress> progressList = userProgressRepository.findByUserIdAndCourseId(userId, course.getId());
            if (progressList.isEmpty()) {
                // User hasn't started this course yet
                continue;
            }

            long completedLessons = 0;
            LocalDateTime lastAccessed = null;
            Lesson lastLesson = null;

            for (UserProgress up : progressList) {
                if (up.isCompleted()) {
                    completedLessons++;
                    totalWatched++;
                    totalDurationWatched += up.getLesson().getDurationMinutes();
                }
                
                if (lastAccessed == null || up.getLastAccessedAt().isAfter(lastAccessed)) {
                    lastAccessed = up.getLastAccessedAt();
                    lastLesson = up.getLesson();
                }
            }

            int percentage = (int) ((completedLessons * 100) / totalLessons);
            
            if (percentage == 100) {
                completedCount++;
            } else if (percentage > 0) {
                inProgressCount++;
            }

            Long lastLessonId = lastLesson != null ? lastLesson.getId() : null;
            String lastLessonTitle = lastLesson != null ? lastLesson.getTitle() : null;

            summaries.add(new CourseProgressSummaryDto(
                    course.getId(),
                    course.getTitle(),
                    course.getCategory(),
                    course.getImageUrl(),
                    completedLessons,
                    totalLessons,
                    percentage,
                    lastLessonId,
                    lastLessonTitle
            ));
        }

        StudentDashboardDto dashboard = new StudentDashboardDto();
        dashboard.setInProgressCourses(inProgressCount);
        dashboard.setCompletedCourses(completedCount);
        dashboard.setTotalLessonsWatched(totalWatched);
        dashboard.setStudyTimeMinutes(totalDurationWatched);
        dashboard.setTotalCertificates(certificateRepository.findByUserId(userId).size());
        dashboard.setBookmarkCount(bookmarkRepository.findByUserId(userId).size());
        dashboard.setCourseSummaries(summaries);

        return dashboard;
    }
}
