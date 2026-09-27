package com.educonnect.controller;

import com.educonnect.model.Recommendation;
import com.educonnect.model.User;
import com.educonnect.service.RecommendationService;
import com.educonnect.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    private final UserService userService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public RecommendationController(
            RecommendationService recommendationService,
            UserService userService
    ) {

        this.recommendationService =
                recommendationService;

        this.userService =
                userService;
    }


    // =========================================================
    // GENERATE RECOMMENDATIONS
    // =========================================================

    @PostMapping("/generate/{userId}")
    public ResponseEntity<?> generateRecommendations(

            @PathVariable String userId,

            @RequestBody(required = false)
            Map<String, Object> request
    ) {

        try {

            // -------------------------------------------------
            // GET USER
            // -------------------------------------------------

            User user =
                    userService.getUserById(
                            userId
                    );


            if (user == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            // =================================================
            // MISSING SKILLS
            // =================================================

            List<String> missingSkills =
                    new ArrayList<>();


            // =================================================
            // TARGET ROLE
            // =================================================

            String targetRole =
                    "";


            // =================================================
            // READ REQUEST BODY
            // =================================================

            if (request != null) {

                // -------------------------------------------------
                // Read missingSkills
                // -------------------------------------------------

                Object missingSkillsObject =
                        request.get(
                                "missingSkills"
                        );


                if (
                        missingSkillsObject
                                instanceof List<?>
                ) {

                    for (
                            Object skill :
                            (List<?>) missingSkillsObject
                    ) {

                        if (
                                skill != null
                                &&
                                !skill
                                        .toString()
                                        .trim()
                                        .isEmpty()
                        ) {

                            missingSkills.add(
                                    skill
                                            .toString()
                                            .trim()
                            );
                        }
                    }
                }


                // -------------------------------------------------
                // Read targetRole
                // -------------------------------------------------

                Object targetRoleObject =
                        request.get(
                                "targetRole"
                        );


                if (
                        targetRoleObject != null
                ) {

                    targetRole =
                            targetRoleObject
                                    .toString()
                                    .trim();
                }
            }


            // =================================================
            // GENERATE HYBRID RECOMMENDATIONS
            // =================================================

            List<Recommendation> recommendations =
                    recommendationService
                            .generateAndSaveRecommendations(
                                    user,
                                    missingSkills,
                                    targetRole
                            );


            // =================================================
            // RETURN RESULT
            // =================================================

            return ResponseEntity.ok(
                    recommendations
            );

        }
        catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Error generating recommendations: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================================
    // GET USER RECOMMENDATIONS
    // =========================================================

    @GetMapping("/{userId}")
    public ResponseEntity<?> getRecommendations(

            @PathVariable String userId
    ) {

        try {

            List<Recommendation> recommendations =
                    recommendationService
                            .getUserRecommendations(
                                    userId
                            );


            return ResponseEntity.ok(
                    recommendations
            );

        }
        catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Error fetching recommendations: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================================
    // DELETE USER RECOMMENDATIONS
    // =========================================================

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteRecommendations(

            @PathVariable String userId
    ) {

        try {

            recommendationService
                    .deleteUserRecommendations(
                            userId
                    );


            return ResponseEntity.ok(
                    "Recommendations deleted successfully."
            );

        }
        catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Error deleting recommendations: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================================
    // TEST CONTROLLER
    // =========================================================

    @GetMapping("/test")
    public ResponseEntity<String>
    testRecommendationController() {

        return ResponseEntity.ok(
                "Recommendation Controller is working!"
        );
    }
}