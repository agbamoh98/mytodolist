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
        log.info("=== STARTING USER REGISTRATION ===");
        log.info("Registering new user: {}", request.getUsername());
        log.info("Email: {}", request.getEmail());
        log.info("First Name: {}", request.getFirstName());
        log.info("Last Name: {}", request.getLastName());
        
        try {
            // Check if user already exists
            log.info("Checking if username exists: {}", request.getUsername());
            boolean usernameExists = userRepository.existsByUsername(request.getUsername());
            log.info("Username exists check result: {}", usernameExists);
            
            if (usernameExists) {
                log.error("Username is already taken: {}", request.getUsername());
                throw new RuntimeException("Username is already taken!");
            }
            
            log.info("Checking if email exists: {}", request.getEmail());
            boolean emailExists = userRepository.existsByEmail(request.getEmail());
            log.info("Email exists check result: {}", emailExists);
            
            if (emailExists) {
                log.error("Email is already in use: {}", request.getEmail());
                throw new RuntimeException("Email is already in use!");
            }

            // Create new user
            log.info("Creating new User entity...");
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            
            log.info("Encoding password...");
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            user.setPassword(encodedPassword);
            log.info("Password encoded successfully");
            
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEnabled(false); // User must verify email before being enabled
            
            log.info("User entity created, about to save to database...");
            log.info("User details - Username: {}, Email: {}, FirstName: {}, LastName: {}, Enabled: {}", 
                user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName(), user.isEnabled());

            User savedUser = userRepository.save(user);
            log.info("User saved successfully with ID: {}", savedUser.getId());
            
            // Generate JWT token
            log.info("Generating JWT token...");
            String token = jwtUtil.generateToken(savedUser.getUsername());
            log.info("JWT token generated successfully");
            
            log.info("User registered successfully: {}", savedUser.getUsername());
            log.info("=== USER REGISTRATION COMPLETED ===");
            
            return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName()
            );
            
        } catch (Exception e) {
            log.error("=== REGISTRATION FAILED ===");
            log.error("Error during registration: {}", e.getMessage());
            log.error("Exception type: {}", e.getClass().getSimpleName());
            log.error("Stack trace:", e);
            throw e;
        }
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

    public void resetPassword(String email, String newPassword) {
        log.info("Resetting password for email: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found!"));
        
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        
        userRepository.save(user);
        log.info("Password reset successfully for user: {}", user.getUsername());
    }
}
