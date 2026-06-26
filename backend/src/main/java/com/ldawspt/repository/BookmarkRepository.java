package com.ldawspt.repository;

import com.ldawspt.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    Optional<Bookmark> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<Bookmark> findByUserId(Long userId);

    boolean existsByUserIdAndLessonId(Long userId, Long lessonId);
}
