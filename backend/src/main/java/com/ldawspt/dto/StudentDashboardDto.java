package com.ldawspt.dto;

import java.util.List;

public class StudentDashboardDto {

    private int inProgressCourses;
    private int completedCourses;
    private int totalLessonsWatched;
    private int totalCertificates;
    private int bookmarkCount;
    private int studyTimeMinutes;
    private List<CourseProgressSummaryDto> courseSummaries;

    public StudentDashboardDto() {
    }

    public int getInProgressCourses() {
        return inProgressCourses;
    }

    public void setInProgressCourses(int inProgressCourses) {
        this.inProgressCourses = inProgressCourses;
    }

    public int getCompletedCourses() {
        return completedCourses;
    }

    public void setCompletedCourses(int completedCourses) {
        this.completedCourses = completedCourses;
    }

    public int getTotalLessonsWatched() {
        return totalLessonsWatched;
    }

    public void setTotalLessonsWatched(int totalLessonsWatched) {
        this.totalLessonsWatched = totalLessonsWatched;
    }

    public int getTotalCertificates() {
        return totalCertificates;
    }

    public void setTotalCertificates(int totalCertificates) {
        this.totalCertificates = totalCertificates;
    }

    public int getBookmarkCount() {
        return bookmarkCount;
    }

    public void setBookmarkCount(int bookmarkCount) {
        this.bookmarkCount = bookmarkCount;
    }

    public int getStudyTimeMinutes() {
        return studyTimeMinutes;
    }

    public void setStudyTimeMinutes(int studyTimeMinutes) {
        this.studyTimeMinutes = studyTimeMinutes;
    }

    public List<CourseProgressSummaryDto> getCourseSummaries() {
        return courseSummaries;
    }

    public void setCourseSummaries(List<CourseProgressSummaryDto> courseSummaries) {
        this.courseSummaries = courseSummaries;
    }
}
