import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/MentorReviews.css";

function MentorReviews() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================
    // FETCH MENTOR REVIEWS
    // =========================================

    useEffect(() => {

        const fetchReviews = async () => {

            if (!user?.id) {
                setError("Mentor information not found.");
                setLoading(false);
                return;
            }

            try {

                setLoading(true);

                // =========================================
                // STEP 1:
                // GET MENTOR PROFILE USING USER ID
                // =========================================

                const profileResponse = await fetch(
                    `http://localhost:8080/api/mentor-profiles/user/${user.id}`
                );

                if (!profileResponse.ok) {

                    throw new Error(
                        "Mentor profile not found."
                    );

                }

                const mentorProfile =
                    await profileResponse.json();


                // =========================================
                // STEP 2:
                // GET MENTOR PROFILE ID
                // =========================================

                if (!mentorProfile?.id) {

                    throw new Error(
                        "Mentor profile ID not found."
                    );

                }

                const mentorId =
                    mentorProfile.id;


                console.log(
                    "Logged-in User ID:",
                    user.id
                );

                console.log(
                    "Mentor Profile ID:",
                    mentorId
                );


                // =========================================
                // STEP 3:
                // GET FEEDBACK USING MENTOR PROFILE ID
                // =========================================

                const response = await fetch(
                    `http://localhost:8080/api/feedback/mentor/${mentorId}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Unable to fetch student reviews."
                    );

                }

                const data =
                    await response.json();


                console.log(
                    "Student Reviews:",
                    data
                );


                // =========================================
                // STEP 4:
                // STORE REVIEWS
                // =========================================

                setReviews(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Error fetching mentor reviews:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load student reviews."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchReviews();

    }, [user?.id]);


    // =========================================
    // CALCULATE AVERAGE RATING
    // =========================================

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (total, review) =>
                        total +
                        Number(review.rating || 0),
                    0
                ) / reviews.length
            ).toFixed(1)
            : "0.0";


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        try {

            return new Date(date).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        } catch {

            return "Not available";

        }
    };


    // =========================================
    // RENDER STARS
    // =========================================

    const renderStars = (rating) => {

        const numericRating =
            Number(rating) || 0;

        return (
            <div className="rating">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <span
                            key={star}
                            className={
                                star <= numericRating
                                    ? "star filled"
                                    : "star empty"
                            }
                        >
                            ★
                        </span>

                    )
                )}

            </div>
        );
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="mentor-reviews-page">

                    <div className="no-reviews">

                        <div className="loading-icon">
                            ⭐
                        </div>

                        <h2>
                            Loading Reviews...
                        </h2>

                        <p>
                            Fetching feedback from your learners.
                        </p>

                    </div>

                </div>
            </>
        );
    }


    // =========================================
    // MAIN UI
    // =========================================

    return (
        <>
            <Navbar />

            <div className="mentor-reviews-page">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="mentor-reviews-header">

                    <h1>
                        ⭐ Student Reviews
                    </h1>

                    <p>
                        See what learners say about your mentoring.
                    </p>

                </div>


                {/* =================================
                    RATING SUMMARY
                ================================= */}

                {reviews.length > 0 && (

                    <div className="rating-summary">

                        <div className="average-rating">

                            <div className="average-number">
                                {averageRating}
                            </div>

                            <div className="average-stars">
                                {renderStars(
                                    Math.round(
                                        Number(averageRating)
                                    )
                                )}
                            </div>

                            <p>
                                Average Rating
                            </p>

                        </div>


                        <div className="rating-divider"></div>


                        <div className="total-reviews">

                            <div className="review-count">
                                {reviews.length}
                            </div>

                            <div className="review-label">

                                {reviews.length === 1
                                    ? "Student Review"
                                    : "Student Reviews"}

                            </div>

                            <p>
                                From your learners
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="no-reviews">

                        <h2>
                            ⚠️ Unable to Load Reviews
                        </h2>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* =================================
                    REVIEWS
                ================================= */}

                {!error && reviews.length > 0 && (

                    <div className="reviews-container">

                        {reviews.map((review) => (

                            <div
                                className="review-card"
                                key={review.id}
                            >

                                {/* Student */}

                                <div className="review-top">

                                    <div className="student-info">

                                        <div className="student-avatar">
                                            👨‍🎓
                                        </div>

                                        <div>

                                            <h2>
                                                {review.studentName ||
                                                    "Student"}
                                            </h2>

                                            <span className="review-date">

                                                📅{" "}

                                                {formatDate(
                                                    review.submittedAt
                                                )}

                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* Rating */}

                                {renderStars(
                                    review.rating
                                )}


                                {/* Feedback */}

                                <p className="review-feedback">

                                    "{review.feedback ||
                                        "No written feedback provided."}"

                                </p>


                                {/* Session */}

                                <div className="review-details">

                                    <span>

                                        📚 Skill:{" "}

                                        {review.skill ||
                                            "Not specified"}

                                    </span>

                                    <span>

                                        🎓 Session:{" "}

                                        {review.sessionTitle ||
                                            "Mentoring Session"}

                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}


                {/* =================================
                    NO REVIEWS
                ================================= */}

                {!error && reviews.length === 0 && (

                    <div className="no-reviews">

                        <div className="empty-review-icon">
                            📭
                        </div>

                        <h2>
                            No Reviews Yet
                        </h2>

                        <p>
                            Student feedback will appear here
                            after learners complete sessions
                            and submit their ratings.
                        </p>

                    </div>

                )}

            </div>
        </>
    );
}

export default MentorReviews;