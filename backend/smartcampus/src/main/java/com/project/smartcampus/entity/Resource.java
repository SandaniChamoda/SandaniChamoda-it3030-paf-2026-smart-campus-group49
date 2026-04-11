package com.project.smartcampus.entity;

import com.project.smartcampus.enums.ResourceStatus;
import com.project.smartcampus.enums.ResourceType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "resources")
@Data
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ResourceType type;

    @NotNull
    @Min(1)
    private Integer  capacity;

    @NotBlank
    private String location;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ResourceStatus status;
}