package com.project.smartcampus.controller;

import com.project.smartcampus.entity.Resource;
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

import java.util.List;

@RestController
@RequestMapping("/resources")
public class ResourceController {

    @Autowired
    private ResourceService service;

    @GetMapping
    public List<Resource> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Resource create(@Valid @RequestBody Resource r) {
    return service.create(r);
    }

    @GetMapping("/{id}")
    public Resource getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/type/{type}")
    public List<Resource> getByType(@PathVariable ResourceType type) {
        return service.getByType(type);
    }

    @GetMapping("/location/{location}")
    public List<Resource> getByLocation(@PathVariable String location) {
        return service.getByLocation(location);
    }

    @PutMapping("/{id}")
    public Resource update(@PathVariable Long id, @Valid @RequestBody Resource r) {
        return service.update(id, r);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}