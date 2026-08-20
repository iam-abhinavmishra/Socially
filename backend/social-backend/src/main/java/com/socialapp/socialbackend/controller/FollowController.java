package com.socialapp.socialbackend.controller;

import com.socialapp.socialbackend.model.Follow;
import com.socialapp.socialbackend.service.FollowService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    public Follow follow(@RequestBody Follow follow) {
        return followService.follow(follow);
    }

    @GetMapping("/followers/{userId}")
    public List<Follow> followers(@PathVariable Long userId) {
        return followService.getFollowers(userId);
    }

    @GetMapping("/following/{userId}")
    public List<Follow> following(@PathVariable Long userId) {
        return followService.getFollowing(userId);
    }

    @DeleteMapping("/{id}")
    public String unfollow(@PathVariable Long id) {
        followService.unfollow(id);
        return "Unfollowed successfully";
    }
}