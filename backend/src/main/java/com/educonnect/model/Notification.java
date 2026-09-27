package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {

    // =========================================
    // NOTIFICATION ID
    // =========================================

    @Id
    private String id;


    // =========================================
    // USER WHO RECEIVES THE NOTIFICATION
    // =========================================

    private String userId;

    private String userName;

    private String userEmail;


    // =========================================
    // USER ROLE
    // MENTOR / STUDENT
    // =========================================

    private String userRole;


    // =========================================
    // NOTIFICATION TYPE
    //
    // BOOKING_REQUEST
    // BOOKING_APPROVED
    // BOOKING_REJECTED
    // =========================================

    private String type;


    // =========================================
    // NOTIFICATION TITLE
    // =========================================

    private String title;


    // =========================================
    // NOTIFICATION MESSAGE
    // =========================================

    private String message;


    // =========================================
    // RELATED BOOKING
    // =========================================

    private String bookingId;


    // =========================================
    // RELATED MENTOR
    // =========================================

    private String mentorId;

    private String mentorName;


    // =========================================
    // RELATED STUDENT
    // =========================================

    private String studentId;

    private String studentName;


    // =========================================
    // SESSION INFORMATION
    // =========================================

    private String sessionTitle;

    private String slot;


    // =========================================
    // READ / UNREAD
    // =========================================

    private boolean read;


    // =========================================
    // CREATED TIME
    // =========================================

    private LocalDateTime createdAt;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public Notification() {

    }


    // =========================================
    // GETTERS AND SETTERS
    // =========================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }


    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }


    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }


    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
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


    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }


    public String getSlot() {
        return slot;
    }

    public void setSlot(String slot) {
        this.slot = slot;
    }


    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {

        this.createdAt = createdAt;

    }

}