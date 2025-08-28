package com.todo.service.controller;

import com.todo.service.dto.AuthResponse;
import com.todo.service.dto.LoginRequest;
import com.todo.service.dto.RegisterRequest;
import com.todo.service.repository.UserRepository;
import com.todo.service.repository.VerificationCodeRepository;
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
    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        log.info("=== REGISTER ENDPOINT CALLED ===");
        log.info("Request received - Username: {}, Email: {}, FirstName: {}, LastName: {}", 
            request.getUsername(), request.getEmail(), request.getFirstName(), request.getLastName());
        
        try {
            // Check if user already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Username is already taken!"));
            }
            
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Email is already in use!"));
            }
            
            // Send verification email without creating user (async)
            log.info("Sending verification email to: {}", request.getEmail());
            try {
                String code = verificationService.generateVerificationCode(request.getEmail(), 
                    com.todo.service.entity.VerificationCode.CodeType.EMAIL_VERIFICATION);
                verificationService.sendEmailVerificationCode(request.getEmail(), request.getUsername());
                log.info("Verification email queued successfully");
                return ResponseEntity.ok(new MessageResponse("Verification email sent. Please check your email and enter the code to complete registration."));
            } catch (Exception emailError) {
                log.error("Email sending failed: {}", emailError.getMessage());
                // For testing: return the verification code directly when email fails
                try {
                    String code = verificationService.generateVerificationCode(request.getEmail(), 
                        com.todo.service.entity.VerificationCode.CodeType.EMAIL_VERIFICATION);
                    log.info("Generated verification code for testing: {}", code);
                    return ResponseEntity.ok(new MessageResponse("Email service unavailable. For testing, use verification code: " + code));
                } catch (Exception codeError) {
                    log.error("Failed to generate verification code: {}", codeError.getMessage());
                    return ResponseEntity.ok(new MessageResponse("Email service temporarily unavailable. Please contact support."));
                }
            }
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

    @PostMapping("/complete-registration")
    public ResponseEntity<?> completeRegistration(@RequestBody CompleteRegistrationRequest request) {
        try {
            // Verify the email code first
            boolean verified = verificationService.verifyCode(request.getEmail(), request.getCode(), 
                com.todo.service.entity.VerificationCode.CodeType.EMAIL_VERIFICATION);
            
            if (!verified) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Invalid or expired verification code"));
            }
            
            // Create the user
            AuthResponse response = authService.register(request.getRegisterData());
            
            // Mark verification code as used
            verificationService.markAllCodesAsUsed(request.getEmail(), 
                com.todo.service.entity.VerificationCode.CodeType.EMAIL_VERIFICATION);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Complete registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse("Registration completion failed"));
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

    // Debug endpoint to get verification codes (remove in production)
    @GetMapping("/debug/verification-code/{email}")
    public ResponseEntity<?> getVerificationCode(@PathVariable String email) {
        try {
            // For now, just return a simple message
            // In production, implement proper verification code retrieval
            return ResponseEntity.ok(new MessageResponse("Debug endpoint - check logs for verification code"));
        } catch (Exception e) {
            log.error("Failed to get verification code: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to get verification code"));
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

    public static class CompleteRegistrationRequest {
        private String email;
        private String code;
        private RegisterRequest registerData;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public RegisterRequest getRegisterData() { return registerData; }
        public void setRegisterData(RegisterRequest registerData) { this.registerData = registerData; }
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
