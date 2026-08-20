package com.socialapp.socialbackend.controller;

import com.socialapp.socialbackend.model.Like;
import com.socialapp.socialbackend.service.LikeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public Like likePost(
            @RequestBody Map<String, Object> request
    ) {

        Long userId = Long.valueOf(
                request.get("userId").toString()
        );

        Long postId = Long.valueOf(
                request.get("postId").toString()
        );

        return likeService.likePost(userId, postId);
    }

    @GetMapping
    public List<Like> getLikes() {
        return likeService.getAllLikes();
    }

    @DeleteMapping("/{id}")
    public String removeLike(@PathVariable Long id) {
        likeService.deleteLike(id);
        return "Like removed";
    }
}