package com.socialapp.socialbackend.controller;

import com.socialapp.socialbackend.model.Notification;
import com.socialapp.socialbackend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(
            @PathVariable Long userId
    ) {
        return notificationService
                .getUserNotifications(userId);
    }

    @PutMapping("/{notificationId}/read")
    public Notification markAsRead(
            @PathVariable Long notificationId
    ) {
        return notificationService
                .markAsRead(notificationId);
    }

    @DeleteMapping("/{notificationId}")
    public String deleteNotification(
            @PathVariable Long notificationId
    ) {
        notificationService
                .deleteNotification(notificationId);

        return "Notification deleted successfully";
    }
}