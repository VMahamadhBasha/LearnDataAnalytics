package com.ldawspt.service;

import com.ldawspt.dto.CourseDto;
import com.ldawspt.dto.LessonDto;
import com.ldawspt.entity.Bookmark;
import com.ldawspt.entity.Course;
import com.ldawspt.entity.Lesson;
import com.ldawspt.entity.User;
import com.ldawspt.exception.ResourceNotFoundException;
import com.ldawspt.repository.*;
import com.ldawspt.service.impl.CourseServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private ModuleRepository moduleRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private BookmarkRepository bookmarkRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CourseServiceImpl courseService;

    private Course course1;
    private Course course2;

    @BeforeEach
    void setUp() {
        course1 = new Course();
        course1.setId(1L);
        course1.setTitle("Snowflake Cloud Data Warehousing");
        course1.setCategory("SNOWFLAKE");
        course1.setDifficultyLevel("INTERMEDIATE");
        course1.setPublished(true);

        course2 = new Course();
        course2.setId(2L);
        course2.setTitle("Power BI Advanced DAX");
        course2.setCategory("POWER_BI");
        course2.setDifficultyLevel("ADVANCED");
        course2.setPublished(false);
    }

    @Test
    void getAllPublishedCourses_Success() {
        // Arrange
        when(courseRepository.findByIsPublishedTrue()).thenReturn(Arrays.asList(course1));

        // Act
        List<CourseDto> result = courseService.getAllPublishedCourses();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Snowflake Cloud Data Warehousing", result.get(0).getTitle());
        verify(courseRepository, times(1)).findByIsPublishedTrue();
    }

    @Test
    void getCourseById_NotFound_ThrowsException() {
        // Arrange
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> courseService.getCourseById(99L));
        verify(courseRepository, times(1)).findById(99L);
    }

    @Test
    void toggleBookmark_AddBookmark() {
        // Arrange
        User user = new User();
        user.setId(10L);
        Lesson lesson = new Lesson();
        lesson.setId(20L);

        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(lessonRepository.findById(20L)).thenReturn(Optional.of(lesson));
        when(bookmarkRepository.findByUserIdAndLessonId(10L, 20L)).thenReturn(Optional.empty());

        // Act
        courseService.toggleBookmark(10L, 20L);

        // Assert
        verify(bookmarkRepository, times(1)).save(any(Bookmark.class));
        verify(bookmarkRepository, never()).delete(any(Bookmark.class));
    }

    @Test
    void toggleBookmark_RemoveBookmark() {
        // Arrange
        User user = new User();
        user.setId(10L);
        Lesson lesson = new Lesson();
        lesson.setId(20L);
        Bookmark bookmark = new Bookmark(user, lesson);

        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(lessonRepository.findById(20L)).thenReturn(Optional.of(lesson));
        when(bookmarkRepository.findByUserIdAndLessonId(10L, 20L)).thenReturn(Optional.of(bookmark));

        // Act
        courseService.toggleBookmark(10L, 20L);

        // Assert
        verify(bookmarkRepository, times(1)).delete(bookmark);
        verify(bookmarkRepository, never()).save(any(Bookmark.class));
    }
}
