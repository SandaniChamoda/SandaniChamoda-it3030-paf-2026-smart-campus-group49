package com.project.smartcampus.repository;

import com.project.smartcampus.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByResourceNameAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceName,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
}