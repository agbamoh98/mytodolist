package com.todo.service.service;

import com.todo.service.entity.Todo;
import com.todo.service.entity.User;
import com.todo.service.repository.TodoRepository;
import com.todo.service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TodoReminderService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.email.reminder.hours-before:24}")
    private int hoursBeforeReminder;

    @Scheduled(fixedRate = 300000) // Run every 5 minutes
    @Transactional
    public void sendTodoReminders() {
        log.info("Starting todo reminder check...");
        
        LocalDateTime reminderTime = LocalDateTime.now().plusHours(hoursBeforeReminder);
        LocalDateTime reminderTimeEnd = reminderTime.plusMinutes(5); // 5-minute window
        
        // Find todos that are due within the reminder window
        List<Todo> todosToRemind = todoRepository.findTodosDueBetween(
            reminderTime, 
            reminderTimeEnd
        );
        
        log.info("Found {} todos to remind", todosToRemind.size());
        
        for (Todo todo : todosToRemind) {
            try {
                sendReminderForTodo(todo);
            } catch (Exception e) {
                log.error("Failed to send reminder for todo ID: {}", todo.getId(), e);
            }
        }
        
        log.info("Completed todo reminder check");
    }

    private void sendReminderForTodo(Todo todo) {
        // Find the user for this todo
        User user = userRepository.findByUsername(todo.getUserId()).orElse(null);
        if (user == null) {
            log.warn("User not found for todo ID: {}", todo.getId());
            return;
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            log.warn("User {} has no email address for reminder", user.getUsername());
            return;
        }

        // Format the due date/time
        String dueDateTime = formatDueDateTime(todo.getDueDate());
        
        // Send the reminder email
        emailService.sendTodoReminderEmail(
            user.getEmail(),
            user.getUsername(),
            todo.getTitle(),
            dueDateTime
        );
        
        log.info("Sent reminder for todo '{}' to user '{}'", todo.getTitle(), user.getUsername());
    }

    private String formatDueDateTime(LocalDateTime dueDate) {
        if (dueDate == null) {
            return "No due date";
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' h:mm a");
        return dueDate.format(formatter);
    }
}
