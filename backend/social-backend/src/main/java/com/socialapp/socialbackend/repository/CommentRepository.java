package com.socialapp.socialbackend.repository;

import com.socialapp.socialbackend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}