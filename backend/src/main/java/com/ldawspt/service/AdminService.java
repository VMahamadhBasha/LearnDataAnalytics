package com.ldawspt.service;

import com.ldawspt.dto.*;

import java.util.List;

public interface AdminService {

    AdminDashboardDto getAdminDashboard();

    List<UserDto> getAllUsers();

    UserDto toggleUserStatus(Long userId, boolean isActive);

    CourseDto createCourse(CourseDto courseDto);

    CourseDto updateCourse(Long courseId, CourseDto courseDto);

    void deleteCourse(Long courseId);

    ModuleDto createModule(ModuleDto moduleDto);

    ModuleDto updateModule(Long moduleId, ModuleDto moduleDto);

    void deleteModule(Long moduleId);

    LessonDto createLesson(LessonDto lessonDto);

    LessonDto updateLesson(Long lessonId, LessonDto lessonDto);

    void deleteLesson(Long lessonId);

    List<CertificateDto> getAllCertificates();

    CertificateDto regenerateCertificate(Long certificateId);
}
