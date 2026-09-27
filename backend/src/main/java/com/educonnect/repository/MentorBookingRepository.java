package com.educonnect.repository;

import com.educonnect.model.MentorBooking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MentorBookingRepository
        extends MongoRepository<MentorBooking, String> {

    // =========================================
    // GET ALL BOOKINGS FOR A MENTOR
    // =========================================

    List<MentorBooking> findByMentorId(String mentorId);


    // =========================================
    // GET ALL BOOKINGS FOR A STUDENT
    // =========================================

    List<MentorBooking> findByStudentId(String studentId);


    // =========================================
    // GET BOOKINGS BY MENTOR AND STATUS
    // =========================================

    List<MentorBooking> findByMentorIdAndStatus(
            String mentorId,
            String status
    );


    // =========================================
    // GET BOOKINGS BY STUDENT AND STATUS
    // =========================================

    List<MentorBooking> findByStudentIdAndStatus(
            String studentId,
            String status
    );


    // =========================================
    // CHECK DUPLICATE PENDING BOOKING
    // =========================================

    boolean existsByMentorIdAndStudentIdAndSessionIdAndSlotAndStatus(
            String mentorId,
            String studentId,
            String sessionId,
            String slot,
            String status
    );

}