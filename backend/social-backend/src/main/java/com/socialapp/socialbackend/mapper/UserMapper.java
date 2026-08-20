package com.socialapp.socialbackend.mapper;

import com.socialapp.socialbackend.dto.UserRequest;
import com.socialapp.socialbackend.dto.UserResponse;
import com.socialapp.socialbackend.model.User;

public class UserMapper {

    public static User toEntity(UserRequest request) {

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return user;
    }

    public static UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}