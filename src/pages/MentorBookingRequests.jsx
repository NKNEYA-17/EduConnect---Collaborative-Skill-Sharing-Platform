
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import "../styles/MentorBookingRequests.css";

function MentorBookingRequests() {

    const navigate = useNavigate();


    // =========================================
    // LOGGED-IN USER
    // =========================================

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // =========================================
    // BOOKING REQUESTS
    // =========================================

    const [bookings, setBookings] =
        useState([]);


    // =========================================
    // MENTOR PROFILE
    // =========================================

    const [mentorProfile, setMentorProfile] =
        useState(null);


    // =========================================
    // LOADING
    // =========================================

    const [loading, setLoading] =
        useState(true);


    // =========================================
    // ERROR
    // =========================================

    const [error, setError] =
        useState("");


    // =========================================
    // PROCESSING BOOKING
    // =========================================

    const [processingId, setProcessingId] =
        useState(null);


    // =========================================
    // REJECT MODAL
    // =========================================

    const [showRejectBox, setShowRejectBox] =
        useState(false);


    const [selectedBooking, setSelectedBooking] =
        useState(null);


    const [rejectReason, setRejectReason] =
        useState("");


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        if (!user?.id) {

            setError(
                "Unable to identify the logged-in mentor."
            );

            setLoading(false);

            return;

        }


        loadMentorAndBookings();

    }, [user?.id]);


    // =========================================
    // LOAD MENTOR PROFILE + BOOKINGS
    // =========================================

    const loadMentorAndBookings = async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "Logged-in user:",
                user
            );


            // =====================================
            // STEP 1
            // GET MENTOR PROFILE USING USER ID
            // =====================================

            console.log(
                "Loading mentor profile for user:",
                user.id
            );


            const profileResponse =
                await fetch(
                    `http://localhost:8080/api/mentor-profiles/user/${user.id}`
                );


            if (!profileResponse.ok) {

                if (
                    profileResponse.status === 404
                ) {

                    throw new Error(
                        "Mentor profile not found. Please complete your mentor profile first."
                    );

                }


                throw new Error(
                    `Unable to load mentor profile. Status: ${profileResponse.status}`
                );

            }


            const profile =
                await profileResponse.json();


            console.log(
                "Mentor profile loaded:",
                profile
            );


            if (!profile?.id) {

                throw new Error(
                    "Mentor profile ID was not found."
                );

            }


            // =====================================
            // SAVE MENTOR PROFILE
            // =====================================

            setMentorProfile(
                profile
            );


            // =====================================
            // IMPORTANT
            // =====================================
            //
            // Booking documents contain:
            //
            // mentorId = mentor PROFILE id
            //
            // NOT necessarily:
            //
            // user.id
            //
            // Therefore we MUST use:
            //
            // profile.id
            //
            // =====================================

            const mentorId =
                String(profile.id);


            console.log(
                "Using mentor profile ID:",
                mentorId
            );


            // =====================================
            // STEP 2
            // GET PENDING BOOKINGS
            // =====================================

            const bookingResponse =
                await fetch(
                    `http://localhost:8080/api/mentor-bookings/mentor/${mentorId}/pending`
                );


            console.log(
                "Booking request response status:",
                bookingResponse.status
            );


            if (!bookingResponse.ok) {

                throw new Error(
                    `Failed to load booking requests. Status: ${bookingResponse.status}`
                );

            }


            const data =
                await bookingResponse.json();


            console.log(
                "Pending mentor booking requests:",
                data
            );


            if (Array.isArray(data)) {

                setBookings(
                    data
                );

            } else {

                setBookings([]);

            }

        } catch (err) {

            console.error(
                "Error loading mentor bookings:",
                err
            );


            setBookings([]);


            setError(
                err.message ||
                "Unable to load booking requests. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // REFRESH BOOKINGS
    // =========================================

    const fetchBookings = async () => {

        await loadMentorAndBookings();

    };


    // =========================================
    // ACCEPT BOOKING
    // =========================================

    const handleAccept = async (
        bookingId
    ) => {

        if (!bookingId) {

            alert(
                "Invalid booking request."
            );

            return;

        }


        try {

            setProcessingId(
                bookingId
            );


            console.log(
                "Accepting booking:",
                bookingId
            );


            const response =
                await fetch(
                    `http://localhost:8080/api/mentor-bookings/${bookingId}/accept`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            mentorResponse:
                                "Booking request accepted."
                        })
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();


                throw new Error(
                    errorText ||
                    `Unable to accept booking. Status: ${response.status}`
                );

            }


            const updatedBooking =
                await response.json();


            console.log(
                "Booking accepted:",
                updatedBooking
            );


            // =====================================
            // REMOVE FROM PENDING REQUESTS
            // =====================================

            setBookings(
                (previous) =>
                    previous.filter(
                        (booking) =>
                            String(
                                booking.id
                            ) !==
                            String(
                                bookingId
                            )
                    )
            );


            alert(
                "Booking request accepted successfully."
            );


        } catch (err) {

            console.error(
                "Accept booking error:",
                err
            );


            alert(
                err.message ||
                "Unable to accept booking. Please try again."
            );


        } finally {

            setProcessingId(
                null
            );

        }

    };


    // =========================================
    // OPEN REJECT BOX
    // =========================================

    const handleOpenReject = (
        booking
    ) => {

        setSelectedBooking(
            booking
        );


        setRejectReason("");


        setShowRejectBox(
            true
        );

    };


    // =========================================
    // CLOSE REJECT BOX
    // =========================================

    const handleCloseReject = () => {

        if (processingId) {

            return;

        }


        setShowRejectBox(
            false
        );


        setSelectedBooking(
            null
        );


        setRejectReason("");

    };


    // =========================================
    // REJECT BOOKING
    // =========================================

    const handleReject = async () => {

        if (!selectedBooking?.id) {

            alert(
                "Invalid booking request."
            );

            return;

        }


        const reason =
            rejectReason.trim();


        if (!reason) {

            alert(
                "Please enter a reason for rejecting this booking."
            );

            return;

        }


        try {

            setProcessingId(
                selectedBooking.id
            );


            console.log(
                "Rejecting booking:",
                selectedBooking.id
            );


            const response =
                await fetch(
                    `http://localhost:8080/api/mentor-bookings/${selectedBooking.id}/reject`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            mentorResponse:
                                reason

                        })

                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();


                throw new Error(
                    errorText ||
                    `Unable to reject booking. Status: ${response.status}`
                );

            }


            const updatedBooking =
                await response.json();


            console.log(
                "Booking rejected:",
                updatedBooking
            );


            // =====================================
            // REMOVE FROM PENDING LIST
            // =====================================

            setBookings(
                (previous) =>
                    previous.filter(
                        (booking) =>
                            String(
                                booking.id
                            ) !==
                            String(
                                selectedBooking.id
                            )
                    )
            );


            // =====================================
            // CLOSE MODAL
            // =====================================

            setShowRejectBox(
                false
            );


            setSelectedBooking(
                null
            );


            setRejectReason("");


            alert(
                "Booking request rejected successfully."
            );


        } catch (err) {

            console.error(
                "Reject booking error:",
                err
            );


            alert(
                err.message ||
                "Unable to reject booking. Please try again."
            );


        } finally {

            setProcessingId(
                null
            );

        }

    };


    // =========================================
    // LOADING SCREEN
    // =========================================

    if (loading) {

        return (

            <>

                <Navbar />


                <div className="mentor-booking-page">

                    <div className="booking-loading">

                        <div className="loading-spinner">
                            ⏳
                        </div>


                        <p>
                            Loading booking requests...
                        </p>

                    </div>

                </div>

            </>

        );

    }


    // =========================================
    // USER NOT FOUND
    // =========================================

    if (!user?.id) {

        return (

            <>

                <Navbar />


                <div className="mentor-booking-page">

                    <div className="booking-empty-card">

                        <h2>
                            Mentor Login Required
                        </h2>


                        <p>
                            Please login as a mentor
                            to view booking requests.
                        </p>


                        <button
                            className="back-dashboard-btn"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Back to Home
                        </button>

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


            <div className="mentor-booking-page">


                {/* =================================
                    PAGE HEADER
                ================================= */}

                <div className="booking-page-header">

                    <button
                        className="booking-back-btn"
                        onClick={() =>
                            navigate(
                                "/mentor-dashboard"
                            )
                        }
                    >
                        ← Back to Dashboard
                    </button>


                    <h1>
                        📚 Booking Requests
                    </h1>


                    <p>
                        Review and manage student
                        booking requests.
                    </p>


                    {/* =================================
                        REFRESH BUTTON
                    ================================= */}

                    <button
                        className="booking-back-btn"
                        onClick={
                            fetchBookings
                        }
                    >
                        🔄 Refresh Requests
                    </button>

                </div>


                {/* =================================
                    MENTOR PROFILE INFORMATION
                ================================= */}

                {mentorProfile && (

                    <div
                        style={{
                            marginBottom: "20px",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            background:
                                "rgba(99,102,241,0.12)",
                            color: "#c4b5fd"
                        }}
                    >

                        👨‍🏫 Mentor:
                        {" "}
                        <strong>
                            {mentorProfile.name ||
                                user.name ||
                                "Mentor"}
                        </strong>

                    </div>

                )}


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="booking-error">

                        ⚠️ {error}


                        <button
                            onClick={
                                fetchBookings
                            }
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =================================
                    NO BOOKINGS
                ================================= */}

                {!error &&
                    bookings.length === 0 && (

                        <div className="booking-empty-card">

                            <div className="empty-icon">
                                📭
                            </div>


                            <h2>
                                No Pending Requests
                            </h2>


                            <p>
                                You don't have any
                                pending student booking
                                requests right now.
                            </p>

                        </div>

                    )}


                {/* =================================
                    BOOKING REQUEST LIST
                ================================= */}

                {bookings.length > 0 && (

                    <div className="booking-list">

                        {bookings.map(
                            (booking) => {

                                const isProcessing =
                                    String(
                                        processingId
                                    ) ===
                                    String(
                                        booking.id
                                    );


                                return (

                                    <div
                                        className="booking-request-card"
                                        key={
                                            booking.id
                                        }
                                    >


                                        {/* =================================
                                            CARD HEADER
                                        ================================= */}

                                        <div className="booking-card-header">

                                            <div>

                                                <h2>
                                                    📚{" "}
                                                    {
                                                        booking.sessionTitle ||
                                                        "Mentoring Session"
                                                    }
                                                </h2>


                                                <span className="pending-badge">
                                                    🟡 PENDING
                                                </span>

                                            </div>

                                        </div>


                                        {/* =================================
                                            BOOKING INFORMATION
                                        ================================= */}

                                        <div className="booking-information">


                                            {/* STUDENT */}

                                            <div className="booking-info-item">

                                                <span className="info-label">
                                                    👨‍🎓 Student
                                                </span>


                                                <span className="info-value">
                                                    {
                                                        booking.studentName ||
                                                        "Student"
                                                    }
                                                </span>

                                            </div>


                                            {/* STUDENT EMAIL */}

                                            {booking.studentEmail && (

                                                <div className="booking-info-item">

                                                    <span className="info-label">
                                                        📧 Email
                                                    </span>


                                                    <span className="info-value">
                                                        {
                                                            booking.studentEmail
                                                        }
                                                    </span>

                                                </div>

                                            )}


                                            {/* SKILL */}

                                            {booking.skill && (

                                                <div className="booking-info-item">

                                                    <span className="info-label">
                                                        💡 Skill
                                                    </span>


                                                    <span className="info-value">
                                                        {
                                                            booking.skill
                                                        }
                                                    </span>

                                                </div>

                                            )}


                                            {/* SLOT */}

                                            <div className="booking-info-item">

                                                <span className="info-label">
                                                    🕐 Time Slot
                                                </span>


                                                <span className="info-value">
                                                    {
                                                        booking.slot ||
                                                        "Not specified"
                                                    }
                                                </span>

                                            </div>


                                            {/* DURATION */}

                                            {booking.duration && (

                                                <div className="booking-info-item">

                                                    <span className="info-label">
                                                        ⏱️ Duration
                                                    </span>


                                                    <span className="info-value">
                                                        {
                                                            booking.duration
                                                        }
                                                    </span>

                                                </div>

                                            )}


                                            {/* MODE */}

                                            {booking.mode && (

                                                <div className="booking-info-item">

                                                    <span className="info-label">
                                                        🌐 Mode
                                                    </span>


                                                    <span className="info-value">
                                                        {
                                                            booking.mode
                                                        }
                                                    </span>

                                                </div>

                                            )}


                                            {/* MAX STUDENTS */}

                                            {booking.maxStudents != null && (

                                                <div className="booking-info-item">

                                                    <span className="info-label">
                                                        👥 Maximum Students
                                                    </span>


                                                    <span className="info-value">
                                                        {
                                                            booking.maxStudents
                                                        }
                                                    </span>

                                                </div>

                                            )}


                                            {/* REQUESTED AT */}

                                            {booking.requestedAt && (

                                                <div className="booking-info-item">

                                                    <span className="info-label">
                                                        📅 Requested
                                                    </span>


                                                    <span className="info-value">

                                                        {new Date(
                                                            booking.requestedAt
                                                        ).toLocaleString()}

                                                    </span>

                                                </div>

                                            )}

                                        </div>


                                        {/* =================================
                                            ACTION BUTTONS
                                        ================================= */}

                                        <div className="booking-actions">

                                            <button
                                                className="accept-booking-btn"
                                                disabled={
                                                    isProcessing
                                                }
                                                onClick={() =>
                                                    handleAccept(
                                                        booking.id
                                                    )
                                                }
                                            >

                                                {isProcessing
                                                    ? "Processing..."
                                                    : "✅ Accept"}

                                            </button>


                                            <button
                                                className="reject-booking-btn"
                                                disabled={
                                                    isProcessing
                                                }
                                                onClick={() =>
                                                    handleOpenReject(
                                                        booking
                                                    )
                                                }
                                            >

                                                ❌ Reject

                                            </button>

                                        </div>

                                    </div>

                                );

                            }

                        )}

                    </div>

                )}

            </div>


            {/* =========================================
                REJECT MODAL
            ========================================= */}

            {showRejectBox && (

                <div className="reject-modal-overlay">

                    <div className="reject-modal">

                        <h2>
                            ❌ Reject Booking
                        </h2>


                        <p>
                            Please provide a reason
                            for rejecting this booking.
                        </p>


                        {selectedBooking && (

                            <div className="reject-booking-summary">

                                <strong>
                                    {
                                        selectedBooking.sessionTitle ||
                                        "Mentoring Session"
                                    }
                                </strong>


                                <span>
                                    Student:{" "}
                                    {
                                        selectedBooking.studentName ||
                                        "Student"
                                    }
                                </span>

                            </div>

                        )}


                        <textarea
                            value={
                                rejectReason
                            }
                            onChange={(e) =>
                                setRejectReason(
                                    e.target.value
                                )
                            }
                            placeholder="Example: This slot is no longer available. Please choose another time."
                            rows="5"
                            disabled={
                                !!processingId
                            }
                        />


                        <div className="reject-modal-actions">

                            <button
                                className="cancel-reject-btn"
                                onClick={
                                    handleCloseReject
                                }
                                disabled={
                                    !!processingId
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="confirm-reject-btn"
                                onClick={
                                    handleReject
                                }
                                disabled={
                                    !!processingId
                                }
                            >

                                {processingId
                                    ? "Rejecting..."
                                    : "❌ Reject Booking"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>

    );

}

export default MentorBookingRequests;

