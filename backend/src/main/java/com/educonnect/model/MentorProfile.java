package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "mentor_profiles")
public class MentorProfile {

    // =========================================
    // PRIMARY KEY
    // =========================================

    @Id
    private String id;


    // =========================================
    // LINK TO USER
    // =========================================

    /*
     * Connects this mentor profile with the
     * logged-in User.
     *
     * Example:
     * userId = "68a123456789"
     */
    private String userId;


    // =========================================
    // PERSONAL INFORMATION
    // =========================================

    private String name;

    private String email;

    private String phone;


    // =========================================
    // PROFILE PHOTO
    // =========================================

    /*
     * Stores the mentor profile photo.
     *
     * For now this can be a URL or image path.
     */
    private String profilePhoto;


    // =========================================
    // MENTOR INFORMATION
    // =========================================

    /*
     * Example:
     * "Senior React Mentor"
     */
    private String role;

    /*
     * Example:
     * "Programming"
     * "Artificial Intelligence"
     * "Data Science"
     */
    private String category;

    /*
     * Example:
     * "5 Years"
     */
    private String experience;


    // =========================================
    // SKILLS
    // =========================================

    /*
     * Example:
     * ["React", "JavaScript", "UI / UX"]
     */
    private List<String> skills = new ArrayList<>();


    // =========================================
    // ABOUT MENTOR
    // =========================================

    private String about;


    // =========================================
    // ACHIEVEMENTS
    // =========================================

    /*
     * Example:
     *
     * [
     *   "Top Mentor 2025",
     *   "React Expert",
     *   "500+ Students Mentored"
     * ]
     */
    private List<String> achievements = new ArrayList<>();


    // =========================================
    // RESOURCES
    // =========================================

    /*
     * Example:
     *
     * [
     *   "React Roadmap.pdf",
     *   "JavaScript Notes.pdf"
     * ]
     */
    private List<String> resources = new ArrayList<>();


    // =========================================
    // AVAILABLE SLOTS
    // =========================================

    /*
     * Example:
     *
     * [
     *   "Monday - 10:00 AM",
     *   "Tuesday - 5:00 PM",
     *   "Friday - 2:00 PM"
     * ]
     */
    private List<String> slots = new ArrayList<>();


    // =========================================
    // STUDENT REVIEWS
    // =========================================

    /*
     * Initially empty.
     *
     * Reviews can be added later when students
     * complete mentoring sessions.
     */
    private List<String> reviews = new ArrayList<>();


    // =========================================
    // RATING
    // =========================================

    /*
     * Initial rating is 0.
     *
     * Later this can be calculated from reviews.
     */
    private double rating = 0.0;


    // =========================================
    // STUDENT COUNT
    // =========================================

    /*
     * Number of students mentored.
     */
    private int students = 0;


    // =========================================
    // MENTOR STATUS
    // =========================================

    /*
     * Example:
     *
     * "Available"
     * "Busy"
     */
    private String status = "Available";


    // =========================================
    // PROFILE COMPLETION
    // =========================================

    /*
     * false = mentor still needs to complete profile
     * true  = mentor has completed profile
     *
     * Only completed profiles should appear
     * on the public Mentors page.
     */
    private boolean profileCompleted = false;


    // =========================================
    // CONSTRUCTORS
    // =========================================

    public MentorProfile() {
    }


    public MentorProfile(
            String userId,
            String name,
            String email,
            String phone
    ) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone;
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


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    // =========================================
    // PROFILE PHOTO GETTER / SETTER
    // =========================================

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }


    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }


    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }


    public List<String> getAchievements() {
        return achievements;
    }

    public void setAchievements(List<String> achievements) {
        this.achievements = achievements;
    }


    public List<String> getResources() {
        return resources;
    }

    public void setResources(List<String> resources) {
        this.resources = resources;
    }


    public List<String> getSlots() {
        return slots;
    }

    public void setSlots(List<String> slots) {
        this.slots = slots;
    }


    public List<String> getReviews() {
        return reviews;
    }

    public void setReviews(List<String> reviews) {
        this.reviews = reviews;
    }


    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }


    public int getStudents() {
        return students;
    }

    public void setStudents(int students) {
        this.students = students;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public boolean isProfileCompleted() {
        return profileCompleted;
    }

    public void setProfileCompleted(boolean profileCompleted) {
        this.profileCompleted = profileCompleted;
    }
}