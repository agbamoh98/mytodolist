package com.todo.service.dto;

import com.todo.service.entity.Todo;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
public class CreateTodoRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private String userId;

    private Todo.Priority priority = Todo.Priority.MEDIUM;

    private LocalDateTime dueDate;

    public Todo toTodo() {
        Todo todo = new Todo();
        todo.setTitle(this.title);
        todo.setDescription(this.description);
        todo.setUserId(this.userId);
        todo.setPriority(this.priority);
        todo.setDueDate(this.dueDate);
        todo.setCompleted(false);
        return todo;
    }
}
