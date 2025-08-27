package com.todo.service.repository;

import com.todo.service.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Todo> findByUserIdAndCompletedOrderByCreatedAtDesc(String userId, boolean completed);

    List<Todo> findByUserIdAndPriorityOrderByCreatedAtDesc(String userId, Todo.Priority priority);

    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.dueDate <= :date ORDER BY t.dueDate ASC")
    List<Todo> findOverdueTodos(@Param("userId") String userId, @Param("date") LocalDateTime date);

    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.dueDate BETWEEN :startDate AND :endDate ORDER BY t.dueDate ASC")
    List<Todo> findTodosByDateRange(@Param("userId") String userId, 
                                   @Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);

    long countByUserIdAndCompleted(String userId, boolean completed);

    @Query("SELECT t FROM Todo t WHERE t.dueDate BETWEEN :startTime AND :endTime AND t.completed = false")
    List<Todo> findTodosDueBetween(@Param("startTime") LocalDateTime startTime, 
                                  @Param("endTime") LocalDateTime endTime);
}
