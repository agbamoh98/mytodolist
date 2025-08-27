package com.todo.service.controller;

import com.todo.service.dto.AuthResponse;
import com.todo.service.dto.LoginRequest;
import com.todo.service.dto.RegisterRequest;
import com.todo.service.service.AuthService;
import com.todo.service.service.VerificationService;
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
    private final VerificationService verificationService;

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

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody EmailVerificationRequest request) {
        try {
            boolean verified = verificationService.verifyEmailAndActivateUser(request.getEmail(), request.getCode());
            if (verified) {
                return ResponseEntity.ok(new MessageResponse("Email verified successfully"));
            } else {
                return ResponseEntity.badRequest().body(new ErrorResponse("Invalid or expired verification code"));
            }
        } catch (Exception e) {
            log.error("Email verification failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse("Email verification failed"));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody ResendVerificationRequest request) {
        try {
            verificationService.sendEmailVerificationCode(request.getEmail(), request.getUsername());
            return ResponseEntity.ok(new MessageResponse("Verification code sent successfully"));
        } catch (Exception e) {
            log.error("Failed to resend verification code: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to send verification code"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            verificationService.sendPasswordResetCode(request.getEmail(), request.getUsername());
            return ResponseEntity.ok(new MessageResponse("Password reset code sent to your email"));
        } catch (Exception e) {
            log.error("Failed to send password reset code: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to send password reset code"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            boolean verified = verificationService.verifyCode(request.getEmail(), request.getCode(), 
                com.todo.service.entity.VerificationCode.CodeType.PASSWORD_RESET);
            
            if (verified) {
                authService.resetPassword(request.getEmail(), request.getNewPassword());
                verificationService.markAllCodesAsUsed(request.getEmail(), 
                    com.todo.service.entity.VerificationCode.CodeType.PASSWORD_RESET);
                return ResponseEntity.ok(new MessageResponse("Password reset successfully"));
            } else {
                return ResponseEntity.badRequest().body(new ErrorResponse("Invalid or expired reset code"));
            }
        } catch (Exception e) {
            log.error("Password reset failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse("Password reset failed"));
        }
    }

    // Request/Response classes
    public static class EmailVerificationRequest {
        private String email;
        private String code;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    public static class ResendVerificationRequest {
        private String email;
        private String username;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }

    public static class ForgotPasswordRequest {
        private String email;
        private String username;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }

    public static class ResetPasswordRequest {
        private String email;
        private String code;
        private String newPassword;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
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
