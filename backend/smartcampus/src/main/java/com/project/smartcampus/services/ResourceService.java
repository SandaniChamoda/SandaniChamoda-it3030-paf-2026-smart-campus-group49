package com.project.smartcampus.services;

import com.project.smartcampus.entity.Resource;
import com.project.smartcampus.enums.ResourceType;
import com.project.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repo;

    public List<Resource> getAll() {
        return repo.findAll();
    }

        public List<Resource> getByType(ResourceType type) {
        return repo.findByType(type);
    }

    public List<Resource> getByLocation(String location) {
        return repo.findByLocation(location);
    }

    public Resource create(Resource r) {
        return repo.save(r);
    }

    public Resource getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Resource update(Long id, Resource r) {
        Resource existing = getById(id);
        existing.setName(r.getName());
        existing.setType(r.getType());
        existing.setCapacity(r.getCapacity());
        existing.setLocation(r.getLocation());
        existing.setStatus(r.getStatus());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

}
