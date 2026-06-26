package com.ldawspt.dto;

public class LessonProgressRequest {

    private boolean completed;
    private int resumePositionSeconds;

    public LessonProgressRequest() {
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
}
