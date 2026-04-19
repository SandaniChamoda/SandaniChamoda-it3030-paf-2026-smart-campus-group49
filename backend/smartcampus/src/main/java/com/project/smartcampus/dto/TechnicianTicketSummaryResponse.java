package com.project.smartcampus.dto;

public class TechnicianTicketSummaryResponse {

    private long totalAssigned;
    private long openCount;
    private long inProgressCount;
    private long resolvedTodayCount;

    public TechnicianTicketSummaryResponse() {
    }

    public TechnicianTicketSummaryResponse(long totalAssigned,
                                           long openCount,
                                           long inProgressCount,
                                           long resolvedTodayCount) {
        this.totalAssigned = totalAssigned;
        this.openCount = openCount;
        this.inProgressCount = inProgressCount;
        this.resolvedTodayCount = resolvedTodayCount;
    }

    public long getTotalAssigned() {
        return totalAssigned;
    }

    public void setTotalAssigned(long totalAssigned) {
        this.totalAssigned = totalAssigned;
    }

    public long getOpenCount() {
        return openCount;
    }

    public void setOpenCount(long openCount) {
        this.openCount = openCount;
    }

    public long getInProgressCount() {
        return inProgressCount;
    }

    public void setInProgressCount(long inProgressCount) {
        this.inProgressCount = inProgressCount;
    }

    public long getResolvedTodayCount() {
        return resolvedTodayCount;
    }

    public void setResolvedTodayCount(long resolvedTodayCount) {
        this.resolvedTodayCount = resolvedTodayCount;
    }
}
