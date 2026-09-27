import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/StudentDashboard.css";

import { detectSkillGap } from "../algorithms/skillGapDetection";
import { generateLLMAnalysis } from "../algorithms/llmAnalysis";

import { apiFetch } from "../utils/api";


function StudentDashboard() {

    const navigate = useNavigate();


    // ===============================
    // USER STATE
    // ===============================

    const storedUser =
        JSON.parse(localStorage.getItem("user"));

    const [user, setUser] = useState(storedUser);

    const [loading, setLoading] = useState(true);


    // ===============================
    // LEARNING PROGRESS STATE
    // ===============================

    const [learningProgress, setLearningProgress] = useState({
        completed: 0,
        total: 0,
        percentage: 0
    });


    // ===============================
    // SKILL-WISE PROGRESS STATE
    // ===============================

    const [skillProgress, setSkillProgress] = useState([]);


    // ===============================
    // AI STATES
    // ===============================

    const [aiLoading, setAiLoading] = useState(false);

    const [analysisStarted, setAnalysisStarted] = useState(true);

    const [aiReport, setAiReport] = useState(null);


    // ===============================
    // HYBRID RECOMMENDATION STATE
    // ===============================

    const [recommendations, setRecommendations] = useState([]);

    const [recommendationLoading, setRecommendationLoading] =
        useState(false);

    const [recommendationError, setRecommendationError] =
        useState("");


    // ===============================
    // FETCH LIVE USER
    // ===============================

    useEffect(() => {

        const fetchStudent = async () => {

            if (!storedUser?.id) {

                setLoading(false);
                return;
            }


            try {

                const response =
                    await apiFetch(
                        `/api/users/${storedUser.id}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch student"
                    );

                }


                const latestUser =
                    await response.json();


                setUser(latestUser);


                localStorage.setItem(
                    "user",
                    JSON.stringify(latestUser)
                );


            }
            catch (error) {

                console.error(
                    "Unable to fetch student",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };


        fetchStudent();

    }, []);


    // ===============================
    // STUDENT SKILLS
    // ===============================

    const studentSkills =
        user?.skills || [];


    // ===============================
    // TARGET ROLE DETECTION
    // ===============================

    const getTargetRole = (skills) => {

        const normalized =
            skills.map(
                skill =>
                    skill.toLowerCase()
            );


        if (
            normalized.some(
                skill =>
                    skill.includes("java") ||
                    skill.includes("spring") ||
                    skill.includes("hibernate")
            )
        ) {

            return "Java Developer";

        }


        if (
            normalized.some(
                skill =>
                    skill.includes("python") ||
                    skill.includes("machine learning") ||
                    skill.includes("data")
            )
        ) {

            return "Data Scientist";

        }


        if (
            normalized.some(
                skill =>
                    skill.includes("react") ||
                    skill.includes("javascript") ||
                    skill.includes("frontend")
            )
        ) {

            return "React Developer";

        }


        if (
            normalized.some(
                skill =>
                    skill.includes("ui") ||
                    skill.includes("ux") ||
                    skill.includes("figma")
            )
        ) {

            return "UI/UX Designer";

        }


        if (
            normalized.some(
                skill =>
                    skill.includes("cyber") ||
                    skill.includes("security") ||
                    skill.includes("network")
            )
        ) {

            return "Cyber Security Specialist";

        }


        return "Software Developer";

    };


    const targetRole =
        getTargetRole(studentSkills);


    // ===============================
    // SKILL GAP ANALYSIS
    // ===============================

    const skillAnalysis =
        detectSkillGap(
            studentSkills,
            targetRole
        );


    // ===============================
    // LLM ANALYSIS
    // ===============================

    const llmAnalysis =
        generateLLMAnalysis(
            skillAnalysis
        );


    // ===============================
    // FETCH HYBRID RECOMMENDATIONS
    // ===============================

    const fetchRecommendations = async () => {

        if (!storedUser?.id) {
            return;
        }


        setRecommendationLoading(true);

        setRecommendationError("");


        try {

            // =========================================
            // GET CURRENT USER SKILLS
            // =========================================

            const currentSkills =
                user?.skills ||
                storedUser?.skills ||
                [];


            // =========================================
            // DETERMINE CURRENT TARGET ROLE
            // =========================================

            const currentTargetRole =
                getTargetRole(
                    currentSkills
                );


            // =========================================
            // RUN EXISTING SKILL GAP DETECTION
            // =========================================

            const currentSkillAnalysis =
                detectSkillGap(
                    currentSkills,
                    currentTargetRole
                );


            // =========================================
            // GET ACTUAL MISSING SKILLS
            // =========================================

            const missingSkills =
                currentSkillAnalysis?.missingSkills || [];


            console.log(
                "Recommendation Target Role:",
                currentTargetRole
            );


            console.log(
                "Recommendation Missing Skills:",
                missingSkills
            );


            // =========================================
            // SEND SKILL GAP TO BACKEND
            // =========================================

            const generateResponse =
                await apiFetch(
                    `/api/recommendations/generate/${storedUser.id}`,
                    {
                        method: "POST",

                        body: JSON.stringify({

                            targetRole:
                                currentTargetRole,

                            missingSkills:
                                missingSkills

                        })

                    }
                );


            if (!generateResponse.ok) {

                throw new Error(
                    "Failed to generate recommendations"
                );

            }


            // =========================================
            // READ GENERATED RECOMMENDATIONS
            // =========================================

            const generatedRecommendations =
                await generateResponse.json();


            if (
                Array.isArray(
                    generatedRecommendations
                )
            ) {

                setRecommendations(
                    generatedRecommendations
                );

            }
            else {

                setRecommendations([]);

            }

        }
        catch (error) {

            console.error(
                "Unable to fetch recommendations:",
                error
            );


            setRecommendationError(
                "Unable to load recommendations right now."
            );

        }
        finally {

            setRecommendationLoading(false);

        }

    };


    // ===============================
    // LOAD HYBRID RECOMMENDATIONS
    // ===============================

    useEffect(() => {

        if (storedUser?.id && !loading) {

            fetchRecommendations();

        }

    }, [loading, user]);


    // ===============================
    // FETCH LEARNING PROGRESS
    // ===============================

    const fetchLearningProgress = async () => {

        if (!storedUser?.id) {
            return;
        }


        try {

            // =====================================
            // FETCH BOOKINGS
            // =====================================

            const bookingResponse =
                await apiFetch(
                    `/api/mentor-bookings/student/${storedUser.id}`
                );


            if (!bookingResponse.ok) {

                throw new Error(
                    "Failed to fetch learning sessions"
                );

            }


            const bookings =
                await bookingResponse.json();


            const bookingList =
                Array.isArray(bookings)
                    ? bookings
                    : [];


            // =====================================
            // OVERALL LEARNING PROGRESS
            // =====================================

            const total =
                bookingList.length;


            const completed =
                bookingList.filter(
                    booking =>
                        booking?.status?.toUpperCase() ===
                        "COMPLETED"
                ).length;


            let percentage = 0;


            if (total > 0) {

                percentage =
                    Math.round(
                        (completed / total) * 100
                    );

            }


            setLearningProgress({

                completed,

                total,

                percentage

            });


            // =====================================
            // FETCH BACKEND SKILL PROGRESS
            // =====================================

            const progressResponse =
                await apiFetch(
                    `/api/skill-progress/student/${storedUser.id}`
                );


            if (
                progressResponse.ok
            ) {

                const backendProgress =
                    await progressResponse.json();


                const progressList =
                    Array.isArray(backendProgress)
                        ? backendProgress
                        : [];


                // =====================================
                // CONVERT BACKEND DATA FOR UI
                // =====================================

                const formattedProgress =
                    progressList.map(
                        item => {

                            let displayStatus =
                                "Not Started 🚀";


                            if (
                                item.status ===
                                "LEARNING"
                            ) {

                                displayStatus =
                                    "Learning 📚";

                            }


                            if (
                                item.status ===
                                "MASTERED"
                            ) {

                                displayStatus =
                                    "Mastered 🏆";

                            }


                            return {

                                skill:
                                    item.skill,

                                total:
                                    item.totalSessions,

                                completed:
                                    item.completedSessions,

                                percentage:
                                    item.progressPercentage,

                                status:
                                    displayStatus,

                                canTeach:
                                    item.canTeach

                            };

                        }
                    );


                setSkillProgress(
                    formattedProgress
                );

            }
            else {

                // =====================================
                // FALLBACK
                // =====================================

                const skillMap = {};


                bookingList.forEach(
                    booking => {

                        const skill =
                            booking?.skill?.trim();


                        if (!skill) {
                            return;
                        }


                        const skillKey =
                            skill.toLowerCase();


                        if (!skillMap[skillKey]) {

                            skillMap[skillKey] = {

                                skill: skill,

                                total: 0,

                                completed: 0

                            };

                        }


                        skillMap[skillKey].total += 1;


                        if (
                            booking?.status?.toUpperCase() ===
                            "COMPLETED"
                        ) {

                            skillMap[skillKey].completed += 1;

                        }

                    }
                );


                const fallbackProgress =
                    Object.values(skillMap).map(
                        item => {

                            const skillPercentage =
                                item.total > 0
                                    ? Math.round(
                                        (item.completed /
                                            item.total) * 100
                                    )
                                    : 0;


                            let status =
                                "Not Started 🚀";


                            let canTeach = false;


                            if (
                                skillPercentage > 0 &&
                                skillPercentage < 100
                            ) {

                                status =
                                    "Learning 📚";

                            }


                            if (
                                skillPercentage === 100 &&
                                item.total > 0
                            ) {

                                status =
                                    "Mastered 🏆";

                                canTeach = true;

                            }


                            return {

                                skill:
                                    item.skill,

                                total:
                                    item.total,

                                completed:
                                    item.completed,

                                percentage:
                                    skillPercentage,

                                status:
                                    status,

                                canTeach:
                                    canTeach

                            };

                        }
                    );


                setSkillProgress(
                    fallbackProgress
                );

            }

        }
        catch (error) {

            console.error(
                "Unable to fetch learning progress:",
                error
            );

        }

    };


    // ===============================
    // LOAD LEARNING PROGRESS
    // ===============================

    useEffect(() => {

        fetchLearningProgress();


        // =====================================
        // REFRESH WHEN STARS OR SESSION CHANGES
        // =====================================

        const handleStarsUpdated = () => {

            fetchLearningProgress();

            fetchRecommendations();

        };


        window.addEventListener(
            "starsUpdated",
            handleStarsUpdated
        );


        return () => {

            window.removeEventListener(
                "starsUpdated",
                handleStarsUpdated
            );

        };

    }, []);


    // ===============================
    // AI REPORT GENERATOR
    // ===============================

    const generateCareerReport = () => {

        const missingSkills =
            skillAnalysis.missingSkills || [];


        let project = "";


        if (targetRole === "Java Developer") {

            project =
                "Student Management System using Spring Boot and MySQL";

        }

        else if (targetRole === "React Developer") {

            project =
                "Full Stack Skill Sharing Platform using React and Node.js";

        }

        else if (targetRole === "Data Scientist") {

            project =
                "Student Performance Prediction using Machine Learning";

        }

        else {

            project =
                "Personal Portfolio Website with Career Tracker";

        }


        return {

            role: targetRole,

            score:
                skillAnalysis.completionPercentage || 0,

            missingSkills: missingSkills,

            jobMatches: [

                `${targetRole} Intern`,

                `${targetRole} Trainee`,

                "Software Engineer Intern"

            ],

            roadmap: [

                `Week 1: Learn ${missingSkills[0] || "Core Concepts"}`,

                `Week 2: Practice ${missingSkills[1] || "Programming Skills"}`,

                "Week 3: Build Real World Projects",

                "Week 4: Learn Developer Tools",

                "Week 5: Interview Preparation"

            ],

            courses: [

                `${targetRole} Fundamentals`,

                "Git and GitHub",

                "Database Management",

                "Data Structures and Algorithms"

            ],

            project: project,

            interview: [

                `Explain your knowledge in ${studentSkills[0] || "programming"}`,

                `Why do you want to become a ${targetRole}?`,

                "Explain your project architecture",

                "What challenges did you face while developing projects?"

            ],

            recommendation:

                `Your current profile matches a ${targetRole}. Improve your missing skills and build practical projects to become job ready.`

        };

    };


    // ===============================
    // START AI ANALYSIS
    // ===============================

    const startAnalysis = () => {

        setAiLoading(true);


        setTimeout(() => {

            const report =
                generateCareerReport();


            navigate(
                "/ai-career-report",
                {

                    state: {

                        aiReport: report,

                        skillAnalysis: skillAnalysis,

                        llmAnalysis: llmAnalysis

                    }

                }
            );


        }, 2500);

    };


    // ===============================
    // RECOMMENDATION HELPERS
    // ===============================

    const skillRecommendations =
        recommendations.filter(
            recommendation =>
                recommendation.itemType === "SKILL"
        );


    const mentorRecommendations =
        recommendations.filter(
            recommendation =>
                recommendation.itemType === "MENTOR"
        );


    const resourceRecommendations =
        recommendations.filter(
            recommendation =>
                recommendation.itemType === "RESOURCE"
        );


    // =========================================
    // BOOK MENTOR
    // =========================================

    const handleBookMentor = (recommendation) => {

        const mentorId =
            recommendation?.mentorId ||
            recommendation?.itemId;


        if (!mentorId) {

            console.error(
                "Mentor ID is missing from recommendation"
            );

            return;

        }


        navigate(
            `/book/${mentorId}`
        );

    };


    // =========================================
    // OPEN RESOURCE
    // =========================================

    const handleLearnResource = (recommendation) => {

        const resourceUrl =
            recommendation?.resourceUrl ||
            recommendation?.itemId;


        if (!resourceUrl) {

            console.error(
                "Resource URL is missing from recommendation"
            );

            return;

        }


        window.open(
            resourceUrl,
            "_blank",
            "noopener,noreferrer"
        );

    };


    // ===============================
    // LOADING SCREEN
    // ===============================

    if (loading) {

        return (

            <>
                <Navbar />


                <div
                    style={{
                        paddingTop: "120px",
                        textAlign: "center",
                        color: "white",
                        fontSize: "22px"
                    }}
                >

                    Loading latest skills...

                </div>

            </>

        );

    }


    // ===============================
    // RETURN UI
    // ===============================

    return (

        <>

            <Navbar />


            <div className="student-dashboard">


                {/* ===============================
                    HEADER
                =============================== */}

                <div className="dashboard-header">

                    <h1>

                        Welcome, {user?.name || "Student"} 👋

                    </h1>


                    <p>

                        Continue your learning journey with EduConnect

                    </p>

                </div>


                {/* ===============================
                    DASHBOARD CARDS
                =============================== */}

                <div className="dashboard-cards">


                    {/* ===============================
                        SKILLS LEARNING CARD
                    =============================== */}

                    <div
                        className="student-card"
                        onClick={() => navigate("/skills")}
                    >

                        <h2>

                            🎯 Skills Learning

                        </h2>


                        <p>

                            Explore and improve your skills by learning from mentors.

                        </p>


                        <button className="dashboard-card-btn">

                            Explore Skills →

                        </button>

                    </div>


                    {/* ===============================
                        MY MENTORS CARD
                    =============================== */}

                    <div
                        className="student-card"
                        onClick={() => navigate("/mentors")}
                    >

                        <h2>

                            👨‍🏫 My Mentors

                        </h2>


                        <p>

                            Connect with mentors and discover experts.

                        </p>


                        <button className="dashboard-card-btn">

                            Find Mentors →

                        </button>

                    </div>


                    {/* ===============================
                        UPCOMING SESSIONS CARD
                    =============================== */}

                    <div
                        className="student-card"
                        onClick={() => navigate("/my-bookings")}
                    >

                        <h2>

                            📅 Upcoming Sessions

                        </h2>


                        <p>

                            View and manage your mentoring sessions.

                        </p>


                        <button className="dashboard-card-btn">

                            View Bookings →

                        </button>

                    </div>


                    {/* ===============================
                        LEARNING PROGRESS CARD
                    =============================== */}

                    <div className="student-card">

                        <h2>

                            📚 Learning Progress

                        </h2>


                        <p>

                            Track your learning journey.

                        </p>


                        {/* =====================================
                            OVERALL PROGRESS
                        ===================================== */}

                        <div className="learning-progress-content">


                            <div className="learning-progress-info">

                                <span>

                                    {learningProgress.completed} of{" "}

                                    {learningProgress.total} sessions completed

                                </span>


                                <strong>

                                    {learningProgress.percentage}%

                                </strong>

                            </div>


                            <div className="learning-progress-bar">

                                <div
                                    className="learning-progress-fill"
                                    style={{
                                        width:
                                            `${learningProgress.percentage}%`
                                    }}
                                ></div>

                            </div>


                            <span className="learning-progress-status">

                                {

                                    learningProgress.percentage === 0
                                        ?
                                        "Getting Started 🚀"
                                        :
                                        learningProgress.percentage < 50
                                            ?
                                            "Keep Learning 📚"
                                            :
                                            learningProgress.percentage < 100
                                                ?
                                                "Great Progress 🔥"
                                                :
                                                "Learning Goal Completed 🏆"

                                }

                            </span>


                        </div>


                        {/* =====================================
                            SKILL-WISE PROGRESS
                        ===================================== */}

                        {

                            skillProgress.length > 0 && (

                                <div className="skill-progress-section">

                                    <h3>

                                        📊 Skill Progress

                                    </h3>


                                    {

                                        skillProgress.map(
                                            (item, index) => (

                                                <div
                                                    className="skill-progress-item"
                                                    key={index}
                                                >

                                                    {/* =====================
                                                        SKILL HEADER
                                                    ====================== */}

                                                    <div className="skill-progress-header">

                                                        <span>

                                                            {item.skill}

                                                        </span>


                                                        <strong>

                                                            {item.percentage}%

                                                        </strong>

                                                    </div>


                                                    {/* =====================
                                                        PROGRESS BAR
                                                    ====================== */}

                                                    <div className="skill-progress-bar">

                                                        <div
                                                            className="skill-progress-fill"
                                                            style={{
                                                                width:
                                                                    `${item.percentage}%`
                                                            }}
                                                        ></div>

                                                    </div>


                                                    {/* =====================
                                                        SESSION DETAILS
                                                    ====================== */}

                                                    <div className="skill-progress-details">

                                                        <span>

                                                            {item.completed} of{" "}

                                                            {item.total} sessions completed

                                                        </span>


                                                        <span>

                                                            {item.status}

                                                        </span>

                                                    </div>


                                                    {/* =====================
                                                        CAN TEACH
                                                    ====================== */}

                                                    {

                                                        item.canTeach && (

                                                            <div className="can-teach-badge">

                                                                ✅ You can teach this skill

                                                            </div>

                                                        )

                                                    }

                                                </div>

                                            )

                                        )

                                    }

                                </div>

                            )

                        }


                    </div>


                </div>


                {/* ===============================
                    AI ANALYSIS CARD
                =============================== */}

                <div className="skill-gap-card">


                    <h2>

                        🤖 AI Career Analysis

                    </h2>


                    <p>

                        Get AI-powered career suggestions based on your skills.

                    </p>


                    <button
                        className="dashboard-card-btn"
                        onClick={startAnalysis}
                        disabled={aiLoading}
                    >

                        {

                            aiLoading
                                ?
                                "🤖 AI Analyzing..."
                                :
                                "Start Analysis →"

                        }

                    </button>


                    {

                        aiLoading &&

                        <div className="analysis-section">


                            <h3>

                                🤖 AI is analyzing your profile...

                            </h3>


                            <p>

                                Checking skills, career roles and learning gaps...

                            </p>


                        </div>

                    }


                    {

                        analysisStarted && !aiLoading &&

                        <>


                            <h3>

                                🎯 Target Role

                            </h3>


                            <p>

                                {skillAnalysis.targetRole}

                            </p>


                            <h3>

                                📊 Skill Completion

                            </h3>


                            <p>

                                {skillAnalysis.completionPercentage}%

                            </p>


                            <h3>

                                ✅ Your Strengths

                            </h3>


                            {

                                skillAnalysis.matchedSkills.length > 0
                                    ?
                                    skillAnalysis.matchedSkills.map(
                                        (skill, index) => (

                                            <p key={index}>

                                                ✓ {skill}

                                            </p>

                                        )
                                    )
                                    :
                                    <p>

                                        No matching skills found

                                    </p>

                            }


                            <h3>

                                📚 Skills To Improve

                            </h3>


                            {

                                skillAnalysis.missingSkills.map(
                                    (skill, index) => (

                                        <p key={index}>

                                            → {skill}

                                        </p>

                                    )
                                )

                            }


                        </>

                    }


                </div>


                {/* ===============================
                    AI REPORT
                =============================== */}

                {

                    aiReport && (

                        <div className="skill-gap-card">


                            <h2>

                                📊 AI Career Analysis Report

                            </h2>


                            <h3>

                                🎯 Career Readiness Score

                            </h3>


                            <p>

                                {aiReport.score}% Ready for {aiReport.role}

                            </p>


                            <h3>

                                💼 Job Match Prediction
                            </h3>


                            {

                                aiReport.jobMatches.map(
                                    (job, index) => (

                                        <p key={index}>

                                            ✓ {job}

                                        </p>

                                    )
                                )

                            }


                            <h3>

                                📊 Skill Gap Report

                            </h3>


                            {

                                aiReport.missingSkills.length > 0
                                    ?
                                    aiReport.missingSkills.map(
                                        (skill, index) => (

                                            <p key={index}>

                                                ❌ Improve {skill}

                                            </p>

                                        )
                                    )
                                    :
                                    <p>

                                        Great! No major skill gaps detected.

                                    </p>

                            }


                            <h3>

                                📅 Personalized Learning Roadmap

                            </h3>


                            {

                                aiReport.roadmap.map(
                                    (item, index) => (

                                        <p key={index}>

                                            {item}

                                        </p>

                                    )
                                )

                            }


                            <h3>

                                📚 Recommended Courses

                            </h3>


                            {

                                aiReport.courses.map(
                                    (course, index) => (

                                        <p key={index}>

                                            📘 {course}

                                        </p>

                                    )
                                )

                            }


                            <h3>

                                💻 Recommended Project

                            </h3>


                            <p>

                                {llmAnalysis.recommendedProject}

                            </p>


                            <h3>

                                🎤 Interview Questions

                            </h3>


                            {

                                aiReport.interview.map(
                                    (question, index) => (

                                        <p key={index}>

                                            {index + 1}. {question}

                                        </p>

                                    )
                                )

                            }


                            <h3>

                                💡 AI Learning Recommendation

                            </h3>


                            <p>

                                {llmAnalysis.analysis}

                            </p>


                        </div>

                    )

                }


                {/* =====================================================
                    HYBRID RECOMMENDATION ENGINE
                    ===================================================== */}

                <div
                    className="skill-gap-card"
                    style={{
                        marginTop: "30px"
                    }}
                >

                    <h2>

                        🤝 Personalized Skill Recommendations

                    </h2>


                    <p>

                        Recommendations generated using your skills,
                        learning activity, skill gaps, and similar learners.

                    </p>


                    {/* =========================================
                        SKILL GAP INFORMATION
                    ========================================= */}

                    <div
                        style={{
                            marginTop: "15px",
                            marginBottom: "20px",
                            padding: "15px",
                            background: "#252B42",
                            borderRadius: "10px"
                        }}
                    >

                        <h3>

                            🎯 Recommendation Based On

                        </h3>


                        <p>

                            Target Role:{" "}

                            <strong>
                                {targetRole}
                            </strong>

                        </p>


                        <p>

                            Skills To Improve:{" "}

                            {

                                skillAnalysis.missingSkills?.length > 0
                                    ?
                                    skillAnalysis.missingSkills.join(", ")
                                    :
                                    "No major skill gaps detected"

                            }

                        </p>

                    </div>


                    {/* =========================================
                        LOADING
                    ========================================= */}

                    {

                        recommendationLoading && (

                            <div className="analysis-section">

                                <h3>

                                    🤖 Finding personalized recommendations...

                                </h3>


                                <p>

                                    Analyzing your skills, skill gaps,
                                    learning activity, and similar learners...

                                </p>

                            </div>

                        )

                    }


                    {/* =========================================
                        ERROR
                    ========================================= */}

                    {

                        !recommendationLoading &&
                        recommendationError && (

                            <div className="analysis-section">

                                <p>

                                    {recommendationError}

                                </p>

                            </div>

                        )

                    }


                    {/* =========================================
                        NO RECOMMENDATIONS
                    ========================================= */}

                    {

                        !recommendationLoading &&
                        !recommendationError &&
                        recommendations.length === 0 && (

                            <div className="analysis-section">

                                <h3>

                                    🌱 Start exploring skills

                                </h3>


                                <p>

                                    Complete some learning sessions
                                    to receive personalized recommendations.

                                </p>

                            </div>

                        )

                    }


                    {/* =========================================
                        SEPARATE RECOMMENDATION CATEGORIES
                    ========================================= */}

                    {

                        !recommendationLoading &&
                        !recommendationError &&
                        recommendations.length > 0 && (

                            <div
                                style={{
                                    marginTop: "25px"
                                }}
                            >

                                {/* =====================================
                                    🧠 SKILL RECOMMENDATIONS
                                ===================================== */}

                                {

                                    skillRecommendations.length > 0 && (

                                        <div
                                            style={{
                                                marginBottom: "30px"
                                            }}
                                        >

                                            <h2>

                                                🧠 Skills

                                            </h2>


                                            <p>

                                                Skills recommended to help
                                                you close your current skill gap.

                                            </p>


                                            {

                                                skillRecommendations.map(
                                                    (recommendation, index) => (

                                                        <div
                                                            key={
                                                                recommendation.id ||
                                                                recommendation.itemId ||
                                                                `skill-${index}`
                                                            }
                                                            style={{
                                                                background:
                                                                    "#252B42",
                                                                borderRadius:
                                                                    "12px",
                                                                padding:
                                                                    "20px",
                                                                marginBottom:
                                                                    "15px",
                                                                border:
                                                                    "1px solid rgba(255,255,255,0.08)"
                                                            }}
                                                        >

                                                            <h3
                                                                style={{
                                                                    marginTop:
                                                                        "0",
                                                                    marginBottom:
                                                                        "10px"
                                                                }}
                                                            >

                                                                🎯{" "}

                                                                {
                                                                    recommendation.itemName
                                                                }

                                                            </h3>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "8px 0",
                                                                    fontWeight:
                                                                        "600"
                                                                }}
                                                            >

                                                                ⭐ Hybrid Score:{" "}

                                                                {
                                                                    recommendation.hybridScore
                                                                }
                                                                %

                                                            </p>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "6px 0"
                                                                }}
                                                            >

                                                                📚 Content-Based Score:{" "}

                                                                {
                                                                    recommendation.contentScore
                                                                }
                                                                %

                                                            </p>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "6px 0"
                                                                }}
                                                            >

                                                                👥 Collaborative Score:{" "}

                                                                {
                                                                    recommendation.collaborativeScore
                                                                }
                                                                %

                                                            </p>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "10px 0 0",
                                                                    lineHeight:
                                                                        "1.5"
                                                                }}
                                                            >

                                                                💡{" "}

                                                                {
                                                                    recommendation.reason
                                                                }

                                                            </p>

                                                        </div>

                                                    )
                                                )

                                            }

                                        </div>

                                    )

                                }


                                {/* =====================================
                                    👨‍🏫 MENTOR RECOMMENDATIONS
                                ===================================== */}

                                {

                                    mentorRecommendations.length > 0 && (

                                        <div
                                            style={{
                                                marginBottom: "30px"
                                            }}
                                        >

                                            <h2>

                                                👨‍🏫 Mentors

                                            </h2>


                                            <p>

                                                Mentors recommended based on
                                                the skills you need to improve.

                                            </p>


                                            {

                                                mentorRecommendations.map(
                                                    (recommendation, index) => (

                                                        <div
                                                            key={
                                                                recommendation.id ||
                                                                recommendation.itemId ||
                                                                `mentor-${index}`
                                                            }
                                                            style={{
                                                                background:
                                                                    "#252B42",
                                                                borderRadius:
                                                                    "12px",
                                                                padding:
                                                                    "20px",
                                                                marginBottom:
                                                                    "15px",
                                                                border:
                                                                    "1px solid rgba(255,255,255,0.08)"
                                                            }}
                                                        >

                                                            <h3
                                                                style={{
                                                                    marginTop:
                                                                        "0",
                                                                    marginBottom:
                                                                        "10px"
                                                                }}
                                                            >

                                                                👨‍🏫{" "}

                                                                {
                                                                    recommendation.itemName
                                                                }

                                                            </h3>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "8px 0",
                                                                    fontWeight:
                                                                        "600"
                                                                }}
                                                            >

                                                                ⭐ Hybrid Score:{" "}

                                                                {
                                                                    recommendation.hybridScore
                                                                }
                                                                %

                                                            </p>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "6px 0"
                                                                }}
                                                            >

                                                                📚 Content-Based Score:{" "}

                                                                {
                                                                    recommendation.contentScore
                                                                }
                                                                %

                                                            </p>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "6px 0"
                                                                }}
                                                            >

                                                                👥 Collaborative Score:{" "}

                                                                {
                                                                    recommendation.collaborativeScore
                                                                }
                                                                %

                                                            </p>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "10px 0 15px",
                                                                    lineHeight:
                                                                        "1.5"
                                                                }}
                                                            >

                                                                💡{" "}

                                                                {
                                                                    recommendation.reason
                                                                }

                                                            </p>


                                                            <button
                                                                className="dashboard-card-btn"
                                                                onClick={() =>
                                                                    handleBookMentor(
                                                                        recommendation
                                                                    )
                                                                }
                                                            >

                                                                📅 Book Mentor →

                                                            </button>

                                                        </div>

                                                    )
                                                )

                                            }

                                        </div>

                                    )

                                }


                                {/* =====================================
                                    📚 RESOURCE RECOMMENDATIONS
                                ===================================== */}

                                {

                                    resourceRecommendations.length > 0 && (

                                        <div
                                            style={{
                                                marginBottom:
                                                    "10px"
                                            }}
                                        >

                                            <h2>

                                                📚 Resources

                                            </h2>


                                            <p>

                                                Learning resources selected
                                                for your current skill gaps.

                                            </p>


                                            {

                                                resourceRecommendations.map(
                                                    (recommendation, index) => (

                                                        <div
                                                            key={
                                                                recommendation.id ||
                                                                recommendation.itemId ||
                                                                `resource-${index}`
                                                            }
                                                            style={{
                                                                background:
                                                                    "#252B42",
                                                                borderRadius:
                                                                    "12px",
                                                                padding:
                                                                    "20px",
                                                                marginBottom:
                                                                    "15px",
                                                                border:
                                                                    "1px solid rgba(255,255,255,0.08)"
                                                            }}
                                                        >

                                                            <h3
                                                                style={{
                                                                    marginTop:
                                                                        "0",
                                                                    marginBottom:
                                                                        "10px"
                                                                }}
                                                            >

                                                                📖{" "}

                                                                {
                                                                    recommendation.itemName
                                                                }

                                                            </h3>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "8px 0",
                                                                    fontWeight:
                                                                        "600"
                                                                }}
                                                            >

                                                                ⭐ Hybrid Score:{" "}

                                                                {
                                                                    recommendation.hybridScore
                                                                }
                                                                %

                                                            </p>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "6px 0"
                                                                }}
                                                            >

                                                                📚 Content-Based Score:{" "}

                                                                {
                                                                    recommendation.contentScore
                                                                }
                                                                %

                                                            </p>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "6px 0"
                                                                }}
                                                            >

                                                                👥 Collaborative Score:{" "}

                                                                {
                                                                    recommendation.collaborativeScore
                                                                }
                                                                %

                                                            </p>


                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "10px 0 15px",
                                                                    lineHeight:
                                                                        "1.5"
                                                                }}
                                                            >

                                                                💡{" "}

                                                                {
                                                                    recommendation.reason
                                                                }

                                                            </p>


                                                            <button
                                                                className="dashboard-card-btn"
                                                                onClick={() =>
                                                                    handleLearnResource(
                                                                        recommendation
                                                                    )
                                                                }
                                                            >

                                                                📖 Learn Resource →

                                                            </button>

                                                        </div>

                                                    )

                                                )

                                            }

                                        </div>

                                    )

                                }

                            </div>

                        )

                    }


                    {/* =========================================
                        REFRESH BUTTON
                    ========================================= */}

                    {

                        !recommendationLoading && (

                            <button
                                className="dashboard-card-btn"
                                onClick={
                                    fetchRecommendations
                                }
                                style={{
                                    marginTop: "10px"
                                }}
                            >

                                🔄 Refresh Recommendations

                            </button>

                        )

                    }


                </div>


            </div>

        </>

    );

}


export default StudentDashboard;