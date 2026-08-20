package com.socialapp.socialbackend.service;

import com.socialapp.socialbackend.model.Follow;
import com.socialapp.socialbackend.repository.FollowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final NotificationService notificationService;

    public FollowService(
            FollowRepository followRepository,
            NotificationService notificationService
    ) {
        this.followRepository = followRepository;
        this.notificationService = notificationService;
    }

    public Follow follow(Follow follow) {

        Follow savedFollow = followRepository.save(follow);

        // Don't create a notification if somehow a user follows themselves
        if (!follow.getFollower().getId()
                .equals(follow.getFollowing().getId())) {

            notificationService.createNotification(
                    follow.getFollowing().getId(),
                    follow.getFollower().getUsername()
                            + " started following you",
                    "FOLLOW"
            );
        }

        return savedFollow;
    }

    public List<Follow> getFollowers(Long userId) {
        return followRepository.findByFollowingId(userId);
    }

    public List<Follow> getFollowing(Long userId) {
        return followRepository.findByFollowerId(userId);
    }

    public void unfollow(Long id) {
        followRepository.deleteById(id);
    }
}