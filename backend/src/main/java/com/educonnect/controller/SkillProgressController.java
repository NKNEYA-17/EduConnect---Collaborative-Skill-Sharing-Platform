package com.educonnect.controller;

import com.educonnect.model.SkillProgress;
import com.educonnect.service.SkillProgressService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/skill-progress")
@CrossOrigin(origins = "http://localhost:5173")
public class SkillProgressController {

    private final SkillProgressService skillProgressService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public SkillProgressController(
            SkillProgressService skillProgressService
    ) {
        this.skillProgressService = skillProgressService;
    }


    // =========================================
    // UPDATE ONE SKILL PROGRESS
    // =========================================

    @PutMapping("/update")
    public ResponseEntity<?> updateSkillProgress(
            @RequestParam String studentId,
            @RequestParam String skill
    ) {

        try {

            SkillProgress progress =
                    skillProgressService.updateSkillProgress(
                            studentId,
                            skill
                    );

            return ResponseEntity.ok(progress);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to update skill progress");
        }
    }


    // =========================================
    // UPDATE ALL SKILLS FOR A STUDENT
    // =========================================

    @PutMapping("/update-all/{studentId}")
    public ResponseEntity<?> updateAllSkillProgress(
            @PathVariable String studentId
    ) {

        try {

            List<SkillProgress> progressList =
                    skillProgressService.updateAllSkillProgress(
                            studentId
                    );

            return ResponseEntity.ok(progressList);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to update skill progress");
        }
    }


    // =========================================
    // GET ALL SKILL PROGRESS
    // =========================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentSkillProgress(
            @PathVariable String studentId
    ) {

        try {

            List<SkillProgress> progressList =
                    skillProgressService.getStudentSkillProgress(
                            studentId
                    );

            return ResponseEntity.ok(progressList);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to fetch skill progress");
        }
    }


    // =========================================
    // GET PROGRESS FOR ONE SKILL
    // =========================================

    @GetMapping("/student/{studentId}/skill")
    public ResponseEntity<?> getSkillProgress(
            @PathVariable String studentId,
            @RequestParam String skill
    ) {

        try {

            Optional<SkillProgress> progress =
                    skillProgressService.getSkillProgress(
                            studentId,
                            skill
                    );

            if (progress.isEmpty()) {

                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(progress.get());

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to fetch skill progress");
        }
    }


    // =========================================
    // GET MASTERED SKILLS
    // =========================================

    @GetMapping("/student/{studentId}/mastered")
    public ResponseEntity<?> getMasteredSkills(
            @PathVariable String studentId
    ) {

        try {

            List<SkillProgress> masteredSkills =
                    skillProgressService.getMasteredSkills(
                            studentId
                    );

            return ResponseEntity.ok(masteredSkills);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to fetch mastered skills");
        }
    }


    // =========================================
    // CHECK WHETHER STUDENT CAN TEACH A SKILL
    // =========================================

    @GetMapping("/student/{studentId}/can-teach")
    public ResponseEntity<?> canTeachSkill(
            @PathVariable String studentId,
            @RequestParam String skill
    ) {

        try {

            boolean canTeach =
                    skillProgressService.canTeachSkill(
                            studentId,
                            skill
                    );

            return ResponseEntity.ok(canTeach);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to check teaching eligibility");
        }
    }
}