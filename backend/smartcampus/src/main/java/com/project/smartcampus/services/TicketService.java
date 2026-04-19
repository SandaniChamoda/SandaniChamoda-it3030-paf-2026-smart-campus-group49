package com.project.smartcampus.services;

import com.project.smartcampus.dto.AssignTechnicianRequest;
import com.project.smartcampus.dto.CreateCommentRequest;
import com.project.smartcampus.dto.CreateTicketRequest;
import com.project.smartcampus.dto.TechnicianTicketSummaryResponse;
import com.project.smartcampus.dto.TicketActivityResponse;
import com.project.smartcampus.dto.TicketCommentResponse;
import com.project.smartcampus.dto.TicketResponse;
import com.project.smartcampus.dto.UpdateCommentRequest;
import com.project.smartcampus.dto.UpdateTicketStatusRequest;
import com.project.smartcampus.dto.UpdateTicketRequest;
import com.project.smartcampus.entity.Ticket;
import com.project.smartcampus.entity.TicketActivity;
import com.project.smartcampus.entity.TicketComment;
import com.project.smartcampus.entity.User;
import com.project.smartcampus.enums.Role;
import com.project.smartcampus.enums.TicketActivityType;
import com.project.smartcampus.enums.TicketPriority;
import com.project.smartcampus.enums.TicketStatus;
import com.project.smartcampus.exception.ResourceNotFoundException;
import com.project.smartcampus.exception.TicketNotFoundException;
import com.project.smartcampus.exception.UnauthorizedException;
import com.project.smartcampus.repository.TicketActivityRepository;
import com.project.smartcampus.repository.TicketCommentRepository;
import com.project.smartcampus.repository.TicketRepository;
import com.project.smartcampus.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private static final int MAX_FILES = 3;
    private static final long MAX_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );
    private static final Path UPLOAD_DIR = Paths.get("uploads", "tickets");

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final TicketActivityRepository ticketActivityRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TicketService(TicketRepository ticketRepository,
                         TicketCommentRepository ticketCommentRepository,
                         TicketActivityRepository ticketActivityRepository,
                         UserRepository userRepository,
                         NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.ticketCommentRepository = ticketCommentRepository;
        this.ticketActivityRepository = ticketActivityRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public TicketResponse createTicket(CreateTicketRequest request, List<MultipartFile> images) {
        List<String> imagePaths = saveImages(images);

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setImagePaths(imagePaths);
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setCreatedBy(request.getCreatedBy());
        ticket.setStatus(TicketStatus.OPEN);

        Ticket savedTicket = ticketRepository.save(ticket);
        appendActivity(
                savedTicket,
                TicketActivityType.TICKET_CREATED,
                null,
                TicketStatus.OPEN,
                request.getCreatedBy(),
                "Ticket created"
        );

        return mapToResponse(savedTicket, true);
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(ticket -> mapToResponse(ticket, false))
                .collect(Collectors.toList());
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = findTicketById(id);
        return mapToResponse(ticket, true);
    }

    public List<TicketResponse> getTicketsByCreatedUser(Long createdBy) {
        return ticketRepository.findByCreatedBy(createdBy)
                .stream()
                .map(ticket -> mapToResponse(ticket, false))
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getTicketsByAssignedTechnician(Long assignedTo,
                                                                TicketStatus status,
                                                                TicketPriority priority,
                                                                String search,
                                                                Authentication authentication) {
        ensureTechnicianOrAdminAccess(assignedTo, authentication);

        String normalizedSearch = normalizeSearch(search);
        return ticketRepository.findAssignedTicketsWithFilters(assignedTo, status, priority, normalizedSearch)
                .stream()
                .map(ticket -> mapToResponse(ticket, false))
                .collect(Collectors.toList());
    }

    public TechnicianTicketSummaryResponse getTechnicianSummary(Long assignedTo, Authentication authentication) {
        ensureTechnicianOrAdminAccess(assignedTo, authentication);

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = today.plusDays(1).atStartOfDay();

        long totalAssigned = ticketRepository.findByAssignedTo(assignedTo).size();
        long openCount = ticketRepository.countByAssignedToAndStatus(assignedTo, TicketStatus.OPEN);
        long inProgressCount = ticketRepository.countByAssignedToAndStatus(assignedTo, TicketStatus.IN_PROGRESS);
        long resolvedTodayCount = ticketRepository.countByAssignedToAndResolvedAtBetween(
                assignedTo,
                startOfDay,
                startOfNextDay
        );

        return new TechnicianTicketSummaryResponse(totalAssigned, openCount, inProgressCount, resolvedTodayCount);
    }

    public TicketResponse assignTechnician(Long ticketId,
                                           AssignTechnicianRequest request,
                                           Authentication authentication) {
        if (request.getAssignedTo() == null) {
            throw new RuntimeException("assignedTo is required.");
        }

        Ticket ticket = findTicketById(ticketId);
        User technician = userRepository.findById(request.getAssignedTo())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + request.getAssignedTo()));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new RuntimeException("Assigned user must have TECHNICIAN role.");
        }

        Long actorId = getAuthenticatedUserId(authentication);

        ticket.setAssignedTo(request.getAssignedTo());
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket updatedTicket = ticketRepository.save(ticket);

        appendActivity(
                updatedTicket,
                TicketActivityType.TECHNICIAN_ASSIGNED,
                null,
                null,
                actorId,
                "Technician assigned to ticket"
        );

        notifyIfEnabled(technician.getId(),
                () -> notificationService.notifyTicketAssigned(technician.getId(), ticketId, updatedTicket.getTitle()));

        return mapToResponse(updatedTicket, true);
    }

    public TicketResponse updateTicketStatus(Long ticketId,
                                             UpdateTicketStatusRequest request,
                                             Authentication authentication) {
        Ticket ticket = findTicketById(ticketId);

        Long actorId = getAuthenticatedUserId(authentication);
        boolean isAdmin = hasRole(authentication, "ROLE_ADMIN");
        boolean isTechnician = hasRole(authentication, "ROLE_TECHNICIAN");

        if (!isAdmin && !isTechnician) {
            throw new UnauthorizedException("Only technicians and admins can update ticket status.");
        }

        if (isTechnician && !Objects.equals(ticket.getAssignedTo(), actorId)) {
            throw new UnauthorizedException("You can only update tickets assigned to you.");
        }

        TicketStatus previousStatus = ticket.getStatus();
        TicketStatus newStatus = request.getStatus();
        if (newStatus == null) {
            throw new RuntimeException("status is required.");
        }

        validateStatusTransition(previousStatus, newStatus, isAdmin);

        String normalizedNotes = normalizeResolutionNotes(request.getResolutionNotes());
        if ((newStatus == TicketStatus.RESOLVED || newStatus == TicketStatus.CLOSED)
                && (normalizedNotes == null && isBlank(ticket.getResolutionNotes()))) {
            throw new RuntimeException("Resolution notes are required when resolving or closing a ticket.");
        }

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (normalizedNotes != null) {
            ticket.setResolutionNotes(normalizedNotes);
        }

        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        if (newStatus == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
            if (ticket.getResolvedAt() == null) {
                ticket.setResolvedAt(LocalDateTime.now());
            }
        }

        Ticket updatedTicket = ticketRepository.save(ticket);
        appendActivity(
                updatedTicket,
                TicketActivityType.STATUS_CHANGED,
                previousStatus,
                newStatus,
                actorId,
                buildStatusChangeDescription(previousStatus, newStatus, normalizedNotes)
        );

        notifyIfEnabled(updatedTicket.getCreatedBy(),
                () -> notificationService.notifyTicketStatusChanged(updatedTicket.getCreatedBy(), ticketId, newStatus.name()));

        return mapToResponse(updatedTicket, true);
    }

    public TicketResponse updateTicket(Long ticketId, UpdateTicketRequest request, Authentication authentication) {
        Ticket ticket = findTicketById(ticketId);

        Long userId = getAuthenticatedUserId(authentication);
        boolean isAdmin = hasRole(authentication, "ROLE_ADMIN");

        boolean isOwner = userId != null && Objects.equals(ticket.getCreatedBy(), userId);
        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("You are not allowed to edit this ticket.");
        }

        if (ticket.getStatus() == TicketStatus.RESOLVED || ticket.getStatus() == TicketStatus.CLOSED) {
            throw new IllegalStateException("Resolved tickets cannot be edited.");
        }

        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return mapToResponse(updatedTicket, true);
    }

    public TicketCommentResponse addComment(Long ticketId,
                                            CreateCommentRequest request,
                                            Authentication authentication) {
        Ticket ticket = findTicketById(ticketId);

        Long requesterId = getAuthenticatedUserId(authentication);
        Long commenterId = requesterId != null ? requesterId : request.getCommentedBy();
        if (commenterId == null) {
            throw new UnauthorizedException("Authentication is required to add comments.");
        }

        TicketComment ticketComment = new TicketComment();
        ticketComment.setComment(request.getComment().trim());
        ticketComment.setCommentedBy(commenterId);
        ticketComment.setTicket(ticket);

        TicketComment savedComment = ticketCommentRepository.save(ticketComment);
        appendActivity(
                ticket,
                TicketActivityType.COMMENT_ADDED,
                null,
                null,
                commenterId,
                "Comment added"
        );

        String commenterName = resolveUserName(commenterId);
        if (!Objects.equals(ticket.getCreatedBy(), commenterId)) {
            notifyIfEnabled(ticket.getCreatedBy(),
                    () -> notificationService.notifyNewComment(ticket.getCreatedBy(), ticketId, commenterName));
        }
        if (ticket.getAssignedTo() != null && !Objects.equals(ticket.getAssignedTo(), commenterId)) {
            notifyIfEnabled(ticket.getAssignedTo(),
                    () -> notificationService.notifyNewComment(ticket.getAssignedTo(), ticketId, commenterName));
        }

        return mapCommentResponse(savedComment);
    }

    public List<TicketCommentResponse> getCommentsByTicketId(Long ticketId) {
        findTicketById(ticketId);
        return ticketCommentRepository.findByTicketIdOrderByCreatedAtDesc(ticketId)
                .stream()
                .map(this::mapCommentResponse)
                .collect(Collectors.toList());
    }

    public TicketCommentResponse updateComment(Long ticketId,
                                               Long commentId,
                                               UpdateCommentRequest request,
                                               Authentication authentication) {
        TicketComment comment = ticketCommentRepository.findByIdAndTicketId(commentId, ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        Long requesterId = getAuthenticatedUserId(authentication);
        if (!Objects.equals(comment.getCommentedBy(), requesterId)) {
            throw new UnauthorizedException("You can only edit your own comments.");
        }

        comment.setComment(request.getComment().trim());
        comment.setEdited(true);
        TicketComment updatedComment = ticketCommentRepository.save(comment);

        appendActivity(
                comment.getTicket(),
                TicketActivityType.COMMENT_UPDATED,
                null,
                null,
                requesterId,
                "Comment updated"
        );

        return mapCommentResponse(updatedComment);
    }

    public void deleteComment(Long ticketId, Long commentId, Authentication authentication) {
        TicketComment comment = ticketCommentRepository.findByIdAndTicketId(commentId, ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        Long requesterId = getAuthenticatedUserId(authentication);
        if (!Objects.equals(comment.getCommentedBy(), requesterId)) {
            throw new UnauthorizedException("You can only delete your own comments.");
        }

        Ticket ticket = comment.getTicket();
        ticketCommentRepository.delete(comment);

        appendActivity(
                ticket,
                TicketActivityType.COMMENT_DELETED,
                null,
                null,
                requesterId,
                "Comment deleted"
        );
    }

    private Ticket findTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + ticketId));
    }

    private TicketResponse mapToResponse(Ticket ticket, boolean includeHistory) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setImages(ticket.getImagePaths());
        response.setCategory(ticket.getCategory());
        response.setPriority(ticket.getPriority());
        response.setStatus(ticket.getStatus());
        response.setCreatedBy(ticket.getCreatedBy());
        response.setCreatedByName(resolveUserName(ticket.getCreatedBy()));
        response.setCreatedByEmail(resolveUserEmail(ticket.getCreatedBy()));
        response.setAssignedTo(ticket.getAssignedTo());
        response.setAssignedToName(resolveUserName(ticket.getAssignedTo()));
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        response.setResolvedAt(ticket.getResolvedAt());
        response.setResolutionNotes(ticket.getResolutionNotes());
        response.setClosedAt(ticket.getClosedAt());

        if (includeHistory) {
            List<TicketActivityResponse> history = ticketActivityRepository
                    .findByTicketIdOrderByCreatedAtDesc(ticket.getId())
                    .stream()
                    .map(this::mapActivityResponse)
                    .collect(Collectors.toList());
            response.setHistory(history);
        } else {
            response.setHistory(Collections.emptyList());
        }

        return response;
    }

    private TicketCommentResponse mapCommentResponse(TicketComment comment) {
        TicketCommentResponse response = new TicketCommentResponse();
        response.setId(comment.getId());
        response.setComment(comment.getComment());
        response.setCommentedBy(comment.getCommentedBy());
        response.setCommentedByName(resolveUserName(comment.getCommentedBy()));
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        response.setEdited(comment.isEdited());
        return response;
    }

    private TicketActivityResponse mapActivityResponse(TicketActivity activity) {
        TicketActivityResponse response = new TicketActivityResponse();
        response.setId(activity.getId());
        response.setActionType(activity.getActionType());
        response.setPreviousStatus(activity.getPreviousStatus());
        response.setNewStatus(activity.getNewStatus());
        response.setActorId(activity.getActorId());
        response.setActorName(activity.getActorName());
        response.setDescription(activity.getDescription());
        response.setCreatedAt(activity.getCreatedAt());
        return response;
    }

    private void appendActivity(Ticket ticket,
                                TicketActivityType actionType,
                                TicketStatus previousStatus,
                                TicketStatus newStatus,
                                Long actorId,
                                String description) {
        TicketActivity activity = new TicketActivity();
        activity.setTicket(ticket);
        activity.setActionType(actionType);
        activity.setPreviousStatus(previousStatus);
        activity.setNewStatus(newStatus);
        activity.setActorId(actorId);
        activity.setActorName(resolveUserName(actorId));
        activity.setDescription(description);
        ticketActivityRepository.save(activity);
    }

    private void validateStatusTransition(TicketStatus current,
                                          TicketStatus next,
                                          boolean isAdmin) {
        if (current == next) {
            return;
        }

        if (isAdmin && next == TicketStatus.REJECTED
                && (current == TicketStatus.OPEN || current == TicketStatus.IN_PROGRESS)) {
            return;
        }

        boolean valid = switch (current) {
            case OPEN -> next == TicketStatus.IN_PROGRESS;
            case IN_PROGRESS -> next == TicketStatus.RESOLVED;
            case RESOLVED -> next == TicketStatus.CLOSED;
            case CLOSED, REJECTED -> false;
        };

        if (!valid) {
            throw new RuntimeException("Invalid status transition: " + current + " -> " + next);
        }
    }

    private void ensureTechnicianOrAdminAccess(Long assignedTo, Authentication authentication) {
        Long requesterId = getAuthenticatedUserId(authentication);
        boolean isAdmin = hasRole(authentication, "ROLE_ADMIN");
        boolean isTechnician = hasRole(authentication, "ROLE_TECHNICIAN");

        if (isAdmin) {
            return;
        }

        if (!isTechnician || !Objects.equals(requesterId, assignedTo)) {
            throw new UnauthorizedException("You are not allowed to access another technician's ticket list.");
        }
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new UnauthorizedException("Authentication is required.");
        }

        try {
            return Long.parseLong(authentication.getName());
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Invalid authentication context.");
        }
    }

    private boolean hasRole(Authentication authentication, String roleName) {
        return authentication != null
                && authentication.getAuthorities() != null
                && authentication.getAuthorities().stream()
                .anyMatch(authority -> roleName.equals(authority.getAuthority()));
    }

    private String normalizeSearch(String search) {
        if (search == null) {
            return null;
        }
        String value = search.trim();
        return value.isEmpty() ? null : value;
    }

    private String normalizeResolutionNotes(String notes) {
        if (notes == null) {
            return null;
        }
        String normalized = notes.trim();
        if (normalized.isEmpty()) {
            return null;
        }
        if (normalized.length() > 1000) {
            throw new RuntimeException("Resolution notes must be 1000 characters or less.");
        }
        return normalized;
    }

    private String resolveUserName(Long userId) {
        if (userId == null) {
            return null;
        }
        return userRepository.findById(userId)
                .map(User::getName)
                .orElse("User #" + userId);
    }

    private String resolveUserEmail(Long userId) {
        if (userId == null) {
            return null;
        }
        return userRepository.findById(userId)
                .map(User::getEmail)
                .orElse(null);
    }

    private String buildStatusChangeDescription(TicketStatus previousStatus,
                                                TicketStatus newStatus,
                                                String resolutionNotes) {
        String base = "Status changed from " + previousStatus + " to " + newStatus;
        if (resolutionNotes != null && !resolutionNotes.isBlank()) {
            return base + ". Note: " + resolutionNotes;
        }
        return base;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void notifyIfEnabled(Long userId, Runnable callback) {
        if (userId == null) {
            return;
        }
        userRepository.findById(userId)
                .filter(user -> Boolean.TRUE.equals(user.getNotificationsEnabled()))
                .ifPresent(user -> callback.run());
    }

    private List<String> saveImages(List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return Collections.emptyList();
        }

        if (images.size() > MAX_FILES) {
            throw new IllegalArgumentException("You can upload up to " + MAX_FILES + " images.");
        }

        try {
            Files.createDirectories(UPLOAD_DIR);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory.", e);
        }

        List<String> savedPaths = new ArrayList<>();

        for (MultipartFile file : images) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            if (file.getSize() > MAX_SIZE) {
                throw new IllegalArgumentException("File size exceeds 5MB.");
            }
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
                throw new IllegalArgumentException("Invalid image type.");
            }

            String originalName = Optional.ofNullable(file.getOriginalFilename()).orElse("");
            String extension = "";
            int dotIndex = originalName.lastIndexOf(".");
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }

            String uniqueName = UUID.randomUUID() + extension;
            Path targetPath = UPLOAD_DIR.resolve(uniqueName);

            try {
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image: " + originalName, e);
            }

            savedPaths.add(UPLOAD_DIR.resolve(uniqueName).toString().replace("\\", "/"));
        }

        return savedPaths;
    }
}