package com.ldawspt.service;

import com.ldawspt.dto.CourseDto;
import com.ldawspt.dto.LessonDto;
import com.ldawspt.dto.ModuleDto;

import java.util.List;

public interface CourseService {

    List<CourseDto> getAllPublishedCourses();

    List<CourseDto> getCoursesByCategory(String category);

    CourseDto getCourseById(Long courseId);

    List<ModuleDto> getCourseModules(Long courseId);

    List<LessonDto> getModuleLessons(Long userId, Long moduleId);

    LessonDto getLessonById(Long userId, Long lessonId);

    List<CourseDto> searchCourses(String query);

    List<LessonDto> searchLessons(String query);

    void toggleBookmark(Long userId, Long lessonId);

    List<LessonDto> getBookmarkedLessons(Long userId);
}
