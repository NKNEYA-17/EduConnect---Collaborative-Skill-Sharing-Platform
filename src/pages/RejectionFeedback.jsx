import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/RejectionFeedback.css";

function RejectionFeedback() {

    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadRejectedApplication = async () => {

            try {

                // Get logged-in user
                const loggedInUser =
                    JSON.parse(localStorage.getItem("user"));

                if (!loggedInUser || !loggedInUser.email) {

                    setError("Please login again.");
                    setLoading(false);
                    return;
                }

                console.log(
                    "Loading rejected application for:",
                    loggedInUser.email
                );

                const response = await fetch(
                    `http://localhost:8080/api/mentor-applications/rejected/${encodeURIComponent(
                        loggedInUser.email
                    )}`
                );

                console.log(
                    "Rejected application response:",
                    response.status
                );

                if (response.status === 404) {

                    setApplication(null);
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        "Failed to load rejection details"
                    );
                }

                const data = await response.json();

                console.log(
                    "Rejected application:",
                    data
                );

                setApplication(data);

            } catch (err) {

                console.error(
                    "Error loading rejection details:",
                    err
                );

                setError(
                    "Unable to load your rejection feedback."
                );

            } finally {

                setLoading(false);
            }
        };

        loadRejectedApplication();

    }, []);

    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="rejection-page">

                <div className="rejection-card">

                    <h2>Loading...</h2>

                    <p>
                        Please wait while we load your
                        application feedback.
                    </p>

                </div>

            </div>
        );
    }

    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (
            <div className="rejection-page">

                <div className="rejection-card">

                    <h2>Something went wrong</h2>

                    <p>{error}</p>

                    <button
                        onClick={() => navigate("/home")}
                        className="back-btn"
                    >
                        ← Back to Home
                    </button>

                </div>

            </div>
        );
    }

    // =========================================
    // NO REJECTED APPLICATION
    // =========================================

    if (!application) {

        return (
            <div className="rejection-page">

                <div className="rejection-card">

                    <h2>
                        No Rejection Feedback Found
                    </h2>

                    <p>
                        We could not find any rejected mentor
                        application.
                    </p>

                    <button
                        onClick={() => navigate("/home")}
                        className="back-btn"
                    >
                        ← Back to Home
                    </button>

                </div>

            </div>
        );
    }

    // =========================================
    // REJECTION FEEDBACK
    // =========================================

    return (
        <div className="rejection-page">

            <div className="rejection-card">

                <div className="rejection-icon">
                    ❌
                </div>

                <h1>
                    Mentor Application Rejected
                </h1>

                <p className="intro-text">
                    Your mentor application was reviewed by
                    the admin. Please go through the feedback
                    below and improve your application before
                    applying again.
                </p>

                {/* =========================================
                    REJECTION REASON
                ========================================= */}

                <div className="feedback-section">

                    <h2>
                        ❌ Reason for Rejection
                    </h2>

                    <div className="feedback-box reason-box">

                        {application.rejectionReason ||
                            "No specific reason was provided."}

                    </div>

                </div>

                {/* =========================================
                    IMPROVEMENT
                ========================================= */}

                <div className="feedback-section">

                    <h2>
                        💡 Areas for Improvement
                    </h2>

                    <div className="feedback-box improvement-box">

                        {application.improvementSuggestion ||
                            "No improvement suggestions were provided."}

                    </div>

                </div>

                {/* =========================================
                    ACTION
                ========================================= */}

                <div className="action-section">

                    <p>
                        Make the suggested improvements and
                        submit your mentor application again.
                    </p>

                    <button
                        className="apply-again-btn"
                        onClick={() =>
                            navigate("/mentor-application")
                        }
                    >
                        ✏️ Improve & Apply Again
                    </button>

                    <button
                        className="back-btn"
                        onClick={() => navigate("/home")}
                    >
                        ← Back to Home
                    </button>

                </div>

            </div>

        </div>
    );
}

export default RejectionFeedback;

