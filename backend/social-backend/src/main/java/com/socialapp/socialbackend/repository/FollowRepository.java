package com.socialapp.socialbackend.repository;

import com.socialapp.socialbackend.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    List<Follow> findByFollowerId(Long followerId);

    List<Follow> findByFollowingId(Long followingId);

    Optional<Follow> findByFollowerIdAndFollowingId(
            Long followerId,
            Long followingId
    );
}