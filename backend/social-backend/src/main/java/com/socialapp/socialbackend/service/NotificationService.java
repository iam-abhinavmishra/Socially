package com.socialapp.socialbackend.service;

import com.socialapp.socialbackend.model.Notification;
import com.socialapp.socialbackend.model.User;
import com.socialapp.socialbackend.repository.NotificationRepository;
import com.socialapp.socialbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Notification createNotification(
            Long userId,
            String message,
            String type
    ) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Notification notification =
                new Notification(
                        message,
                        type,
                        user
                );

        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(
            Long userId
    ) {
        return notificationRepository
                .findByUserIdOrderByIdDesc(userId);
    }

    public Notification markAsRead(Long notificationId) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        notification.setRead(true);

        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}