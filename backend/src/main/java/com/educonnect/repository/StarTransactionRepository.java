package com.educonnect.repository;

import com.educonnect.model.StarTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StarTransactionRepository
        extends MongoRepository<StarTransaction, String> {

    // Get all star transactions of a user
    List<StarTransaction> findByUserId(String userId);

    // Get transactions of a user, newest first
    List<StarTransaction> findByUserIdOrderByCreatedAtDesc(String userId);

    // Calculate total stars earned by a user
    int countByUserId(String userId);
}