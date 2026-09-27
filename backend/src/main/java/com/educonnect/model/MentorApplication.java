package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "mentor_applications")
public class MentorApplication {

    @Id
    private String id;

    // =========================================
    // USER DETAILS
    // =========================================

    private String userId;

    private String fullName;

    private String email;

    private String phone;

    // =========================================
    // LOCATION
    // =========================================

    private String city;

    private String country;

    // =========================================
    // EDUCATION
    // =========================================

    private String degree;

    private String department;

    private String university;

    private String graduationYear;

    // =========================================
    // PROFESSIONAL DETAILS
    // =========================================

    private String profession;

    private String experience;

    // =========================================
    // SKILLS
    // =========================================

    private List<String> skills = new ArrayList<>();

    private String primarySkill;

    private String languages;

    // =========================================
    // PROFILE
    // =========================================

    private String bio;

    private String linkedin;

    private String portfolio;

    private String profilePhoto;

    private String resume;

    // =========================================
    // APPLICATION STATUS
    // =========================================

    // PENDING
    // APPROVED
    // REJECTED

    private String status;

    private LocalDateTime appliedAt;

    // =========================================
    // REJECTION DETAILS
    // =========================================

    private String rejectionReason;

    private String improvementSuggestion;

    // =========================================
    // DEFAULT CONSTRUCTOR
    // =========================================

    public MentorApplication() {

        this.status = "PENDING";

        this.appliedAt = LocalDateTime.now();
    }

    // =========================================
    // ID
    // =========================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // =========================================
    // USER ID
    // =========================================

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    // =========================================
    // FULL NAME
    // =========================================

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    // =========================================
    // EMAIL
    // =========================================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // =========================================
    // PHONE
    // =========================================

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    // =========================================
    // CITY
    // =========================================

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    // =========================================
    // COUNTRY
    // =========================================

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    // =========================================
    // DEGREE
    // =========================================

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    // =========================================
    // DEPARTMENT
    // =========================================

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    // =========================================
    // UNIVERSITY
    // =========================================

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    // =========================================
    // GRADUATION YEAR
    // =========================================

    public String getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(String graduationYear) {
        this.graduationYear = graduationYear;
    }

    // =========================================
    // PROFESSION
    // =========================================

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    // =========================================
    // EXPERIENCE
    // =========================================

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    // =========================================
    // SKILLS
    // =========================================

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    // =========================================
    // PRIMARY SKILL
    // =========================================

    public String getPrimarySkill() {
        return primarySkill;
    }

    public void setPrimarySkill(String primarySkill) {
        this.primarySkill = primarySkill;
    }

    // =========================================
    // LANGUAGES
    // =========================================

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    // =========================================
    // BIO
    // =========================================

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    // =========================================
    // LINKEDIN
    // =========================================

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    // =========================================
    // PORTFOLIO
    // =========================================

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    // =========================================
    // PROFILE PHOTO
    // =========================================

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    // =========================================
    // RESUME
    // =========================================

    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }

    // =========================================
    // STATUS
    // =========================================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // =========================================
    // APPLIED AT
    // =========================================

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    // =========================================
    // REJECTION REASON
    // =========================================

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    // =========================================
    // IMPROVEMENT SUGGESTION
    // =========================================

    public String getImprovementSuggestion() {
        return improvementSuggestion;
    }

    public void setImprovementSuggestion(String improvementSuggestion) {
        this.improvementSuggestion = improvementSuggestion;
    }
}

