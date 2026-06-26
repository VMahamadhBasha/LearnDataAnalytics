package com.ldawspt.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing course completion certificates earned by students.
 */
@Entity
@Table(
    name = "certificates",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "course_id"})}
)
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "certificate_uuid", unique = true, nullable = false, length = 100)
    private String certificateUuid;

    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate;

    @Column(name = "download_url", length = 255)
    private String downloadUrl;

    @PrePersist
    protected void onCreate() {
        if (issueDate == null) {
            issueDate = LocalDateTime.now();
        }
    }

    public Certificate() {
    }

    public Certificate(User user, Course course, String certificateUuid, String downloadUrl) {
        this.user = user;
        this.course = course;
        this.certificateUuid = certificateUuid;
        this.downloadUrl = downloadUrl;
        this.issueDate = LocalDateTime.now();
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

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
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
