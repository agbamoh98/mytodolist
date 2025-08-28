package com.todo.service.service;

import com.todo.service.entity.User;
import com.todo.service.entity.VerificationCode;
import com.todo.service.repository.UserRepository;
import com.todo.service.repository.VerificationCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationService {

    private final VerificationCodeRepository verificationCodeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.email.verification.code-expiry-minutes:15}")
    private int codeExpiryMinutes;

    private static final String CODE_CHARACTERS = "0123456789";
    private static final int CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    public String generateVerificationCode(String email, VerificationCode.CodeType type) {
        // Generate a 6-digit numeric code (faster method)
        int code = 100000 + random.nextInt(900000); // Generates 100000-999999
        
        // Save the verification code
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(email);
        verificationCode.setCode(String.valueOf(code));
        verificationCode.setType(type);
        verificationCode.setExpiresAt(LocalDateTime.now().plusMinutes(codeExpiryMinutes));
        verificationCode.setUsed(false);

        verificationCodeRepository.save(verificationCode);
        
        log.info("Generated {} code for email: {}", type, email);
        return String.valueOf(code);
    }

    public boolean verifyCode(String email, String code, VerificationCode.CodeType type) {
        Optional<VerificationCode> verificationCodeOpt = verificationCodeRepository
                .findByEmailAndCodeAndTypeAndUsedFalse(email, code, type);

        if (verificationCodeOpt.isEmpty()) {
            log.warn("Invalid verification code for email: {}", email);
            return false;
        }

        VerificationCode verificationCode = verificationCodeOpt.get();
        
        if (!verificationCode.isValid()) {
            log.warn("Expired verification code for email: {}", email);
            return false;
        }

        // Mark the code as used
        verificationCode.setUsed(true);
        verificationCodeRepository.save(verificationCode);
        
        log.info("Successfully verified {} code for email: {}", type, email);
        return true;
    }

    public void sendEmailVerificationCode(String email, String username) {
        String code = generateVerificationCode(email, VerificationCode.CodeType.EMAIL_VERIFICATION);
        // Send email asynchronously to avoid blocking the response
        try {
            emailService.sendVerificationEmailAsync(email, username, code);
        } catch (Exception e) {
            log.error("Failed to send email, but verification code was generated: {}", e.getMessage());
            // Don't throw exception - user can still verify manually if needed
        }
    }

    public void sendPasswordResetCode(String email, String username) {
        String code = generateVerificationCode(email, VerificationCode.CodeType.PASSWORD_RESET);
        emailService.sendPasswordResetEmail(email, username, code);
    }

    @Transactional
    public boolean verifyEmailAndActivateUser(String email, String code) {
        if (!verifyCode(email, code, VerificationCode.CodeType.EMAIL_VERIFICATION)) {
            return false;
        }

        // Find and activate the user
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.error("User not found for email: {}", email);
            return false;
        }

        User user = userOpt.get();
        user.setEnabled(true);
        userRepository.save(user);
        
        log.info("User activated successfully for email: {}", email);
        return true;
    }

    @Transactional
    public void markAllCodesAsUsed(String email, VerificationCode.CodeType type) {
        verificationCodeRepository.markCodesAsUsed(email, type);
    }

    public void cleanupExpiredCodes() {
        verificationCodeRepository.deleteExpiredCodes(LocalDateTime.now());
        log.info("Cleaned up expired verification codes");
    }
}
