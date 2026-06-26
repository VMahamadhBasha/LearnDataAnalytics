package com.ldawspt.dto;

import com.ldawspt.entity.UserProgress;
import java.time.LocalDateTime;

public class UserProgressDto {

    private Long lessonId;
    private boolean completed;
    private int resumePositionSeconds;
    private LocalDateTime lastAccessedAt;
    private LocalDateTime completedAt;

    public UserProgressDto() {
    }

    public UserProgressDto(UserProgress progress) {
        this.lessonId = progress.getLesson().getId();
        this.completed = progress.isCompleted();
        this.resumePositionSeconds = progress.getResumePositionSeconds();
        this.lastAccessedAt = progress.getLastAccessedAt();
        this.completedAt = progress.getCompletedAt();
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public int getResumePositionSeconds() {
        return resumePositionSeconds;
    }

    public void setResumePositionSeconds(int resumePositionSeconds) {
        this.resumePositionSeconds = resumePositionSeconds;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
