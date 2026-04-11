package com.project.smartcampus.mapper;

import com.project.smartcampus.dto.ResourceDTO;
import com.project.smartcampus.entity.Resource;

public class ResourceMapper {

    public static ResourceDTO toDTO(Resource r) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(r.getId());
        dto.setName(r.getName());
        dto.setType(r.getType());
        dto.setCapacity(r.getCapacity());
        dto.setLocation(r.getLocation());
        dto.setStatus(r.getStatus());
        return dto;
    }

    public static Resource toEntity(ResourceDTO dto) {
        Resource r = new Resource();
        r.setId(dto.getId());
        r.setName(dto.getName());
        r.setType(dto.getType());
        r.setCapacity(dto.getCapacity());
        r.setLocation(dto.getLocation());
        r.setStatus(dto.getStatus());
        return r;
    }
}