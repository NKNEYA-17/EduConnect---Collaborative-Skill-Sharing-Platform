
const API_BASE_URL = "http://localhost:8080/api/star-level";

// =========================================
// GET USER LEVEL INFORMATION
// =========================================

export const getStarLevel = async (userId) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/${userId}`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch star level information"
            );
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Error fetching star level:",
            error
        );

        return null;
    }
};


// =========================================
// CALCULATE LEVEL FROM STAR COUNT
// =========================================

export const calculateStarLevel = async (totalStars) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/calculate/${totalStars}`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to calculate star level"
            );
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Error calculating star level:",
            error
        );

        return null;
    }
};

