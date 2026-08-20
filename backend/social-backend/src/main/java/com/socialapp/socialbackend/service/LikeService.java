package com.socialapp.socialbackend.service;

import com.socialapp.socialbackend.model.Like;
import com.socialapp.socialbackend.model.Post;
import com.socialapp.socialbackend.model.User;
import com.socialapp.socialbackend.repository.LikeRepository;
import com.socialapp.socialbackend.repository.PostRepository;
import com.socialapp.socialbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    public LikeService(
            LikeRepository likeRepository,
            UserRepository userRepository,
            PostRepository postRepository,
            NotificationService notificationService
    ) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    public Like likePost(Long userId, Long postId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found")
                );

        Like like = new Like();

        like.setUser(user);
        like.setPost(post);

        Like savedLike = likeRepository.save(like);

        if (post.getUser() != null
                && !post.getUser().getId().equals(userId)) {

            notificationService.createNotification(
                    post.getUser().getId(),
                    user.getUsername()
                            + " liked your post",
                    "LIKE"
            );
        }

        return savedLike;
    }

    public List<Like> getAllLikes() {
        return likeRepository.findAll();
    }

    public void deleteLike(Long id) {
        likeRepository.deleteById(id);
    }
}