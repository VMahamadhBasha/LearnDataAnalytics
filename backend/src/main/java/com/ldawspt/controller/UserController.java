package com.ldawspt.controller;

import com.ldawspt.dto.PasswordChangeRequest;
import com.ldawspt.dto.ProfileUpdateRequest;
import com.ldawspt.dto.UserDto;
import com.ldawspt.security.UserPrincipal;
import com.ldawspt.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserDto profile = userService.getUserProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                 @Valid @RequestBody ProfileUpdateRequest request) {
        UserDto updatedProfile = userService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/profile/password")
    public ResponseEntity<Map<String, Object>> changePassword(@AuthenticationPrincipal UserPrincipal currentUser,
                                                              @Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(currentUser.getId(), request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password changed successfully");

        return ResponseEntity.ok(response);
    }
}
