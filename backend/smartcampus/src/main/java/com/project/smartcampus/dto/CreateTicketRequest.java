package com.project.smartcampus.dto;

import com.project.smartcampus.enums.TicketCategory;
import com.project.smartcampus.enums.TicketPriority;

public class CreateTicketRequest {

    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private Long createdBy;

    public CreateTicketRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
}