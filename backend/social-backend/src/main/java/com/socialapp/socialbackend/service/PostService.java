package com.socialapp.socialbackend.service;
import org.springframework.transaction.annotation.Transactional;

import com.socialapp.socialbackend.model.Post;
import com.socialapp.socialbackend.model.User;
import com.socialapp.socialbackend.repository.BookmarkRepository;
import com.socialapp.socialbackend.repository.CommentRepository;
import com.socialapp.socialbackend.repository.LikeRepository;
import com.socialapp.socialbackend.repository.PostRepository;
import com.socialapp.socialbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    public Post createPost(Post post, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        post.setUser(user);

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElse(null);
    }
    @Transactional
    public void deletePost(Long id) {

        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post not found");
        }

        // Delete records that reference this post first.
        commentRepository.deleteByPostId(id);
        likeRepository.deleteByPostId(id);
        bookmarkRepository.deleteByPostId(id);

        // Now the post can safely be deleted.
        postRepository.deleteById(id);
    }
}