package com.socialapp.socialbackend.repository;

import com.socialapp.socialbackend.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository
        extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByUserId(Long userId);

    Optional<Bookmark> findByUserIdAndPostId(
            Long userId,
            Long postId
    );
}