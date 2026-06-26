package com.ldawspt.service.impl;

import com.ldawspt.dto.CertificateDto;
import com.ldawspt.entity.Certificate;
import com.ldawspt.entity.Course;
import com.ldawspt.entity.User;
import com.ldawspt.exception.BadRequestException;
import com.ldawspt.exception.ResourceNotFoundException;
import com.ldawspt.repository.*;
import com.ldawspt.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final UserProgressRepository userProgressRepository;
    private final LessonRepository lessonRepository;

    @Autowired
    public CertificateServiceImpl(CertificateRepository certificateRepository, UserRepository userRepository,
                                  CourseRepository courseRepository, UserProgressRepository userProgressRepository,
                                  LessonRepository lessonRepository) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.userProgressRepository = userProgressRepository;
        this.lessonRepository = lessonRepository;
    }

    @Override
    @Transactional
    public CertificateDto getOrCreateCertificate(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        // 1. Verify that the course is completed
        long totalLessons = lessonRepository.countByCourseId(courseId);
        if (totalLessons == 0) {
            throw new BadRequestException("This course does not contain any lessons yet.");
        }

        long completedLessons = userProgressRepository.countCompletedLessonsByUserIdAndCourseId(userId, courseId);

        if (completedLessons < totalLessons) {
            throw new BadRequestException("Course is not completed yet. You completed " + completedLessons + " out of " + totalLessons + " lessons.");
        }

        // 2. Check if a certificate has already been issued
        Optional<Certificate> existingCertificate = certificateRepository.findByUserIdAndCourseId(userId, courseId);
        if (existingCertificate.isPresent()) {
            return new CertificateDto(existingCertificate.get());
        }

        // 3. Generate a new certificate
        String certificateUuid = UUID.randomUUID().toString();
        // The downloadUrl will point to the GET /api/certificates/download/{uuid} endpoint
        String downloadUrl = "/api/certificates/download/" + certificateUuid;

        Certificate certificate = new Certificate(user, course, certificateUuid, downloadUrl);
        Certificate savedCertificate = certificateRepository.save(certificate);

        return new CertificateDto(savedCertificate);
    }

    @Override
    public List<CertificateDto> getCertificatesByUserId(Long userId) {
        List<Certificate> certificates = certificateRepository.findByUserId(userId);
        return certificates.stream()
                .map(CertificateDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Certificate getCertificateEntityByUuid(String uuid) {
        return certificateRepository.findByCertificateUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with verification token: " + uuid));
    }
}
