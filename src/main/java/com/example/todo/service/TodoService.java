package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.dto.TodoStats;
import com.example.todo.exception.TodoNotFoundException;
import com.example.todo.model.Priority;
import com.example.todo.model.Todo;
import com.example.todo.Repository.TodoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
public class TodoService {

    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {   // constructor injection
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<TodoResponse> search(Boolean completed, Priority priority, String q, Pageable pageable) {
        String query = (q == null || q.isBlank()) ? null : q.trim();
        return repository.search(completed, priority, query, pageable).map(TodoResponse::from);
    }

    @Transactional(readOnly = true)
    public TodoResponse get(Long id) {
        return TodoResponse.from(find(id));
    }

    public TodoResponse create(TodoRequest req) {
        Todo todo = new Todo(req.title().trim(), req.description(), req.priority(), req.dueDate());
        return TodoResponse.from(repository.save(todo));
    }

    public TodoResponse update(Long id, TodoRequest req) {
        Todo todo = find(id);
        todo.setTitle(req.title().trim());
        todo.setDescription(req.description());
        todo.setPriority(req.priority() != null ? req.priority() : Priority.MEDIUM);
        todo.setDueDate(req.dueDate());
        return TodoResponse.from(todo);   // changes are saved automatically at commit
    }

    public TodoResponse toggle(Long id) {
        Todo todo = find(id);
        todo.setCompleted(!todo.isCompleted());
        return TodoResponse.from(todo);
    }

    public void delete(Long id) {
        repository.delete(find(id));
    }

    @Transactional(readOnly = true)
    public TodoStats stats() {
        long completed = repository.countByCompleted(true);
        long pending = repository.countByCompleted(false);
        long overdue = repository.countByCompletedFalseAndDueDateBefore(LocalDate.now());
        return new TodoStats(completed + pending, completed, pending, overdue);
    }

    private Todo find(Long id) {
        return repository.findById(id).orElseThrow(() -> new TodoNotFoundException(id));
    }
}
