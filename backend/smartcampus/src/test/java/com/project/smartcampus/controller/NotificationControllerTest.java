package com.project.smartcampus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.smartcampus.dto.NotificationDTO;
import com.project.smartcampus.model.NotificationType;
import com.project.smartcampus.service.NotificationService;
import com.project.smartcampus.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private UserService userService;

    private NotificationDTO sampleNotification() {
        return NotificationDTO.builder()
                .id(1L)
                .recipientId(10L)
                .type(NotificationType.BOOKING_APPROVED)
                .title("Booking Approved")
                .message("Your booking has been approved.")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @WithMockUser(username = "10", roles = "USER")
    void getNotifications_shouldReturn200WithList() throws Exception {
        when(userService.extractUserId(ArgumentMatchers.any())).thenReturn(10L);
        when(notificationService.getNotificationsForUser(10L)).thenReturn(List.of(sampleNotification()));

        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Booking Approved"))
                .andExpect(jsonPath("$[0].isRead").value(false));
    }

    @Test
    @WithMockUser(username = "10", roles = "USER")
    void getUnreadNotifications_shouldReturn200() throws Exception {
        when(userService.extractUserId(ArgumentMatchers.any())).thenReturn(10L);
        when(notificationService.getUnreadNotifications(10L)).thenReturn(List.of(sampleNotification()));

        mockMvc.perform(get("/api/notifications/unread"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(username = "10", roles = "USER")
    void getUnreadCount_shouldReturn200WithCount() throws Exception {
        when(userService.extractUserId(ArgumentMatchers.any())).thenReturn(10L);
        when(notificationService.getUnreadCount(10L)).thenReturn(3L);

        mockMvc.perform(get("/api/notifications/unread/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(3));
    }

    @Test
    @WithMockUser(username = "10", roles = "USER")
    void markAsRead_shouldReturn200() throws Exception {
        NotificationDTO read = sampleNotification();
        read.setRead(true);

        when(userService.extractUserId(ArgumentMatchers.any())).thenReturn(10L);
        when(notificationService.markAsRead(1L, 10L)).thenReturn(read);

        mockMvc.perform(patch("/api/notifications/1/read").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isRead").value(true));
    }

    @Test
    @WithMockUser(username = "10", roles = "USER")
    void markAllAsRead_shouldReturn200() throws Exception {
        when(userService.extractUserId(ArgumentMatchers.any())).thenReturn(10L);

        mockMvc.perform(patch("/api/notifications/read-all").with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "10", roles = "USER")
    void deleteNotification_shouldReturn204() throws Exception {
        when(userService.extractUserId(ArgumentMatchers.any())).thenReturn(10L);

        mockMvc.perform(delete("/api/notifications/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "10", roles = "USER")
    void clearAllNotifications_shouldReturn204() throws Exception {
        when(userService.extractUserId(ArgumentMatchers.any())).thenReturn(10L);

        mockMvc.perform(delete("/api/notifications/clear").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    void getNotifications_unauthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isUnauthorized());
    }
}
