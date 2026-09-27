import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBriefcase,
    FaGraduationCap,
    FaStar,
    FaArrowLeft,
    FaEdit,
    FaSave,
    FaTimes,
    FaPlus,
    FaBook,
    FaCalendarAlt,
} from "react-icons/fa";

import "../styles/MyMentorProfile.css";

function MyMentorProfile() {

    const navigate = useNavigate();

    // =========================================
    // GET LOGGED-IN USER
    // =========================================

    const storedUser = JSON.parse(
        localStorage.getItem("user")
    );

    // =========================================
    // STATE
    // =========================================

    const [profileId, setProfileId] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [profileData, setProfileData] = useState({
        name: storedUser?.name || "",
        email: storedUser?.email || "",
        phone: storedUser?.phone || "",

        role: "",

        experience: "",

        about: "",

        skills: [],

        achievements: [],

        resources: [],

        slots: [],
    });

    // =========================================
    // TEMP INPUT STATES
    // =========================================

    const [skillInput, setSkillInput] = useState("");

    const [achievementInput, setAchievementInput] =
        useState("");

    const [resourceInput, setResourceInput] =
        useState("");

    const [slotInput, setSlotInput] =
        useState("");

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
            .map((word) => word[0].toUpperCase())
            .join("");
    };

    // =========================================
    // LOAD MENTOR PROFILE
    // =========================================

    useEffect(() => {

        const fetchMentorProfile = async () => {

            if (!storedUser?.id) {

                console.error(
                    "User ID not found in localStorage."
                );

                setLoading(false);

                return;
            }

            try {

                setLoading(true);

                const response = await fetch(
                    `http://localhost:8080/api/mentor-profiles/user/${storedUser.id}`
                );

                // =====================================
                // PROFILE DOES NOT EXIST YET
                // =====================================

                if (response.status === 404) {

                    console.log(
                        "Mentor profile not created yet."
                    );

                    setIsEditing(true);

                    setProfileData({
                        name: storedUser?.name || "",
                        email: storedUser?.email || "",
                        phone: storedUser?.phone || "",

                        role: "",

                        experience: "",

                        about: "",

                        skills: [],

                        achievements: [],

                        resources: [],

                        slots: [],
                    });

                    return;
                }

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch mentor profile."
                    );
                }

                const data = await response.json();

                console.log(
                    "Mentor profile:",
                    data
                );

                setProfileId(
                    data.id
                );

                setProfileData({

                    name:
                        data.name ||
                        storedUser?.name ||
                        "",

                    email:
                        data.email ||
                        storedUser?.email ||
                        "",

                    phone:
                        data.phone ||
                        "",

                    role:
                        data.role ||
                        "",

                    experience:
                        data.experience ||
                        "",

                    about:
                        data.about ||
                        "",

                    skills:
                        Array.isArray(data.skills)
                            ? data.skills
                            : [],

                    achievements:
                        Array.isArray(
                            data.achievements
                        )
                            ? data.achievements
                            : [],

                    resources:
                        Array.isArray(
                            data.resources
                        )
                            ? data.resources
                            : [],

                    slots:
                        Array.isArray(data.slots)
                            ? data.slots
                            : [],
                });

                // Profile already exists
                setIsEditing(false);

            } catch (error) {

                console.error(
                    "Error loading mentor profile:",
                    error
                );

                // Do not show an alert.
     n          // Allow the page to finish loading normally.

            } finally {

                setLoading(false);

            }
        };

        fetchMentorProfile();

    }, []);

    // =========================================
    // HANDLE BASIC INPUT
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================================
    // ADD SKILL
    // =========================================

    const addSkill = () => {

        const value =
            skillInput.trim();

        if (!value) {
            return;
        }

        if (
            profileData.skills.includes(value)
        ) {

            setSkillInput("");

            return;
        }

        setProfileData((prev) => ({
            ...prev,

            skills: [
                ...prev.skills,
                value,
            ],
        }));

        setSkillInput("");
    };

    // =========================================
    // REMOVE SKILL
    // =========================================

    const removeSkill = (index) => {

        setProfileData((prev) => ({
            ...prev,

            skills: prev.skills.filter(
                (_, i) => i !== index
            ),
        }));
    };

    // =========================================
    // ADD ACHIEVEMENT
    // =========================================

    const addAchievement = () => {

        const value =
            achievementInput.trim();

        if (!value) {
            return;
        }

        setProfileData((prev) => ({
            ...prev,

            achievements: [
                ...prev.achievements,
                value,
            ],
        }));

        setAchievementInput("");
    };

    // =========================================
    // REMOVE ACHIEVEMENT
    // =========================================

    const removeAchievement = (index) => {

        setProfileData((prev) => ({
            ...prev,

            achievements:
                prev.achievements.filter(
                    (_, i) => i !== index
                ),
        }));
    };

    // =========================================
    // ADD RESOURCE
    // =========================================

    const addResource = () => {

        const value =
            resourceInput.trim();

        if (!value) {
            return;
        }

        setProfileData((prev) => ({
            ...prev,

            resources: [
                ...prev.resources,
                value,
            ],
        }));

        setResourceInput("");
    };

    // =========================================
    // REMOVE RESOURCE
    // =========================================

    const removeResource = (index) => {

        setProfileData((prev) => ({
            ...prev,

            resources:
                prev.resources.filter(
                    (_, i) => i !== index
                ),
        }));
    };

    // =========================================
    // ADD SLOT
    // =========================================

    const addSlot = () => {

        const value =
            slotInput.trim();

        if (!value) {
            return;
        }

        setProfileData((prev) => ({
            ...prev,

            slots: [
                ...prev.slots,
                value,
            ],
        }));

        setSlotInput("");
    };

    // =========================================
    // REMOVE SLOT
    // =========================================

    const removeSlot = (index) => {

        setProfileData((prev) => ({
            ...prev,

            slots:
                prev.slots.filter(
                    (_, i) => i !== index
                ),
        }));
    };

    // =========================================
    // SAVE PROFILE
    // =========================================

    const handleSave = async () => {

        if (!storedUser?.id) {

            alert(
                "User ID not found. Please login again."
            );

            return;
        }

        // =====================================
        // VALIDATION
        // =====================================

        if (!profileData.name.trim()) {

            alert("Please enter your name.");

            return;
        }

        if (!profileData.role.trim()) {

            alert(
                "Please enter your mentor role."
            );

            return;
        }

        if (!profileData.about.trim()) {

            alert(
                "Please write something about yourself."
            );

            return;
        }

        if (profileData.skills.length === 0) {

            alert(
                "Please add at least one skill."
            );

            return;
        }

        try {

            setSaving(true);

            const dataToSend = {

                userId:
                    storedUser.id,

                name:
                    profileData.name.trim(),

                email:
                    profileData.email.trim(),

                phone:
                    profileData.phone.trim(),

                role:
                    profileData.role.trim(),

                experience:
                    profileData.experience.trim(),

                about:
                    profileData.about.trim(),

                skills:
                    profileData.skills,

                achievements:
                    profileData.achievements,

                resources:
                    profileData.resources,

                slots:
                    profileData.slots,

                status:
                    "APPROVED",
            };

            console.log(
                "Saving mentor profile:",
                dataToSend
            );

            // =====================================
            // CREATE OR UPDATE
            // =====================================

            let response;

            if (profileId) {

                response = await fetch(
                    `http://localhost:8080/api/mentor-profiles/${profileId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                dataToSend
                            ),
                    }
                );

            } else {

                response = await fetch(
                    "http://localhost:8080/api/mentor-profiles",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                dataToSend
                            ),
                    }
                );
            }

            const responseData =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    responseData?.message ||
                    "Failed to save mentor profile."
                );
            }

            console.log(
                "Mentor profile saved:",
                responseData
            );

            // Store profile ID
            if (responseData.id) {

                setProfileId(
                    responseData.id
                );
            }

            setProfileData({

                name:
                    responseData.name || "",

                email:
                    responseData.email || "",

                phone:
                    responseData.phone || "",

                role:
                    responseData.role || "",

                experience:
                    responseData.experience || "",

                about:
                    responseData.about || "",

                skills:
                    responseData.skills || [],

                achievements:
                    responseData.achievements || [],

                resources:
                    responseData.resources || [],

                slots:
                    responseData.slots || [],
            });

            setIsEditing(false);

            alert(
                "Mentor profile updated successfully!"
            );

        } catch (error) {

            console.error(
                "Error saving mentor profile:",
                error
            );

            alert(
                error.message ||
                "Unable to save mentor profile."
            );

        } finally {

            setSaving(false);

        }
    };

    // =========================================
    // CANCEL EDITING
    // =========================================

    const handleCancel = async () => {

        // Reload profile from backend
        if (!storedUser?.id) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/mentor-profiles/user/${storedUser.id}`
            );

            if (response.ok) {

                const data =
                    await response.json();

                setProfileId(
                    data.id
                );

                setProfileData({

                    name:
                        data.name || "",

                    email:
                        data.email || "",

                    phone:
                        data.phone || "",

                    role:
                        data.role || "",

                    experience:
                        data.experience || "",

                    about:
                        data.about || "",

                    skills:
                        data.skills || [],

                    achievements:
                        data.achievements || [],

                    resources:
                        data.resources || [],

                    slots:
                        data.slots || [],
                });

            }

        } catch (error) {

            console.error(
                "Error restoring profile:",
                error
            );
        }

        setIsEditing(false);
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div
                    className="my-mentor-profile-page"
                    style={{
                        textAlign: "center",
                        paddingTop: "120px",
                        color: "white",
                        fontSize: "22px",
                    }}
                >
                    Loading mentor profile...
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

            <div className="my-mentor-profile-page">

                {/* BACK BUTTON */}

                <button
                    className="profile-back-btn"
                    onClick={() =>
                        navigate(
                            "/mentor-dashboard"
                        )
                    }
                >
                    <FaArrowLeft />

                    Back to Dashboard
                </button>

                {/* PROFILE CONTAINER */}

                <div className="my-mentor-profile-container">

                    {/* =================================
                        PROFILE HEADER
                    ================================= */}

                    <div className="my-profile-header">

                        <div className="my-profile-avatar">
                            {getInitials(
                                profileData.name
                            )}
                        </div>

                        <div className="my-profile-header-info">

                            <h1>
                                {profileData.name ||
                                    "Your Name"}
                            </h1>

                            <p>
                                <FaGraduationCap />

                                {profileData.role ||
                                    "EduConnect Mentor"}
                            </p>

                        </div>

                        <div className="mentor-rating">

                            <FaStar />

                            <span>
                                0.0
                            </span>

                            <small>
                                Rating
                            </small>

                        </div>

                    </div>

                    {/* =================================
                        PROFILE CONTENT
                    ================================= */}

                    <div className="my-profile-content">

                        {/* =================================
                            PERSONAL INFORMATION
                        ================================= */}

                        <div className="profile-section">

                            <div className="section-heading">

                                <h2>
                                    <FaUser />

                                    Personal Information
                                </h2>

                                {!isEditing && (

                                    <button
                                        className="edit-profile-btn"
                                        onClick={() =>
                                            setIsEditing(true)
                                        }
                                    >
                                        <FaEdit />

                                        Edit Profile
                                    </button>

                                )}

                            </div>

                            <div className="profile-grid">

                                {/* NAME */}

                                <div className="profile-field">

                                    <label>
                                        <FaUser />

                                        Full Name
                                    </label>

                                    {isEditing ? (

                                        <input
                                            type="text"
                                            name="name"
                                            value={
                                                profileData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter your full name"
                                        />

                                    ) : (

                                        <p>
                                            {profileData.name ||
                                                "Not provided"}
                                        </p>

                                    )}

                                </div>

                                {/* EMAIL */}

                                <div className="profile-field">

                                    <label>
                                        <FaEnvelope />

                                        Email Address
                                    </label>

                                    {isEditing ? (

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                profileData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter your email"
                                        />

                                    ) : (

                                        <p>
                                            {profileData.email ||
                                                "Not provided"}
                                        </p>

                                    )}

                                </div>

                                {/* PHONE */}

                                <div className="profile-field">

                                    <label>
                                        <FaPhone />

                                        Phone Number
                                    </label>

                                    {isEditing ? (

                                        <input
                                            type="text"
                                            name="phone"
                                            value={
                                                profileData.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter your phone number"
                                        />

                                    ) : (

                                        <p>
                                            {profileData.phone ||
                                                "Not provided"}
                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>

                        {/* =================================
                            PROFESSIONAL INFORMATION
                        ================================= */}

                        <div className="profile-section">

                            <div className="section-heading">

                                <h2>
                                    <FaBriefcase />

                                    Professional Information
                                </h2>

                            </div>

                            <div className="profile-grid">

                                {/* ROLE */}

                                <div className="profile-field">

                                    <label>
                                        <FaGraduationCap />

                                        Mentor Role
                                    </label>

                                    {isEditing ? (

                                        <input
                                            type="text"
                                            name="role"
                                            value={
                                                profileData.role
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Example: Senior React Mentor"
                                        />

                                    ) : (

                                        <p>
                                            {profileData.role ||
                                                "Not provided"}
                                        </p>

                                    )}

                                </div>

                                {/* EXPERIENCE */}

                                <div className="profile-field">

                                    <label>
                                        <FaBriefcase />

                                        Experience
                                    </label>

                                    {isEditing ? (

                                        <input
                                            type="text"
                                            name="experience"
                                            value={
                                                profileData.experience
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Example: 5 Years"
                                        />

                                    ) : (

                                        <p>
                                            {profileData.experience ||
                                                "Not provided"}
                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>

                        {/* =================================
                            SKILLS
                        ================================= */}

                        <div className="profile-section">

                            <div className="section-heading">

                                <h2>
                                    💡 Skills & Expertise
                                </h2>

                            </div>

                            {isEditing ? (

                                <>

                                    <div className="add-item-row">

                                        <input
                                            type="text"
                                            value={
                                                skillInput
                                            }
                                            onChange={(e) =>
                                                setSkillInput(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: React"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                addSkill
                                            }
                                        >
                                            <FaPlus />
                                            Add
                                        </button>

                                    </div>

                                    <div className="editable-tags">

                                        {profileData.skills.map(
                                            (
                                                skill,
                                                index
                                            ) => (

                                                <span
                                                    key={index}
                                                    className="editable-tag"
                                                >
                                                    {skill}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeSkill(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <FaTimes />
                                                    </button>

                                                </span>

                                            )
                                        )}

                                    </div>

                                </>

                            ) : (

                                <div className="skill-tags">

                                    {profileData.skills.length >
                                    0 ? (

                                        profileData.skills.map(
                                            (
                                                skill,
                                                index
                                            ) => (

                                                <span
                                                    key={index}
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

                            )}

                        </div>

                        {/* =================================
                            ABOUT
                        ================================= */}

                        <div className="profile-section">

                            <div className="section-heading">

                                <h2>
                                    About Me
                                </h2>

                            </div>

                            {isEditing ? (

                                <textarea
                                    name="about"
                                    rows="6"
                                    value={
                                        profileData.about
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Tell learners about yourself, your expertise and your mentoring experience..."
                                />

                            ) : (

                                <p className="profile-bio">

                                    {profileData.about ||
                                        "Add a description about yourself and your mentoring experience."}

                                </p>

                            )}

                        </div>

                        {/* =================================
                            ACHIEVEMENTS
                        ================================= */}

                        <div className="profile-section">

                            <div className="section-heading">

                                <h2>
                                    🏆 Achievements
                                </h2>

                            </div>

                            {isEditing ? (

                                <>

                                    <div className="add-item-row">

                                        <input
                                            type="text"
                                            value={
                                                achievementInput
                                            }
                                            onChange={(e) =>
                                                setAchievementInput(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: Top Mentor 2026"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                addAchievement
                                            }
                                        >
                                            <FaPlus />
                                            Add
                                        </button>

                                    </div>

                                    <ul className="editable-list">

                                        {profileData.achievements.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <li
                                                    key={index}
                                                >
                                                    {item}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeAchievement(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <FaTimes />
                                                    </button>

                                                </li>

                                            )
                                        )}

                                    </ul>

                                </>

                            ) : (

                                <ul>

                                    {profileData.achievements.length >
                                    0 ? (

                                        profileData.achievements.map(
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

                            )}

                        </div>

                        {/* =================================
                            RESOURCES
                        ================================= */}

                        <div className="profile-section">

                            <div className="section-heading">

                                <h2>
                                    <FaBook />

                                    Resources
                                </h2>

                            </div>

                            {isEditing ? (

                                <>

                                    <div className="add-item-row">

                                        <input
                                            type="text"
                                            value={
                                                resourceInput
                                            }
                                            onChange={(e) =>
                                                setResourceInput(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: React Roadmap.pdf"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                addResource
                                            }
                                        >
                                            <FaPlus />
                                            Add
                                        </button>

                                    </div>

                                    <ul className="editable-list">

                                        {profileData.resources.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <li
                                                    key={index}
                                                >
                                                    📄 {item}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeResource(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <FaTimes />
                                                    </button>

                                                </li>

                                            )
                                        )}

                                    </ul>

                                </>

                            ) : (

                                <ul>

                                    {profileData.resources.length >
                                    0 ? (

                                        profileData.resources.map(
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

                            )}

                        </div>

                        {/* =================================
                            AVAILABLE SLOTS
                        ================================= */}

                        <div className="profile-section">

                            <div className="section-heading">

                                <h2>
                                    <FaCalendarAlt />

                                    Available Slots
                                </h2>

                            </div>

                            {isEditing ? (

                                <>

                                    <div className="add-item-row">

                                        <input
                                            type="text"
                                            value={
                                                slotInput
                                            }
                                            onChange={(e) =>
                                                setSlotInput(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Example: Monday - 10:00 AM"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                addSlot
                                            }
                                        >
                                            <FaPlus />
                                            Add
                                        </button>

                                    </div>

                                    <div className="slot-list">

                                        {profileData.slots.map(
                                            (
                                                slot,
                                                index
                                            ) => (

                                                <div
                                                    key={index}
                                                    className="slot-card"
                                                >

                                                    {slot}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeSlot(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <FaTimes />
                                                    </button>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </>

                            ) : (

                                <div className="slot-list">

                                    {profileData.slots.length >
                                    0 ? (

                                        profileData.slots.map(
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
                                            No available slots added.
                                        </p>

                                    )}

                                </div>

                            )}

                        </div>

                        {/* =================================
                            SAVE / CANCEL
                        ================================= */}

                        {isEditing && (

                            <div className="profile-actions">

                                <button
                                    className="cancel-profile-btn"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={saving}
                                >
                                    <FaTimes />

                                    Cancel
                                </button>

                                <button
                                    className="save-profile-btn"
                                    onClick={
                                        handleSave
                                    }
                                    disabled={saving}
                                >
                                    <FaSave />

                                    {saving
                                        ? "Saving..."
                                        : "Save Profile"}
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>
        </>
    );
}

export default MyMentorProfile;