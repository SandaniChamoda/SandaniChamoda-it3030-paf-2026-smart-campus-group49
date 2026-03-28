package com.project.smartcampus.services;

import com.project.smartcampus.entity.Booking;
import com.project.smartcampus.repository.BookingRepository;
import org.springframework.stereotype.Service;
import com.project.smartcampus.exception.BookingConflictException;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repository;

    public BookingService(BookingRepository repository) {
        this.repository = repository;
    }

    public Booking createBooking(Booking booking) {

    List<Booking> conflicts =
            repository.findByResourceNameAndStartTimeLessThanAndEndTimeGreaterThan(
                    booking.getResourceName(),
                    booking.getEndTime(),
                    booking.getStartTime()
            );

    if (!conflicts.isEmpty()) {
        throw new BookingConflictException(
    "Booking conflict detected for this time slot"
);
    }

    booking.setStatus("PENDING");

    return repository.save(booking);
}
    public List<Booking> getAllBookings() {
        return repository.findAll();
    }

    public Booking approveBooking(Long id) {

        Booking booking = repository.findById(id)
                .orElseThrow();

        booking.setStatus("APPROVED");

        return repository.save(booking);
    }

    public Booking rejectBooking(Long id) {

        Booking booking = repository.findById(id)
                .orElseThrow();

        booking.setStatus("REJECTED");

        return repository.save(booking);
    }

    public void deleteBooking(Long id) {
        repository.deleteById(id);
    }
}
