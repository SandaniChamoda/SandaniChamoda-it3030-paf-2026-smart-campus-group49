package com.project.smartcampus.dto;

import com.project.smartcampus.enums.TicketActivityType;
import com.project.smartcampus.enums.TicketStatus;

import java.time.LocalDateTime;

public class TicketActivityResponse {

    private Long id;
    private TicketActivityType actionType;
    private TicketStatus previousStatus;
    private TicketStatus newStatus;
    private Long actorId;
    private String actorName;
    private String description;
    private LocalDateTime createdAt;

    public TicketActivityResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TicketActivityType getActionType() {
        return actionType;
    }

    public void setActionType(TicketActivityType actionType) {
        this.actionType = actionType;
    }

    public TicketStatus getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(TicketStatus previousStatus) {
        this.previousStatus = previousStatus;
    }

    public TicketStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(TicketStatus newStatus) {
        this.newStatus = newStatus;
    }

    public Long getActorId() {
        return actorId;
    }

    public void setActorId(Long actorId) {
        this.actorId = actorId;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
