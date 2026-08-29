package com.socialapp.socialbackend.service;

import com.socialapp.socialbackend.model.Follow;
import com.socialapp.socialbackend.model.User;
import com.socialapp.socialbackend.repository.FollowRepository;
import com.socialapp.socialbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public FollowService(
            FollowRepository followRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Follow follow(Long followerId, Long followingId) {

        if (followerId.equals(followingId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        if (followRepository
                .findByFollowerIdAndFollowingId(
                        followerId,
                        followingId
                )
                .isPresent()) {

            throw new RuntimeException("Already following this user");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() ->
                        new RuntimeException("Follower not found")
                );

        User following = userRepository.findById(followingId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Follow follow = new Follow(follower, following);

        Follow savedFollow = followRepository.save(follow);

        notificationService.createNotification(
                followingId,
                follower.getUsername() + " started following you",
                "FOLLOW"
        );

        return savedFollow;
    }

    public List<Follow> getFollowers(Long userId) {
        return followRepository.findByFollowingId(userId);
    }

    public List<Follow> getFollowing(Long userId) {
        return followRepository.findByFollowerId(userId);
    }

    public void unfollow(Long followerId, Long followingId) {

        Follow follow = followRepository
                .findByFollowerIdAndFollowingId(
                        followerId,
                        followingId
                )
                .orElseThrow(() ->
                        new RuntimeException("Follow relationship not found")
                );

        followRepository.delete(follow);
    }
}