package com.educonnect.repository;

import com.educonnect.model.MentorApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MentorApplicationRepository
        extends MongoRepository<MentorApplication, String> {

    // Find mentor application by user email
    Optional<MentorApplication> findByEmail(String email);

    // Find all applications by status
    List<MentorApplication> findByStatus(String status);

    // Check if user has already applied
    boolean existsByEmail(String email);

    // Find rejected applications by user email and status
    List<MentorApplication> findByEmailAndStatus(
            String email,
            String status
    );
}

