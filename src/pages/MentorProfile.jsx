
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import "../styles/MentorProfile.css";

import mentorData from "../data/mentorData";

function MentorProfile() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [mentor, setMentor] = useState(null);

    const [loading, setLoading] = useState(true);

    // =========================================
    // STUDENT REVIEWS
    // =========================================

    const [studentReviews, setStudentReviews] = useState([]);

    const [reviewsLoading, setReviewsLoading] = useState(true);


    // =========================================
    // CLEAN PROFILE ID
    // =========================================

    const profileId =
        id && id.startsWith("db-")
            ? id.substring(3)
            : id;


    // =========================================
    // GET INITIALS
    // =========================================

    const getInitials = (name) => {

        if (!name) {
            return "ME";
        }

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (word) =>
                    word[0].toUpperCase()
            )
            .join("");
    };


    // =========================================
    // CONVERT BACKEND DATA
    // TO FRONTEND FORMAT
    // =========================================

    const convertBackendMentor = (data) => {

        return {

            id: data.id,

            userId:
                data.userId || "",

            name:
                data.name ||
                "EduConnect Mentor",

            email:
                data.email || "",

            phone:
                data.phone || "",

            initials:
                getInitials(data.name),

            role:
                data.role ||
                "EduConnect Mentor",

            category:
                data.category ||
                "Programming",

            experience:
                data.experience ||
                "Not specified",

            skills:
                Array.isArray(data.skills)
                    ? data.skills
                    : [],

            about:
                data.about ||
                "No description available.",

            achievements:
                Array.isArray(data.achievements)
                    ? data.achievements
                    : [],

            resources:
                Array.isArray(data.resources)
                    ? data.resources
                    : [],

            slots:
                Array.isArray(data.slots)
                    ? data.slots
                    : [],

            /*
             * IMPORTANT:
             *
             * Do NOT use data.reviews here for
             * actual student feedback.
             *
             * Real reviews come from:
             *
             * /api/feedback/mentor/{mentorId}
             */

            reviews:
                Array.isArray(data.reviews)
                    ? data.reviews
                    : [],

            rating:
                data.rating !== undefined &&
                data.rating !== null
                    ? data.rating
                    : 0,

            students:
                data.students !== undefined &&
                data.students !== null
                    ? `${data.students} Students`
                    : "0 Students",

            status:
                data.status ||
                "Available",

            profileCompleted:
                data.profileCompleted === true

        };
    };


    // =========================================
    // LOAD MENTOR
    // =========================================

    useEffect(() => {

        const fetchMentor = async () => {

            setLoading(true);

            setMentor(null);

            try {

                console.log(
                    "================================="
                );

                console.log(
                    "Opening mentor profile"
                );

                console.log(
                    "Original URL ID:",
                    id
                );

                console.log(
                    "Clean profile ID:",
                    profileId
                );

                console.log(
                    "================================="
                );


                // =====================================
                // STEP 1
                // CHECK EXISTING STATIC MENTORS
                // =====================================

                const staticMentor =
                    mentorData.find(
                        (m) =>
                            String(m.id) ===
                            String(profileId)
                    );


                // =====================================
                // STATIC MENTOR FOUND
                // =====================================

                if (staticMentor) {

                    console.log(
                        "Static mentor found:",
                        staticMentor
                    );

                    setMentor({

                        ...staticMentor,

                        initials:
                            staticMentor.initials ||
                            getInitials(
                                staticMentor.name
                            )

                    });

                    return;
                }


                // =====================================
                // STEP 2
                // MONGODB MENTOR
                // =====================================

                console.log(
                    "Static mentor not found."
                );

                console.log(
                    "Fetching mentor from MongoDB..."
                );

                console.log(
                    "API URL:",
                    `http://localhost:8080/api/mentor-profiles/${profileId}`
                );


                const response =
                    await fetch(
                        `http://localhost:8080/api/mentor-profiles/${profileId}`
                    );


                // =====================================
                // BACKEND SUCCESS
                // =====================================

                if (response.ok) {

                    const data =
                        await response.json();

                    console.log(
                        "MongoDB mentor profile:",
                        data
                    );


                    // =================================
                    // CHECK PROFILE COMPLETION
                    // =================================

                    if (
                        data.profileCompleted !== true
                    ) {

                        console.warn(
                            "Mentor profile exists but is not completed."
                        );

                        setMentor(null);

                        return;
                    }


                    // =================================
                    // CONVERT BACKEND DATA
                    // =================================

                    const convertedMentor =
                        convertBackendMentor(data);


                    console.log(
                        "Converted mentor:",
                        convertedMentor
                    );


                    setMentor(
                        convertedMentor
                    );

                    return;
                }


                // =====================================
                // BACKEND ERROR
                // =====================================

                console.error(
                    "Backend returned status:",
                    response.status
                );


                // =====================================
                // TRY STATIC DATA ONE MORE TIME
                // =====================================

                const fallbackStaticMentor =
                    mentorData.find(
                        (m) =>
                            String(m.id) ===
                            String(profileId)
                    );


                if (fallbackStaticMentor) {

                    setMentor({

                        ...fallbackStaticMentor,

                        initials:
                            fallbackStaticMentor.initials ||
                            getInitials(
                                fallbackStaticMentor.name
                            )

                    });

                    return;
                }


                setMentor(null);

            } catch (error) {

                console.error(
                    "Error loading mentor profile:",
                    error
                );


                // =====================================
                // FALLBACK TO STATIC DATA
                // =====================================

                const staticMentor =
                    mentorData.find(
                        (m) =>
                            String(m.id) ===
                            String(profileId)
                    );


                if (staticMentor) {

                    setMentor({

                        ...staticMentor,

                        initials:
                            staticMentor.initials ||
                            getInitials(
                                staticMentor.name
                            )

                    });

                } else {

                    setMentor(null);

                }

            } finally {

                setLoading(false);

            }
        };


        fetchMentor();

    }, [id, profileId]);


    // =========================================
    // LOAD REAL STUDENT REVIEWS
    // =========================================

    useEffect(() => {

        const fetchStudentReviews = async () => {

            // Wait until mentor profile is loaded
            if (!mentor?.id) {
                return;
            }

            try {

                setReviewsLoading(true);

                console.log(
                    "================================="
                );

                console.log(
                    "Loading student reviews"
                );

                console.log(
                    "Mentor ID:",
                    mentor.id
                );

                console.log(
                    "Reviews API:",
                    `http://localhost:8080/api/feedback/mentor/${mentor.id}`
                );


                const response =
                    await fetch(
                        `http://localhost:8080/api/feedback/mentor/${mentor.id}`
                    );


                if (!response.ok) {

                    throw new Error(
                        `Unable to fetch reviews. Status: ${response.status}`
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Student reviews received:",
                    data
                );


                if (Array.isArray(data)) {

                    setStudentReviews(data);

                } else {

                    setStudentReviews([]);

                }

            } catch (error) {

                console.error(
                    "Error loading student reviews:",
                    error
                );

                setStudentReviews([]);

            } finally {

                setReviewsLoading(false);

            }

        };


        fetchStudentReviews();

    }, [mentor?.id]);


    // =========================================
    // CALCULATE AVERAGE RATING
    // =========================================

    const averageRating =
        studentReviews.length > 0
            ? (
                studentReviews.reduce(
                    (total, review) =>
                        total +
                        Number(
                            review.rating || 0
                        ),
                    0
                ) / studentReviews.length
            ).toFixed(1)
            : "0.0";


    // =========================================
    // FORMAT REVIEW DATE
    // =========================================

    const formatReviewDate = (date) => {

        if (!date) {
            return "Date not available";
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

            return "Date not available";

        }
    };


    // =========================================
    // RENDER STARS
    // =========================================

    const renderStars = (rating) => {

        const numericRating =
            Number(rating) || 0;

        return (

            <span className="review-stars">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <span
                            key={star}
                            className={
                                star <= numericRating
                                    ? "star-filled"
                                    : "star-empty"
                            }
                        >
                            ★
                        </span>

                    )
                )}

            </span>

        );
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div
                    style={{
                        color: "white",
                        textAlign: "center",
                        paddingTop: "100px",
                        fontSize: "22px"
                    }}
                >
                    Loading mentor profile...
                </div>
            </>
        );
    }


    // =========================================
    // MENTOR NOT FOUND
    // =========================================

    if (!mentor) {

        return (
            <>
                <Navbar />

                <div
                    style={{
                        color: "white",
                        textAlign: "center",
                        paddingTop: "100px"
                    }}
                >

                    <h2>
                        Mentor Not Found
                    </h2>

                    <p>
                        This mentor profile could not
                        be loaded.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/mentors")
                        }
                    >
                        Back to Mentors
                    </button>

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

            <div className="mentor-profile">


                {/* =================================
                    HERO
                ================================= */}

                <div className="profile-hero">

                    <div className="profile-avatar">

                        {mentor.initials ||
                            getInitials(
                                mentor.name
                            )}

                    </div>


                    <div className="profile-details">

                        <h1>
                            {mentor.name}
                        </h1>

                        <h3>
                            {mentor.role}
                        </h3>


                        <div className="profile-info">

                            <span>
                                ⭐ {
                                    studentReviews.length > 0
                                        ? averageRating
                                        : mentor.rating
                                }
                            </span>

                            <span>
                                👨‍🎓 {
                                    studentReviews.length > 0
                                        ? `${studentReviews.length} Reviews`
                                        : mentor.students
                                }
                            </span>

                            <span>
                                💼 {mentor.experience}
                            </span>

                        </div>


                        {/* CATEGORY */}

                        {mentor.category && (

                            <div
                                style={{
                                    marginTop: "10px"
                                }}
                            >
                                📚 {mentor.category}
                            </div>

                        )}


                        {/* STATUS */}

                        <div
                            style={{
                                marginTop: "10px"
                            }}
                        >

                            {mentor.status ===
                            "Available" ? (

                                <span>
                                    🟢 Available
                                </span>

                            ) : (

                                <span>
                                    🔴 Busy
                                </span>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================
                    ABOUT
                ================================= */}

                <section>

                    <h2>
                        About
                    </h2>

                    <p>
                        {mentor.about ||
                            "No description available."}
                    </p>

                </section>


                {/* =================================
                    SKILLS
                ================================= */}

                <section>

                    <h2>
                        Skills
                    </h2>

                    <div className="skill-list">

                        {mentor.skills &&
                        mentor.skills.length > 0 ? (

                            mentor.skills.map(
                                (
                                    skill,
                                    index
                                ) => (

                                    <span
                                        key={index}
                                        className="skill-chip"
                                    >
                                        {skill}
                                    </span>

                                )
                            )

                        ) : (

                            <p>
                                No skills added.
                            </p>

                        )}

                    </div>

                </section>


                {/* =================================
                    ACHIEVEMENTS
                ================================= */}

                <section>

                    <h2>
                        Achievements
                    </h2>

                    <ul>

                        {mentor.achievements &&
                        mentor.achievements.length >
                            0 ? (

                            mentor.achievements.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <li
                                        key={index}
                                    >
                                        {item}
                                    </li>

                                )
                            )

                        ) : (

                            <li>
                                No achievements added yet.
                            </li>

                        )}

                    </ul>

                </section>


                {/* =================================
                    RESOURCES
                ================================= */}

                <section>

                    <h2>
                        Resources
                    </h2>

                    <ul>

                        {mentor.resources &&
                        mentor.resources.length >
                            0 ? (

                            mentor.resources.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <li
                                        key={index}
                                    >
                                        📄 {item}
                                    </li>

                                )
                            )

                        ) : (

                            <li>
                                No resources added yet.
                            </li>

                        )}

                    </ul>

                </section>


                {/* =================================
                    AVAILABLE SLOTS
                ================================= */}

                <section>

                    <h2>
                        Available Slots
                    </h2>

                    <div className="slot-list">

                        {mentor.slots &&
                        mentor.slots.length > 0 ? (

                            mentor.slots.map(
                                (
                                    slot,
                                    index
                                ) => (

                                    <div
                                        key={index}
                                        className="slot-card"
                                    >
                                        {slot}
                                    </div>

                                )
                            )

                        ) : (

                            <p>
                                No available slots currently.
                            </p>

                        )}

                    </div>

                </section>


                {/* =================================
                    STUDENT REVIEWS
                ================================= */}

                <section>

                    <h2>
                        Student Reviews
                    </h2>


                    {/* =================================
                        REVIEW SUMMARY
                    ================================= */}

                    <div className="review-summary">

                        <div className="average-rating">

                            <div className="average-number">
                                ⭐ {averageRating}
                            </div>

                            <div>
                                Average Rating
                            </div>

                        </div>


                        <div className="review-count">

                            <div className="review-count-number">
                                {studentReviews.length}
                            </div>

                            <div>
                                Student Reviews
                            </div>

                        </div>

                    </div>


                    {/* =================================
                        REVIEW LIST
                    ================================= */}

                    <div className="review-list">

                        {reviewsLoading ? (

                            <div className="review-card">

                                <p>
                                    Loading student reviews...
                                </p>

                            </div>

                        ) : studentReviews.length > 0 ? (

                            studentReviews.map(
                                (review, index) => (

                                    <div
                                        key={
                                            review.id ||
                                            index
                                        }
                                        className="review-card"
                                    >

                                        {/* REVIEW HEADER */}

                                        <div className="review-header">

                                            <div className="student-avatar">

                                                {getInitials(
                                                    review.studentName
                                                )}

                                            </div>


                                            <div className="student-details">

                                                <strong>
                                                    {
                                                        review.studentName ||
                                                        "Anonymous Student"
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        formatReviewDate(
                                                            review.submittedAt
                                                        )
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        {/* RATING */}

                                        <div className="review-rating">

                                            {renderStars(
                                                review.rating
                                            )}

                                            <span>
                                                {
                                                    review.rating
                                                }/5
                                            </span>

                                        </div>


                                        {/* REVIEW TEXT */}

                                        <p className="review-text">

                                            {
                                                review.feedback ||
                                                "No written feedback provided."
                                            }

                                        </p>


                                        {/* SESSION / SKILL */}

                                        {(review.skill ||
                                            review.sessionTitle) && (

                                            <div className="review-meta">

                                                {review.skill && (

                                                    <span>
                                                        📚 {review.skill}
                                                    </span>

                                                )}

                                                {review.sessionTitle && (

                                                    <span>
                                                        🎓 {
                                                            review.sessionTitle
                                                        }
                                                    </span>

                                                )}

                                            </div>

                                        )}

                                    </div>

                                )
                            )

                        ) : (

                            <div className="review-card">

                                <div className="review-rating">

                                    {renderStars(0)}

                                </div>

                                <p>
                                    No student reviews yet.
                                </p>

                                <p>
                                    Be the first learner
                                    to review this mentor
                                    after completing a session.
                                </p>

                            </div>

                        )}

                    </div>

                </section>


                {/* =================================
                    BOOK SESSION
                ================================= */}

                <div className="book-section">

                    <button
                        className="book-session-btn"
                        onClick={() =>
                            navigate(
                                `/book/${mentor.id}`
                            )
                        }
                    >
                        📅 Book Session
                    </button>

                </div>


            </div>
        </>
    );
}

export default MentorProfile;
