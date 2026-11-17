package com.example.todo.dto;

import com.example.todo.model.Priority;
import com.example.todo.model.Todo;

import java.time.Instant;
import java.time.LocalDate;

public record TodoResponse(
        Long id,
        String title,
        String description,
        Priority priority,
        LocalDate dueDate,
        boolean completed,
        Instant createdAt,
        Instant updatedAt
) {
    public static TodoResponse from(Todo t) {
        return new TodoResponse(t.getId(), t.getTitle(), t.getDescription(),
                t.getPriority(), t.getDueDate(), t.isCompleted(),
                t.getCreatedAt(), t.getUpdatedAt());
    }
}
