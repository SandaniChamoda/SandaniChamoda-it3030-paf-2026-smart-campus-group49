package com.project.smartcampus.repository;

import com.project.smartcampus.entity.Ticket;
import com.project.smartcampus.enums.TicketPriority;
import com.project.smartcampus.enums.TicketStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCreatedBy(Long createdBy);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByAssignedTo(Long assignedTo);

    @Query("""
        SELECT t FROM Ticket t
        WHERE t.assignedTo = :assignedTo
          AND (:status IS NULL OR t.status = :status)
          AND (:priority IS NULL OR t.priority = :priority)
          AND (
              :searchTerm IS NULL
              OR LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
              OR LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
              OR STR(t.id) LIKE CONCAT('%', :searchTerm, '%')
          )
        ORDER BY t.createdAt DESC
        """)
    List<Ticket> findAssignedTicketsWithFilters(@Param("assignedTo") Long assignedTo,
                                                @Param("status") TicketStatus status,
                                                @Param("priority") TicketPriority priority,
                                                @Param("searchTerm") String searchTerm);

    long countByAssignedToAndStatus(Long assignedTo, TicketStatus status);

    long countByAssignedToAndResolvedAtBetween(Long assignedTo,
                                               LocalDateTime start,
                                               LocalDateTime end);
}