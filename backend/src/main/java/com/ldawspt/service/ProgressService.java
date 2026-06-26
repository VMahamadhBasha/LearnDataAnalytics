package com.ldawspt.service;

import com.ldawspt.dto.LessonProgressRequest;
import com.ldawspt.dto.StudentDashboardDto;
import com.ldawspt.dto.UserProgressDto;

public interface ProgressService {

    void updateLessonProgress(Long userId, Long lessonId, LessonProgressRequest request);

    UserProgressDto getLessonProgress(Long userId, Long lessonId);

    StudentDashboardDto getStudentDashboard(Long userId);
}
