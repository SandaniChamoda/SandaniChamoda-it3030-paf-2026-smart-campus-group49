package com.project.smartcampus.controller;

import com.project.smartcampus.dto.ResourceDTO;
import com.project.smartcampus.enums.ResourceType;
import com.project.smartcampus.services.ResourceService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/resources")
public class ResourceController {

    @Autowired
    private ResourceService service;

    @GetMapping
    public List<ResourceDTO> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResourceDTO create(@Valid @RequestBody ResourceDTO dto) {
    return service.create(dto);
    }

    @GetMapping("/{id}")
    public ResourceDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/type/{type}")
    public List<ResourceDTO> getByType(@PathVariable ResourceType type) {
        return service.getByType(type);
    }

    @GetMapping("/location/{location}")
    public List<ResourceDTO> getByLocation(@PathVariable String location) {
        return service.getByLocation(location);
    }

    @PutMapping("/{id}")
    public ResourceDTO update(@PathVariable Long id, @Valid @RequestBody ResourceDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}