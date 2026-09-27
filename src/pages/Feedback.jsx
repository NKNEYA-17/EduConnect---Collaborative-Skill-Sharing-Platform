import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Feedback.css";

function Feedback() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);


    // =========================================
    // LOAD BOOKING
    // =========================================

    useEffect(() => {

        const loadBooking = async () => {

            if (!bookingId) {

                alert("Booking ID is missing.");

                navigate("/my-bookings");

                return;
            }

            try {

                setLoading(true);


                // -----------------------------------------
                // GET BOOKING DETAILS
                // -----------------------------------------

                const bookingResponse = await fetch(
                    `http://localhost:8080/api/mentor-bookings/${bookingId}`
                );


                if (!bookingResponse.ok) {

                    throw new Error(
                        "Unable to load booking details."
                    );
                }


                const bookingData =
                    await bookingResponse.json();


                // -----------------------------------------
                // ONLY COMPLETED SESSIONS CAN BE REVIEWED
                // -----------------------------------------

                if (
                    !bookingData.status ||
                    bookingData.status.toUpperCase() !==
                        "COMPLETED"
                ) {

                    alert(
                        "Feedback can only be submitted after completing the session."
                    );

                    navigate("/my-bookings");

                    return;
                }


                setBooking(bookingData);


                // -----------------------------------------
                // CHECK WHETHER FEEDBACK ALREADY EXISTS
                // -----------------------------------------

                const feedbackResponse =
                    await fetch(
                        `http://localhost:8080/api/feedback/booking/${bookingId}/exists`
                    );


                if (feedbackResponse.ok) {

                    const exists =
                        await feedbackResponse.json();


                    if (exists === true) {

                        setAlreadySubmitted(true);
                    }
                }

            } catch (error) {

                console.error(
                    "Error loading feedback page:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to load the feedback page."
                );


                navigate("/my-bookings");

            } finally {

                setLoading(false);
            }
        };


        loadBooking();

    }, [bookingId, navigate]);


    // =========================================
    // SUBMIT FEEDBACK
    // =========================================

    const submitFeedback = async (event) => {

        event.preventDefault();


        // -----------------------------------------
        // VALIDATE RATING
        // -----------------------------------------

        if (rating < 1 || rating > 5) {

            alert(
                "Please select a rating from 1 to 5 stars."
            );

            return;
        }


        // -----------------------------------------
        // VALIDATE FEEDBACK TEXT
        // -----------------------------------------

        if (!feedbackText.trim()) {

            alert(
                "Please enter your feedback."
            );

            return;
        }


        // -----------------------------------------
        // PREVENT DUPLICATE FEEDBACK
        // -----------------------------------------

        if (alreadySubmitted) {

            alert(
                "You have already submitted feedback for this session."
            );

            return;
        }


        try {

            setSubmitting(true);


            // -----------------------------------------
            // SUBMIT FEEDBACK TO BACKEND
            // -----------------------------------------

            const response = await fetch(
                "http://localhost:8080/api/feedback",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        bookingId: bookingId,

                        rating: rating,

                        feedback:
                            feedbackText.trim()
                    })
                }
            );


            // -----------------------------------------
            // HANDLE ERROR RESPONSE
            // -----------------------------------------

            if (!response.ok) {

                let errorMessage =
                    "Unable to submit feedback.";


                try {

                    const errorText =
                        await response.text();


                    if (errorText) {

                        errorMessage =
                            errorText;
                    }

                } catch (error) {

                    console.error(
                        "Unable to read error response:",
                        error
                    );
                }


                throw new Error(
                    errorMessage
                );
            }


            // -----------------------------------------
            // READ SUCCESS RESPONSE
            // -----------------------------------------

            await response.json();


            // -----------------------------------------
            // IMPORTANT:
            // BACKEND HAS NOW:
            //
            // 1. SAVED THE FEEDBACK
            // 2. AWARDED STARS TO THE MENTOR
            //
            // Tell StarDisplay to refresh immediately.
            // -----------------------------------------

            window.dispatchEvent(
                new Event("starsUpdated")
            );


            setAlreadySubmitted(true);


            alert(
                "⭐ Feedback submitted successfully!"
            );


            navigate("/my-bookings");


        } catch (error) {

            console.error(
                "Error submitting feedback:",
                error
            );


            alert(
                error.message ||
                "Unable to submit feedback. Please try again."
            );


        } finally {

            setSubmitting(false);
        }
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="feedback-page">

                    <div className="feedback-card loading-card">

                        <div className="loading-icon">
                            ⭐
                        </div>

                        <h2>
                            Loading Feedback...
                        </h2>

                        <p>
                            Preparing your session feedback form.
                        </p>

                    </div>

                </div>
            </>
        );
    }


    // =========================================
    // BOOKING NOT FOUND
    // =========================================

    if (!booking) {

        return (
            <>
                <Navbar />

                <div className="feedback-page">

                    <div className="feedback-card">

                        <h2>
                            Session Not Found
                        </h2>

                        <button
                            className="back-feedback-btn"
                            onClick={() =>
                                navigate("/my-bookings")
                            }
                        >
                            ← Back to My Bookings
                        </button>

                    </div>

                </div>
            </>
        );
    }


    // =========================================
    // ALREADY SUBMITTED
    // =========================================

    if (alreadySubmitted) {

        return (
            <>
                <Navbar />

                <div className="feedback-page">

                    <div className="feedback-card submitted-card">

                        <div className="submitted-icon">
                            ✓
                        </div>

                        <h1>
                            Feedback Submitted
                        </h1>

                        <p>
                            You have already submitted your
                            rating and feedback for this session.
                        </p>


                        <div className="submitted-session">

                            <strong>
                                {
                                    booking.sessionTitle ||
                                    "Mentoring Session"
                                }
                            </strong>


                            <span>
                                Mentor:{" "}
                                {
                                    booking.mentorName ||
                                    "Mentor"
                                }
                            </span>

                        </div>


                        <button
                            className="back-feedback-btn"
                            onClick={() =>
                                navigate("/my-bookings")
                            }
                        >
                            ← Back to My Bookings
                        </button>

                    </div>

                </div>
            </>
        );
    }


    // =========================================
    // MAIN FEEDBACK PAGE
    // =========================================

    return (
        <>
            <Navbar />

            <div className="feedback-page">

                <div className="feedback-card">


                    {/* =====================================
                        HEADER
                    ===================================== */}

                    <div className="feedback-header">

                        <div className="feedback-title-icon">
                            ⭐
                        </div>


                        <h1>
                            Rate Your Session
                        </h1>


                        <p>
                            Share your experience and help
                            improve future mentoring sessions.
                        </p>

                    </div>


                    {/* =====================================
                        SESSION INFORMATION
                    ===================================== */}

                    <div className="feedback-session-info">


                        <div className="feedback-info-row">

                            <span className="feedback-label">
                                📚 Session
                            </span>


                            <span className="feedback-value">

                                {
                                    booking.sessionTitle ||
                                    "Mentoring Session"
                                }

                            </span>

                        </div>


                        <div className="feedback-info-row">

                            <span className="feedback-label">
                                👨‍🏫 Mentor
                            </span>


                            <span className="feedback-value">

                                {
                                    booking.mentorName ||
                                    "Mentor"
                                }

                            </span>

                        </div>


                        <div className="feedback-info-row">

                            <span className="feedback-label">
                                💡 Skill
                            </span>


                            <span className="feedback-value">

                                {
                                    booking.skill ||
                                    "Not specified"
                                }

                            </span>

                        </div>


                        <div className="feedback-info-row">

                            <span className="feedback-label">
                                📅 Slot
                            </span>


                            <span className="feedback-value">

                                {
                                    booking.slot ||
                                    "Not specified"
                                }

                            </span>

                        </div>

                    </div>


                    {/* =====================================
                        FEEDBACK FORM
                    ===================================== */}

                    <form
                        className="feedback-form"
                        onSubmit={submitFeedback}
                    >


                        {/* =================================
                            RATING
                        ================================= */}

                        <div className="rating-section">

                            <h2>
                                How would you rate this session?
                            </h2>


                            <p>
                                Your rating helps us understand
                                your learning experience.
                            </p>


                            <div
                                className="stars-container"

                                onMouseLeave={() =>
                                    setHoverRating(0)
                                }
                            >

                                {
                                    [1, 2, 3, 4, 5].map(
                                        (star) => (

                                            <button
                                                type="button"
                                                key={star}

                                                className={
                                                    `star-btn ${
                                                        star <=
                                                        (
                                                            hoverRating ||
                                                            rating
                                                        )
                                                            ? "active"
                                                            : ""
                                                    }`
                                                }

                                                onClick={() =>
                                                    setRating(star)
                                                }

                                                onMouseEnter={() =>
                                                    setHoverRating(star)
                                                }

                                                aria-label={
                                                    `Rate ${star} out of 5`
                                                }
                                            >
                                                ★
                                            </button>

                                        )
                                    )
                                }

                            </div>


                            <div className="rating-text">

                                {
                                    rating === 0 &&
                                    "Select your rating"
                                }

                                {
                                    rating === 1 &&
                                    "Very Poor"
                                }

                                {
                                    rating === 2 &&
                                    "Poor"
                                }

                                {
                                    rating === 3 &&
                                    "Average"
                                }

                                {
                                    rating === 4 &&
                                    "Good"
                                }

                                {
                                    rating === 5 &&
                                    "Excellent"
                                }

                            </div>

                        </div>


                        {/* =================================
                            FEEDBACK TEXT
                        ================================= */}

                        <div className="feedback-text-section">

                            <label htmlFor="feedback">
                                💬 Share your experience
                            </label>


                            <p>
                                Tell us what you liked about the
                                session or what could be improved.
                            </p>


                            <textarea
                                id="feedback"

                                value={feedbackText}

                                onChange={(event) =>
                                    setFeedbackText(
                                        event.target.value
                                    )
                                }

                                placeholder="Write your feedback here..."

                                rows="6"

                                maxLength="1000"
                            />


                            <div className="character-count">

                                {feedbackText.length}/1000

                            </div>

                        </div>


                        {/* =================================
                            SUBMIT BUTTON
                        ================================= */}

                        <button
                            type="submit"
                            className="submit-feedback-btn"
                            disabled={submitting}
                        >

                            {
                                submitting
                                    ? "Submitting Feedback..."
                                    : "⭐ Submit Feedback"
                            }

                        </button>


                        {/* =================================
                            BACK BUTTON
                        ================================= */}

                        <button
                            type="button"
                            className="cancel-feedback-btn"

                            onClick={() =>
                                navigate("/my-bookings")
                            }

                            disabled={submitting}
                        >
                            ← Back to My Bookings
                        </button>

                    </form>

                </div>

            </div>
        </>
    );
}

export default Feedback;