package com.educonnect.service;

import com.educonnect.model.User;
import com.educonnect.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public UserService(
            UserRepository userRepository
    ) {

        this.userRepository = userRepository;

    }

    // =========================================
    // GET USER BY ID
    // =========================================

    public User getUserById(String id) {

        return userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

    }

    // =========================================
    // GET USER BY EMAIL
    // =========================================

    public User getUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

    }

    // =========================================
    // UPDATE USER PROFILE
    // =========================================

    public User updateUserProfile(

            String id,

            User updatedUser

    ) {

        User existingUser =
                userRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("User not found")
                        );

        // =========================================
        // BASIC DETAILS
        // =========================================

        if(updatedUser.getName()!=null)
            existingUser.setName(updatedUser.getName());

        if(updatedUser.getEmail()!=null)
            existingUser.setEmail(updatedUser.getEmail());

        if(updatedUser.getPhone()!=null)
            existingUser.setPhone(updatedUser.getPhone());

        // =========================================
        // STUDENT SKILLS
        // =========================================

        if(updatedUser.getSkills()!=null){

            existingUser.setSkills(
                    updatedUser.getSkills()
            );

        }

        // =========================================
        // LEARNING INTERESTS
        // =========================================

        if(updatedUser.getInterests()!=null){

            existingUser.setInterests(
                    updatedUser.getInterests()
            );

        }

        // =========================================
        // LEARNING GOALS
        // =========================================

        if(updatedUser.getLearningGoals()!=null){

            existingUser.setLearningGoals(
                    updatedUser.getLearningGoals()
            );

        }

        // =========================================
        // PROFILE IMAGE
        // =========================================

        if(updatedUser.getProfileImage()!=null){

            existingUser.setProfileImage(
                    updatedUser.getProfileImage()
            );

        }

        // =========================================
        // MENTOR DETAILS
        // =========================================

        if(updatedUser.getExperience()!=null){

            existingUser.setExperience(
                    updatedUser.getExperience()
            );

        }

        if(updatedUser.getBio()!=null){

            existingUser.setBio(
                    updatedUser.getBio()
            );

        }

        // =========================================
        // MENTOR STATUS
        // =========================================

        if(updatedUser.getMentorStatus()!=null){

            existingUser.setMentorStatus(
                    updatedUser.getMentorStatus()
            );

        }

        // =========================================
        // ROLE
        // =========================================

        if(updatedUser.getRole()!=null){

            existingUser.setRole(
                    updatedUser.getRole()
            );

        }

        // =========================================
        // SAVE
        // =========================================

        return userRepository.save(existingUser);

    }

}