package com.todo.service.controller;

import com.todo.service.entity.Todo;
import com.todo.service.service.TodoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos(@RequestParam String userId) {
        log.info("GET /api/todos - userId: {}", userId);
        List<Todo> todos = todoService.getAllTodosByUserId(userId);
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id, @RequestParam String userId) {
        log.info("GET /api/todos/{} - userId: {}", id, userId);
        return todoService.getTodoById(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{completed}")
    public ResponseEntity<List<Todo>> getTodosByStatus(@PathVariable boolean completed, @RequestParam String userId) {
        log.info("GET /api/todos/status/{} - userId: {}", completed, userId);
        List<Todo> todos = todoService.getTodosByStatus(userId, completed);
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Todo>> getTodosByPriority(@PathVariable Todo.Priority priority, @RequestParam String userId) {
        log.info("GET /api/todos/priority/{} - userId: {}", priority, userId);
        List<Todo> todos = todoService.getTodosByPriority(userId, priority);
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Todo>> getOverdueTodos(@RequestParam String userId) {
        log.info("GET /api/todos/overdue - userId: {}", userId);
        List<Todo> todos = todoService.getOverdueTodos(userId);
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Todo>> getTodosByDateRange(
            @RequestParam String userId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        log.info("GET /api/todos/date-range - userId: {}, startDate: {}, endDate: {}", userId, startDate, endDate);
        List<Todo> todos = todoService.getTodosByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(todos);
    }

    @PostMapping
    public ResponseEntity<Todo> createTodo(@Valid @RequestBody Todo todo) {
        log.info("POST /api/todos - userId: {}", todo.getUserId());
        Todo createdTodo = todoService.createTodo(todo);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @Valid @RequestBody Todo todoDetails, @RequestParam String userId) {
        log.info("PUT /api/todos/{} - userId: {}", id, userId);
        return todoService.updateTodo(id, todoDetails, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id, @RequestParam String userId) {
        log.info("DELETE /api/todos/{} - userId: {}", id, userId);
        boolean deleted = todoService.deleteTodo(id, userId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleTodoStatus(@PathVariable Long id, @RequestParam String userId) {
        log.info("PATCH /api/todos/{}/toggle - userId: {}", id, userId);
        boolean toggled = todoService.toggleTodoStatus(id, userId);
        if (toggled) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats/completed")
    public ResponseEntity<Long> getCompletedTodoCount(@RequestParam String userId) {
        log.info("GET /api/todos/stats/completed - userId: {}", userId);
        long count = todoService.getCompletedTodoCount(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/pending")
    public ResponseEntity<Long> getPendingTodoCount(@RequestParam String userId) {
        log.info("GET /api/todos/stats/pending - userId: {}", userId);
        long count = todoService.getPendingTodoCount(userId);
        return ResponseEntity.ok(count);
    }
}
