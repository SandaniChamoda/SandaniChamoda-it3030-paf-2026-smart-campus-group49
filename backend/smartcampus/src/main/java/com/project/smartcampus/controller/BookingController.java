package com.project.smartcampus.controller;

import com.project.smartcampus.entity.Booking;
import com.project.smartcampus.enums.BookingStatus;
import com.project.smartcampus.exception.BookingConflictException;
import com.project.smartcampus.services.BookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")

@CrossOrigin(origins = "http://localhost:5173")

public class BookingController {

    @Autowired
    private BookingService bookingService;
    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return service.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings(
            @RequestParam(required = false) String resourceName,
            @RequestParam(required = false) BookingStatus status) {
        return service.getBookingsFiltered(resourceName, status);
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return service.getBookingById(id);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(
            @PathVariable Long id,
            @RequestBody Booking updatedBooking) {

        return service.updateBooking(id, updatedBooking);
    }

    @PutMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable Long id) {
        return service.approveBooking(id);
    }

    @PutMapping("/{id}/reject")
    public Booking rejectBooking(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {

        System.out.println("Reject request body: " + request);

        Object reasonObj = request.get("reason");

        if (reasonObj == null) {
            throw new BookingConflictException("Rejection reason is required");
        }

        String reason = reasonObj.toString();

        if (reason.isBlank()) {
            throw new BookingConflictException("Rejection reason cannot be empty");
        }

        return service.rejectBooking(id, reason);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {
        return service.cancelBooking(id);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        service.deleteBooking(id);
    }

    @GetMapping("/search/resource")
    public List<Booking> searchByResource(
            @RequestParam String resourceName) {
        return service.searchByResource(resourceName);
    }

    @GetMapping("/search/date")
    public List<Booking> searchByDateRange(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return service.searchByDateRange(start, end);
    }

    @GetMapping("/search")
    public List<Booking> searchByResourceAndDate(
            @RequestParam String resourceName,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return service.searchByResourceAndDate(
                resourceName,
                start,
                end);
    }

    @GetMapping("/availability")
    public Map<String, Boolean> checkAvailability(
            @RequestParam String resourceName,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {

        boolean available = service.checkAvailability(resourceName, start, end);

        Map<String, Boolean> response = new HashMap<>();

        response.put("available", available);

        return response;
    }

    @PutMapping("/checkin/{id}")
    public ResponseEntity<Booking> checkInBooking(
            @PathVariable Long id) {

        Booking booking = bookingService.checkIn(id);

        return ResponseEntity.ok(booking);
    }

}
