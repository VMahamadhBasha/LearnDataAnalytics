package com.ldawspt.repository;

import com.ldawspt.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<UserProgress> findByUserId(Long userId);

    @Query("SELECT up FROM UserProgress up WHERE up.user.id = :userId AND up.lesson.module.course.id = :courseId")
    List<UserProgress> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.user.id = :userId AND up.lesson.module.course.id = :courseId AND up.completed = true")
    long countCompletedLessonsByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);

    @Query("SELECT up FROM UserProgress up WHERE up.user.id = :userId ORDER BY up.lastAccessedAt DESC")
    List<UserProgress> findLastAccessedByUser(@Param("userId") Long userId);
}
