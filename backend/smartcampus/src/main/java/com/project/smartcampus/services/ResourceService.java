package com.project.smartcampus.services;

import com.project.smartcampus.dto.ResourceDTO;
import com.project.smartcampus.entity.Resource;
import com.project.smartcampus.enums.ResourceType;
import com.project.smartcampus.exception.ResourceNotFoundException;
import com.project.smartcampus.mapper.ResourceMapper;
import com.project.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repo;

    public List<ResourceDTO> getAll() {
    return repo.findAll().stream()
            .map(ResourceMapper::toDTO)
            .toList();
    }

    public List<ResourceDTO> getByType(ResourceType type) {
    return repo.findByType(type).stream()
            .map(ResourceMapper::toDTO)
            .toList();
}

    public List<ResourceDTO> getByLocation(String location) {
    return repo.findByLocation(location).stream()
            .map(ResourceMapper::toDTO)
            .toList();
}

    public ResourceDTO create(ResourceDTO dto) {
    Resource r = ResourceMapper.toEntity(dto);
    return ResourceMapper.toDTO(repo.save(r));
}

    public ResourceDTO getById(Long id) {
    Resource r = repo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id " + id));
    return ResourceMapper.toDTO(r);
}

    public ResourceDTO update(Long id, ResourceDTO dto) {
    Resource existing = repo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id " + id));

    existing.setName(dto.getName());
    existing.setType(dto.getType());
    existing.setCapacity(dto.getCapacity());
    existing.setLocation(dto.getLocation());
    existing.setStatus(dto.getStatus());

    return ResourceMapper.toDTO(repo.save(existing));
}

    public void delete(Long id) {
        repo.deleteById(id);
    }

}
