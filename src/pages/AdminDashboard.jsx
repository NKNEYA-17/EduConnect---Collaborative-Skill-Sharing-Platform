import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================================
    // REJECTION MODAL
    // =========================================

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [rejectionReason, setRejectionReason] = useState("");
    const [improvementSuggestion, setImprovementSuggestion] = useState("");

    const [rejecting, setRejecting] = useState(false);

    // =========================================
    // LOAD PENDING APPLICATIONS
    // =========================================

    const loadApplications = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:8080/api/mentor-applications/pending"
            );

            if (!response.ok) {
                throw new Error("Failed to load applications");
            }

            const data = await response.json();

            setApplications(data);

        } catch (error) {

            console.error(
                "Error loading applications:",
                error
            );

            alert("Unable to load mentor applications.");

        } finally {

            setLoading(false);

        }
    };

    // =========================================
    // LOAD WHEN PAGE OPENS
    // =========================================

    useEffect(() => {

        loadApplications();

    }, []);

    // =========================================
    // APPROVE APPLICATION
    // =========================================

    const approveApplication = async (application) => {

        const confirmApproval = window.confirm(
            `Are you sure you want to approve ${application.fullName}?`
        );

        if (!confirmApproval) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/mentor-applications/approve/${application.id}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Approval failed");
            }

            // =====================================
            // UPDATE USER MENTOR STATUS
            // =====================================

            try {

                const userResponse = await fetch(
                    `http://localhost:8080/api/users/${application.userId}`
                );

                if (userResponse.ok) {

                    const user = await userResponse.json();

                    await fetch(
                        `http://localhost:8080/api/users/${application.userId}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                ...user,
                                mentorStatus: "APPROVED"
                            })
                        }
                    );
                }

            } catch (userError) {

                console.error(
                    "User status update failed:",
                    userError
                );
            }

            alert(
                `${application.fullName}'s mentor application has been APPROVED.`
            );

            loadApplications();

        } catch (error) {

            console.error(error);

            alert("Unable to approve application.");
        }
    };

    // =========================================
    // OPEN REJECTION MODAL
    // =========================================

    const openRejectModal = (application) => {

        setSelectedApplication(application);

        setRejectionReason("");

        setImprovementSuggestion("");

        setShowRejectModal(true);
    };

    // =========================================
    // CLOSE REJECTION MODAL
    // =========================================

    const closeRejectModal = () => {

        if (rejecting) {
            return;
        }

        setShowRejectModal(false);

        setSelectedApplication(null);

        setRejectionReason("");

        setImprovementSuggestion("");
    };

    // =========================================
    // REJECT APPLICATION
    // =========================================

    const rejectApplication = async () => {

        if (!selectedApplication) {
            return;
        }

        if (!rejectionReason.trim()) {

            alert(
                "Please provide a reason for rejection."
            );

            return;
        }

        if (!improvementSuggestion.trim()) {

            alert(
                "Please provide improvement suggestions."
            );

            return;
        }

        try {

            setRejecting(true);

            const response = await fetch(
                `http://localhost:8080/api/mentor-applications/reject/${selectedApplication.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        rejectionReason:
                            rejectionReason.trim(),

                        improvementSuggestion:
                            improvementSuggestion.trim()
                    })
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Rejection failed"
                );
            }

            // =====================================
            // UPDATE USER MENTOR STATUS
            // =====================================

            try {

                const userResponse = await fetch(
                    `http://localhost:8080/api/users/${selectedApplication.userId}`
                );

                if (userResponse.ok) {

                    const user =
                        await userResponse.json();

                    await fetch(
                        `http://localhost:8080/api/users/${selectedApplication.userId}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body: JSON.stringify({
                                ...user,
                                mentorStatus: "REJECTED"
                            })
                        }
                    );
                }

            } catch (userError) {

                console.error(
                    "User status update failed:",
                    userError
                );
            }

            alert(
                `${selectedApplication.fullName}'s mentor application has been REJECTED.`
            );

            closeRejectModal();

            loadApplications();

        } catch (error) {

            console.error(
                "Rejection error:",
                error
            );

            alert(
                "Unable to reject application."
            );

        } finally {

            setRejecting(false);
        }
    };

    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("admin");

        navigate("/login");
    };

    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="admin-dashboard">

            {/* =====================================
                HEADER
            ====================================== */}

            <div className="admin-header">

                <div>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Review and manage mentor applications
                    </p>

                </div>

                <div className="admin-header-buttons">

                    <button
                        className="refresh-btn"
                        onClick={loadApplications}
                    >
                        ↻ Refresh
                    </button>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* =====================================
                STATISTICS
            ====================================== */}

            <div className="admin-stats">

                <div className="stat-card">

                    <div className="stat-icon">
                        📋
                    </div>

                    <div>

                        <h2>
                            {applications.length}
                        </h2>

                        <p>
                            Pending Applications
                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================
                APPLICATION SECTION
            ====================================== */}

            <div className="applications-section">

                <h2>
                    Mentor Applications
                </h2>


                {loading ? (

                    <div className="loading-message">
                        Loading applications...
                    </div>

                ) : applications.length === 0 ? (

                    <div className="empty-message">

                        <div className="empty-icon">
                            🎉
                        </div>

                        <h3>
                            No Pending Applications
                        </h3>

                        <p>
                            There are currently no mentor
                            applications waiting for approval.
                        </p>

                    </div>

                ) : (

                    <div className="application-grid">

                        {applications.map((application) => (

                            <div
                                className="application-card"
                                key={application.id}
                            >

                                {/* ==========================
                                    CARD HEADER
                                =========================== */}

                                <div className="application-header">

                                    <div className="applicant-avatar">

                                        {application.fullName
                                            ? application.fullName
                                                .charAt(0)
                                                .toUpperCase()
                                            : "M"}

                                    </div>

                                    <div className="applicant-info">

                                        <h3>
                                            {application.fullName}
                                        </h3>

                                        <p>
                                            {application.email}
                                        </p>

                                    </div>

                                    <span className="pending-badge">
                                        PENDING
                                    </span>

                                </div>


                                {/* ==========================
                                    CONTACT
                                =========================== */}

                                <div className="application-details">

                                    <div className="detail-item">

                                        <span className="detail-label">
                                            📱 Phone
                                        </span>

                                        <span className="detail-value">
                                            {application.phone || "-"}
                                        </span>

                                    </div>


                                    <div className="detail-item">

                                        <span className="detail-label">
                                            📍 Location
                                        </span>

                                        <span className="detail-value">
                                            {application.city || "-"},
                                            {" "}
                                            {application.country || "-"}
                                        </span>

                                    </div>


                                    {/* EDUCATION */}

                                    <div className="detail-item">

                                        <span className="detail-label">
                                            🎓 Degree
                                        </span>

                                        <span className="detail-value">
                                            {application.degree || "-"}
                                        </span>

                                    </div>


                                    <div className="detail-item">

                                        <span className="detail-label">
                                            🏫 Department
                                        </span>

                                        <span className="detail-value">
                                            {application.department || "-"}
                                        </span>

                                    </div>


                                    <div className="detail-item">

                                        <span className="detail-label">
                                            🏛️ University
                                        </span>

                                        <span className="detail-value">
                                            {application.university || "-"}
                                        </span>

                                    </div>


                                    <div className="detail-item">

                                        <span className="detail-label">
                                            📅 Graduation
                                        </span>

                                        <span className="detail-value">
                                            {application.graduationYear || "-"}
                                        </span>

                                    </div>


                                    {/* EXPERIENCE */}

                                    <div className="detail-item">

                                        <span className="detail-label">
                                            💼 Profession
                                        </span>

                                        <span className="detail-value">
                                            {application.profession || "-"}
                                        </span>

                                    </div>


                                    <div className="detail-item">

                                        <span className="detail-label">
                                            ⏳ Experience
                                        </span>

                                        <span className="detail-value">
                                            {application.experience || "0"} Years
                                        </span>

                                    </div>


                                    {/* SKILLS */}

                                    <div className="skills-section">

                                        <span className="detail-label">
                                            🧠 Skills
                                        </span>

                                        <div className="skills-list">

                                            {application.skills &&
                                            application.skills.length > 0 ? (

                                                application.skills.map(
                                                    (skill, index) => (

                                                        <span
                                                            className="skill-tag"
                                                            key={index}
                                                        >
                                                            {skill}
                                                        </span>

                                                    )
                                                )

                                            ) : (

                                                <span>
                                                    No skills added
                                                </span>

                                            )}

                                        </div>

                                    </div>

                                </div>


                                {/* ==========================
                                    BIO
                                =========================== */}

                                {application.bio && (

                                    <div className="bio-section">

                                        <strong>
                                            About
                                        </strong>

                                        <p>
                                            {application.bio}
                                        </p>

                                    </div>

                                )}


                                {/* ==========================
                                    ACTION BUTTONS
                                =========================== */}

                                <div className="application-actions">

                                    <button
                                        className="approve-btn"
                                        onClick={() =>
                                            approveApplication(
                                                application
                                            )
                                        }
                                    >
                                        ✓ Approve
                                    </button>


                                    <button
                                        className="reject-btn"
                                        onClick={() =>
                                            openRejectModal(
                                                application
                                            )
                                        }
                                    >
                                        ✕ Reject
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* =========================================
                REJECTION MODAL
            ========================================= */}

            {showRejectModal && selectedApplication && (

                <div className="reject-modal-overlay">

                    <div className="reject-modal">

                        <div className="reject-modal-header">

                            <div>

                                <h2>
                                    Reject Mentor Application
                                </h2>

                                <p>
                                    {selectedApplication.fullName}
                                </p>

                            </div>

                            <button
                                className="reject-modal-close"
                                onClick={closeRejectModal}
                                disabled={rejecting}
                            >
                                ×
                            </button>

                        </div>


                        {/* REJECTION REASON */}

                        <div className="reject-form-group">

                            <label>
                                Reason for Rejection
                                <span>*</span>
                            </label>

                            <textarea
                                value={rejectionReason}
                                onChange={(event) =>
                                    setRejectionReason(
                                        event.target.value
                                    )
                                }
                                placeholder="Explain why this mentor application was rejected..."
                                rows="5"
                                disabled={rejecting}
                            />

                        </div>


                        {/* IMPROVEMENT */}

                        <div className="reject-form-group">

                            <label>
                                What Can the Applicant Improve?
                                <span>*</span>
                            </label>

                            <textarea
                                value={improvementSuggestion}
                                onChange={(event) =>
                                    setImprovementSuggestion(
                                        event.target.value
                                    )
                                }
                                placeholder="Tell the applicant what they should improve before applying again..."
                                rows="5"
                                disabled={rejecting}
                            />

                        </div>


                        {/* MODAL ACTIONS */}

                        <div className="reject-modal-actions">

                            <button
                                className="cancel-reject-btn"
                                onClick={closeRejectModal}
                                disabled={rejecting}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-reject-btn"
                                onClick={rejectApplication}
                                disabled={rejecting}
                            >
                                {rejecting
                                    ? "Rejecting..."
                                    : "Confirm Rejection"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminDashboard;

