package com.project.smartcampus.services;

import com.project.smartcampus.dto.AssignTechnicianRequest;
import com.project.smartcampus.dto.CreateTicketRequest;
import com.project.smartcampus.dto.TicketResponse;
import com.project.smartcampus.dto.UpdateTicketStatusRequest;
import com.project.smartcampus.entity.Ticket;
import com.project.smartcampus.enums.TicketStatus;
import com.project.smartcampus.repository.TicketRepository;
import org.springframework.stereotype.Service;
import com.project.smartcampus.exception.TicketNotFoundException;
import com.project.smartcampus.dto.CreateCommentRequest;
import com.project.smartcampus.dto.TicketCommentResponse;
import com.project.smartcampus.entity.TicketComment;
import com.project.smartcampus.repository.TicketCommentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository ticketCommentRepository;

    public TicketService(TicketRepository ticketRepository, TicketCommentRepository ticketCommentRepository) {
    this.ticketRepository = ticketRepository;
    this.ticketCommentRepository = ticketCommentRepository;
}

    public TicketResponse createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setImage(request.getImage());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setCreatedBy(request.getCreatedBy());
        ticket.setStatus(TicketStatus.OPEN);

        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToResponse(savedTicket);
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + id));
        return mapToResponse(ticket);
    }

    public List<TicketResponse> getTicketsByCreatedUser(Long createdBy) {
        return ticketRepository.findByCreatedBy(createdBy)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getTicketsByAssignedTechnician(Long assignedTo) {
        return ticketRepository.findByAssignedTo(assignedTo)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TicketResponse assignTechnician(Long ticketId, AssignTechnicianRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        ticket.setAssignedTo(request.getAssignedTo());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return mapToResponse(updatedTicket);
    }

    public TicketResponse updateTicketStatus(Long ticketId, UpdateTicketStatusRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        ticket.setStatus(request.getStatus());
        ticket.setUpdatedAt(LocalDateTime.now());

        if (request.getStatus() == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        Ticket updatedTicket = ticketRepository.save(ticket);
        return mapToResponse(updatedTicket);
    }

    private TicketResponse mapToResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setImage(ticket.getImage());
        response.setCategory(ticket.getCategory());
        response.setPriority(ticket.getPriority());
        response.setStatus(ticket.getStatus());
        response.setCreatedBy(ticket.getCreatedBy());
        response.setAssignedTo(ticket.getAssignedTo());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        response.setResolvedAt(ticket.getResolvedAt());
        return response;
    }

    public TicketCommentResponse addComment(Long ticketId, CreateCommentRequest request) {
    Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

    TicketComment ticketComment = new TicketComment();
    ticketComment.setComment(request.getComment());
    ticketComment.setCommentedBy(request.getCommentedBy());
    ticketComment.setTicket(ticket);

    TicketComment savedComment = ticketCommentRepository.save(ticketComment);

    TicketCommentResponse response = new TicketCommentResponse();
    response.setId(savedComment.getId());
    response.setComment(savedComment.getComment());
    response.setCommentedBy(savedComment.getCommentedBy());
    response.setCreatedAt(savedComment.getCreatedAt());

    return response;
}

public List<TicketCommentResponse> getCommentsByTicketId(Long ticketId) {
    return ticketCommentRepository.findByTicketId(ticketId)
            .stream()
            .map(comment -> {
                TicketCommentResponse response = new TicketCommentResponse();
                response.setId(comment.getId());
                response.setComment(comment.getComment());
                response.setCommentedBy(comment.getCommentedBy());
                response.setCreatedAt(comment.getCreatedAt());
                return response;
            })
            .collect(Collectors.toList());
}
}