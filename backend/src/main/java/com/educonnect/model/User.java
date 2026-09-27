package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    private String email;

    private String password;

    private String phone;


    // =========================================
    // USER ROLE
    // =========================================

    // STUDENT
    // ADMIN
    private String role;


    // =========================================
    // MENTOR APPLICATION STATUS
    // =========================================

    // NOT_APPLIED
    // PENDING
    // APPROVED
    // REJECTED
    private String mentorStatus;


    // =========================================
    // USER SKILLS
    // =========================================

    private List<String> skills = new ArrayList<>();

    private List<String> interests = new ArrayList<>();

    private List<String> learningGoals = new ArrayList<>();


    // =========================================
    // PROFILE
    // =========================================

    private String profileImage;

    private String experience;

    private String bio;


    // =========================================
    // MENTOR APPLICATION DETAILS
    // =========================================

    private String city;

    private String country;

    private String degree;

    private String university;

    private String graduationYear;

    private String profession;

    private String primarySkill;

    private String languages;

    private String linkedin;

    private String portfolio;


    // =========================================
    // CREATED DATE
    // =========================================

    private LocalDateTime createdAt;


    // =========================================
    // DEFAULT CONSTRUCTOR
    // =========================================

    public User() {

        this.createdAt = LocalDateTime.now();

        this.role = "STUDENT";

        this.mentorStatus = "NOT_APPLIED";

    }


    // =========================================
    // PARAMETERIZED CONSTRUCTOR
    // =========================================

    public User(
            String name,
            String email,
            String password,
            String phone,
            String role
    ) {

        this.name = name;

        this.email = email;

        this.password = password;

        this.phone = phone;

        this.role = role;

        this.mentorStatus = "NOT_APPLIED";

        this.createdAt = LocalDateTime.now();

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
    // NAME
    // =========================================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
    // PASSWORD
    // =========================================

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
    // ROLE
    // =========================================

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    // =========================================
    // MENTOR STATUS
    // =========================================

    public String getMentorStatus() {
        return mentorStatus;
    }

    public void setMentorStatus(String mentorStatus) {
        this.mentorStatus = mentorStatus;
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
    // INTERESTS
    // =========================================

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }


    // =========================================
    // LEARNING GOALS
    // =========================================

    public List<String> getLearningGoals() {
        return learningGoals;
    }

    public void setLearningGoals(List<String> learningGoals) {
        this.learningGoals = learningGoals;
    }


    // =========================================
    // PROFILE IMAGE
    // =========================================

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
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
    // BIO
    // =========================================

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
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
    // CREATED AT
    // =========================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}