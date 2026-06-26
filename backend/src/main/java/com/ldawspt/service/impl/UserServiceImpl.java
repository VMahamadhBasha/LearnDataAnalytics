package com.ldawspt.service.impl;

import com.ldawspt.dto.PasswordChangeRequest;
import com.ldawspt.dto.ProfileUpdateRequest;
import com.ldawspt.dto.RegisterRequest;
import com.ldawspt.dto.UserDto;
import com.ldawspt.entity.Role;
import com.ldawspt.entity.User;
import com.ldawspt.exception.BadRequestException;
import com.ldawspt.exception.ResourceNotFoundException;
import com.ldawspt.repository.RoleRepository;
import com.ldawspt.repository.UserRepository;
import com.ldawspt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public User registerStudent(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address is already in use");
        }

        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getFirstName(),
                registerRequest.getLastName()
        );

        // Assign STUDENT role by default
        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new ResourceNotFoundException("Role STUDENT not found in database. Seed data check required."));
        Set<Role> roles = new HashSet<>();
        roles.add(studentRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Override
    public UserDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return new UserDto(user);
    }

    @Override
    @Transactional
    public UserDto updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check email uniqueness if email is changing
        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, PasswordChangeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        /*
         * TODO: Leaderboards & Learning Streaks Implementation
         * - Why: Rewarding consistent habits (daily logging/studying) increases student engagement.
         * - Files to Change/Create:
         *   - Modify User.java: Add `current_streak (int)` and `last_study_date (LocalDate)` fields.
         *   - Create StreakSchedulerService.java (scheduled daily job) to recalculate or reset streaks.
         *   - Create LeaderboardDto.java to hold score rankings.
         * - Database Tables to Add:
         *   - `streaks`: id, user_id, start_date, end_date, active (to track historic streaks).
         * - APIs Required:
         *   - GET /api/leaderboard: Retrieve top 50 users based on course progress and streak multipliers.
         * - Implementation Approach:
         *   - On any lesson progress update, compare `LocalDate.now()` with `last_study_date`.
         *   - If difference is exactly 1 day, increment `current_streak`. If > 1 day, reset `current_streak` to 1.
         *   - Schedule a Spring Batch job at midnight to check inactive users and reset current streaks.
         */
    }
}
