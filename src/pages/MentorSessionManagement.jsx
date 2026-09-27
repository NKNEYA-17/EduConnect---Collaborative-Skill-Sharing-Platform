import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import "../styles/MentorSessionManagement.css";

function MentorSessionManagement() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // =========================================
    // SESSION FORM
    // =========================================

    const [sessionData, setSessionData] = useState({

        title: "",

        description: "",

        skill: "",

        duration: "1 Hour",

        mode: "Online",

        maxStudents: 10,

        status: "Available",

        googleMeetLink: "",

        slots: []

    });

    // =========================================
    // NEW TIME SLOT
    // =========================================

    const [newSlot, setNewSlot] = useState("");

    // =========================================
    // MATERIALS
    // =========================================

    const [materials, setMaterials] = useState([]);

    // =========================================
    // MESSAGE
    // =========================================

    const [message, setMessage] = useState("");

    // =========================================
    // LOADING
    // =========================================

    const [loadingSession, setLoadingSession] =
        useState(true);

    // =========================================
    // SAVING
    // =========================================

    const [savingSession, setSavingSession] =
        useState(false);

    // =========================================
    // LOAD SESSION FROM BACKEND
    // =========================================

    useEffect(() => {

        const loadSession = async () => {

            if (!user?.id) {

                setLoadingSession(false);

                return;
            }

            try {

                console.log(
                    "Loading mentor session for:",
                    user.id
                );

                const response = await fetch(
                    `http://localhost:8080/api/mentor-sessions/mentor/${user.id}`
                );

                // =====================================
                // SESSION FOUND
                // =====================================

                if (response.ok) {

                    const data =
                        await response.json();

                    console.log(
                        "Mentor session loaded:",
                        data
                    );

                    setSessionData({

                        title:
                            data.title || "",

                        description:
                            data.description || "",

                        skill:
                            data.skill || "",

                        duration:
                            data.duration ||
                            "1 Hour",

                        mode:
                            data.mode ||
                            "Online",

                        maxStudents:
                            data.maxStudents ??
                            10,

                        status:
                            data.status ||
                            "Available",

                        googleMeetLink:
                            data.googleMeetLink ||
                            "",

                        slots:
                            Array.isArray(
                                data.slots
                            )
                                ? data.slots
                                : []

                    });

                    // =================================
                    // LOAD MATERIALS
                    // =================================

                    if (
                        Array.isArray(
                            data.materials
                        )
                    ) {

                        setMaterials(
                            data.materials
                        );

                    }

                    // =================================
                    // KEEP LOCAL STORAGE COPY
                    // =================================

                    localStorage.setItem(

                        `mentorSession_${user.id}`,

                        JSON.stringify(data)

                    );

                    localStorage.setItem(

                        "mentorSession",

                        JSON.stringify(data)

                    );

                    return;
                }

                // =====================================
                // BACKEND SESSION NOT FOUND
                // FALLBACK TO LOCAL STORAGE
                // =====================================

                console.log(
                    "No backend session found. Checking localStorage..."
                );

                loadFromLocalStorage();

            } catch (error) {

                console.error(
                    "Error loading mentor session:",
                    error
                );

                // =====================================
                // FALLBACK
                // =====================================

                loadFromLocalStorage();

            } finally {

                setLoadingSession(false);

            }

        };

        // =========================================
        // LOCAL STORAGE FALLBACK
        // =========================================

        const loadFromLocalStorage = () => {

            try {

                const savedSession =
                    localStorage.getItem(
                        `mentorSession_${user?.id}`
                    );

                if (!savedSession) {

                    return;

                }

                const parsedSession =
                    JSON.parse(
                        savedSession
                    );

                setSessionData({

                    title:
                        parsedSession.title ||
                        "",

                    description:
                        parsedSession.description ||
                        "",

                    skill:
                        parsedSession.skill ||
                        "",

                    duration:
                        parsedSession.duration ||
                        "1 Hour",

                    mode:
                        parsedSession.mode ||
                        "Online",

                    maxStudents:
                        parsedSession.maxStudents ??
                        10,

                    status:
                        parsedSession.status ||
                        "Available",

                    googleMeetLink:
                        parsedSession.googleMeetLink ||
                        "",

                    slots:
                        Array.isArray(
                            parsedSession.slots
                        )
                            ? parsedSession.slots
                            : []

                });

                if (
                    Array.isArray(
                        parsedSession.materials
                    )
                ) {

                    setMaterials(
                        parsedSession.materials
                    );

                }

            } catch (error) {

                console.error(
                    "Error loading local session:",
                    error
                );

            }

        };

        loadSession();

    }, [user?.id]);


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setSessionData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // =========================================
    // ADD TIME SLOT
    // =========================================

    const handleAddSlot = () => {

        const trimmedSlot =
            newSlot.trim();

        if (!trimmedSlot) {

            alert(
                "Please enter a time slot."
            );

            return;
        }

        if (
            sessionData.slots.includes(
                trimmedSlot
            )
        ) {

            alert(
                "This time slot already exists."
            );

            return;
        }

        setSessionData((previous) => ({

            ...previous,

            slots: [

                ...previous.slots,

                trimmedSlot

            ]

        }));

        setNewSlot("");

    };


    // =========================================
    // REMOVE TIME SLOT
    // =========================================

    const handleRemoveSlot = (
        slotToRemove
    ) => {

        setSessionData((previous) => ({

            ...previous,

            slots:
                previous.slots.filter(
                    (slot) =>
                        slot !== slotToRemove
                )

        }));

    };


    // =========================================
    // HANDLE PDF MATERIAL UPLOAD
    // =========================================

    const handleMaterialUpload = (e) => {

        const files =
            Array.from(
                e.target.files || []
            );

        const pdfFiles =
            files.filter(
                (file) =>
                    file.type ===
                    "application/pdf"
            );

        if (
            pdfFiles.length !==
            files.length
        ) {

            alert(
                "Only PDF files are allowed."
            );

        }

        if (pdfFiles.length > 0) {

            setMaterials((previous) => [

                ...previous,

                ...pdfFiles

            ]);

        }

        e.target.value = "";

    };


    // =========================================
    // REMOVE MATERIAL
    // =========================================

    const handleRemoveMaterial = (
        index
    ) => {

        setMaterials((previous) =>
            previous.filter(
                (_, fileIndex) =>
                    fileIndex !== index
            )
        );

    };


    // =========================================
    // SAVE SESSION
    // =========================================

    const handleSaveSession = async () => {

        // =====================================
        // VALIDATE TITLE
        // =====================================

        if (
            !sessionData.title.trim()
        ) {

            alert(
                "Please enter a session title."
            );

            return;
        }


        // =====================================
        // VALIDATE DESCRIPTION
        // =====================================

        if (
            !sessionData.description.trim()
        ) {

            alert(
                "Please enter a session description."
            );

            return;
        }


        // =====================================
        // VALIDATE SKILL
        // =====================================

        if (
            !sessionData.skill.trim()
        ) {

            alert(
                "Please enter the skill."
            );

            return;
        }


        // =====================================
        // VALIDATE TIME SLOT
        // =====================================

        if (
            sessionData.slots.length === 0
        ) {

            alert(
                "Please add at least one time slot."
            );

            return;
        }


        // =====================================
        // VALIDATE MAXIMUM STUDENTS
        // =====================================

        if (
            !sessionData.maxStudents ||
            Number(
                sessionData.maxStudents
            ) < 1
        ) {

            alert(
                "Please enter a valid maximum number of students."
            );

            return;
        }


        // =====================================
        // CHECK USER
        // =====================================

        if (!user?.id) {

            alert(
                "Mentor information not found. Please login again."
            );

            navigate("/login");

            return;
        }


        // =====================================
        // START SAVING
        // =====================================

        setSavingSession(true);

        try {

            // =================================
            // MATERIAL DATA
            // =================================

            const materialData =
                materials.map(
                    (file) => ({

                        name:
                            file.name,

                        type:
                            file.type ||
                            "application/pdf",

                        size:
                            file.size || 0

                    })
                );


            // =================================
            // SESSION OBJECT
            // =================================

            const sessionPayload = {

                mentorId:
                    String(user.id),

                mentorName:
                    user.name ||
                    "Mentor",

                title:
                    sessionData.title.trim(),

                description:
                    sessionData.description.trim(),

                skill:
                    sessionData.skill.trim(),

                duration:
                    sessionData.duration,

                mode:
                    sessionData.mode,

                maxStudents:
                    Number(
                        sessionData.maxStudents
                    ),

                bookedStudents:
                    0,

                status:
                    sessionData.status,

                googleMeetLink:
                    sessionData.googleMeetLink.trim(),

                slots:
                    sessionData.slots,

                materials:
                    materialData

            };


            console.log(
                "Saving mentor session:",
                sessionPayload
            );


            // =================================
            // SEND TO BACKEND
            // =================================

            const response =
                await fetch(
                    "http://localhost:8080/api/mentor-sessions",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                sessionPayload
                            )

                    }
                );


            // =================================
            // BACKEND ERROR
            // =================================

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Backend session save failed:",
                    errorText
                );

                throw new Error(
                    "Backend could not save the session."
                );

            }


            // =================================
            // READ SAVED SESSION
            // =================================

            const savedSession =
                await response.json();

            console.log(
                "Session saved to backend:",
                savedSession
            );


            // =================================
            // KEEP LOCAL STORAGE COPY
            // =================================

            localStorage.setItem(

                `mentorSession_${user.id}`,

                JSON.stringify(
                    savedSession
                )

            );

            localStorage.setItem(

                "mentorSession",

                JSON.stringify(
                    savedSession
                )

            );


            // =================================
            // UPDATE FORM USING BACKEND DATA
            // =================================

            setSessionData({

                title:
                    savedSession.title ||
                    sessionPayload.title,

                description:
                    savedSession.description ||
                    sessionPayload.description,

                skill:
                    savedSession.skill ||
                    sessionPayload.skill,

                duration:
                    savedSession.duration ||
                    sessionPayload.duration,

                mode:
                    savedSession.mode ||
                    sessionPayload.mode,

                maxStudents:
                    savedSession.maxStudents ??
                    sessionPayload.maxStudents,

                status:
                    savedSession.status ||
                    sessionPayload.status,

                googleMeetLink:
                    savedSession.googleMeetLink ||
                    sessionPayload.googleMeetLink,

                slots:
                    Array.isArray(
                        savedSession.slots
                    )
                        ? savedSession.slots
                        : sessionPayload.slots

            });


            // =================================
            // SUCCESS
            // =================================

            alert(
                "Session details saved successfully!"
            );

        } catch (error) {

            console.error(
                "Error saving mentor session:",
                error
            );

            alert(
                "Unable to save session details. Please make sure the backend is running."
            );

        } finally {

            setSavingSession(false);

        }

    };


    // =========================================
    // SEND MESSAGE
    // =========================================

    const handleSendMessage = () => {

        if (!message.trim()) {

            alert(
                "Please enter a message."
            );

            return;
        }

        const messageData = {

            id:
                Date.now(),

            mentorId:
                user?.id || null,

            mentorName:
                user?.name ||
                "Mentor",

            message:
                message.trim(),

            sender:
                "MENTOR",

            time:
                new Date().toISOString()

        };


        const existingMessages =
            JSON.parse(
                localStorage.getItem(
                    "mentorStudentMessages"
                )
            ) || [];


        existingMessages.push(
            messageData
        );


        localStorage.setItem(

            "mentorStudentMessages",

            JSON.stringify(
                existingMessages
            )

        );


        setMessage("");


        alert(
            "Message sent successfully!"
        );

    };


    // =========================================
    // LOADING SESSION
    // =========================================

    if (loadingSession) {

        return (

            <>

                <Navbar />

                <div
                    style={{
                        textAlign: "center",
                        paddingTop: "120px",
                        color: "white",
                        fontSize: "22px"
                    }}
                >
                    Loading session details...
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

            <div className="mentor-session-page">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="session-page-header">

                    <button
                        className="session-back-btn"
                        onClick={() =>
                            navigate(
                                "/mentor-dashboard"
                            )
                        }
                    >
                        ← Back to Dashboard
                    </button>


                    <h1>
                        🗓️ Session Management
                    </h1>


                    <p>
                        Create and manage your
                        mentoring sessions
                    </p>

                </div>


                {/* =================================
                    SESSION DETAILS
                ================================= */}

                <div className="session-management-card">

                    <h2>
                        📚 Session Details
                    </h2>


                    <p className="section-description">
                        Add the basic information
                        about the session you want
                        to offer learners.
                    </p>


                    {/* SESSION TITLE */}

                    <div className="form-group">

                        <label>
                            Session Title
                        </label>


                        <input
                            type="text"
                            name="title"
                            value={
                                sessionData.title
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Example: React Masterclass"
                        />

                    </div>


                    {/* SKILL */}

                    <div className="form-group">

                        <label>
                            Skill
                        </label>


                        <input
                            type="text"
                            name="skill"
                            value={
                                sessionData.skill
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Example: React"
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Session Description
                        </label>


                        <textarea
                            name="description"
                            value={
                                sessionData.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Describe what students will learn in this session..."
                            rows="5"
                        />

                    </div>


                    {/* DURATION + MODE */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Duration
                            </label>


                            <select
                                name="duration"
                                value={
                                    sessionData.duration
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="30 Minutes">
                                    30 Minutes
                                </option>

                                <option value="1 Hour">
                                    1 Hour
                                </option>

                                <option value="1.5 Hours">
                                    1.5 Hours
                                </option>

                                <option value="2 Hours">
                                    2 Hours
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Mode
                            </label>


                            <select
                                name="mode"
                                value={
                                    sessionData.mode
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="Online">
                                    Online
                                </option>

                                <option value="Offline">
                                    Offline
                                </option>

                                <option value="Hybrid">
                                    Hybrid
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* MAXIMUM STUDENTS + STATUS */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Maximum Students
                            </label>


                            <input
                                type="number"
                                name="maxStudents"
                                min="1"
                                max="100"
                                value={
                                    sessionData.maxStudents
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: 10"
                            />


                            <small className="field-help">
                                Maximum students allowed
                                for this session.
                            </small>

                        </div>


                        <div className="form-group">

                            <label>
                                Session Status
                            </label>


                            <select
                                name="status"
                                value={
                                    sessionData.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="Available">
                                    Available
                                </option>

                                <option value="Unavailable">
                                    Unavailable
                                </option>

                                <option value="Full">
                                    Full
                                </option>

                            </select>


                            <small className="field-help">
                                Set whether students can
                                currently request this session.
                            </small>

                        </div>

                    </div>

                </div>


                {/* =================================
                    TIME SLOTS
                ================================= */}

                <div className="session-management-card">

                    <h2>
                        🕐 Available Time Slots
                    </h2>


                    <p className="section-description">
                        Add the timings when students
                        can book your session.
                    </p>


                    <div className="slot-add-row">

                        <input
                            type="text"
                            value={newSlot}
                            onChange={(e) =>
                                setNewSlot(
                                    e.target.value
                                )
                            }
                            placeholder="Example: Monday - 10:00 AM"
                        />


                        <button
                            className="add-slot-btn"
                            onClick={
                                handleAddSlot
                            }
                        >
                            + Add Slot
                        </button>

                    </div>


                    <div className="mentor-slots-list">

                        {sessionData.slots.length >
                        0 ? (

                            sessionData.slots.map(
                                (
                                    slot,
                                    index
                                ) => (

                                    <div
                                        className="mentor-slot-item"
                                        key={index}
                                    >

                                        <span>
                                            🕐 {slot}
                                        </span>


                                        <button
                                            onClick={() =>
                                                handleRemoveSlot(
                                                    slot
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                )

                            )

                        ) : (

                            <p className="empty-message">
                                No time slots added yet.
                            </p>

                        )}

                    </div>

                </div>


                {/* =================================
                    PDF MATERIALS
                ================================= */}

                <div className="session-management-card">

                    <h2>
                        📄 Study Materials
                    </h2>


                    <p className="section-description">
                        Upload PDF materials that
                        students can use during
                        the session.
                    </p>


                    <label className="upload-area">

                        <span>
                            📁
                        </span>


                        <strong>
                            Upload PDF Materials
                        </strong>


                        <small>
                            Click here to select PDF files
                        </small>


                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            multiple
                            onChange={
                                handleMaterialUpload
                            }
                        />

                    </label>


                    {materials.length > 0 && (

                        <div className="materials-list">

                            {materials.map(
                                (
                                    file,
                                    index
                                ) => (

                                    <div
                                        className="material-item"
                                        key={index}
                                    >

                                        <span>
                                            📄{" "}
                                            {file.name}
                                        </span>


                                        <button
                                            onClick={() =>
                                                handleRemoveMaterial(
                                                    index
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                )

                            )}

                        </div>

                    )}

                </div>


                {/* =================================
                    GOOGLE MEET
                ================================= */}

                <div className="session-management-card">

                    <h2>
                        🎥 Google Meet
                    </h2>


                    <p className="section-description">
                        Add the Google Meet link
                        students should use to join
                        the session.
                    </p>


                    <div className="form-group">

                        <label>
                            Google Meet Link
                        </label>


                        <input
                            type="url"
                            name="googleMeetLink"
                            value={
                                sessionData.googleMeetLink
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://meet.google.com/..."
                        />

                    </div>

                </div>


                {/* =================================
                    MESSAGING
                ================================= */}

                <div className="session-management-card">

                    <h2>
                        💬 Student Messaging
                    </h2>


                    <p className="section-description">
                        Send a message to your
                        learners about the session.
                    </p>


                    <div className="message-box">

                        <textarea
                            value={message}
                            onChange={(e) =>
                                setMessage(
                                    e.target.value
                                )
                            }
                            placeholder="Type your message to students..."
                            rows="4"
                        />


                        <button
                            className="send-message-btn"
                            onClick={
                                handleSendMessage
                            }
                        >
                            💬 Send Message
                        </button>

                    </div>

                </div>


                {/* =================================
                    SAVE SESSION
                ================================= */}

                <div className="save-session-section">

                    <button
                        className="save-session-btn"
                        onClick={
                            handleSaveSession
                        }
                        disabled={
                            savingSession
                        }
                    >

                        {savingSession
                            ? "💾 Saving..."
                            : "💾 Save Session Details"}

                    </button>

                </div>

            </div>

        </>

    );

}

export default MentorSessionManagement;