package com.socialapp.socialbackend.service;

import com.socialapp.socialbackend.model.Comment;
import com.socialapp.socialbackend.model.Post;
import com.socialapp.socialbackend.model.User;
import com.socialapp.socialbackend.repository.CommentRepository;
import com.socialapp.socialbackend.repository.PostRepository;
import com.socialapp.socialbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    public CommentService(
            CommentRepository commentRepository,
            UserRepository userRepository,
            PostRepository postRepository,
            NotificationService notificationService
    ) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    public Comment createComment(
            String content,
            Long userId,
            Long postId
    ) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Post post = postRepository
                .findById(postId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found")
                );

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setUser(user);
        comment.setPost(post);

        Comment savedComment = commentRepository.save(comment);

        // Don't notify when commenting on your own post
        if (!post.getUser().getId().equals(userId)) {

            notificationService.createNotification(
                    post.getUser().getId(),
                    user.getUsername() + " commented on your post",
                    "COMMENT"
            );
        }

        return savedComment;
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}