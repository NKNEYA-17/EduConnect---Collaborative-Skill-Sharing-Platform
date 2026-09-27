package com.educonnect.controller;

import com.educonnect.model.ChatMessage;
import com.educonnect.service.ChatService;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;

    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(
            ChatService chatService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "✅ ChatWebSocketController INITIALIZED"
        );

        System.out.println(
                "=========================================="
        );
    }

    @MessageMapping("/chat.send")
    public void sendMessage(
            @Payload ChatMessage message,
            Principal principal
    ) {

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "🔥🔥🔥 CHAT MESSAGE RECEIVED 🔥🔥🔥"
        );

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Booking ID: "
                        + message.getBookingId()
        );

        System.out.println(
                "Message: "
                        + message.getMessage()
        );

        System.out.println(
                "Sender ID from payload: "
                        + message.getSenderId()
        );

        System.out.println(
                "Principal: "
                        + (
                        principal != null
                                ? principal.getName()
                                : "NULL"
                )
        );

        try {

            // =====================================
            // AUTHENTICATION
            // =====================================

            if (principal == null) {

                System.out.println(
                        "❌ Principal is NULL"
                );

                throw new IllegalArgumentException(
                        "User is not authenticated"
                );
            }

            String authenticatedUserId =
                    principal.getName();

            System.out.println(
                    "🔐 Authenticated User ID: "
                            + authenticatedUserId
            );

            // =====================================
            // USE JWT USER ID AS SENDER
            // =====================================

            message.setSenderId(
                    authenticatedUserId
            );

            System.out.println(
                    "✅ Sender ID set from JWT"
            );

            // =====================================
            // VALIDATE MESSAGE DATA
            // =====================================

            System.out.println(
                    "📋 Validating message data..."
            );

            System.out.println(
                    "Booking ID: "
                            + message.getBookingId()
            );

            System.out.println(
                    "Student ID: "
                            + message.getStudentId()
            );

            System.out.println(
                    "Student Name: "
                            + message.getStudentName()
            );

            System.out.println(
                    "Mentor ID: "
                            + message.getMentorId()
            );

            System.out.println(
                    "Mentor Name: "
                            + message.getMentorName()
            );

            System.out.println(
                    "Sender ID: "
                            + message.getSenderId()
            );

            System.out.println(
                    "Sender Name: "
                            + message.getSenderName()
            );

            System.out.println(
                    "Receiver ID: "
                            + message.getReceiverId()
            );

            System.out.println(
                    "Receiver Name: "
                            + message.getReceiverName()
            );

            System.out.println(
                    "Message Text: "
                            + message.getMessage()
            );

            // =====================================
            // SAVE MESSAGE
            // =====================================

            System.out.println(
                    "💾 Calling ChatService.sendMessage()..."
            );

            ChatMessage savedMessage =
                    chatService.sendMessage(
                            message.getBookingId(),
                            message.getStudentId(),
                            message.getStudentName(),
                            message.getMentorId(),
                            message.getMentorName(),
                            message.getSenderId(),
                            message.getSenderName(),
                            message.getReceiverId(),
                            message.getReceiverName(),
                            message.getMessage()
                    );

            System.out.println(
                    "💾 Message saved successfully!"
            );

            System.out.println(
                    "Message ID: "
                            + savedMessage.getId()
            );

            // =====================================
            // BOOKING TOPIC
            // =====================================

            String destination =
                    "/topic/chat/"
                            + savedMessage.getBookingId();

            System.out.println(
                    "📡 Broadcasting message to:"
            );

            System.out.println(
                    destination
            );

            // =====================================
            // SEND TO BOOKING TOPIC
            // =====================================

            messagingTemplate.convertAndSend(
                    destination,
                    savedMessage
            );

            System.out.println(
                    "✅ WebSocket message broadcast successfully!"
            );

            System.out.println(
                    "=========================================="
            );

        } catch (Exception e) {

            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "❌❌❌ CHAT WEBSOCKET ERROR ❌❌❌"
            );

            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "Error Type: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "Error Message: "
                            + e.getMessage()
            );

            e.printStackTrace();

            System.out.println(
                    "=========================================="
            );
        }
    }
}