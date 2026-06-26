package com.ldawspt.controller;

import com.ldawspt.dto.*;
import com.ldawspt.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller to handle all administrative and platform management capabilities.
 * 
 * TODO: Organization & Instructor Dashboards
 * - Why: Enterprise customers need features to register their employees (organization dashboard) 
 *   and track overall performance. Instructors need portals to manage assignments and answer forum posts.
 * - Files to Change/Create:
 *   - Create OrgDashboardController.java and InstructorController.java.
 *   - Implement Organization.java and TenantMapping.java entities.
 *   - Modify AdminController.java to enable delegated tenant administrations.
 * - Database Tables to Add:
 *   - `organizations`: id, name, domain, max_users, created_at.
 *   - `organization_users`: org_id, user_id, dept_name.
 *   - `instructors`: user_id, bio, specialization.
 * - APIs Required:
 *   - GET /api/admin/orgs: View registered business accounts.
 *   - GET /api/instructor/dashboard: Retrieve courses mapped to current instructor.
 * - Implementation Approach:
 *   - Introduce Multi-Tenancy partitioning in database schemas (using org_id filter columns).
 *   - Separate Spring Security roles: `ROLE_ORG_ADMIN` (for business customers) and `ROLE_INSTRUCTOR` (for tutors).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        AdminDashboardDto dashboard = adminService.getAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserDto> toggleUserStatus(@PathVariable("id") Long id,
                                                    @RequestParam("active") boolean active) {
        UserDto updatedUser = adminService.toggleUserStatus(id, active);
        return ResponseEntity.ok(updatedUser);
    }

    // Courses CRUD
    @PostMapping("/courses")
    public ResponseEntity<CourseDto> createCourse(@Valid @RequestBody CourseDto courseDto) {
        CourseDto created = adminService.createCourse(courseDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable("id") Long id,
                                                   @Valid @RequestBody CourseDto courseDto) {
        CourseDto updated = adminService.updateCourse(id, courseDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Map<String, Object>> deleteCourse(@PathVariable("id") Long id) {
        adminService.deleteCourse(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Course deleted successfully");

        return ResponseEntity.ok(response);
    }

    // Modules CRUD
    @PostMapping("/modules")
    public ResponseEntity<ModuleDto> createModule(@Valid @RequestBody ModuleDto moduleDto) {
        ModuleDto created = adminService.createModule(moduleDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/modules/{id}")
    public ResponseEntity<ModuleDto> updateModule(@PathVariable("id") Long id,
                                                   @Valid @RequestBody ModuleDto moduleDto) {
        ModuleDto updated = adminService.updateModule(id, moduleDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/modules/{id}")
    public ResponseEntity<Map<String, Object>> deleteModule(@PathVariable("id") Long id) {
        adminService.deleteModule(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Module deleted successfully");

        return ResponseEntity.ok(response);
    }

    // Lessons CRUD
    @PostMapping("/lessons")
    public ResponseEntity<LessonDto> createLesson(@Valid @RequestBody LessonDto lessonDto) {
        LessonDto created = adminService.createLesson(lessonDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<LessonDto> updateLesson(@PathVariable("id") Long id,
                                                   @Valid @RequestBody LessonDto lessonDto) {
        LessonDto updated = adminService.updateLesson(id, lessonDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<Map<String, Object>> deleteLesson(@PathVariable("id") Long id) {
        adminService.deleteLesson(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Lesson deleted successfully");

        return ResponseEntity.ok(response);
    }

    // Certificates Management
    @GetMapping("/certificates")
    public ResponseEntity<List<CertificateDto>> getAllCertificates() {
        List<CertificateDto> certificates = adminService.getAllCertificates();
        return ResponseEntity.ok(certificates);
    }

    @PostMapping("/certificates/{id}/regenerate")
    public ResponseEntity<CertificateDto> regenerateCertificate(@PathVariable("id") Long id) {
        CertificateDto regenerated = adminService.regenerateCertificate(id);
        return ResponseEntity.ok(regenerated);
    }
}
