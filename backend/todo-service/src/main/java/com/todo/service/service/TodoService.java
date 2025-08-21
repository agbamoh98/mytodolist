package com.todo.service.service;

import com.todo.service.entity.Todo;
import com.todo.service.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;

    public List<Todo> getAllTodosByUserId(String userId) {
        log.info("Fetching all todos for user: {}", userId);
        return todoRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Todo> getTodosByStatus(String userId, boolean completed) {
        log.info("Fetching {} todos for user: {}", completed ? "completed" : "pending", userId);
        return todoRepository.findByUserIdAndCompletedOrderByCreatedAtDesc(userId, completed);
    }

    public List<Todo> getTodosByPriority(String userId, Todo.Priority priority) {
        log.info("Fetching todos with priority {} for user: {}", priority, userId);
        return todoRepository.findByUserIdAndPriorityOrderByCreatedAtDesc(userId, priority);
    }

    public List<Todo> getOverdueTodos(String userId) {
        log.info("Fetching overdue todos for user: {}", userId);
        return todoRepository.findOverdueTodos(userId, LocalDateTime.now());
    }

    public List<Todo> getTodosByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching todos for user: {} between {} and {}", userId, startDate, endDate);
        return todoRepository.findTodosByDateRange(userId, startDate, endDate);
    }

    public Optional<Todo> getTodoById(Long id, String userId) {
        log.info("Fetching todo with id: {} for user: {}", id, userId);
        return todoRepository.findById(id)
                .filter(todo -> todo.getUserId().equals(userId));
    }

    public Todo createTodo(Todo todo) {
        log.info("Creating new todo for user: {}", todo.getUserId());
        todo.setCreatedAt(LocalDateTime.now());
        todo.setUpdatedAt(LocalDateTime.now());
        return todoRepository.save(todo);
    }

    public Optional<Todo> updateTodo(Long id, Todo todoDetails, String userId) {
        log.info("Updating todo with id: {} for user: {}", id, userId);
        return todoRepository.findById(id)
                .filter(todo -> todo.getUserId().equals(userId))
                .map(existingTodo -> {
                    existingTodo.setTitle(todoDetails.getTitle());
                    existingTodo.setDescription(todoDetails.getDescription());
                    existingTodo.setCompleted(todoDetails.isCompleted());
                    existingTodo.setPriority(todoDetails.getPriority());
                    existingTodo.setDueDate(todoDetails.getDueDate());
                    existingTodo.setUpdatedAt(LocalDateTime.now());
                    return todoRepository.save(existingTodo);
                });
    }

    public boolean deleteTodo(Long id, String userId) {
        log.info("Deleting todo with id: {} for user: {}", id, userId);
        return todoRepository.findById(id)
                .filter(todo -> todo.getUserId().equals(userId))
                .map(todo -> {
                    todoRepository.delete(todo);
                    return true;
                })
                .orElse(false);
    }

    public boolean toggleTodoStatus(Long id, String userId) {
        log.info("Toggling status for todo with id: {} for user: {}", id, userId);
        return todoRepository.findById(id)
                .filter(todo -> todo.getUserId().equals(userId))
                .map(todo -> {
                    todo.setCompleted(!todo.isCompleted());
                    todo.setUpdatedAt(LocalDateTime.now());
                    todoRepository.save(todo);
                    return true;
                })
                .orElse(false);
    }

    public long getCompletedTodoCount(String userId) {
        return todoRepository.countByUserIdAndCompleted(userId, true);
    }

    public long getPendingTodoCount(String userId) {
        return todoRepository.countByUserIdAndCompleted(userId, false);
    }
}
