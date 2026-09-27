
const API_BASE_URL = "http://localhost:8080/api/stars";


// =========================================
// GET TOTAL STARS
// =========================================

export const getTotalStars = async (userId) => {

    try {

        const response = await fetch(
            `${API_BASE_URL}/total/${userId}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch total stars");
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Error fetching total stars:",
            error
        );

        return 0;
    }
};


// =========================================
// ADD DEFAULT 10 STARS
// =========================================

export const addDefaultStars = async (userId) => {

    try {

        const response = await fetch(
            `${API_BASE_URL}/default/${userId}`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add default stars");
        }

        /*
         * Backend returns:
         *
         * 200 + JSON       → first time, stars created
         * 200 + empty body → stars already exist
         *
         * So read the response as text first.
         */

        const text = await response.text();

        if (!text || text.trim() === "") {
            return null;
        }

        return JSON.parse(text);

    } catch (error) {

        console.error(
            "Error adding default stars:",
            error
        );

        return null;
    }
};


// =========================================
// AWARD LEARNING SESSION STARS
// =========================================

export const awardLearningSessionStars = async (
    userId,
    skill,
    sessionId
) => {

    try {

        const params = new URLSearchParams();

        params.append("userId", userId);

        if (skill) {
            params.append("skill", skill);
        }

        if (sessionId) {
            params.append("sessionId", sessionId);
        }

        const response = await fetch(
            `${API_BASE_URL}/learning?${params.toString()}`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to award learning session stars"
            );
        }

        const text = await response.text();

        if (!text || text.trim() === "") {
            return null;
        }

        return JSON.parse(text);

    } catch (error) {

        console.error(
            "Error awarding learning session stars:",
            error
        );

        return null;
    }
};


// =========================================
// AWARD TEACHING SESSION STARS
// =========================================

export const awardTeachingSessionStars = async (
    userId,
    skill,
    sessionId
) => {

    try {

        const params = new URLSearchParams();

        params.append("userId", userId);

        if (skill) {
            params.append("skill", skill);
        }

        if (sessionId) {
            params.append("sessionId", sessionId);
        }

        const response = await fetch(
            `${API_BASE_URL}/teaching?${params.toString()}`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to award teaching session stars"
            );
        }

        const text = await response.text();

        if (!text || text.trim() === "") {
            return null;
        }

        return JSON.parse(text);

    } catch (error) {

        console.error(
            "Error awarding teaching session stars:",
            error
        );

        return null;
    }
};


// =========================================
// AWARD SKILL COMPLETION STARS
// =========================================

export const awardSkillCompletionStars = async (
    userId,
    skill
) => {

    try {

        const params = new URLSearchParams();

        params.append("userId", userId);
        params.append("skill", skill);

        const response = await fetch(
            `${API_BASE_URL}/skill-completion?${params.toString()}`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to award skill completion stars"
            );
        }

        const text = await response.text();

        if (!text || text.trim() === "") {
            return null;
        }

        return JSON.parse(text);

    } catch (error) {

        console.error(
            "Error awarding skill completion stars:",
            error
        );

        return null;
    }
};


// =========================================
// GET STAR HISTORY
// =========================================

export const getStarHistory = async (userId) => {

    try {

        const response = await fetch(
            `${API_BASE_URL}/history/${userId}`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch star history"
            );
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Error fetching star history:",
            error
        );

        return [];
    }
};

