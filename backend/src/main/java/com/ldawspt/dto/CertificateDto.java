package com.ldawspt.dto;

import com.ldawspt.entity.Certificate;
import java.time.LocalDateTime;

public class CertificateDto {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private String studentUsername;
    private String studentFullName;
    private String certificateUuid;
    private LocalDateTime issueDate;
    private String downloadUrl;

    public CertificateDto() {
    }

    public CertificateDto(Certificate certificate) {
        this.id = certificate.getId();
        this.courseId = certificate.getCourse().getId();
        this.courseTitle = certificate.getCourse().getTitle();
        this.studentUsername = certificate.getUser().getUsername();
        this.studentFullName = certificate.getUser().getFirstName() + " " + certificate.getUser().getLastName();
        this.certificateUuid = certificate.getCertificateUuid();
        this.issueDate = certificate.getIssueDate();
        this.downloadUrl = certificate.getDownloadUrl();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStudentUsername() {
        return studentUsername;
    }

    public void setStudentUsername(String studentUsername) {
        this.studentUsername = studentUsername;
    }

    public String getStudentFullName() {
        return studentFullName;
    }

    public void setStudentFullName(String studentFullName) {
        this.studentFullName = studentFullName;
    }

    public String getCertificateUuid() {
        return certificateUuid;
    }

    public void setCertificateUuid(String certificateUuid) {
        this.certificateUuid = certificateUuid;
    }

    public LocalDateTime getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDateTime issueDate) {
        this.issueDate = issueDate;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }
}
