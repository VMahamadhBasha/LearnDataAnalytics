package com.ldawspt.service.impl;

import com.ldawspt.dto.*;
import com.ldawspt.entity.*;
import com.ldawspt.entity.Module;
import com.ldawspt.exception.ResourceNotFoundException;
import com.ldawspt.repository.*;
import com.ldawspt.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final CertificateRepository certificateRepository;

    @Autowired
    public AdminServiceImpl(UserRepository userRepository, CourseRepository courseRepository,
                            ModuleRepository moduleRepository, LessonRepository lessonRepository,
                            CertificateRepository certificateRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.certificateRepository = certificateRepository;
    }

    @Override
    public AdminDashboardDto getAdminDashboard() {
        long totalUsers = userRepository.count();
        long totalCourses = courseRepository.count();
        long totalLessons = lessonRepository.count();
        long totalCertificates = certificateRepository.count();

        return new AdminDashboardDto(totalUsers, totalCourses, totalLessons, totalCertificates);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto toggleUserStatus(Long userId, boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        user.setActive(isActive);
        User savedUser = userRepository.save(user);
        return new UserDto(savedUser);
    }

    @Override
    @Transactional
    public CourseDto createCourse(CourseDto courseDto) {
        Course course = new Course(
                courseDto.getTitle(),
                courseDto.getDescription(),
                courseDto.getCategory(),
                courseDto.getDifficultyLevel(),
                courseDto.getImageUrl(),
                courseDto.isPublished()
        );
        Course savedCourse = courseRepository.save(course);
        return new CourseDto(savedCourse);
    }

    @Override
    @Transactional
    public CourseDto updateCourse(Long courseId, CourseDto courseDto) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setCategory(courseDto.getCategory());
        course.setDifficultyLevel(courseDto.getDifficultyLevel());
        course.setImageUrl(courseDto.getImageUrl());
        course.setPublished(courseDto.isPublished());

        Course savedCourse = courseRepository.save(course);
        return new CourseDto(savedCourse);
    }

    @Override
    @Transactional
    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        courseRepository.deleteById(courseId);
    }

    @Override
    @Transactional
    public ModuleDto createModule(ModuleDto moduleDto) {
        Course course = courseRepository.findById(moduleDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + moduleDto.getCourseId()));

        Module module = new Module(
                course,
                moduleDto.getTitle(),
                moduleDto.getDescription(),
                moduleDto.getOrderIndex()
        );
        Module savedModule = moduleRepository.save(module);
        return new ModuleDto(savedModule);
    }

    @Override
    @Transactional
    public ModuleDto updateModule(Long moduleId, ModuleDto moduleDto) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));

        module.setTitle(moduleDto.getTitle());
        module.setDescription(moduleDto.getDescription());
        module.setOrderIndex(moduleDto.getOrderIndex());

        Module savedModule = moduleRepository.save(module);
        return new ModuleDto(savedModule);
    }

    @Override
    @Transactional
    public void deleteModule(Long moduleId) {
        if (!moduleRepository.existsById(moduleId)) {
            throw new ResourceNotFoundException("Module not found with id: " + moduleId);
        }
        moduleRepository.deleteById(moduleId);
    }

    @Override
    @Transactional
    public LessonDto createLesson(LessonDto lessonDto) {
        Module module = moduleRepository.findById(lessonDto.getModuleId())
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + lessonDto.getModuleId()));

        Lesson lesson = new Lesson();
        lesson.setModule(module);
        lesson.setTitle(lessonDto.getTitle());
        lesson.setDescription(lessonDto.getDescription());
        lesson.setContentType(lessonDto.getContentType());
        lesson.setYoutubeVideoId(lessonDto.getYoutubeVideoId());
        lesson.setPdfUrl(lessonDto.getPdfUrl());
        lesson.setPracticeFileUrl(lessonDto.getPracticeFileUrl());
        lesson.setOrderIndex(lessonDto.getOrderIndex());
        lesson.setDurationMinutes(lessonDto.getDurationMinutes());

        Lesson savedLesson = lessonRepository.save(lesson);
        return new LessonDto(savedLesson);
    }

    @Override
    @Transactional
    public LessonDto updateLesson(Long lessonId, LessonDto lessonDto) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        lesson.setTitle(lessonDto.getTitle());
        lesson.setDescription(lessonDto.getDescription());
        lesson.setContentType(lessonDto.getContentType());
        lesson.setYoutubeVideoId(lessonDto.getYoutubeVideoId());
        lesson.setPdfUrl(lessonDto.getPdfUrl());
        lesson.setPracticeFileUrl(lessonDto.getPracticeFileUrl());
        lesson.setOrderIndex(lessonDto.getOrderIndex());
        lesson.setDurationMinutes(lessonDto.getDurationMinutes());

        Lesson savedLesson = lessonRepository.save(lesson);
        return new LessonDto(savedLesson);
    }

    @Override
    @Transactional
    public void deleteLesson(Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Lesson not found with id: " + lessonId);
        }
        lessonRepository.deleteById(lessonId);
    }

    @Override
    public List<CertificateDto> getAllCertificates() {
        return certificateRepository.findAll().stream()
                .map(CertificateDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CertificateDto regenerateCertificate(Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + certificateId));

        String newUuid = UUID.randomUUID().toString();
        certificate.setCertificateUuid(newUuid);
        certificate.setDownloadUrl("/api/certificates/download/" + newUuid);

        Certificate savedCertificate = certificateRepository.save(certificate);
        return new CertificateDto(savedCertificate);
    }
}
