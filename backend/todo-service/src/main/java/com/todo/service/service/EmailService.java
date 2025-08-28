package com.todo.service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${resend.api.key}")
    private String resendApiKey;

    // This method is kept for backward compatibility but now uses REST API
    public void sendVerificationEmail(String to, String username, String verificationCode) {
        sendVerificationEmailAsync(to, username, verificationCode);
    }

    @Async
    public void sendVerificationEmailAsync(String to, String username, String verificationCode) {
        try {
            // Use Resend REST API instead of SMTP
            String url = "https://api.resend.com/emails";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + resendApiKey);
            
            String emailBody = buildVerificationEmailBody(username, verificationCode);
            
            // Clean up the email body for JSON - remove newlines and escape quotes properly
            String cleanEmailBody = emailBody
                .replace("\n", "\\n")
                .replace("\"", "\\\"")
                .replace("\r", "");
            
            String requestBody = String.format("""
                {
                    "from": "%s",
                    "to": ["%s"],
                    "subject": "Verify Your Email - Todo App",
                    "text": "%s"
                }
                """, fromEmail, to, cleanEmailBody);
            
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Verification email sent successfully via Resend API to: {}", to);
            } else {
                log.error("Failed to send email via Resend API. Status: {}, Response: {}", 
                    response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", to, e);
            // Don't throw exception in async method, just log it
        }
    }

    public void sendPasswordResetEmail(String to, String username, String resetCode) {
        try {
            // Use Resend REST API instead of SMTP
            String url = "https://api.resend.com/emails";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + resendApiKey);
            
            String emailBody = buildPasswordResetEmailBody(username, resetCode);
            
            // Clean up the email body for JSON
            String cleanEmailBody = emailBody
                .replace("\n", "\\n")
                .replace("\"", "\\\"")
                .replace("\r", "");
            
            String requestBody = String.format("""
                {
                    "from": "%s",
                    "to": ["%s"],
                    "subject": "Password Reset - Todo App",
                    "text": "%s"
                }
                """, fromEmail, to, cleanEmailBody);
            
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Password reset email sent successfully via Resend API to: {}", to);
            } else {
                log.error("Failed to send password reset email via Resend API. Status: {}, Response: {}", 
                    response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", to, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    public void sendTodoReminderEmail(String to, String username, String todoTitle, String dueDateTime) {
        try {
            // Use Resend REST API instead of SMTP
            String url = "https://api.resend.com/emails";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + resendApiKey);
            
            String emailBody = buildTodoReminderEmailBody(username, todoTitle, dueDateTime);
            
            // Clean up the email body for JSON
            String cleanEmailBody = emailBody
                .replace("\n", "\\n")
                .replace("\"", "\\\"")
                .replace("\r", "");
            
            String requestBody = String.format("""
                {
                    "from": "%s",
                    "to": ["%s"],
                    "subject": "Todo Reminder - %s",
                    "text": "%s"
                }
                """, fromEmail, to, todoTitle, cleanEmailBody);
            
            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Todo reminder email sent successfully via Resend API to: {}", to);
            } else {
                log.error("Failed to send todo reminder email via Resend API. Status: {}, Response: {}", 
                    response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Failed to send todo reminder email to: {}", to, e);
            throw new RuntimeException("Failed to send todo reminder email", e);
        }
    }

    private String buildVerificationEmailBody(String username, String verificationCode) {
        return String.format("""
            Hello %s,
            
            Welcome to Todo App! Please verify your email address by using the following code:
            
            Verification Code: %s
            
            This code will expire in 15 minutes.
            
            If you didn't create an account with us, please ignore this email.
            
            Best regards,
            Todo App Team
            """, username, verificationCode);
    }

    private String buildPasswordResetEmailBody(String username, String resetCode) {
        return String.format("""
            Hello %s,
            
            You requested a password reset for your Todo App account.
            
            Reset Code: %s
            
            This code will expire in 15 minutes.
            
            If you didn't request this password reset, please ignore this email.
            
            Best regards,
            Todo App Team
            """, username, resetCode);
    }

    private String buildTodoReminderEmailBody(String username, String todoTitle, String dueDateTime) {
        return String.format("""
            Hello %s,
            
            This is a friendly reminder that you have a todo item due soon:
            
            Todo: %s
            Due: %s
            
            Don't forget to complete it on time!
            
            Best regards,
            Todo App Team
            """, username, todoTitle, dueDateTime);
    }
}
