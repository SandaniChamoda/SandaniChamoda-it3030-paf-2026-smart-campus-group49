package com.project.smartcampus.controller;

import com.project.smartcampus.dto.AssignTechnicianRequest;
import com.project.smartcampus.dto.CreateTicketRequest;
import com.project.smartcampus.dto.TicketResponse;
import com.project.smartcampus.dto.UpdateTicketStatusRequest;
import com.project.smartcampus.dto.UpdateTicketRequest;
import com.project.smartcampus.services.TicketService;
import jakarta.validation.Valid;
import com.project.smartcampus.dto.CreateCommentRequest;
import com.project.smartcampus.dto.TicketCommentResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @ModelAttribute CreateTicketRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        TicketResponse response = ticketService.createTicket(request, images);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/user/{createdBy}")
    public ResponseEntity<List<TicketResponse>> getTicketsByCreatedUser(@PathVariable Long createdBy) {
        return ResponseEntity.ok(ticketService.getTicketsByCreatedUser(createdBy));
    }

    @GetMapping("/technician/{assignedTo}")
    public ResponseEntity<List<TicketResponse>> getTicketsByAssignedTechnician(@PathVariable Long assignedTo) {
        return ResponseEntity.ok(ticketService.getTicketsByAssignedTechnician(assignedTo));
    }

    @PutMapping("/{ticketId}/assign")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable Long ticketId,
            @RequestBody AssignTechnicianRequest request) {
        return ResponseEntity.ok(ticketService.assignTechnician(ticketId, request));
    }

    @PutMapping("/{ticketId}/status")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long ticketId,
            @RequestBody UpdateTicketStatusRequest request) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(ticketId, request));
    }

    @PutMapping("/{ticketId}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable Long ticketId,
            @Valid @RequestBody UpdateTicketRequest request) {
        return ResponseEntity.ok(ticketService.updateTicket(ticketId, request));
    }

    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<TicketCommentResponse> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CreateCommentRequest request) {
        TicketCommentResponse response = ticketService.addComment(ticketId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<TicketCommentResponse>> getCommentsByTicketId(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.getCommentsByTicketId(ticketId));
    }
}