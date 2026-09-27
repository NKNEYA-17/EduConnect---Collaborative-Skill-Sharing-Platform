
package com.educonnect.controller;

import com.educonnect.service.StarLevelService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/star-level")
@CrossOrigin(origins = "http://localhost:5173")
public class StarLevelController {

    private final StarLevelService starLevelService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public StarLevelController(
            StarLevelService starLevelService
    ) {
        this.starLevelService = starLevelService;
    }

    // =========================================
    // GET LEVEL INFORMATION
    // =========================================

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getLevelInfo(
            @PathVariable String userId
    ) {

        Map<String, Object> levelInfo =
                starLevelService.getLevelInfo(userId);

        return ResponseEntity.ok(levelInfo);
    }

    // =========================================
    // CALCULATE LEVEL FROM STAR COUNT
    // =========================================

    @GetMapping("/calculate/{totalStars}")
    public ResponseEntity<Map<String, Object>> calculateLevel(
            @PathVariable int totalStars
    ) {

        Map<String, Object> levelInfo =
                starLevelService.calculateLevel(totalStars);

        return ResponseEntity.ok(levelInfo);
    }
}

