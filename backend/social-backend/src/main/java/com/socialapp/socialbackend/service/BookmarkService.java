package com.socialapp.socialbackend.service;

import com.socialapp.socialbackend.model.Bookmark;
import com.socialapp.socialbackend.model.Post;
import com.socialapp.socialbackend.model.User;
import com.socialapp.socialbackend.repository.BookmarkRepository;
import com.socialapp.socialbackend.repository.PostRepository;
import com.socialapp.socialbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public BookmarkService(
            BookmarkRepository bookmarkRepository,
            UserRepository userRepository,
            PostRepository postRepository
    ) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public Bookmark addBookmark(
            Long userId,
            Long postId
    ) {
        if (bookmarkRepository
                .findByUserIdAndPostId(userId, postId)
                .isPresent()) {

            throw new RuntimeException(
                    "Post is already bookmarked"
            );
        }

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

        Bookmark bookmark = new Bookmark(user, post);

        return bookmarkRepository.save(bookmark);
    }

    public List<Bookmark> getUserBookmarks(
            Long userId
    ) {
        return bookmarkRepository.findByUserId(userId);
    }

    public void removeBookmark(
            Long userId,
            Long postId
    ) {
        Bookmark bookmark = bookmarkRepository
                .findByUserIdAndPostId(userId, postId)
                .orElseThrow(() ->
                        new RuntimeException("Bookmark not found")
                );

        bookmarkRepository.delete(bookmark);
    }
}