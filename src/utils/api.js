const API_BASE_URL = "http://localhost:8080";


export const apiFetch = async (
    endpoint,
    options = {}
) => {

    const token =
        localStorage.getItem("token");


    const headers = {
        ...(options.headers || {}),
    };


    // =========================================
    // ADD JWT TOKEN
    // =========================================

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }


    // =========================================
    // CONTENT TYPE
    // =========================================

    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {

        headers["Content-Type"] =
            "application/json";

    }


    // =========================================
    // SEND REQUEST
    // =========================================

    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers,
            }
        );


    // =========================================
    // JWT EXPIRED / INVALID
    // =========================================

    if (response.status === 401) {

        console.warn(
            "JWT expired or unauthorized."
        );

        localStorage.removeItem("token");

        // Don't immediately redirect here.
        // Existing pages can handle the response.

    }


    return response;
};