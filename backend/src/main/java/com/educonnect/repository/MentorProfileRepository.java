package com.educonnect.repository;

import com.educonnect.model.MentorProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MentorProfileRepository
        extends MongoRepository<MentorProfile, String> {

    // Find mentor profile using the logged-in user's ID
    Optional<MentorProfile> findByUserId(String userId);

    // Find mentor profiles by completion status
    List<MentorProfile> findByProfileCompleted(boolean profileCompleted);

    // Find all completed mentor profiles
    List<MentorProfile> findByProfileCompletedTrue();

    // Check whether a mentor profile already exists for a user
    boolean existsByUserId(String userId);
}