package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "feedback")
public class Feedback {

    // =========================================
    // FEEDBACK ID
    // =========================================

    @Id
    private String id;


    // =========================================
    // BOOKING DETAILS
    // =========================================

    private String bookingId;

    private String sessionId;

    private String sessionTitle;


    // =========================================
    // MENTOR DETAILS
    // =========================================

    private String mentorId;

    private String mentorName;


    // =========================================
    // STUDENT DETAILS
    // =========================================

    private String studentId;

    private String studentName;


    // =========================================
    // RATING
    // 1 - 5
    // =========================================

    private Integer rating;


    // =========================================
    // FEEDBACK
    // =========================================

    private String feedback;


    // =========================================
    // DATE
    // =========================================

    private LocalDateTime submittedAt;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public Feedback() {

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


    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }


    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }


    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
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


    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }


    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }


    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}