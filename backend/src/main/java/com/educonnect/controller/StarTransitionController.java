package com.educonnect.controller;

import com.educonnect.model.StarTransaction;
import com.educonnect.service.StarTransitionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stars")
@CrossOrigin(origins = "http://localhost:5173")
public class StarTransitionController {

    private final StarTransitionService starTransitionService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public StarTransitionController(
            StarTransitionService starTransitionService) {

        this.starTransitionService = starTransitionService;
    }


    // =========================================
    // ADD DEFAULT STARS
    // =========================================

    @PostMapping("/default/{userId}")
    public ResponseEntity<StarTransaction> addDefaultStars(
            @PathVariable String userId) {

        StarTransaction transaction =
                starTransitionService.addDefaultStars(userId);

        if (transaction == null) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok(transaction);
    }


    // =========================================
    // AWARD LEARNING SESSION STARS
    // =========================================

    @PostMapping("/learning")
    public ResponseEntity<StarTransaction> awardLearningSessionStars(
            @RequestParam String userId,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String sessionId) {

        StarTransaction transaction =
                starTransitionService.awardLearningSessionStars(
                        userId,
                        skill,
                        sessionId
                );

        if (transaction == null) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok(transaction);
    }


    // =========================================
    // AWARD TEACHING SESSION STARS
    // =========================================

    @PostMapping("/teaching")
    public ResponseEntity<StarTransaction> awardTeachingSessionStars(
            @RequestParam String userId,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String sessionId) {

        StarTransaction transaction =
                starTransitionService.awardTeachingSessionStars(
                        userId,
                        skill,
                        sessionId
                );

        if (transaction == null) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok(transaction);
    }


    // =========================================
    // AWARD SKILL COMPLETION STARS
    // =========================================

    @PostMapping("/skill-completion")
    public ResponseEntity<StarTransaction> awardSkillCompletionStars(
            @RequestParam String userId,
            @RequestParam String skill) {

        StarTransaction transaction =
                starTransitionService.awardSkillCompletionStars(
                        userId,
                        skill
                );

        if (transaction == null) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok(transaction);
    }


    // =========================================
    // GET STAR HISTORY
    // =========================================

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<StarTransaction>> getStarHistory(
            @PathVariable String userId) {

        List<StarTransaction> history =
                starTransitionService.getStarHistory(userId);

        return ResponseEntity.ok(history);
    }


    // =========================================
    // GET TOTAL STARS
    // =========================================

    @GetMapping("/total/{userId}")
    public ResponseEntity<Integer> getTotalStars(
            @PathVariable String userId) {

        int totalStars =
                starTransitionService.getTotalStars(userId);

        return ResponseEntity.ok(totalStars);
    }
}