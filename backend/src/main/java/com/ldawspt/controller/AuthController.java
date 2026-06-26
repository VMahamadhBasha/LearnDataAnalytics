package com.ldawspt.controller;

import com.ldawspt.dto.JwtResponse;
import com.ldawspt.dto.LoginRequest;
import com.ldawspt.dto.RegisterRequest;
import com.ldawspt.entity.User;
import com.ldawspt.security.JwtTokenProvider;
import com.ldawspt.security.UserPrincipal;
import com.ldawspt.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller handling user registration and login authentication.
 * 
 * TODO: Mobile App API Integration
 * - Why: Extending the platform to iOS and Android requires adjustments in authentication configurations 
 *   to allow token refresh cycles, biometric login integrations, and push register triggers.
 * - Files to Change/Create:
 *   - Create MobileAuthController.java to support OAuth2 password grants / Authorization Code flows.
 *   - Implement RefreshToken.java (JPA Entity) and RefreshTokenRepository.java.
 *   - Modify SecurityConfig.java to expose token refresh paths and permit non-browser agents.
 * - Database Tables to Add:
 *   - `refresh_tokens`: id, user_id, token, expiry_date.
 * - APIs Required:
 *   - POST /api/auth/refresh: Re-issue JWT using a refresh token.
 *   - POST /api/auth/mobile-login: Native biometric signature login.
 * - Implementation Approach:
 *   - Issue short-lived access tokens (e.g., 15 minutes) and long-lived refresh tokens (e.g., 30 days) stored securely.
 *   - Secure cookies or bearer authorization headers are processed via mobile client interceptors.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User registeredUser = userService.registerStudent(registerRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("userId", registeredUser.getId());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, userPrincipal.getId(), userPrincipal.getUsername(), userPrincipal.getEmail(), roles));
    }
}
