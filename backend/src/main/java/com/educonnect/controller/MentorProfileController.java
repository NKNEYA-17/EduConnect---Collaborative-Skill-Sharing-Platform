package com.educonnect.controller;

import com.educonnect.model.MentorProfile;
import com.educonnect.service.MentorProfileService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mentor-profiles")
@CrossOrigin(origins = "http://localhost:5173")
public class MentorProfileController {

    private final MentorProfileService mentorProfileService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public MentorProfileController(
            MentorProfileService mentorProfileService
    ) {
        this.mentorProfileService = mentorProfileService;
    }

    // =========================================
    // TEST API
    // =========================================

    @GetMapping("/test")
    public String test() {

        return "Mentor Profile Controller Working";
    }

    // =========================================
    // CREATE MENTOR PROFILE
    // =========================================

    @PostMapping
    public ResponseEntity<MentorProfile> createProfile(
            @RequestBody MentorProfile profile
    ) {

        MentorProfile savedProfile =
                mentorProfileService.createProfile(profile);

        return ResponseEntity.ok(savedProfile);
    }

    // =========================================
    // GET ALL MENTOR PROFILES
    // =========================================

    @GetMapping
    public ResponseEntity<List<MentorProfile>> getAllProfiles() {

        return ResponseEntity.ok(
                mentorProfileService.getAllProfiles()
        );
    }

    // =========================================
    // GET COMPLETED MENTOR PROFILES
    // =========================================
    /*
     * Used by the public Mentors page.
     *
     * Only profiles where:
     *
     * profileCompleted = true
     *
     * will be returned.
     */

    @GetMapping("/completed")
    public ResponseEntity<List<MentorProfile>> getCompletedProfiles() {

        return ResponseEntity.ok(
                mentorProfileService.getCompletedProfiles()
        );
    }

    // =========================================
    // GET APPROVED / COMPLETED MENTORS
    // =========================================
    /*
     * The frontend Mentors.jsx currently calls:
     *
     * /api/mentor-profiles/approved
     *
     * So this endpoint points to the same
     * completed mentor profile logic.
     */

    @GetMapping("/approved")
    public ResponseEntity<List<MentorProfile>> getApprovedProfiles() {

        return ResponseEntity.ok(
                mentorProfileService.getCompletedProfiles()
        );
    }

    // =========================================
    // GET PROFILE BY USER ID
    // =========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<MentorProfile> getProfileByUserId(
            @PathVariable String userId
    ) {

        return ResponseEntity.ok(
                mentorProfileService.getProfileByUserId(userId)
        );
    }

    // =========================================
    // GET PROFILE BY PROFILE ID
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<MentorProfile> getProfileById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                mentorProfileService.getProfileById(id)
        );
    }

    // =========================================
    // UPDATE MENTOR PROFILE
    // =========================================

    @PutMapping("/{id}")
    public ResponseEntity<MentorProfile> updateProfile(
            @PathVariable String id,
            @RequestBody MentorProfile profile
    ) {

        MentorProfile updatedProfile =
                mentorProfileService.updateProfile(
                        id,
                        profile
                );

        return ResponseEntity.ok(updatedProfile);
    }

    // =========================================
    // DELETE MENTOR PROFILE
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProfile(
            @PathVariable String id
    ) {

        mentorProfileService.deleteProfile(id);

        return ResponseEntity.ok(
                "Mentor profile deleted successfully"
        );
    }
}