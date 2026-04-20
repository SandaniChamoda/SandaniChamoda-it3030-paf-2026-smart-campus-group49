package com.project.smartcampus.config;

import com.project.smartcampus.entity.User;
import com.project.smartcampus.enums.Role;
import com.project.smartcampus.repository.UserRepository;
import com.project.smartcampus.config.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

/**
 * Handler invoked after a successful Google OAuth2 login.
 * Generates a JWT token and redirects the user to the frontend with the token.
 */
@Slf4j
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = Optional.ofNullable((String) oAuth2User.getAttribute("email"))
            .map(String::trim)
            .orElse("");

        if (email.isEmpty()) {
            throw new RuntimeException("OAuth2 email is missing from provider response.");
        }

        User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                log.warn("OAuth2 user was authenticated but not found in DB. Creating user: {}", email);

                    String name = Optional.ofNullable((String) oAuth2User.getAttribute("name"))
                    .map(String::trim)
                    .filter(value -> !value.isEmpty())
                    .orElse(email);

                User newUser = User.builder()
                    .email(email)
                    .name(name)
                    .profilePicture(oAuth2User.getAttribute("picture"))
                    .role(Role.USER)
                    .provider("google")
                    .providerId(oAuth2User.getAttribute("sub"))
                    .build();

                return userRepository.save(newUser);
            });

        String token = jwtUtil.generateToken(user);
        log.info("Generated JWT for user: {}", email);

        String redirectUrl = frontendUrl + "/oauth2/redirect?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
