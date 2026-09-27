package com.educonnect.repository;

import com.educonnect.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository
        extends MongoRepository<Notification, String> {

    // =========================================
    // GET ALL NOTIFICATIONS FOR A USER
    // =========================================

    List<Notification> findByUserIdOrderByCreatedAtDesc(
            String userId
    );


    // =========================================
    // GET UNREAD NOTIFICATIONS
    // =========================================

    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(
            String userId
    );


    // =========================================
    // COUNT UNREAD NOTIFICATIONS
    // =========================================

    long countByUserIdAndReadFalse(
            String userId
    );


    // =========================================
    // GET NOTIFICATIONS BY TYPE
    // =========================================

    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(
            String userId,
            String type
    );


    // =========================================
    // FIND NOTIFICATION FOR A BOOKING
    // =========================================

    List<Notification> findByBookingIdOrderByCreatedAtDesc(
            String bookingId
    );

}