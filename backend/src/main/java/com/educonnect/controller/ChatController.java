package com.educonnect.controller;

import com.educonnect.model.ChatMessage;
import com.educonnect.service.ChatService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public ChatController(
            ChatService chatService
    ) {
        this.chatService = chatService;
    }


    // =========================================
    // SEND MESSAGE
    // =========================================

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestParam String bookingId,
            @RequestParam String studentId,
            @RequestParam(required = false) String studentName,
            @RequestParam String mentorId,
            @RequestParam(required = false) String mentorName,
            @RequestParam String senderId,
            @RequestParam(required = false) String senderName,
            @RequestParam String receiverId,
            @RequestParam(required = false) String receiverName,
            @RequestParam String message
    ) {

        try {

            ChatMessage chatMessage =
                    chatService.sendMessage(
                            bookingId,
                            studentId,
                            studentName,
                            mentorId,
                            mentorName,
                            senderId,
                            senderName,
                            receiverId,
                            receiverName,
                            message
                    );

            return ResponseEntity.ok(chatMessage);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to send message");
        }
    }


    // =========================================
    // GET SESSION CHAT
    // =========================================

    @GetMapping("/session/{bookingId}")
    public ResponseEntity<?> getSessionMessages(
            @PathVariable String bookingId
    ) {

        try {

            List<ChatMessage> messages =
                    chatService.getSessionMessages(
                            bookingId
                    );

            return ResponseEntity.ok(messages);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to fetch chat messages");
        }
    }


    // =========================================
    // GET UNREAD MESSAGES
    // =========================================

    @GetMapping("/unread/{userId}")
    public ResponseEntity<?> getUnreadMessages(
            @PathVariable String userId
    ) {

        try {

            List<ChatMessage> messages =
                    chatService.getUnreadMessages(
                            userId
                    );

            return ResponseEntity.ok(messages);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to fetch unread messages");
        }
    }


    // =========================================
    // GET UNREAD MESSAGES FOR A SESSION
    // =========================================

    @GetMapping("/session/{bookingId}/unread/{receiverId}")
    public ResponseEntity<?> getUnreadSessionMessages(
            @PathVariable String bookingId,
            @PathVariable String receiverId
    ) {

        try {

            List<ChatMessage> messages =
                    chatService.getUnreadSessionMessages(
                            bookingId,
                            receiverId
                    );

            return ResponseEntity.ok(messages);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to fetch unread session messages");
        }
    }


    // =========================================
    // MARK ONE MESSAGE AS READ
    // =========================================

    @PutMapping("/{messageId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable String messageId
    ) {

        try {

            ChatMessage updatedMessage =
                    chatService.markAsRead(
                            messageId
                    );

            return ResponseEntity.ok(updatedMessage);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to mark message as read");
        }
    }


    // =========================================
    // MARK ALL SESSION MESSAGES AS READ
    // =========================================

    @PutMapping("/session/{bookingId}/read/{receiverId}")
    public ResponseEntity<?> markSessionMessagesAsRead(
            @PathVariable String bookingId,
            @PathVariable String receiverId
    ) {

        try {

            int count =
                    chatService.markSessionMessagesAsRead(
                            bookingId,
                            receiverId
                    );

            return ResponseEntity.ok(
                    "Marked " + count + " message(s) as read"
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to mark messages as read");
        }
    }


    // =========================================
    // GET CONVERSATION BETWEEN STUDENT & MENTOR
    // =========================================

    @GetMapping("/conversation")
    public ResponseEntity<?> getConversation(
            @RequestParam String bookingId,
            @RequestParam String user1,
            @RequestParam String user2
    ) {

        try {

            List<ChatMessage> messages =
                    chatService.getConversation(
                            bookingId,
                            user1,
                            user2
                    );

            return ResponseEntity.ok(messages);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to fetch conversation");
        }
    }
}