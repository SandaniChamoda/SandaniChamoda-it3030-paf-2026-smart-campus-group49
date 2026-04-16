package com.project.smartcampus.dto;

import com.project.smartcampus.enums.ResourceStatus;
import com.project.smartcampus.enums.ResourceType;
import lombok.Data;

@Data
public class ResourceDTO {

    private Long id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private ResourceStatus status;
}