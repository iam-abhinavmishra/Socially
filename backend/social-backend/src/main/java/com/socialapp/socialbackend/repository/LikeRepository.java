package com.socialapp.socialbackend.repository;

import com.socialapp.socialbackend.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    void deleteByPostId(Long postId);

    long countByPostId(Long postId);

    Optional<Like> findByUserIdAndPostId(Long userId, Long postId);

    Optional<Like> findByUserIdAndCommentId(Long userId, Long commentId);

    long countByCommentId(Long commentId);

    void deleteByCommentId(Long commentId);
}