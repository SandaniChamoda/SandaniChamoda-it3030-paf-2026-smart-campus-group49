package com.project.smartcampus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.smartcampus.entity.Resource;
import com.project.smartcampus.enums.ResourceType;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByType(ResourceType type);

List<Resource> findByLocation(String location);
}