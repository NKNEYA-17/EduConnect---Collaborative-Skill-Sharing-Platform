
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import "../styles/MentorDashboard.css";

function MentorDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [profileExists, setProfileExists] =
        useState(false);

    const [applicationStatus, setApplicationStatus] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    // =========================================
    // CHECK MENTOR APPLICATION + PROFILE
    // =========================================

    useEffect(() => {

        const checkMentorStatus = async () => {

            if (!user?.id) {

                setLoading(false);

                return;
            }

            try {

                // =====================================
                // CHECK MENTOR APPLICATION
                // =====================================

                const applicationResponse =
                    await fetch(
                        "http://localhost:8080/api/mentor-applications"
                    );

                if (applicationResponse.ok) {

                    const applications =
                        await applicationResponse.json();

                    const myApplication =
                        applications.find(
                            (application) =>
                                application.userId === user.id ||
                                application.email === user.email
                        );

                    if (myApplication) {

                        setApplicationStatus(
                            myApplication.status || ""
                        );

                    }

                }

                // =====================================
                // CHECK MENTOR PROFILE
                // =====================================

                const profileResponse =
                    await fetch(
                        `http://localhost:8080/api/mentor-profiles/user/${user.id}`
                    );

                if (profileResponse.ok) {

                    setProfileExists(true);

                } else if (
                    profileResponse.status === 404
                ) {

                    setProfileExists(false);

                }

            } catch (error) {

                console.error(
                    "Error checking mentor status:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        checkMentorStatus();

    }, [user?.id, user?.email]);


    // =========================================
    // OPEN PROFILE
    // =========================================

    const handleProfileClick = () => {

        navigate(
            "/my-mentor-profile"
        );

    };


    // =========================================
    // MAIN UI
    // =========================================

    return (
        <>
            <Navbar />

            <div className="mentor-dashboard">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="dashboard-header">

                    <h1>
                        Welcome,{" "}
                        {user?.name || "Mentor"} 👋
                    </h1>

                    <p>
                        Share your knowledge and guide
                        learners with EduConnect
                    </p>

                </div>


                {/* =================================
                    APPROVED MENTOR BANNER
                ================================= */}

                {!loading &&
                    applicationStatus === "APPROVED" &&
                    !profileExists && (

                        <div className="approval-banner">

                            <h2>
                                🎉 Your mentor account is approved!
                            </h2>

                            <p>
                                Complete your mentor profile
                                so learners can discover you,
                                view your expertise and book
                                mentoring sessions with you.
                            </p>

                            <button
                                onClick={
                                    handleProfileClick
                                }
                            >
                                Complete Mentor Profile
                            </button>

                        </div>

                    )}


                {/* =================================
                    DASHBOARD CARDS
                ================================= */}

                <div className="mentor-cards">


                    {/* =================================
                        MY PROFILE
                    ================================= */}

                    <div className="mentor-card">

                        <h2>
                            👨‍🏫 My Mentor Profile
                        </h2>

                        <p>
                            Create and manage your public
                            mentor profile, expertise,
                            achievements, resources and
                            available sessions.
                        </p>

                        <button
                            onClick={
                                handleProfileClick
                            }
                        >

                            {profileExists
                                ? "View / Edit Profile"
                                : "Complete Profile"}

                        </button>

                    </div>


                    {/* =================================
                        SKILLS
                    ================================= */}

                    <div className="mentor-card">

                        <h2>
                            💡 Skills Offered
                        </h2>

                        <p>
                            Add and manage the skills
                            you teach to learners.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/mentor-skill-management"
                                )
                            }
                        >
                            Manage Skills
                        </button>

                    </div>


                    {/* =================================
                        SESSION MANAGEMENT
                    ================================= */}

                    <div className="mentor-card">

                        <h2>
                            🗓️ Session Management
                        </h2>

                        <p>
                            Create and manage your mentoring
                            sessions, time slots, materials,
                            meeting links and learner
                            communication.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/mentor-session-management"
                                )
                            }
                        >
                            Manage Sessions
                        </button>

                    </div>


                    {/* =================================
                        UPCOMING SESSIONS
                    ================================= */}

                    <div className="mentor-card">

                        <h2>
                            📅 Upcoming Sessions
                        </h2>

                        <p>
                            View your upcoming mentoring
                            sessions and bookings.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/mentor-bookings"
                                )
                            }
                        >
                            View Sessions
                        </button>

                    </div>


                    {/* =================================
                        REVIEWS
                    ================================= */}

                    <div className="mentor-card">

                        <h2>
                            ⭐ Student Reviews
                        </h2>

                        <p>
                            Check feedback and ratings
                            from your learners.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/mentor-reviews"
                                )
                            }
                        >
                            View Reviews
                        </button>

                    </div>


                    {/* =================================
                        BOOKING REQUESTS
                    ================================= */}

                    <div className="mentor-card">

                        <h2>
                            📩 Booking Requests
                        </h2>

                        <p>
                            View booking requests from
                            students and accept or reject
                            their session requests.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/mentor-booking-requests"
                                )
                            }
                        >
                            View Booking Requests
                        </button>

                    </div>


                </div>

            </div>
        </>
    );
}

export default MentorDashboard;

