package com.ldawspt.service.impl;

import com.ldawspt.dto.CourseDto;
import com.ldawspt.dto.LessonDto;
import com.ldawspt.dto.ModuleDto;
import com.ldawspt.entity.Bookmark;
import com.ldawspt.entity.Course;
import com.ldawspt.entity.Lesson;
import com.ldawspt.entity.Module;
import com.ldawspt.entity.User;
import com.ldawspt.exception.ResourceNotFoundException;
import com.ldawspt.repository.*;
import com.ldawspt.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository, ModuleRepository moduleRepository,
                             LessonRepository lessonRepository, BookmarkRepository bookmarkRepository,
                             UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<CourseDto> getAllPublishedCourses() {
        /*
         * TODO: Redis Caching Integration
         * - Why: Fetching the entire course catalog on every visitor click hits MySQL repeatedly. 
         *   Caching it reduces read latency to sub-milliseconds.
         * - Files to Change/Create:
         *   - Modify CourseServiceImpl.java: Add Spring Cache annotations (`@Cacheable(value = "courses")`).
         *   - Create RedisConfig.java to customize jackson serialization and configure RedisConnectionFactory.
         *   - Update application.properties to configure Redis host, port, and default TTL (e.g. 1 hour).
         * - APIs Required:
         *   - All read APIs for course catalogs benefit from caching.
         * - Implementation Approach:
         *   - Use `@Cacheable(value = "courses", key = "'all_published'")` for `getAllPublishedCourses`.
         *   - Use `@CacheEvict(value = "courses", allEntries = true)` on any admin modifications (create/edit/delete course).
         */
        return courseRepository.findByIsPublishedTrue().stream()
                .map(CourseDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseDto> getCoursesByCategory(String category) {
        return courseRepository.findByIsPublishedTrueAndCategory(category).stream()
                .map(CourseDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDto getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        return new CourseDto(course);
    }

    @Override
    public List<ModuleDto> getCourseModules(Long courseId) {
        return moduleRepository.findByCourseIdOrderByOrderIndexAsc(courseId).stream()
                .map(ModuleDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<LessonDto> getModuleLessons(Long userId, Long moduleId) {
        List<Lesson> lessons = lessonRepository.findByModuleIdOrderByOrderIndexAsc(moduleId);
        return lessons.stream().map(lesson -> {
            LessonDto dto = new LessonDto(lesson);
            if (userId != null) {
                dto.setBookmarked(bookmarkRepository.existsByUserIdAndLessonId(userId, lesson.getId()));
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public LessonDto getLessonById(Long userId, Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        
        LessonDto dto = new LessonDto(lesson);
        if (userId != null) {
            dto.setBookmarked(bookmarkRepository.existsByUserIdAndLessonId(userId, lessonId));
        }
        return dto;
    }

    @Override
    public List<CourseDto> searchCourses(String query) {
        return courseRepository.searchCourses(query).stream()
                .map(CourseDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<LessonDto> searchLessons(String query) {
        return lessonRepository.searchLessons(query).stream()
                .map(LessonDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void toggleBookmark(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        Optional<Bookmark> bookmarkOpt = bookmarkRepository.findByUserIdAndLessonId(userId, lessonId);
        if (bookmarkOpt.isPresent()) {
            bookmarkRepository.delete(bookmarkOpt.get());
        } else {
            Bookmark bookmark = new Bookmark(user, lesson);
            bookmarkRepository.save(bookmark);
        }
    }

    @Override
    public List<LessonDto> getBookmarkedLessons(Long userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        return bookmarks.stream()
                .map(bookmark -> new LessonDto(bookmark.getLesson()))
                .collect(Collectors.toList());
    }
}
