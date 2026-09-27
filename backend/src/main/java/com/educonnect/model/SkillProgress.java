package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "skillProgress")
public class SkillProgress {

    // =========================================
    // ID
    // =========================================

    @Id
    private String id;


    // =========================================
    // STUDENT INFORMATION
    // =========================================

    private String studentId;

    private String skill;


    // =========================================
    // SESSION PROGRESS
    // =========================================

    private int totalSessions;

    private int completedSessions;

    private int progressPercentage;


    // =========================================
    // SKILL STATUS
    // =========================================

    /*
     * Possible values:
     *
     * NOT_STARTED
     * LEARNING
     * MASTERED
     */

    private String status;


    // =========================================
    // MENTOR ELIGIBILITY
    // =========================================

    private boolean canTeach;


    // =========================================
    // TIMESTAMP
    // =========================================

    private LocalDateTime updatedAt;


    // =========================================
    // CONSTRUCTORS
    // =========================================

    public SkillProgress() {
    }


    public SkillProgress(
            String studentId,
            String skill
    ) {

        this.studentId = studentId;

        this.skill = skill;

        this.totalSessions = 0;

        this.completedSessions = 0;

        this.progressPercentage = 0;

        this.status = "NOT_STARTED";

        this.canTeach = false;

        this.updatedAt =
                LocalDateTime.now();
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


    public String getStudentId() {

        return studentId;
    }


    public void setStudentId(
            String studentId
    ) {

        this.studentId = studentId;
    }


    public String getSkill() {

        return skill;
    }


    public void setSkill(
            String skill
    ) {

        this.skill = skill;
    }


    public int getTotalSessions() {

        return totalSessions;
    }


    public void setTotalSessions(
            int totalSessions
    ) {

        this.totalSessions =
                totalSessions;
    }


    public int getCompletedSessions() {

        return completedSessions;
    }


    public void setCompletedSessions(
            int completedSessions
    ) {

        this.completedSessions =
                completedSessions;
    }


    public int getProgressPercentage() {

        return progressPercentage;
    }


    public void setProgressPercentage(
            int progressPercentage
    ) {

        this.progressPercentage =
                progressPercentage;
    }


    public String getStatus() {

        return status;
    }


    public void setStatus(
            String status
    ) {

        this.status = status;
    }


    public boolean isCanTeach() {

        return canTeach;
    }


    public void setCanTeach(
            boolean canTeach
    ) {

        this.canTeach = canTeach;
    }


    public LocalDateTime getUpdatedAt() {

        return updatedAt;
    }


    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {

        this.updatedAt = updatedAt;
    }
}