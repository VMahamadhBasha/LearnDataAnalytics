package com.ldawspt.dto;

public class AdminDashboardDto {

    private long totalUsers;
    private long totalCourses;
    private long totalLessons;
    private long totalCertificates;

    public AdminDashboardDto() {
    }

    public AdminDashboardDto(long totalUsers, long totalCourses, long totalLessons, long totalCertificates) {
        this.totalUsers = totalUsers;
        this.totalCourses = totalCourses;
        this.totalLessons = totalLessons;
        this.totalCertificates = totalCertificates;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(long totalLessons) {
        this.totalLessons = totalLessons;
    }

    public long getTotalCertificates() {
        return totalCertificates;
    }

    public void setTotalCertificates(long totalCertificates) {
        this.totalCertificates = totalCertificates;
    }
}
