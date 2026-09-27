import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import mentorData from "../data/mentorData";

import "../styles/BookSession.css";

function BookSession() {

    console.log("🔥 BOOKSESSION COMPONENT IS RUNNING 🔥");

    const { id } = useParams();
    const navigate = useNavigate();

    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mentorProfileId, setMentorProfileId] = useState(null);
    const [mentorSession, setMentorSession] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);


    // ============================================================
    // CLEAN PROFILE ID
    // ============================================================

    const cleanProfileId =
        id?.startsWith("db-")
            ? id.substring(3)
            : id;


    // ============================================================
    // LOAD MENTOR
    // ============================================================

    useEffect(() => {

        console.log("🔥 LOAD MENTOR EFFECT RUNNING");
        console.log("Original ID:", id);
        console.log("Clean ID:", cleanProfileId);

        const loadMentor = async () => {

            setLoading(true);

            try {

                // =================================================
                // CHECK STATIC MENTOR
                // =================================================

                const staticMentor =
                    mentorData.find(
                        (m) =>
                            String(m.id) ===
                                String(id) ||
                            String(m.id) ===
                                String(cleanProfileId)
                    );


                if (staticMentor) {

                    console.log(
                        "Static mentor found:",
                        staticMentor
                    );

                    setMentor(staticMentor);

                    setMentorProfileId(null);

                    return;
                }


                // =================================================
                // FETCH MONGODB MENTOR
                // =================================================

                const profileUrl =
                    `http://localhost:8080/api/mentor-profiles/${cleanProfileId}`;


                console.log(
                    "Fetching mentor:",
                    profileUrl
                );


                let response =
                    await fetch(profileUrl);


                if (response.ok) {

                    const data =
                        await response.json();


                    console.log(
                        "MongoDB mentor:",
                        data
                    );


                    const convertedMentor = {

                        id:
                            data.id,

                        userId:
                            data.userId ||
                            "",

                        name:
                            data.name ||
                            "EduConnect Mentor",

                        role:
                            data.role ||
                            "EduConnect Mentor",

                        email:
                            data.email ||
                            "",

                        phone:
                            data.phone ||
                            "",

                        rating:
                            data.rating ??
                            0,

                        students:
                            data.students ??
                            0,

                        experience:
                            data.experience ||
                            "Not specified",

                        about:
                            data.about ||
                            data.bio ||
                            "No description available.",

                        skills:
                            Array.isArray(
                                data.skills
                            )
                                ? data.skills
                                : [],

                        slots:
                            Array.isArray(
                                data.slots
                            )
                                ? data.slots
                                : [],

                        status:
                            data.status ||
                            "Available"

                    };


                    console.log(
                        "Converted mentor:",
                        convertedMentor
                    );


                    setMentorProfileId(
                        data.id
                    );


                    setMentor(
                        convertedMentor
                    );


                    return;
                }


                // =================================================
                // FALLBACK USER ID
                // =================================================

                console.log(
                    "Trying mentor profile by user ID..."
                );


                response =
                    await fetch(
                        `http://localhost:8080/api/mentor-profiles/user/${cleanProfileId}`
                    );


                if (response.ok) {

                    const data =
                        await response.json();


                    console.log(
                        "Mentor found using user ID:",
                        data
                    );


                    const convertedMentor = {

                        id:
                            data.id,

                        userId:
                            data.userId ||
                            "",

                        name:
                            data.name ||
                            "EduConnect Mentor",

                        role:
                            data.role ||
                            "EduConnect Mentor",

                        email:
                            data.email ||
                            "",

                        phone:
                            data.phone ||
                            "",

                        rating:
                            data.rating ??
                            0,

                        students:
                            data.students ??
                            0,

                        experience:
                            data.experience ||
                            "Not specified",

                        about:
                            data.about ||
                            data.bio ||
                            "No description available.",

                        skills:
                            Array.isArray(
                                data.skills
                            )
                                ? data.skills
                                : [],

                        slots:
                            Array.isArray(
                                data.slots
                            )
                                ? data.slots
                                : [],

                        status:
                            data.status ||
                            "Available"

                    };


                    setMentorProfileId(
                        data.id
                    );


                    setMentor(
                        convertedMentor
                    );


                    return;
                }


                console.error(
                    "❌ Mentor not found"
                );


                setMentor(null);
                setMentorProfileId(null);


            } catch (error) {

                console.error(
                    "❌ Error loading mentor:",
                    error
                );

                setMentor(null);
                setMentorProfileId(null);

            } finally {

                setLoading(false);

            }

        };


        loadMentor();

    }, [id, cleanProfileId]);


    // ============================================================
    // LOAD MENTOR SESSION
    // ============================================================

    useEffect(() => {

        if (!mentor) {
            return;
        }


        console.log(
            "🔥 Loading mentor session for:",
            mentor.id
        );


        try {

            let session = null;


            const possibleKeys = [

                `mentorSession_${mentor.id}`,

                `mentorSession_${mentor.userId}`,

                `mentorSession_${id}`,

                `mentorSession_${cleanProfileId}`,

                "mentorSession"

            ];


            for (
                const key of possibleKeys
            ) {

                if (!key) {
                    continue;
                }


                const stored =
                    localStorage.getItem(
                        key
                    );


                if (stored) {

                    try {

                        session =
                            JSON.parse(
                                stored
                            );


                        console.log(
                            "Mentor session found:",
                            session
                        );


                        break;

                    } catch (error) {

                        console.error(
                            "Invalid session:",
                            error
                        );

                    }

                }

            }


            setMentorSession(
                session
            );


        } catch (error) {

            console.error(
                "Error loading mentor session:",
                error
            );

            setMentorSession(null);

        }

    }, [
        mentor,
        id,
        cleanProfileId
    ]);


    // ============================================================
    // FETCH STUDENT REVIEWS
    // ============================================================

    useEffect(() => {

        console.log(
            "🔥🔥 REVIEW EFFECT RUNNING 🔥🔥"
        );

        console.log(
            "Mentor:",
            mentor
        );

        console.log(
            "Mentor Profile ID:",
            mentorProfileId
        );


        const fetchReviews = async () => {

            if (!mentor) {

                console.log(
                    "⏳ Mentor not loaded yet."
                );

                return;

            }


            setReviewsLoading(true);


            try {

                // =================================================
                // BUILD ALL POSSIBLE IDS
                // =================================================

                const possibleIds = [

                    mentorProfileId,

                    mentor.id,

                    mentor.userId,

                    cleanProfileId

                ]
                    .filter(Boolean)
                    .map(String);


                const mentorIds = [
                    ...new Set(
                        possibleIds
                    )
                ];


                console.log(
                    "================================="
                );

                console.log(
                    "📢 BOOK SESSION - FETCH REVIEWS"
                );

                console.log(
                    "Mentor:",
                    mentor.name
                );

                console.log(
                    "Profile ID:",
                    mentorProfileId
                );

                console.log(
                    "Mentor ID:",
                    mentor.id
                );

                console.log(
                    "User ID:",
                    mentor.userId
                );

                console.log(
                    "IDs being checked:",
                    mentorIds
                );


                let allReviews = [];


                // =================================================
                // FETCH REVIEWS FOR EACH POSSIBLE ID
                // =================================================

                for (
                    const currentId
                    of mentorIds
                ) {

                    const reviewUrl =
                        `http://localhost:8080/api/feedback/mentor/${currentId}`;


                    console.log(
                        "➡️ Fetching:",
                        reviewUrl
                    );


                    try {

                        const response =
                            await fetch(
                                reviewUrl
                            );


                        console.log(
                            "⬅️ Status:",
                            response.status
                        );


                        if (!response.ok) {

                            console.warn(
                                "Failed for ID:",
                                currentId
                            );

                            continue;

                        }


                        const data =
                            await response.json();


                        console.log(
                            "Reviews received:",
                            data
                        );


                        if (
                            Array.isArray(data)
                        ) {

                            allReviews.push(
                                ...data
                            );

                        }

                    } catch (error) {

                        console.error(
                            "Request error for ID:",
                            currentId,
                            error
                        );

                    }

                }


                // =================================================
                // REMOVE DUPLICATES
                // =================================================

                const uniqueReviews = [
                    ...new Map(
                        allReviews.map(
                            (review) => [
                                review.id,
                                review
                            ]
                        )
                    ).values()
                ];


                // =================================================
                // SORT NEWEST FIRST
                // =================================================

                uniqueReviews.sort(
                    (a, b) => {

                        const dateA =
                            new Date(
                                a.submittedAt || 0
                            ).getTime();


                        const dateB =
                            new Date(
                                b.submittedAt || 0
                            ).getTime();


                        return dateB - dateA;

                    }
                );


                console.log(
                    "================================="
                );

                console.log(
                    "🔥 FINAL REVIEWS:",
                    uniqueReviews
                );

                console.log(
                    "🔥 TOTAL REVIEWS:",
                    uniqueReviews.length
                );

                console.log(
                    "================================="
                );


                setReviews(
                    uniqueReviews
                );


            } catch (error) {

                console.error(
                    "❌ Review loading error:",
                    error
                );


                setReviews([]);

            } finally {

                setReviewsLoading(false);

            }

        };


        fetchReviews();

    }, [
        mentor,
        mentorProfileId,
        cleanProfileId
    ]);


    // ============================================================
    // AVERAGE RATING
    // ============================================================

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (
                        total,
                        review
                    ) =>
                        total +
                        Number(
                            review.rating || 0
                        ),
                    0
                ) /
                reviews.length
            ).toFixed(1)
            : "0.0";


    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatReviewDate =
        (date) => {

            if (!date) {
                return "Not available";
            }


            try {

                return new Date(
                    date
                ).toLocaleDateString(
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


    // ============================================================
    // RENDER STARS
    // ============================================================

    const renderReviewStars =
        (rating) => {

            const numericRating =
                Number(
                    rating
                ) || 0;


            return (

                <div className="rating">

                    {[1, 2, 3, 4, 5].map(
                        (star) => (

                            <span
                                key={star}
                                className={
                                    star <=
                                    numericRating
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


    // ============================================================
    // BOOK SESSION
    // ============================================================

    const handleBookSession =
        async () => {

            try {

                const storedUser =
                    localStorage.getItem(
                        "user"
                    );


                if (!storedUser) {

                    alert(
                        "Please login before booking a session."
                    );

                    navigate(
                        "/login"
                    );

                    return;

                }


                const student =
                    JSON.parse(
                        storedUser
                    );


                const session =
                    mentorSession;


                const bookingData = {

                    mentorId:
                        String(
                            mentor.id
                        ),

                    mentorName:
                        mentor.name ||
                        "",

                    mentorEmail:
                        mentor.email ||
                        "",


                    studentId:
                        String(
                            student.id
                        ),

                    studentName:
                        student.name ||
                        "Student",

                    studentEmail:
                        student.email ||
                        "",


                    sessionId:
                        session?.id ||
                        session?.sessionId ||
                        "",

                    sessionTitle:
                        session?.title ||
                        session?.sessionTitle ||
                        "Learning Session",

                    skill:
                        session?.skill ||
                        mentor.skills?.[0] ||
                        "",

                    slot:
                        session?.slot ||
                        session?.dateTime ||
                        "",

                    duration:
                        session?.duration ||
                        "60 minutes",

                    mode:
                        session?.mode ||
                        "Online",

                    maxStudents:
                        session?.maxStudents ||
                        1,

                    bookedStudents:
                        session?.bookedStudents ||
                        0,

                    googleMeetLink:
                        session?.googleMeetLink ||
                        "",

                    materials:
                        session?.materials ||
                        [],

                    status:
                        "PENDING"

                };


                console.log(
                    "BOOKING DATA:",
                    bookingData
                );


                const response =
                    await fetch(
                        "http://localhost:8080/api/mentor-bookings",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    bookingData
                                )
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    throw new Error(
                        errorText ||
                        "Failed to book session"
                    );

                }


                const savedBooking =
                    await response.json();


                // =================================================
                // LOCAL BOOKINGS
                // =================================================

                const existingBookings =
                    JSON.parse(
                        localStorage.getItem(
                            "bookings"
                        ) || "[]"
                    );


                existingBookings.push(
                    savedBooking
                );


                localStorage.setItem(
                    "bookings",
                    JSON.stringify(
                        existingBookings
                    )
                );


                // =================================================
                // MENTOR REQUESTS
                // =================================================

                const mentorRequestKey =
                    `mentorRequests_${mentor.id}`;


                const mentorRequests =
                    JSON.parse(
                        localStorage.getItem(
                            mentorRequestKey
                        ) || "[]"
                    );


                mentorRequests.push(
                    savedBooking
                );


                localStorage.setItem(
                    mentorRequestKey,
                    JSON.stringify(
                        mentorRequests
                    )
                );


                navigate(
                    "/booking-success",
                    {
                        state: {
                            booking:
                                savedBooking
                        }
                    }
                );


            } catch (error) {

                console.error(
                    "Error booking session:",
                    error
                );


                alert(
                    error.message ||
                    "Failed to book session. Please try again."
                );

            }

        };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <>
                <Navbar />

                <div className="book-session-page">

                    <div className="loading-container">

                        <p>
                            Loading mentor details...
                        </p>

                    </div>

                </div>
            </>

        );

    }


    // ============================================================
    // MENTOR NOT FOUND
    // ============================================================

    if (!mentor) {

        return (

            <>
                <Navbar />

                <div className="book-session-page">

                    <div className="error-container">

                        <h2>
                            Mentor Not Found
                        </h2>

                        <p>
                            We couldn't find the
                            requested mentor.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/mentors"
                                )
                            }
                        >
                            Back to Mentors
                        </button>

                    </div>

                </div>
            </>

        );

    }


    // ============================================================
    // PAGE
    // ============================================================

    return (

        <>
            <Navbar />


            <div className="book-session-page">


                {/* =================================================
                    MENTOR HEADER
                ================================================= */}

                <div className="mentor-header">

                    <div className="mentor-header-content">

                        <div className="mentor-avatar">

                            {mentor.name
                                ? mentor.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "M"}

                        </div>


                        <div className="mentor-header-info">

                            <h1>
                                {mentor.name}
                            </h1>

                            <p>
                                {mentor.role}
                            </p>

                            {mentor.experience && (

                                <span>
                                    {mentor.experience}
                                </span>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="book-session-content">


                    {/* =================================================
                        ABOUT
                    ================================================= */}

                    <section className="mentor-about-section">

                        <h2>
                            About the Mentor
                        </h2>

                        <p>
                            {mentor.about ||
                                "No description available."}
                        </p>


                        {mentor.skills &&
                            mentor.skills.length > 0 && (

                                <div className="mentor-skills">

                                    <h3>
                                        Skills
                                    </h3>

                                    <div className="skills-list">

                                        {mentor.skills.map(
                                            (
                                                skill,
                                                index
                                            ) => (

                                                <span
                                                    key={
                                                        index
                                                    }
                                                    className="skill-tag"
                                                >
                                                    {skill}
                                                </span>

                                            )
                                        )}

                                    </div>

                                </div>

                            )}

                    </section>


                    {/* =================================================
                        SESSION
                    ================================================= */}

                    {mentorSession && (

                        <section className="session-details-section">

                            <h2>
                                Session Details
                            </h2>


                            <div className="session-details-card">

                                <h3>
                                    {
                                        mentorSession.title ||
                                        mentorSession.sessionTitle ||
                                        "Learning Session"
                                    }
                                </h3>


                                {mentorSession.skill && (

                                    <p>

                                        <strong>
                                            Skill:
                                        </strong>{" "}

                                        {
                                            mentorSession.skill
                                        }

                                    </p>

                                )}


                                {mentorSession.slot && (

                                    <p>

                                        <strong>
                                            Slot:
                                        </strong>{" "}

                                        {
                                            mentorSession.slot
                                        }

                                    </p>

                                )}


                                {mentorSession.duration && (

                                    <p>

                                        <strong>
                                            Duration:
                                        </strong>{" "}

                                        {
                                            mentorSession.duration
                                        }

                                    </p>

                                )}


                                {mentorSession.mode && (

                                    <p>

                                        <strong>
                                            Mode:
                                        </strong>{" "}

                                        {
                                            mentorSession.mode
                                        }

                                    </p>

                                )}

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        STUDENT REVIEWS
                    ================================================= */}

                    <section className="student-reviews-section">

                        <div className="reviews-header">

                            <div>

                                <h2>
                                    Student Reviews
                                </h2>


                                {reviews.length > 0 && (

                                    <div className="reviews-summary">

                                        <span className="average-rating">

                                            ⭐{" "}

                                            {
                                                averageRating
                                            }

                                        </span>


                                        <span className="review-count">

                                            {
                                                reviews.length
                                            }{" "}

                                            {
                                                reviews.length === 1
                                                    ? "review"
                                                    : "reviews"
                                            }

                                        </span>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {reviewsLoading && (

                            <div className="reviews-loading">

                                <p>
                                    Loading student reviews...
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            NO REVIEWS
                        ================================================= */}

                        {!reviewsLoading &&
                            reviews.length === 0 && (

                                <div className="no-reviews">

                                    <div className="no-reviews-stars">
                                        ⭐⭐⭐⭐⭐
                                    </div>

                                    <p>
                                        No reviews yet.
                                        Be the first learner
                                        to review this mentor.
                                    </p>

                                </div>

                            )}


                        {/* =================================================
                            REVIEWS
                        ================================================= */}

                        {!reviewsLoading &&
                            reviews.length > 0 && (

                                <div className="reviews-list">

                                    {reviews.map(
                                        (review) => (

                                            <div
                                                className="review-card"
                                                key={
                                                    review.id
                                                }
                                            >

                                                <div className="review-card-header">

                                                    <div className="review-student">

                                                        <div className="student-avatar">

                                                            {(
                                                                review.studentName ||
                                                                "Student"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}

                                                        </div>


                                                        <div>

                                                            <h3>
                                                                {
                                                                    review.studentName ||
                                                                    "Student"
                                                                }
                                                            </h3>


                                                            <p>
                                                                {
                                                                    formatReviewDate(
                                                                        review.submittedAt
                                                                    )
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <div className="review-rating">

                                                        {
                                                            renderReviewStars(
                                                                review.rating
                                                            )
                                                        }

                                                    </div>

                                                </div>


                                                <div className="review-content">

                                                    <p>
                                                        {
                                                            review.feedback ||
                                                            "No written feedback provided."
                                                        }
                                                    </p>

                                                </div>


                                                <div className="review-meta">

                                                    <span>

                                                        Skill:{" "}

                                                        {
                                                            review.skill ||
                                                            "Not specified"
                                                        }

                                                    </span>


                                                    <span>

                                                        Session:{" "}

                                                        {
                                                            review.sessionTitle ||
                                                            "Mentoring Session"
                                                        }

                                                    </span>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                    </section>


                    {/* =================================================
                        BOOK BUTTON
                    ================================================= */}

                    <section className="book-session-action">

                        <button
                            className="book-session-button"
                            onClick={
                                handleBookSession
                            }
                        >
                            📅 Book Session
                        </button>

                    </section>


                </div>

            </div>

        </>

    );

}

export default BookSession;