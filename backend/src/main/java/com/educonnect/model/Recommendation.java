package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "recommendations")
public class Recommendation {

    @Id
    private String id;

    private String userId;

    private String itemType;

    private String itemId;

    private String itemName;

    private double contentScore;

    private double collaborativeScore;

    private double hybridScore;

    private String reason;

    // For mentor recommendations
    private String mentorId;

    // For resource recommendations
    private String resourceUrl;

    private String resourceType;


    // =========================
    // GETTERS AND SETTERS
    // =========================

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


    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }


    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }


    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }


    public double getContentScore() {
        return contentScore;
    }

    public void setContentScore(double contentScore) {
        this.contentScore = contentScore;
    }


    public double getCollaborativeScore() {
        return collaborativeScore;
    }

    public void setCollaborativeScore(double collaborativeScore) {
        this.collaborativeScore = collaborativeScore;
    }


    public double getHybridScore() {
        return hybridScore;
    }

    public void setHybridScore(double hybridScore) {
        this.hybridScore = hybridScore;
    }


    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }


    // =========================
    // MENTOR
    // =========================

    public String getMentorId() {
        return mentorId;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }


    // =========================
    // RESOURCE
    // =========================

    public String getResourceUrl() {
        return resourceUrl;
    }

    public void setResourceUrl(String resourceUrl) {
        this.resourceUrl = resourceUrl;
    }


    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }
}