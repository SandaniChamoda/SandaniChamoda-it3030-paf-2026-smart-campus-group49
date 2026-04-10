package com.project.smartcampus.controller;

import com.project.smartcampus.dto.UserDTO;
import com.project.smartcampus.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller handling authentication-related endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Returns the currently authenticated user's info.
     * Used by the frontend to validate the JWT token on app load.
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        UserDTO user = userService.getCurrentUser(authentication);
        return ResponseEntity.ok(user);
    }

    /**
     * Called after a successful OAuth2 login.
     * The actual token generation and redirect is handled by OAuth2LoginSuccessHandler.
     * This endpoint is a fallback/informational endpoint.
     */
    @GetMapping("/login/success")
    public ResponseEntity<String> loginSuccess() {
        return ResponseEntity.ok("Login successful. Token issued via redirect.");
    }

    /**
     * Called when OAuth2 login fails.
     */
    @GetMapping("/login/failure")
    public ResponseEntity<String> loginFailure() {
        return ResponseEntity.status(401).body("OAuth2 login failed. Please try again.");
    }

    /**
     * Logs out the current user.
     * Since we use stateless JWT, the frontend should discard the token.
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out successfully. Please discard your token.");
    }
}
