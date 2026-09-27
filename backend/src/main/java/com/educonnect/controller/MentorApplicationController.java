package com.educonnect.controller;

import com.educonnect.model.MentorApplication;
import com.educonnect.service.MentorApplicationService;

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
import java.util.Map;

@RestController
@RequestMapping("/api/mentor-applications")
@CrossOrigin(origins = "http://localhost:5173")
public class MentorApplicationController {

    private final MentorApplicationService mentorApplicationService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public MentorApplicationController(
            MentorApplicationService mentorApplicationService
    ) {
        this.mentorApplicationService = mentorApplicationService;
    }

    // =========================================
    // TEST API
    // =========================================

    @GetMapping("/test")
    public String test() {

        return "Mentor Controller Working";
    }

    // =========================================
    // SUBMIT APPLICATION
    // =========================================

    @PostMapping
    public ResponseEntity<MentorApplication> submitApplication(
            @RequestBody MentorApplication application
    ) {

        MentorApplication savedApplication =
                mentorApplicationService.submitApplication(application);

        return ResponseEntity.ok(savedApplication);
    }

    // =========================================
    // GET ALL APPLICATIONS
    // =========================================

    @GetMapping
    public ResponseEntity<List<MentorApplication>> getAllApplications() {

        return ResponseEntity.ok(
                mentorApplicationService.getAllApplications()
        );
    }

    // =========================================
    // GET APPLICATION BY ID
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<MentorApplication> getApplicationById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                mentorApplicationService.getApplicationById(id)
        );
    }

    // =========================================
    // GET APPLICATION BY EMAIL
    // =========================================

    @GetMapping("/email/{email}")
    public ResponseEntity<MentorApplication> getApplicationByEmail(
            @PathVariable String email
    ) {

        return ResponseEntity.ok(
                mentorApplicationService.getApplicationByEmail(email)
        );
    }

    // =========================================
    // GET PENDING APPLICATIONS
    // =========================================

    @GetMapping("/pending")
    public ResponseEntity<List<MentorApplication>> getPendingApplications() {

        return ResponseEntity.ok(
                mentorApplicationService.getPendingApplications()
        );
    }

    // =========================================
    // GET REJECTED APPLICATION
    // =========================================

    @GetMapping("/rejected/{email}")
    public ResponseEntity<MentorApplication> getRejectedApplication(
            @PathVariable String email
    ) {

        MentorApplication application =
                mentorApplicationService.getRejectedApplication(email);

        if (application == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(application);
    }

    // =========================================
    // APPROVE APPLICATION
    // =========================================

    @PutMapping("/approve/{id}")
    public ResponseEntity<MentorApplication> approveApplication(
            @PathVariable String id
    ) {

        MentorApplication application =
                mentorApplicationService.approveApplication(id);

        return ResponseEntity.ok(application);
    }

    // =========================================
    // REJECT APPLICATION
    // =========================================

    @PutMapping("/reject/{id}")
    public ResponseEntity<MentorApplication> rejectApplication(
            @PathVariable String id,
            @RequestBody Map<String, String> rejectionData
    ) {

        String rejectionReason =
                rejectionData.get("rejectionReason");

        String improvementSuggestion =
                rejectionData.get("improvementSuggestion");

        if (rejectionReason == null ||
                rejectionReason.trim().isEmpty()) {

            return ResponseEntity.badRequest().build();
        }

        if (improvementSuggestion == null ||
                improvementSuggestion.trim().isEmpty()) {

            return ResponseEntity.badRequest().build();
        }

        MentorApplication application =
                mentorApplicationService.rejectApplication(
                        id,
                        rejectionReason,
                        improvementSuggestion
                );

        return ResponseEntity.ok(application);
    }

    // =========================================
    // DELETE APPLICATION
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(
            @PathVariable String id
    ) {

        mentorApplicationService.deleteApplication(id);

        return ResponseEntity.ok(
                "Mentor application deleted successfully"
        );
    }
}
