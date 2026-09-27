package com.educonnect.repository;

import com.educonnect.model.MentorSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MentorSessionRepository
        extends MongoRepository<MentorSession, String> {

    Optional<MentorSession> findByMentorId(String mentorId);

    boolean existsByMentorId(String mentorId);
}