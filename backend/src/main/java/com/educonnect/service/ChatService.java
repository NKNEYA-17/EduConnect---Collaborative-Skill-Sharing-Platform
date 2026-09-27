package com.educonnect.service;

import com.educonnect.model.ChatMessage;
import com.educonnect.repository.ChatMessageRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public ChatService(
            ChatMessageRepository chatMessageRepository
    ) {
        this.chatMessageRepository = chatMessageRepository;
    }


    // =========================================
    // SEND MESSAGE
    // =========================================

    public ChatMessage sendMessage(
            String bookingId,
            String studentId,
            String studentName,
            String mentorId,
            String mentorName,
            String senderId,
            String senderName,
            String receiverId,
            String receiverName,
            String message
    ) {

        // Validate booking/session
        if (bookingId == null || bookingId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Booking ID cannot be empty"
            );
        }

        // Validate sender
        if (senderId == null || senderId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Sender ID cannot be empty"
            );
        }

        // Validate receiver
        if (receiverId == null || receiverId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Receiver ID cannot be empty"
            );
        }

        // Validate message
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Message cannot be empty"
            );
        }

        // Create chat message
        ChatMessage chatMessage = new ChatMessage();

        chatMessage.setBookingId(
                bookingId.trim()
        );

        chatMessage.setStudentId(
                studentId
        );

        chatMessage.setStudentName(
                studentName
        );

        chatMessage.setMentorId(
                mentorId
        );

        chatMessage.setMentorName(
                mentorName
        );

        chatMessage.setSenderId(
                senderId
        );

        chatMessage.setSenderName(
                senderName
        );

        chatMessage.setReceiverId(
                receiverId
        );

        chatMessage.setReceiverName(
                receiverName
        );

        chatMessage.setMessage(
                message.trim()
        );

        chatMessage.setTimestamp(
                LocalDateTime.now()
        );

        // New message is unread
        chatMessage.setRead(false);

        return chatMessageRepository.save(
                chatMessage
        );
    }


    // =========================================
    // GET SESSION CHAT
    // =========================================

    public List<ChatMessage> getSessionMessages(
            String bookingId
    ) {

        if (bookingId == null || bookingId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Booking ID cannot be empty"
            );
        }

        return chatMessageRepository
                .findByBookingIdOrderByTimestampAsc(
                        bookingId
                );
    }


    // =========================================
    // GET UNREAD MESSAGES
    // =========================================

    public List<ChatMessage> getUnreadMessages(
            String userId
    ) {

        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "User ID cannot be empty"
            );
        }

        return chatMessageRepository
                .findByReceiverIdAndReadFalseOrderByTimestampAsc(
                        userId
                );
    }


    // =========================================
    // GET UNREAD MESSAGES FOR SESSION
    // =========================================

    public List<ChatMessage> getUnreadSessionMessages(
            String bookingId,
            String receiverId
    ) {

        if (bookingId == null || bookingId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Booking ID cannot be empty"
            );
        }

        if (receiverId == null || receiverId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Receiver ID cannot be empty"
            );
        }

        return chatMessageRepository
                .findByBookingIdAndReceiverIdAndReadFalse(
                        bookingId,
                        receiverId
                );
    }


    // =========================================
    // MARK MESSAGE AS READ
    // =========================================

    public ChatMessage markAsRead(
            String messageId
    ) {

        if (messageId == null || messageId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Message ID cannot be empty"
            );
        }

        ChatMessage message =
                chatMessageRepository
                        .findById(messageId)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Message not found"
                                )
                        );

        message.setRead(true);

        return chatMessageRepository.save(
                message
        );
    }


    // =========================================
    // MARK ALL SESSION MESSAGES AS READ
    // =========================================

    public int markSessionMessagesAsRead(
            String bookingId,
            String receiverId
    ) {

        if (bookingId == null || bookingId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Booking ID cannot be empty"
            );
        }

        if (receiverId == null || receiverId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Receiver ID cannot be empty"
            );
        }

        List<ChatMessage> unreadMessages =
                chatMessageRepository
                        .findByBookingIdAndReceiverIdAndReadFalse(
                                bookingId,
                                receiverId
                        );

        for (ChatMessage message : unreadMessages) {
            message.setRead(true);
        }

        if (!unreadMessages.isEmpty()) {
            chatMessageRepository.saveAll(
                    unreadMessages
            );
        }

        return unreadMessages.size();
    }


    // =========================================
    // GET CONVERSATION BETWEEN TWO USERS
    // =========================================

    public List<ChatMessage> getConversation(
            String bookingId,
            String user1,
            String user2
    ) {

        if (bookingId == null || bookingId.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Booking ID cannot be empty"
            );
        }

        if (user1 == null || user1.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "First user ID cannot be empty"
            );
        }

        if (user2 == null || user2.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Second user ID cannot be empty"
            );
        }

        List<ChatMessage> messages =
                chatMessageRepository
                        .findByBookingIdOrderByTimestampAsc(
                                bookingId
                        );

        return messages.stream()
                .filter(message ->
                        (
                                message.getSenderId()
                                        .equals(user1)
                                        &&
                                message.getReceiverId()
                                        .equals(user2)
                        )
                        ||
                        (
                                message.getSenderId()
                                        .equals(user2)
                                        &&
                                message.getReceiverId()
                                        .equals(user1)
                        )
                )
                .toList();
    }
}