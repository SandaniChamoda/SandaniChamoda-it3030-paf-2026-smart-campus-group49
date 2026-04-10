//backend\smartcampus\src\main\java\com\project\smartcampus\services\BookingService.java
package com.project.smartcampus.services;

import com.project.smartcampus.entity.Booking;
import com.project.smartcampus.enums.BookingStatus;
import com.project.smartcampus.exception.BookingConflictException;
import com.project.smartcampus.repository.BookingRepository;
import org.springframework.stereotype.Service;
//import com.project.smartcampus.exception.BookingConflictException;

import java.util.List;
import java.util.EnumSet;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class BookingService {

    private final BookingRepository repository;
    private static final EnumSet<BookingStatus> ACTIVE_CONFLICT_STATUSES =
            EnumSet.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    public BookingService(BookingRepository repository) {
        this.repository = repository;
    }

    public Booking createBooking(Booking booking) {

    if (booking.getStartTime().isBefore(LocalDateTime.now())) {
        throw new BookingConflictException(
        "Start time must be in the future"
);
    }

    if (booking.getEndTime().isBefore(booking.getStartTime())) {
        throw new BookingConflictException(
        "End time must be after start time"
);
    }

    List<Booking> conflicts =
            repository.findByResourceNameAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                    booking.getResourceName(),
                    ACTIVE_CONFLICT_STATUSES,
                    booking.getEndTime(),
                    booking.getStartTime()
            );

    if (!conflicts.isEmpty()) {
        throw new BookingConflictException(
        "Booking conflict detected for this time slot"
);
    }

    booking.setStatus(BookingStatus.PENDING);

    return repository.save(booking);
}
    public List<Booking> getAllBookings() {
        return repository.findAll();
    }

    public Booking approveBooking(Long id) {

        Booking booking = repository.findById(id)
                .orElseThrow();

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingConflictException(
                    "Only PENDING bookings can be approved"
            );
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setRejectionReason(null);

        return repository.save(booking);
    }

    public Booking rejectBooking(Long id, String reason) {

    Booking booking = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (booking.getStatus() != BookingStatus.PENDING) {
        throw new BookingConflictException(
                "Only PENDING bookings can be rejected"
        );
    }

    booking.setStatus(BookingStatus.REJECTED);

    booking.setRejectionReason(reason);

    return repository.save(booking);
}

    public Booking cancelBooking(Long id) {

    Booking booking = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (booking.getStatus() != BookingStatus.APPROVED) {
        throw new BookingConflictException(
                "Only APPROVED bookings can be cancelled"
        );
    }

    booking.setStatus(BookingStatus.CANCELLED);

    return repository.save(booking);
}

    public void deleteBooking(Long id) {
        repository.deleteById(id);
    }

    public List<Booking> searchByResource(String resourceName) {
    return repository.findByResourceName(resourceName);
}

public List<Booking> searchByDateRange(
        LocalDateTime start,
        LocalDateTime end
) {
    return repository.findByStartTimeBetween(start, end);
}

public List<Booking> searchByResourceAndDate(
        String resourceName,
        LocalDateTime start,
        LocalDateTime end
) {
    return repository.findByResourceNameAndStartTimeBetween(
            resourceName,
            start,
            end
    );
}

public boolean checkAvailability(
        String resourceName,
        LocalDateTime start,
        LocalDateTime end
) {

    // Rule 1 — Start must be today or future
    if (start.toLocalDate().isBefore(LocalDate.now())) {
        throw new BookingConflictException(
                "Start time must be today or in the future"
        );
    }

    // Rule 2 — End must be after start
    if (end.isBefore(start)) {
        throw new BookingConflictException(
                "End time must be after start time"
        );
    }

    List<Booking> conflicts =
            repository.findByResourceNameAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                    resourceName,
                    ACTIVE_CONFLICT_STATUSES,
                    end,
                    start
            );

    return conflicts.isEmpty();
}
}

