package com.educonnect.service;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class StarLevelService {

    private final StarTransitionService starTransitionService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public StarLevelService(
            StarTransitionService starTransitionService
    ) {
        this.starTransitionService = starTransitionService;
    }

    // =========================================
    // LEVEL INFORMATION
    // =========================================

    public Map<String, Object> getLevelInfo(String userId) {

        int totalStars =
                starTransitionService.getTotalStars(userId);

        return calculateLevel(totalStars);
    }

    // =========================================
    // CALCULATE LEVEL
    // =========================================

    public Map<String, Object> calculateLevel(int totalStars) {

        String level;
        String rank;
        String emoji;

        int currentLevelMin;
        int nextLevelMin;
        int starsToNextLevel;

        // -----------------------------------------
        // LEVEL 1
        // 0 - 49
        // -----------------------------------------

        if (totalStars < 50) {

            level = "Beginner";
            rank = "Beginner";
            emoji = "🌱";

            currentLevelMin = 0;
            nextLevelMin = 50;

            starsToNextLevel =
                    nextLevelMin - totalStars;

        }

        // -----------------------------------------
        // LEVEL 2
        // 50 - 99
        // -----------------------------------------

        else if (totalStars < 100) {

            level = "Rising Learner";
            rank = "Rising Learner";
            emoji = "🚀";

            currentLevelMin = 50;
            nextLevelMin = 100;

            starsToNextLevel =
                    nextLevelMin - totalStars;

        }

        // -----------------------------------------
        // LEVEL 3
        // 100 - 199
        // -----------------------------------------

        else if (totalStars < 200) {

            level = "Skill Explorer";
            rank = "Skill Explorer";
            emoji = "🔍";

            currentLevelMin = 100;
            nextLevelMin = 200;

            starsToNextLevel =
                    nextLevelMin - totalStars;

        }

        // -----------------------------------------
        // LEVEL 4
        // 200 - 349
        // -----------------------------------------

        else if (totalStars < 350) {

            level = "Skill Master";
            rank = "Skill Master";
            emoji = "🏆";

            currentLevelMin = 200;
            nextLevelMin = 350;

            starsToNextLevel =
                    nextLevelMin - totalStars;

        }

        // -----------------------------------------
        // LEVEL 5
        // 350+
        // -----------------------------------------

        else {

            level = "Skill Champion";
            rank = "Skill Champion";
            emoji = "👑";

            currentLevelMin = 350;

            // No next level
            nextLevelMin = -1;

            starsToNextLevel = 0;
        }

        // =========================================
        // PROGRESS CALCULATION
        // =========================================

        int progressPercentage;

        if (nextLevelMin == -1) {

            // Maximum level
            progressPercentage = 100;

        } else {

            int levelRange =
                    nextLevelMin - currentLevelMin;

            int currentProgress =
                    totalStars - currentLevelMin;

            progressPercentage =
                    (int) Math.round(
                            ((double) currentProgress
                                    / levelRange) * 100
                    );

            // Keep percentage between 0 and 100
            if (progressPercentage < 0) {
                progressPercentage = 0;
            }

            if (progressPercentage > 100) {
                progressPercentage = 100;
            }
        }

        // =========================================
        // BUILD RESPONSE
        // =========================================

        Map<String, Object> levelInfo =
                new LinkedHashMap<>();

        levelInfo.put(
                "totalStars",
                totalStars
        );

        levelInfo.put(
                "level",
                level
        );

        levelInfo.put(
                "rank",
                rank
        );

        levelInfo.put(
                "emoji",
                emoji
        );

        levelInfo.put(
                "currentLevelMin",
                currentLevelMin
        );

        levelInfo.put(
                "nextLevelMin",
                nextLevelMin
        );

        levelInfo.put(
                "starsToNextLevel",
                starsToNextLevel
        );

        levelInfo.put(
                "progressPercentage",
                progressPercentage
        );

        // =========================================
        // NEXT LEVEL NAME
        // =========================================

        String nextLevel;

        if (totalStars < 50) {

            nextLevel = "Rising Learner";

        } else if (totalStars < 100) {

            nextLevel = "Skill Explorer";

        } else if (totalStars < 200) {

            nextLevel = "Skill Master";

        } else if (totalStars < 350) {

            nextLevel = "Skill Champion";

        } else {

            nextLevel = null;
        }

        levelInfo.put(
                "nextLevel",
                nextLevel
        );

        return levelInfo;
    }

    // =========================================
    // SIMPLE LEVEL NAME
    // =========================================

    public String getLevelName(int totalStars) {

        if (totalStars < 50) {
            return "Beginner";
        }

        if (totalStars < 100) {
            return "Rising Learner";
        }

        if (totalStars < 200) {
            return "Skill Explorer";
        }

        if (totalStars < 350) {
            return "Skill Master";
        }

        return "Skill Champion";
    }

    // =========================================
    // LEVEL EMOJI
    // =========================================

    public String getLevelEmoji(int totalStars) {

        if (totalStars < 50) {
            return "🌱";
        }

        if (totalStars < 100) {
            return "🚀";
        }

        if (totalStars < 200) {
            return "🔍";
        }

        if (totalStars < 350) {
            return "🏆";
        }

        return "👑";
    }
}