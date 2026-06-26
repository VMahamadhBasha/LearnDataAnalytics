package com.ldawspt.controller;

import com.ldawspt.dto.LessonProgressRequest;
import com.ldawspt.dto.StudentDashboardDto;
import com.ldawspt.dto.UserProgressDto;
import com.ldawspt.security.UserPrincipal;
import com.ldawspt.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller managing student learning progress.
 * 
 * TODO: Power BI / Tableau Project Submission
 * - Why: Validating hands-on skill is critical before issuing Snowflake or Power BI learning certificates.
 * - Files to Change/Create:
 *   - Create ProjectSubmission.java (JPA Entity).
 *   - Create SubmissionController.java to process file uploads (PBIX, TWBX format).
 *   - Modify ProgressController.java to prevent auto-certificates if project evaluations are pending.
 * - Database Tables to Add:
 *   - `project_submissions`: id, user_id, course_id, file_url, embed_url, grade (PASS/FAIL), reviewed_by, reviewed_at.
 * - APIs Required:
 *   - POST /api/submissions/upload: Upload file.
 *   - GET /api/submissions/course/{id}: Fetch review status.
 * - Implementation Approach:
 *   - Integrate with OCI Object Storage for storing pbix files.
 *   - Use iframe layouts to render Tableau dashboards.
 *   - Require admin review or automated test scripts (verifying model size/schema) to pass.
 */
@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    @Autowired
    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping("/lessons/{lessonId}")
    public ResponseEntity<Map<String, Object>> updateProgress(@AuthenticationPrincipal UserPrincipal currentUser,
                                                              @PathVariable("lessonId") Long lessonId,
                                                              @Valid @RequestBody LessonProgressRequest request) {
        progressService.updateLessonProgress(currentUser.getId(), lessonId, request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Progress updated successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<UserProgressDto> getLessonProgress(@AuthenticationPrincipal UserPrincipal currentUser,
                                                             @PathVariable("lessonId") Long lessonId) {
        UserProgressDto progress = progressService.getLessonProgress(currentUser.getId(), lessonId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardDto> getDashboard(@AuthenticationPrincipal UserPrincipal currentUser) {
        StudentDashboardDto dashboard = progressService.getStudentDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }
}
