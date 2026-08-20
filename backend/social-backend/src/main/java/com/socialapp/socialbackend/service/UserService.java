package com.socialapp.socialbackend.service;

import com.socialapp.socialbackend.dto.LoginRequest;
import com.socialapp.socialbackend.dto.LoginResponse;
import com.socialapp.socialbackend.dto.UserRequest;
import com.socialapp.socialbackend.dto.UserResponse;
import com.socialapp.socialbackend.mapper.UserMapper;
import com.socialapp.socialbackend.model.User;
import com.socialapp.socialbackend.repository.UserRepository;
import com.socialapp.socialbackend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public UserResponse registerUser(UserRequest request) {

        User user = UserMapper.toEntity(request);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user = userRepository.save(user);

        return UserMapper.toResponse(user);
    }

    public LoginResponse loginUser(LoginRequest request) {

        Optional<User> optionalUser =
                userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }

    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }
}