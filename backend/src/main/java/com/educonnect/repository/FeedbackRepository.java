package com.educonnect.repository;

import com.educonnect.model.Feedback;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository
        extends MongoRepository<Feedback, String> {

    // =========================================
    // FIND FEEDBACK FOR A PARTICULAR BOOKING
    // =========================================

    Optional<Feedback> findByBookingId(String bookingId);


    // =========================================
    // FIND ALL FEEDBACK GIVEN BY A STUDENT
    // =========================================

    List<Feedback> findByStudentId(String studentId);


    // =========================================
    // FIND ALL FEEDBACK FOR A MENTOR
    // =========================================

    List<Feedback> findByMentorId(String mentorId);


    // =========================================
    // CHECK WHETHER FEEDBACK ALREADY EXISTS
    // =========================================

    boolean existsByBookingId(String bookingId);
}