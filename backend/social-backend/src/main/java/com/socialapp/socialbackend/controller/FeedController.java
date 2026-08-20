package com.socialapp.socialbackend.controller;

import com.socialapp.socialbackend.model.Follow;
import com.socialapp.socialbackend.model.Post;
import com.socialapp.socialbackend.repository.FollowRepository;
import com.socialapp.socialbackend.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FollowRepository followRepository;
    private final PostRepository postRepository;

    public FeedController(
            FollowRepository followRepository,
            PostRepository postRepository
    ) {
        this.followRepository = followRepository;
        this.postRepository = postRepository;
    }

    @GetMapping("/{userId}")
    public List<Post> getFeed(@PathVariable Long userId) {

        List<Follow> follows =
                followRepository.findByFollowerId(userId);

        List<Post> feed = new ArrayList<>();

        for (Follow follow : follows) {
            Long followingUserId =
                    follow.getFollowing().getId();

            List<Post> posts =
                    postRepository.findByUserId(followingUserId);

            feed.addAll(posts);
        }

        return feed;
    }
}