package com.socialapp.socialbackend.repository;

import com.socialapp.socialbackend.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
}