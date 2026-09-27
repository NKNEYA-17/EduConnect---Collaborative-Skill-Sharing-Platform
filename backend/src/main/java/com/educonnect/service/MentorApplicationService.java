package com.educonnect.service;

import com.educonnect.model.MentorApplication;
import com.educonnect.repository.MentorApplicationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MentorApplicationService {

    private final MentorApplicationRepository mentorApplicationRepository;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public MentorApplicationService(
            MentorApplicationRepository mentorApplicationRepository
    ) {
        this.mentorApplicationRepository = mentorApplicationRepository;
    }

    // =========================================
    // SUBMIT MENTOR APPLICATION
    // =========================================

    public MentorApplication submitApplication(
            MentorApplication application
    ) {

        // Prevent duplicate applications
        if (mentorApplicationRepository.existsByEmail(application.getEmail())) {

            throw new RuntimeException(
                    "You have already submitted a mentor application."
            );
        }

        application.setStatus("PENDING");

        return mentorApplicationRepository.save(application);
    }

    // =========================================
    // GET APPLICATION BY ID
    // =========================================

    public MentorApplication getApplicationById(String id) {

        return mentorApplicationRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found")
                );
    }

    // =========================================
    // GET APPLICATION BY EMAIL
    // =========================================

    public MentorApplication getApplicationByEmail(String email) {

        return mentorApplicationRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Application not found")
                );
    }

    // =========================================
    // GET ALL APPLICATIONS
    // =========================================

    public List<MentorApplication> getAllApplications() {

        return mentorApplicationRepository.findAll();
    }

    // =========================================
    // GET PENDING APPLICATIONS
    // =========================================

    public List<MentorApplication> getPendingApplications() {

        return mentorApplicationRepository.findByStatus("PENDING");
    }

    // =========================================
    // GET REJECTED APPLICATION
    // =========================================

    public MentorApplication getRejectedApplication(String email) {

        List<MentorApplication> applications =
                mentorApplicationRepository.findByEmailAndStatus(
                        email,
                        "REJECTED"
                );

        if (applications.isEmpty()) {
            return null;
        }

        // Return the latest rejected application
        return applications.get(applications.size() - 1);
    }

    // =========================================
    // APPROVE APPLICATION
    // =========================================

    public MentorApplication approveApplication(String id) {

        MentorApplication application = getApplicationById(id);

        application.setStatus("APPROVED");

        // Clear any previous rejection information
        application.setRejectionReason(null);
        application.setImprovementSuggestion(null);

        return mentorApplicationRepository.save(application);
    }

    // =========================================
    // REJECT APPLICATION
    // =========================================

    public MentorApplication rejectApplication(
            String id,
            String rejectionReason,
            String improvementSuggestion
    ) {

        MentorApplication application = getApplicationById(id);

        application.setStatus("REJECTED");

        application.setRejectionReason(rejectionReason);

        application.setImprovementSuggestion(improvementSuggestion);

        return mentorApplicationRepository.save(application);
    }

    // =========================================
    // DELETE APPLICATION
    // =========================================

    public void deleteApplication(String id) {

        mentorApplicationRepository.deleteById(id);
    }
}

