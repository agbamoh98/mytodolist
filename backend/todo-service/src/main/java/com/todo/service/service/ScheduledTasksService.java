package com.todo.service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasksService {

    private final VerificationService verificationService;

    // Run every hour to clean up expired verification codes
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredVerificationCodes() {
        log.info("Starting cleanup of expired verification codes...");
        try {
            verificationService.cleanupExpiredCodes();
            log.info("Cleanup of expired verification codes completed");
        } catch (Exception e) {
            log.error("Error during cleanup of expired verification codes", e);
        }
    }
}
