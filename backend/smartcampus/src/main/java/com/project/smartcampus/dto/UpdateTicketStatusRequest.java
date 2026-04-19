package com.project.smartcampus.dto;

import com.project.smartcampus.enums.TicketStatus;

public class UpdateTicketStatusRequest {

    private TicketStatus status;
    private String resolutionNotes;

    public UpdateTicketStatusRequest() {
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}