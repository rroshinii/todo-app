package com.example.todo.Repository;

import com.example.todo.model.Priority;
import com.example.todo.model.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    // Optional filters: a null parameter means "don't filter on this"
    @Query("""
        SELECT t FROM Todo t
        WHERE (:completed IS NULL OR t.completed = :completed)
          AND (:priority IS NULL OR t.priority = :priority)
          AND (:q IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :q, '%')))
        """)
    Page<Todo> search(@Param("completed") Boolean completed,
                      @Param("priority") Priority priority,
                      @Param("q") String q,
                      Pageable pageable);

    // Derived queries: Spring builds these from the method name
    long countByCompleted(boolean completed);

    long countByCompletedFalseAndDueDateBefore(LocalDate date);
}
