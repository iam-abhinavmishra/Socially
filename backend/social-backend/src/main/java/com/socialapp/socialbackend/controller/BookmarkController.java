package com.socialapp.socialbackend.controller;

import com.socialapp.socialbackend.model.Bookmark;
import com.socialapp.socialbackend.service.BookmarkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(
            BookmarkService bookmarkService
    ) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping
    public Bookmark addBookmark(
            @RequestParam Long userId,
            @RequestParam Long postId
    ) {
        return bookmarkService.addBookmark(
                userId,
                postId
        );
    }

    @GetMapping("/user/{userId}")
    public List<Bookmark> getUserBookmarks(
            @PathVariable Long userId
    ) {
        return bookmarkService
                .getUserBookmarks(userId);
    }

    @DeleteMapping
    public String removeBookmark(
            @RequestParam Long userId,
            @RequestParam Long postId
    ) {
        bookmarkService.removeBookmark(
                userId,
                postId
        );

        return "Bookmark removed successfully";
    }
}