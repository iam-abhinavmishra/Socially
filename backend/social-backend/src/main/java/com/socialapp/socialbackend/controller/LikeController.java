package com.socialapp.socialbackend.controller;

import com.socialapp.socialbackend.model.Like;
import com.socialapp.socialbackend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping
    public Like likePost(@RequestBody Like like) {
        return likeService.save(like);
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