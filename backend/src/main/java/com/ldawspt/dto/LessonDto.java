package com.ldawspt.dto;

import com.ldawspt.entity.Lesson;

public class LessonDto {

    private Long id;
    private Long moduleId;
    private String title;
    private String description;
    private String contentType;
    private String youtubeVideoId;
    private String pdfUrl;
    private String practiceFileUrl;
    private int orderIndex;
    private int durationMinutes;
    private boolean bookmarked;

    public LessonDto() {
    }

    public LessonDto(Lesson lesson) {
        this.id = lesson.getId();
        this.moduleId = lesson.getModule().getId();
        this.title = lesson.getTitle();
        this.description = lesson.getDescription();
        this.contentType = lesson.getContentType();
        this.youtubeVideoId = lesson.getYoutubeVideoId();
        this.pdfUrl = lesson.getPdfUrl();
        this.practiceFileUrl = lesson.getPracticeFileUrl();
        this.orderIndex = lesson.getOrderIndex();
        this.durationMinutes = lesson.getDurationMinutes();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getYoutubeVideoId() {
        return youtubeVideoId;
    }

    public void setYoutubeVideoId(String youtubeVideoId) {
        this.youtubeVideoId = youtubeVideoId;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public String getPracticeFileUrl() {
        return practiceFileUrl;
    }

    public void setPracticeFileUrl(String practiceFileUrl) {
        this.practiceFileUrl = practiceFileUrl;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public boolean isBookmarked() {
        return bookmarked;
    }

    public void setBookmarked(boolean bookmarked) {
        this.bookmarked = bookmarked;
    }
}
