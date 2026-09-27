package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "star_transactions")
public class StarTransaction {

    @Id
    private String id;

    // User who earned the stars
    private String userId;

    // Number of stars earned
    private int stars;

    // Reason/category for earning stars
    // Examples:
    // DEFAULT, LEARNING_SESSION, TEACHING_SESSION, SKILL_COMPLETION
    private String type;

    // Human-readable explanation
    private String description;

    // Skill related to this transaction
    private String skill;

    // Session related to this transaction
    private String sessionId;

    // Date and time when stars were earned
    private LocalDateTime createdAt;


    // =========================================
    // CONSTRUCTORS
    // =========================================

    public StarTransaction() {
    }

    public StarTransaction(
            String userId,
            int stars,
            String type,
            String description,
            String skill,
            String sessionId,
            LocalDateTime createdAt
    ) {
        this.userId = userId;
        this.stars = stars;
        this.type = type;
        this.description = description;
        this.skill = skill;
        this.sessionId = sessionId;
        this.createdAt = createdAt;
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

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}