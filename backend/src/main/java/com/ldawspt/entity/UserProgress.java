package com.ldawspt.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing progress of a User on a specific Lesson.
 */
@Entity
@Table(
    name = "user_progress",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "lesson_id"})}
)
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "last_accessed_at", nullable = false)
    private LocalDateTime lastAccessedAt;

    @Column(name = "resume_position_seconds", nullable = false)
    private int resumePositionSeconds = 0;

    public UserProgress() {
    }

    public UserProgress(User user, Lesson lesson, boolean completed) {
        this.user = user;
        this.lesson = lesson;
        this.completed = completed;
        this.lastAccessedAt = LocalDateTime.now();
        if (completed) {
            this.completedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public int getResumePositionSeconds() {
        return resumePositionSeconds;
    }

    public void setResumePositionSeconds(int resumePositionSeconds) {
        this.resumePositionSeconds = resumePositionSeconds;
    }
}
