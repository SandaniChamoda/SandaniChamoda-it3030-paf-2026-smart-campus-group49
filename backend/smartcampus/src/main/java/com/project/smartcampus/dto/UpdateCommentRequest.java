package com.project.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateCommentRequest {

    @NotBlank(message = "Comment is required")
    @Size(max = 500, message = "Comment must be 500 characters or less")
    private String comment;

    public UpdateCommentRequest() {
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
