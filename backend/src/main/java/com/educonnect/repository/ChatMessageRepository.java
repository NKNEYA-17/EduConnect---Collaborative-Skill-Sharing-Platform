package com.educonnect.repository;

import com.educonnect.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository
        extends MongoRepository<ChatMessage, String> {

    // Get all messages for a particular booking/session
    List<ChatMessage> findByBookingIdOrderByTimestampAsc(
            String bookingId
    );

    // Get unread messages received by a user
    List<ChatMessage> findByReceiverIdAndReadFalseOrderByTimestampAsc(
            String receiverId
    );

    // Get unread messages for a particular session
    List<ChatMessage> findByBookingIdAndReceiverIdAndReadFalse(
            String bookingId,
            String receiverId
    );

    // Get conversation between two users
    List<ChatMessage> findByBookingIdAndSenderIdAndReceiverIdOrderByTimestampAsc(
            String bookingId,
            String senderId,
            String receiverId
    );
}