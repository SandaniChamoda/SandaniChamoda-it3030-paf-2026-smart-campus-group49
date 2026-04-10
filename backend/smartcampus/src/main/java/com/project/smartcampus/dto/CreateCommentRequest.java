package com.project.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateCommentRequest {

    @NotBlank(message = "Comment is required")
    private String comment;

    @NotNull(message = "commentedBy is required")
    private Long commentedBy;

    public CreateCommentRequest() {
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Long getCommentedBy() {
        return commentedBy;
    }

    public void setCommentedBy(Long commentedBy) {
        this.commentedBy = commentedBy;
    }
}