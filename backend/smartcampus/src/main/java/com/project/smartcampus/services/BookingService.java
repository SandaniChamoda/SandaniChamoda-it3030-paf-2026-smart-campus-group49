//backend\smartcampus\src\main\java\com\project\smartcampus\services\BookingService.java
package com.project.smartcampus.services;

import com.project.smartcampus.entity.Booking;
import com.project.smartcampus.enums.BookingStatus;
import com.project.smartcampus.exception.BookingConflictException;
import com.project.smartcampus.repository.BookingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
//import com.project.smartcampus.exception.BookingConflictException;

import java.util.List;
import java.util.EnumSet;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class BookingService {

        @Autowired
        private QRCodeService qrCodeService;

        private final BookingRepository repository;
        private static final EnumSet<BookingStatus> ACTIVE_CONFLICT_STATUSES = EnumSet.of(BookingStatus.PENDING,
                        BookingStatus.APPROVED);

        public BookingService(BookingRepository repository) {
                this.repository = repository;
        }

        public Booking createBooking(Booking booking) {

                if (booking.getStartTime().isBefore(LocalDateTime.now())) {
                        throw new BookingConflictException(
                                        "Start time must be in the future");
                }

                if (booking.getEndTime().isBefore(booking.getStartTime())) {
                        throw new BookingConflictException(
                                        "End time must be after start time");
                }

                List<Booking> conflicts = repository
                                .findByResourceNameAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                                                booking.getResourceName(),
                                                ACTIVE_CONFLICT_STATUSES,
                                                booking.getEndTime(),
                                                booking.getStartTime());

                if (!conflicts.isEmpty()) {
                        throw new BookingConflictException(
                                        "Booking conflict detected for this time slot");
                }

                booking.setStatus(BookingStatus.PENDING);

                return repository.save(booking);
        }

        public List<Booking> getAllBookings() {
                return repository.findAll();
        }

        public List<Booking> getBookingsFiltered(String resourceName, BookingStatus status) {
                boolean hasResource = resourceName != null && !resourceName.isBlank();
                boolean hasStatus = status != null;

                if (hasResource && hasStatus) {
                        return repository.findByResourceNameContainingIgnoreCaseAndStatus(
                                        resourceName,
                                        status);
                }

                if (hasResource) {
                        return repository.findByResourceNameContainingIgnoreCase(resourceName);
                }

                if (hasStatus) {
                        return repository.findByStatus(status);
                }

                return repository.findAll();
        }

        public Booking getBookingById(Long id) {
                return repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));
        }

        public Booking updateBooking(Long id, Booking updatedBooking) {

                Booking existing = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                if (existing.getStatus() != BookingStatus.PENDING) {
                        throw new BookingConflictException(
                                        "Only PENDING bookings can be updated");
                }

                if (updatedBooking.getStartTime().isBefore(LocalDateTime.now())) {
                        throw new BookingConflictException(
                                        "Start time must be in the future");
                }

                if (updatedBooking.getEndTime().isBefore(updatedBooking.getStartTime())) {
                        throw new BookingConflictException(
                                        "End time must be after start time");
                }

                List<Booking> conflicts = repository
                                .findByResourceNameAndStatusInAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
                                                updatedBooking.getResourceName(),
                                                ACTIVE_CONFLICT_STATUSES,
                                                updatedBooking.getEndTime(),
                                                updatedBooking.getStartTime(),
                                                id);

                if (!conflicts.isEmpty()) {
                        throw new BookingConflictException(
                                        "Booking conflict detected for this time slot");
                }

                existing.setResourceName(updatedBooking.getResourceName());
                existing.setStartTime(updatedBooking.getStartTime());
                existing.setEndTime(updatedBooking.getEndTime());
                existing.setPurpose(updatedBooking.getPurpose());
                existing.setAttendees(updatedBooking.getAttendees());

                return repository.save(existing);
        }

        public Booking approveBooking(Long id) {

                Booking booking = repository.findById(id)
                                .orElseThrow();

                if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new BookingConflictException(
                                        "Only PENDING bookings can be approved");
                }

                // Change status
                booking.setStatus(BookingStatus.APPROVED);

                // Clear rejection reason
                booking.setRejectionReason(null);

                // Generate QR code
                String qrPath = qrCodeService.generateQRCode(
                                booking.getId());

                // Save QR path
                booking.setQrCode(qrPath);

                return repository.save(booking);
        }

        public Booking rejectBooking(Long id, String reason) {

                Booking booking = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new BookingConflictException(
                                        "Only PENDING bookings can be rejected");
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
                                        "Only APPROVED bookings can be cancelled");
                }

                booking.setStatus(BookingStatus.CANCELLED);

                return repository.save(booking);
        }

        public void deleteBooking(Long id) {

                Booking booking = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                if (booking.getStatus() != BookingStatus.PENDING) {
                        throw new BookingConflictException(
                                        "Only PENDING bookings can be deleted");
                }

                repository.delete(booking);
        }

        public List<Booking> searchByResource(String resourceName) {
                return repository.findByResourceNameContainingIgnoreCase(resourceName);
        }

        public List<Booking> searchByDateRange(
                        LocalDateTime start,
                        LocalDateTime end) {
                return repository.findByStartTimeBetween(start, end);
        }

        public List<Booking> searchByResourceAndDate(
                        String resourceName,
                        LocalDateTime start,
                        LocalDateTime end) {
                return repository.findByResourceNameAndStartTimeBetween(
                                resourceName,
                                start,
                                end);
        }

        public boolean checkAvailability(
                        String resourceName,
                        LocalDateTime start,
                        LocalDateTime end) {

                // Rule 1 — Start must be today or future
                if (start.toLocalDate().isBefore(LocalDate.now())) {
                        throw new BookingConflictException(
                                        "Start time must be today or in the future");
                }

                // Rule 2 — End must be after start
                if (end.isBefore(start)) {
                        throw new BookingConflictException(
                                        "End time must be after start time");
                }

                List<Booking> conflicts = repository
                                .findByResourceNameAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                                                resourceName,
                                                ACTIVE_CONFLICT_STATUSES,
                                                end,
                                                start);

                return conflicts.isEmpty();
        }

        public Booking checkIn(Long id) {

                Booking booking = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                // Debug print
                System.out.println("Booking ID: " + id);
                System.out.println("Current Status: " + booking.getStatus());

                // Check status safely
                if (!BookingStatus.APPROVED.equals(booking.getStatus())) {

                        throw new RuntimeException(
                                        "Booking must be APPROVED to check in. Current status: "
                                                        + booking.getStatus());
                }

                booking.setStatus(
                                BookingStatus.CHECKED_IN);

                booking.setCheckedInTime(
                                LocalDateTime.now());

                return repository.save(booking);
        }

}
