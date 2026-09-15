package com.socialapp.socialbackend.controller;

import com.socialapp.socialbackend.model.Follow;
import com.socialapp.socialbackend.model.Post;
import com.socialapp.socialbackend.repository.CommentRepository;
import com.socialapp.socialbackend.repository.FollowRepository;
import com.socialapp.socialbackend.repository.LikeRepository;
import com.socialapp.socialbackend.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FollowRepository followRepository;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public FeedController(
            FollowRepository followRepository,
            PostRepository postRepository,
            LikeRepository likeRepository,
            CommentRepository commentRepository
    ) {
        this.followRepository = followRepository;
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/{userId}")
    public List<Map<String, Object>> getFeed(@PathVariable Long userId) {

        List<Post> feed = new ArrayList<>();

        // Add your own posts
        feed.addAll(postRepository.findByUserId(userId));

        // Add posts from people you follow
        List<Follow> follows =
                followRepository.findByFollowerId(userId);

        for (Follow follow : follows) {

            Long followingUserId =
                    follow.getFollowing().getId();

            feed.addAll(
                    postRepository.findByUserId(followingUserId)
            );
        }

        // Newest posts first
        feed.sort(
                (a, b) -> Long.compare(
                        b.getId(),
                        a.getId()
                )
        );

        // Add like/comment counts and current user's like state
        List<Map<String, Object>> response = new ArrayList<>();

        for (Post post : feed) {

            Map<String, Object> postData = new HashMap<>();

            postData.put("id", post.getId());
            postData.put("title", post.getTitle());
            postData.put("content", post.getContent());
            postData.put("user", post.getUser());

            postData.put(
                    "likeCount",
                    likeRepository.countByPostId(post.getId())
            );

            postData.put(
                    "commentCount",
                    commentRepository.countByPostId(post.getId())
            );

            postData.put(
                    "likedByCurrentUser",
                    likeRepository
                            .findByUserIdAndPostId(
                                    userId,
                                    post.getId()
                            )
                            .isPresent()
            );

            response.add(postData);
        }

        return response;
    }
}