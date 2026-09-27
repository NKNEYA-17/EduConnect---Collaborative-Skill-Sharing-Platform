package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "mentor_bookings")
public class MentorBooking {

    // =========================================
    // BOOKING ID
    // =========================================

    @Id
    private String id;


    // =========================================
    // MENTOR DETAILS
    // =========================================

    private String mentorId;

    private String mentorName;

    private String mentorEmail;


    // =========================================
    // STUDENT DETAILS
    // =========================================

    private String studentId;

    private String studentName;

    private String studentEmail;


    // =========================================
    // SESSION DETAILS
    // =========================================

    private String sessionId;

    private String sessionTitle;

    private String skill;

    private String slot;

    private String duration;

    private String mode;


    // =========================================
    // SESSION INFORMATION
    // =========================================

    private Integer maxStudents;

    private Integer bookedStudents;

    private String googleMeetLink;

    private List<Material> materials;


    // =========================================
    // BOOKING STATUS
    // PENDING
    // APPROVED
    // REJECTED
    // =========================================

    private String status;


    // =========================================
    // MENTOR RESPONSE
    // =========================================

    private String mentorResponse;


    // =========================================
    // DATES
    // =========================================

    private LocalDateTime requestedAt;

    private LocalDateTime respondedAt;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public MentorBooking() {

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


    public String getMentorEmail() {
        return mentorEmail;
    }

    public void setMentorEmail(String mentorEmail) {
        this.mentorEmail = mentorEmail;
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


    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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


    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }


    public String getSlot() {
        return slot;
    }

    public void setSlot(String slot) {
        this.slot = slot;
    }


    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }


    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }


    public Integer getMaxStudents() {
        return maxStudents;
    }

    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
    }


    public Integer getBookedStudents() {
        return bookedStudents;
    }

    public void setBookedStudents(Integer bookedStudents) {
        this.bookedStudents = bookedStudents;
    }


    public String getGoogleMeetLink() {
        return googleMeetLink;
    }

    public void setGoogleMeetLink(String googleMeetLink) {
        this.googleMeetLink = googleMeetLink;
    }


    public List<Material> getMaterials() {
        return materials;
    }

    public void setMaterials(List<Material> materials) {
        this.materials = materials;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public String getMentorResponse() {
        return mentorResponse;
    }

    public void setMentorResponse(String mentorResponse) {
        this.mentorResponse = mentorResponse;
    }


    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }


    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }


    // =========================================
    // MATERIAL CLASS
    // =========================================

    public static class Material {

        private String name;

        private String type;

        private Long size;


        public Material() {

        }


        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }


        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }


        public Long getSize() {
            return size;
        }

        public void setSize(Long size) {
            this.size = size;
        }

    }

}