package com.socialapp.socialbackend.controller;
import com.socialapp.socialbackend.dto.LoginResponse;


import com.socialapp.socialbackend.dto.LoginRequest;
import com.socialapp.socialbackend.dto.LoginResponse;
import com.socialapp.socialbackend.dto.UserRequest;
import com.socialapp.socialbackend.dto.UserResponse;
import com.socialapp.socialbackend.service.UserService;
import com.socialapp.socialbackend.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> registerUser(@Valid @RequestBody UserRequest request) {

        UserResponse response = userService.registerUser(request);

        return new ApiResponse<>(
                true,
                "User registered successfully",
                response
        );
    }

    @PostMapping("/login")
    public LoginResponse loginUser(
            @RequestBody LoginRequest request
    ) {
        return userService.loginUser(request);
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {

        return new ApiResponse<>(
                true,
                "Users fetched successfully",
                userService.getAllUsers()
        );
    }
}