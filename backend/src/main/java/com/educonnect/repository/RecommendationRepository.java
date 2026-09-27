package com.educonnect.repository;

import com.educonnect.model.Recommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository
        extends MongoRepository<Recommendation, String> {

    // Get all recommendations for a user,
    // sorted from highest hybrid score to lowest
    List<Recommendation> findByUserIdOrderByHybridScoreDesc(
            String userId
    );

    // Delete all recommendations belonging to a user
    void deleteByUserId(
            String userId
    );
}