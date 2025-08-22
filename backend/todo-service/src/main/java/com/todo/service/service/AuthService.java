package com.todo.service.service;

import com.todo.service.dto.AuthResponse;
import com.todo.service.dto.LoginRequest;
import com.todo.service.dto.RegisterRequest;
import com.todo.service.entity.User;
import com.todo.service.repository.UserRepository;
import com.todo.service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());
        
        // Check if user already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getUsername());
        
        log.info("User registered successfully: {}", savedUser.getUsername());
        
        return new AuthResponse(
            token,
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getFirstName(),
            savedUser.getLastName()
        );
    }

    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt: {}", request.getUsernameOrEmail());
        
        // Find user by username or email
        User user = userRepository.findByUsernameOrEmail(
            request.getUsernameOrEmail(), 
            request.getUsernameOrEmail()
        ).orElseThrow(() -> new RuntimeException("User not found!"));
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }
        
        if (!user.isEnabled()) {
            throw new RuntimeException("User account is disabled!");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername());
        
        log.info("User logged in successfully: {}", user.getUsername());
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName()
        );
    }

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}
