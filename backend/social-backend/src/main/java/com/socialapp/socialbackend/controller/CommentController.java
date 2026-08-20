package com.socialapp.socialbackend.controller;

import com.socialapp.socialbackend.model.Comment;
import com.socialapp.socialbackend.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public Comment createComment(
            @RequestBody Map<String, Object> request
    ) {

        String content = (String) request.get("content");

        Long userId = Long.valueOf(
                request.get("userId").toString()
        );

        Long postId = Long.valueOf(
                request.get("postId").toString()
        );

        return commentService.createComment(
                content,
                userId,
                postId
        );
    }

    @GetMapping
    public List<Comment> getComments() {
        return commentService.getAllComments();
    }

    @DeleteMapping("/{id}")
    public String deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return "Comment deleted";
    }
}