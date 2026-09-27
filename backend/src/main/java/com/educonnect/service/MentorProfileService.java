package com.educonnect.service;

import com.educonnect.model.MentorProfile;
import com.educonnect.repository.MentorProfileRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MentorProfileService {

    private final MentorProfileRepository mentorProfileRepository;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public MentorProfileService(
            MentorProfileRepository mentorProfileRepository
    ) {
        this.mentorProfileRepository = mentorProfileRepository;
    }

    // =========================================
    // CREATE MENTOR PROFILE
    // =========================================

    public MentorProfile createProfile(
            MentorProfile profile
    ) {

        // Prevent duplicate mentor profile
        if (mentorProfileRepository.existsByUserId(
                profile.getUserId()
        )) {

            throw new RuntimeException(
                    "Mentor profile already exists for this user."
            );
        }

        // Mentor has completed the profile
        profile.setProfileCompleted(true);

        return mentorProfileRepository.save(profile);
    }

    // =========================================
    // GET PROFILE BY PROFILE ID
    // =========================================

    public MentorProfile getProfileById(
            String id
    ) {

        return mentorProfileRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Mentor profile not found"
                        )
                );
    }

    // =========================================
    // GET PROFILE BY USER ID
    // =========================================

    public MentorProfile getProfileByUserId(
            String userId
    ) {

        return mentorProfileRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Mentor profile not found"
                        )
                );
    }

    // =========================================
    // GET ALL MENTOR PROFILES
    // =========================================

    public List<MentorProfile> getAllProfiles() {

        return mentorProfileRepository.findAll();
    }

    // =========================================
    // GET COMPLETED MENTOR PROFILES
    // =========================================
    // These profiles will appear on the
    // public Mentors page.

    public List<MentorProfile> getCompletedProfiles() {

        return mentorProfileRepository
                .findByProfileCompletedTrue();
    }

    // =========================================
    // UPDATE MENTOR PROFILE
    // =========================================

    public MentorProfile updateProfile(
            String id,
            MentorProfile updatedProfile
    ) {

        MentorProfile existingProfile =
                getProfileById(id);

        // =====================================
        // BASIC INFORMATION
        // =====================================

        existingProfile.setName(
                updatedProfile.getName()
        );

        existingProfile.setEmail(
                updatedProfile.getEmail()
        );

        existingProfile.setPhone(
                updatedProfile.getPhone()
        );

        // =====================================
        // PROFESSIONAL INFORMATION
        // =====================================

        existingProfile.setRole(
                updatedProfile.getRole()
        );

        existingProfile.setCategory(
                updatedProfile.getCategory()
        );

        existingProfile.setExperience(
                updatedProfile.getExperience()
        );

        existingProfile.setSkills(
                updatedProfile.getSkills()
        );

        existingProfile.setAbout(
                updatedProfile.getAbout()
        );

        // =====================================
        // ADDITIONAL PROFILE INFORMATION
        // =====================================

        existingProfile.setAchievements(
                updatedProfile.getAchievements()
        );

        existingProfile.setResources(
                updatedProfile.getResources()
        );

        existingProfile.setSlots(
                updatedProfile.getSlots()
        );

        // =====================================
        // PROFILE PHOTO
        // =====================================

        existingProfile.setProfilePhoto(
                updatedProfile.getProfilePhoto()
        );

        // =====================================
        // PROFILE STATUS
        // =====================================

        existingProfile.setProfileCompleted(
                true
        );

        return mentorProfileRepository.save(
                existingProfile
        );
    }

    // =========================================
    // DELETE MENTOR PROFILE
    // =========================================

    public void deleteProfile(
            String id
    ) {

        if (!mentorProfileRepository.existsById(id)) {

            throw new RuntimeException(
                    "Mentor profile not found"
            );
        }

        mentorProfileRepository.deleteById(id);
    }
}