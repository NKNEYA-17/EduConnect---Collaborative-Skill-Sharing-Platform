package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chatMessages")
public class ChatMessage {

    @Id
    private String id;

    // Booking/session this message belongs to
    private String bookingId;

    // Student information
    private String studentId;
    private String studentName;

    // Mentor information
    private String mentorId;
    private String mentorName;

    // Person who sent the message
    private String senderId;
    private String senderName;

    // Person who receives the message
    private String receiverId;
    private String receiverName;

    // Message content
    private String message;

    // Message time
    private LocalDateTime timestamp;

    // Whether receiver has read the message
    private boolean read;

    // Default constructor
    public ChatMessage() {
    }

    // Constructor
    public ChatMessage(
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
        this.bookingId = bookingId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.mentorId = mentorId;
        this.mentorName = mentorName;
        this.senderId = senderId;
        this.senderName = senderName;
        this.receiverId = receiverId;
        this.receiverName = receiverName;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.read = false;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getMentorId() {
        return mentorId;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }

    public String getMentorName() {
        return mentorName;
    }

    public void setMentorName(String mentorName) {
        this.mentorName = mentorName;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}