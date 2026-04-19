package com.project.smartcampus.dto;

import com.project.smartcampus.enums.TicketCategory;
import com.project.smartcampus.enums.TicketPriority;
import com.project.smartcampus.enums.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private List<String> images;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private Long createdBy;
    private String createdByName;
    private String createdByEmail;
    private Long assignedTo;
    private String assignedToName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private String resolutionNotes;
    private LocalDateTime closedAt;
    private List<TicketActivityResponse> history;

    public TicketResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public List<String> getImages() { return images; }

    public void setImages(List<String> images) { this.images = images; }

    public TicketCategory getCategory() { return category; }

    public void setCategory(TicketCategory category) { this.category = category; }

    public TicketPriority getPriority() { return priority; }

    public void setPriority(TicketPriority priority) { this.priority = priority; }

    public TicketStatus getStatus() { return status; }

    public void setStatus(TicketStatus status) { this.status = status; }

    public Long getCreatedBy() { return createdBy; }

    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public Long getAssignedTo() { return assignedTo; }

    public void setAssignedTo(Long assignedTo) { this.assignedTo = assignedTo; }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    public String getAssignedToName() {
        return assignedToName;
    }

    public void setAssignedToName(String assignedToName) {
        this.assignedToName = assignedToName;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }

    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }

    public List<TicketActivityResponse> getHistory() {
        return history;
    }

    public void setHistory(List<TicketActivityResponse> history) {
        this.history = history;
    }
}