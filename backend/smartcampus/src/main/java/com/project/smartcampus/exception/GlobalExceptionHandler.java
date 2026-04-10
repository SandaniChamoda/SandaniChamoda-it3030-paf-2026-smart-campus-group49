//backend\smartcampus\src\main\java\com\project\smartcampus\exception\GlobalExceptionHandler.java
package com.project.smartcampus.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.MethodArgumentNotValidException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BookingConflictException.class)
    public ResponseEntity<Map<String, Object>> handleBookingConflict(
            BookingConflictException ex
    ) {

        Map<String, Object> response = new HashMap<>();

        response.put("timestamp", LocalDateTime.now());
        response.put("status", 400);
        response.put("error", "Bad Request");
        response.put("message", ex.getMessage());

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }

    //sandani
     @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex
    ) {
        Map<String, Object> response = new HashMap<>();

        response.put("timestamp", LocalDateTime.now());
        response.put("status", 400);
        response.put("error", "Bad Request");
        response.put("message", ex.getMessage());

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }

    //sandani
    @ExceptionHandler(TicketNotFoundException.class)
public ResponseEntity<Map<String, Object>> handleTicketNotFound(
        TicketNotFoundException ex
) {
    Map<String, Object> response = new HashMap<>();

    response.put("timestamp", LocalDateTime.now());
    response.put("status", 404);
    response.put("error", "Not Found");
    response.put("message", ex.getMessage());

    return new ResponseEntity<>(
            response,
            HttpStatus.NOT_FOUND
    );
}

//sandani
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, Object>> handleValidationException(
        MethodArgumentNotValidException ex
) {
    Map<String, Object> response = new HashMap<>();

    response.put("timestamp", LocalDateTime.now());
    response.put("status", 400);
    response.put("error", "Validation Error");

    String errorMessage = ex.getBindingResult()
            .getFieldErrors()
            .get(0)
            .getDefaultMessage();

    response.put("message", errorMessage);

    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
}
}