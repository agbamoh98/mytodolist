package com.todo.service.controller;

import com.todo.service.dto.AuthResponse;
import com.todo.service.dto.LoginRequest;
import com.todo.service.dto.RegisterRequest;
import com.todo.service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        log.info("=== REGISTER ENDPOINT CALLED ===");
        log.info("Request received - Username: {}, Email: {}, FirstName: {}, LastName: {}", 
            request.getUsername(), request.getEmail(), request.getFirstName(), request.getLastName());
        
        try {
            log.info("Calling authService.register()...");
            AuthResponse response = authService.register(request);
            log.info("Registration successful, returning response");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("=== REGISTRATION FAILED IN CONTROLLER ===");
            log.error("Registration failed: {}", e.getMessage());
            log.error("Exception type: {}", e.getClass().getSimpleName());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("=== UNEXPECTED ERROR IN CONTROLLER ===");
            log.error("Unexpected error during registration: {}", e.getMessage());
            log.error("Exception type: {}", e.getClass().getSimpleName());
            log.error("Stack trace:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Internal server error: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("POST /api/auth/login - user: {}", request.getUsernameOrEmail());
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // Simple error response class
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}
