package com.ldawspt.controller;

import com.ldawspt.dto.CourseDto;
import com.ldawspt.dto.LessonDto;
import com.ldawspt.dto.ModuleDto;
import com.ldawspt.security.UserPrincipal;
import com.ldawspt.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller to manage the Course Catalog, Lessons, and Bookmarks.
 * 
 * TODO: AI Learning Assistant, Doubt Solver, and Discussion Forum
 * - Why: Integrating interactive AI allows students to clear SQL query syntax or Snowflake architectural 
 *   doubts instantly. Forums enable peer-to-peer mentoring.
 * - Files to Change/Create:
 *   - Create AiAssistantService.java (connects to Gemini/Vertex API).
 *   - Create ForumController.java and PostRepository.java.
 *   - Modify CourseController.java to add AI prompt endpoints and Forum post mappings.
 * - Database Tables to Add:
 *   - `posts`: id, course_id, user_id, title, content, created_at.
 *   - `comments`: id, post_id, user_id, content, created_at.
 *   - `ai_conversations`: id, user_id, lesson_id, message, sender (USER/AI), timestamp.
 * - APIs Required:
 *   - POST /api/courses/lessons/{id}/doubt: Send question, returns AI response.
 *   - GET /api/courses/{id}/posts: Retrieve forum discussions.
 *   - POST /api/courses/{id}/posts: Write forum posts.
 * - Implementation Approach:
 *   - Setup Vector DB (e.g., Pinecone or pgvector) storing Snowflake / Power BI doc embeddings.
 *   - Match query embeddings, build RAG prompt context, query Gemini API.
 *   - Live classes will use WebRTC / Socket.io for visual streaming and chat overlays.
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseDto>> getCourses(@RequestParam(value = "category", required = false) String category,
                                                      @RequestParam(value = "search", required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(courseService.searchCourses(search.trim()));
        } else if (category != null && !category.trim().isEmpty()) {
            return ResponseEntity.ok(courseService.getCoursesByCategory(category.trim()));
        } else {
            return ResponseEntity.ok(courseService.getAllPublishedCourses());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable("id") Long id) {
        CourseDto course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/{id}/modules")
    public ResponseEntity<List<ModuleDto>> getCourseModules(@PathVariable("id") Long id) {
        List<ModuleDto> modules = courseService.getCourseModules(id);
        return ResponseEntity.ok(modules);
    }

    @GetMapping("/modules/{moduleId}/lessons")
    public ResponseEntity<List<LessonDto>> getModuleLessons(@AuthenticationPrincipal UserPrincipal currentUser,
                                                            @PathVariable("moduleId") Long moduleId) {
        Long userId = currentUser != null ? currentUser.getId() : null;
        List<LessonDto> lessons = courseService.getModuleLessons(userId, moduleId);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<LessonDto> getLessonById(@AuthenticationPrincipal UserPrincipal currentUser,
                                                    @PathVariable("lessonId") Long lessonId) {
        Long userId = currentUser != null ? currentUser.getId() : null;
        LessonDto lesson = courseService.getLessonById(userId, lessonId);
        return ResponseEntity.ok(lesson);
    }

    @PostMapping("/lessons/{lessonId}/bookmark")
    public ResponseEntity<Map<String, Object>> toggleBookmark(@AuthenticationPrincipal UserPrincipal currentUser,
                                                              @PathVariable("lessonId") Long lessonId) {
        courseService.toggleBookmark(currentUser.getId(), lessonId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Bookmark toggled successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<List<LessonDto>> getBookmarks(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<LessonDto> bookmarks = courseService.getBookmarkedLessons(currentUser.getId());
        return ResponseEntity.ok(bookmarks);
    }
}
