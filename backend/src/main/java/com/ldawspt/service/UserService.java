package com.ldawspt.service;

import com.ldawspt.dto.PasswordChangeRequest;
import com.ldawspt.dto.ProfileUpdateRequest;
import com.ldawspt.dto.UserDto;
import com.ldawspt.entity.User;

public interface UserService {

    User registerStudent(com.ldawspt.dto.RegisterRequest registerRequest);

    UserDto getUserProfile(Long userId);

    UserDto updateProfile(Long userId, ProfileUpdateRequest request);

    void changePassword(Long userId, PasswordChangeRequest request);
}
