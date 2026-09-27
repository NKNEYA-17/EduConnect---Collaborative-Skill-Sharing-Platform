package com.educonnect.repository;

import com.educonnect.model.Admin;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AdminRepository
        extends MongoRepository<Admin, String> {

    // =========================================
    // FIND ADMIN BY EMAIL
    // =========================================

    Optional<Admin> findByEmail(String email);

    // =========================================
    // CHECK WHETHER EMAIL ALREADY EXISTS
    // =========================================

    boolean existsByEmail(String email);

}