package com.project.smartcampus.controller;

import com.project.smartcampus.dto.BookingRequest;
import com.project.smartcampus.dto.BookingResponse;
import com.project.smartcampus.dto.RejectBookingRequest;
import com.project.smartcampus.enums.BookingStatus;
import com.project.smartcampus.services.BookingService;
import com.project.smartcampus.services.UserService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")

@CrossOrigin(origins = "http://localhost:5173")

public class BookingController {
    private final BookingService service;
    private final UserService userService;

    public BookingController(BookingService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    public BookingResponse createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        request.setBookedBy(userService.extractUserEmail(authentication));
        return service.createBooking(request);
    }

    @GetMapping
    public List<BookingResponse> getAllBookings(
            @RequestParam(required = false) String resourceName,
            @RequestParam(required = false) BookingStatus status) {
        return service.getBookingsFiltered(resourceName, status);
    }

    @GetMapping("/my-bookings")
    public List<BookingResponse> getMyBookings(
            Authentication authentication,
            @RequestParam(required = false) String resourceName,
            @RequestParam(required = false) BookingStatus status) {
        String userEmail = userService.extractUserEmail(authentication);
        return service.getUserBookingsFiltered(userEmail, resourceName, status);
    }

    @GetMapping("/{id}")
    public BookingResponse getBookingById(@PathVariable Long id) {
        return service.getBookingById(id);
    }

    @PutMapping("/{id}")
    public BookingResponse updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingRequest request) {

        return service.updateBooking(id, request);
    }

    @PutMapping("/{id}/approve")
    public BookingResponse approveBooking(@PathVariable Long id) {
        return service.approveBooking(id);
    }

    @PutMapping("/{id}/reject")
    public BookingResponse rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody RejectBookingRequest request) {

        return service.rejectBooking(id, request.getReason());
    }

    @PutMapping("/{id}/cancel")
    public BookingResponse cancelBooking(@PathVariable Long id) {
        return service.cancelBooking(id);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        service.deleteBooking(id);
    }

    @GetMapping("/search/resource")
    public List<BookingResponse> searchByResource(
            @RequestParam String resourceName) {
        return service.searchByResource(resourceName);
    }

    @GetMapping("/search/date")
    public List<BookingResponse> searchByDateRange(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return service.searchByDateRange(start, end);
    }

    @GetMapping("/search")
    public List<BookingResponse> searchByResourceAndDate(
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
    public ResponseEntity<BookingResponse> checkInBooking(
            @PathVariable Long id) {

        BookingResponse booking = service.checkIn(id);

        return ResponseEntity.ok(booking);
    }

}

