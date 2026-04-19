package com.project.smartcampus.repository;

import com.project.smartcampus.entity.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import java.util.List;

public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {
    List<TicketComment> findByTicketIdOrderByCreatedAtDesc(Long ticketId);

    Optional<TicketComment> findByIdAndTicketId(Long id, Long ticketId);
}