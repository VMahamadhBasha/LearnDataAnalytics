package com.ldawspt.dto;

public class CourseProgressSummaryDto {

    private Long courseId;
    private String courseTitle;
    private String category;
    private String imageUrl;
    private long completedLessons;
    private long totalLessons;
    private int progressPercentage;
    private Long lastAccessedLessonId;
    private String lastAccessedLessonTitle;

    public CourseProgressSummaryDto() {
    }

    public CourseProgressSummaryDto(Long courseId, String courseTitle, String category, String imageUrl, 
                                     long completedLessons, long totalLessons, int progressPercentage, 
                                     Long lastAccessedLessonId, String lastAccessedLessonTitle) {
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.category = category;
        this.imageUrl = imageUrl;
        this.completedLessons = completedLessons;
        this.totalLessons = totalLessons;
        this.progressPercentage = progressPercentage;
        this.lastAccessedLessonId = lastAccessedLessonId;
        this.lastAccessedLessonTitle = lastAccessedLessonTitle;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public long getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(long completedLessons) {
        this.completedLessons = completedLessons;
    }

    public long getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(long totalLessons) {
        this.totalLessons = totalLessons;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(int progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Long getLastAccessedLessonId() {
        return lastAccessedLessonId;
    }

    public void setLastAccessedLessonId(Long lastAccessedLessonId) {
        this.lastAccessedLessonId = lastAccessedLessonId;
    }

    public String getLastAccessedLessonTitle() {
        return lastAccessedLessonTitle;
    }

    public void setLastAccessedLessonTitle(String lastAccessedLessonTitle) {
        this.lastAccessedLessonTitle = lastAccessedLessonTitle;
    }
}
