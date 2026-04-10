package com.project.smartcampus.repository;

import com.project.smartcampus.model.Role;
import com.project.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByProviderId(String providerId);

    List<User> findByRole(Role role);

    boolean existsByEmail(String email);
}
