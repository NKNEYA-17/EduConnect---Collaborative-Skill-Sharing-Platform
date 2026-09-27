import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import "../styles/Mentors.css";

function Mentors() {

    const navigate = useNavigate();

    // =========================================
    // EXISTING STATIC MENTORS
    // =========================================

    const staticMentors = [

        {
            id: 1,
            name: "Sarah Johnson",
            initials: "SJ",
            role: "Senior React Mentor",

            skills: [
                "React",
                "JavaScript",
                "UI / UX"
            ],

            category: "Programming",
            experience: "8 Years",
            rating: "4.9",
            students: "850+ Students",
            status: "Available",

            about:
                "Passionate about helping students become industry-ready React developers.",

            achievements: [
                "Top Mentor 2025",
                "React Expert",
                "850+ Students Mentored"
            ],

            resources: [
                "React Roadmap.pdf",
                "React Hooks Guide.pdf",
                "JavaScript Notes.pdf"
            ],

            slots: [
                "Monday - 10:00 AM",
                "Tuesday - 5:00 PM",
                "Friday - 2:00 PM"
            ],

            reviews: [
                "Excellent mentor with practical teaching.",
                "Very patient and supportive.",
                "Best React mentor I've learned from."
            ],

            isDatabaseMentor: false
        },

        {
            id: 2,
            name: "David Kumar",
            initials: "DK",
            role: "AI & Python Mentor",

            skills: [
                "Python",
                "Machine Learning",
                "Artificial Intelligence"
            ],

            category: "Artificial Intelligence",
            experience: "6 Years",
            rating: "4.8",
            students: "620+ Students",
            status: "Available",

            about:
                "Helping learners understand Python, machine learning and AI concepts.",

            achievements: [
                "AI Specialist",
                "Machine Learning Expert"
            ],

            resources: [
                "Python Basics.pdf",
                "ML Roadmap.pdf"
            ],

            slots: [
                "Monday - 6:00 PM",
                "Wednesday - 5:00 PM"
            ],

            reviews: [],

            isDatabaseMentor: false
        },

        {
            id: 3,
            name: "Emily Chen",
            initials: "EC",
            role: "Java Full Stack Mentor",

            skills: [
                "Java",
                "Spring Boot"
            ],

            category: "Programming",
            experience: "10 Years",
            rating: "5.0",
            students: "1100+ Students",
            status: "Busy",

            about:
                "Experienced Java full stack developer helping students build real-world applications.",

            achievements: [
                "Java Expert",
                "Full Stack Specialist"
            ],

            resources: [
                "Java Roadmap.pdf",
                "Spring Boot Guide.pdf"
            ],

            slots: [
                "Saturday - 10:00 AM"
            ],

            reviews: [],

            isDatabaseMentor: false
        },

        {
            id: 4,
            name: "Alex Wilson",
            initials: "AW",
            role: "Flutter Developer",

            skills: [
                "Flutter",
                "Dart"
            ],

            category: "Mobile Development",
            experience: "5 Years",
            rating: "4.7",
            students: "430+ Students",
            status: "Available",

            about:
                "Mobile developer passionate about teaching Flutter application development.",

            achievements: [
                "Flutter Developer",
                "Mobile App Specialist"
            ],

            resources: [
                "Flutter Roadmap.pdf"
            ],

            slots: [
                "Tuesday - 6:00 PM"
            ],

            reviews: [],

            isDatabaseMentor: false
        },

        {
            id: 5,
            name: "Priya Sharma",
            initials: "PS",
            role: "Cloud Engineer",

            skills: [
                "AWS",
                "Cloud Computing"
            ],

            category: "Cloud Computing",
            experience: "7 Years",
            rating: "4.8",
            students: "540+ Students",
            status: "Available",

            about:
                "Cloud engineer helping learners understand AWS and cloud technologies.",

            achievements: [
                "AWS Certified",
                "Cloud Specialist"
            ],

            resources: [
                "AWS Roadmap.pdf"
            ],

            slots: [
                "Wednesday - 6:00 PM"
            ],

            reviews: [],

            isDatabaseMentor: false
        },

        {
            id: 6,
            name: "Michael Lee",
            initials: "ML",
            role: "Data Scientist",

            skills: [
                "Data Science",
                "Python"
            ],

            category: "Data Science",
            experience: "9 Years",
            rating: "4.9",
            students: "900+ Students",
            status: "Busy",

            about:
                "Data scientist helping learners build practical data science skills.",

            achievements: [
                "Data Science Expert",
                "Python Specialist"
            ],

            resources: [
                "Data Science Roadmap.pdf"
            ],

            slots: [
                "Sunday - 10:00 AM"
            ],

            reviews: [],

            isDatabaseMentor: false
        }

    ];

    // =========================================
    // STATE
    // =========================================

    /*
     * IMPORTANT:
     *
     * Start with the existing mentors.
     *
     * MongoDB mentors will be added later.
     */

    const [mentors, setMentors] = useState(staticMentors);

    const [search, setSearch] = useState("");

    const [category, setCategory] =
        useState("All Skills");

    const [loading, setLoading] =
        useState(true);

    // =========================================
    // GET INITIALS
    // =========================================

    const getInitials = (name) => {

        if (!name) {
            return "ME";
        }

        return name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (word) =>
                    word.charAt(0).toUpperCase()
            )
            .join("");
    };

    // =========================================
    // LOAD COMPLETED MENTOR PROFILES
    // =========================================

    useEffect(() => {

        const fetchMentors = async () => {

            try {

                console.log(
                    "Loading completed mentor profiles..."
                );

                const response = await fetch(
                    "http://localhost:8080/api/mentor-profiles/approved"
                );

                if (!response.ok) {

                    throw new Error(
                        `Backend returned ${response.status}`
                    );

                }

                const data = await response.json();

                console.log(
                    "Completed mentor profiles from MongoDB:",
                    data
                );

                // =========================================
                // MAKE SURE RESPONSE IS AN ARRAY
                // =========================================

                if (!Array.isArray(data)) {

                    console.error(
                        "Backend mentor response is not an array:",
                        data
                    );

                    setMentors(staticMentors);

                    return;
                }

                // =========================================
                // CONVERT MONGODB MENTORS
                // =========================================

                const databaseMentors = data
                    .filter(
                        (mentor) =>
                            mentor &&
                            mentor.profileCompleted === true
                    )
                    .map((mentor) => {

                        return {

                            /*
                             * Prefix database IDs so they
                             * don't conflict with static IDs.
                             *
                             * Example:
                             * db-68a123456789
                             */

                            id:
                                `db-${mentor.id}`,

                            /*
                             * Keep original MongoDB ID
                             * for future backend operations.
                             */

                            databaseId:
                                mentor.id,

                            name:
                                mentor.name ||
                                "Mentor",

                            initials:
                                getInitials(
                                    mentor.name
                                ),

                            role:
                                mentor.role ||
                                "EduConnect Mentor",

                            skills:
                                Array.isArray(
                                    mentor.skills
                                )
                                    ? mentor.skills
                                    : [],

                            category:
                                mentor.category ||
                                "Programming",

                            experience:
                                mentor.experience ||
                                "Not specified",

                            rating:
                                mentor.rating !==
                                undefined &&
                                mentor.rating !==
                                null
                                    ? String(
                                        mentor.rating
                                    )
                                    : "0.0",

                            students:
                                mentor.students !==
                                undefined &&
                                mentor.students !==
                                null
                                    ? `${mentor.students}+ Students`
                                    : "0+ Students",

                            status:
                                mentor.status ||
                                "Available",

                            about:
                                mentor.about ||
                                "EduConnect mentor helping learners develop their skills.",

                            achievements:
                                Array.isArray(
                                    mentor.achievements
                                )
                                    ? mentor.achievements
                                    : [],

                            resources:
                                Array.isArray(
                                    mentor.resources
                                )
                                    ? mentor.resources
                                    : [],

                            slots:
                                Array.isArray(
                                    mentor.slots
                                )
                                    ? mentor.slots
                                    : [],

                            reviews:
                                Array.isArray(
                                    mentor.reviews
                                )
                                    ? mentor.reviews
                                    : [],

                            isDatabaseMentor: true

                        };

                    });

                console.log(
                    "Converted database mentors:",
                    databaseMentors
                );

                // =========================================
                // KEEP EXISTING + ADD DATABASE MENTORS
                // =========================================

                setMentors([
                    ...staticMentors,
                    ...databaseMentors
                ]);

            } catch (error) {

                console.error(
                    "Error loading mentor profiles:",
                    error
                );

                /*
                 * VERY IMPORTANT:
                 *
                 * Even if backend fails,
                 * existing mentors remain visible.
                 */

                setMentors(staticMentors);

            } finally {

                setLoading(false);

            }

        };

        fetchMentors();

    }, []);

    // =========================================
    // GET CATEGORIES
    // =========================================

    /*
     * This automatically adds categories
     * coming from MongoDB mentors.
     *
     * So if Keerthi has:
     *
     * category = "Web Development"
     *
     * it will automatically appear
     * in the dropdown.
     */

    const categories = [
        "All Skills",
        ...Array.from(
            new Set(
                mentors
                    .map(
                        (mentor) =>
                            mentor.category
                    )
                    .filter(Boolean)
            )
        )
    ];

    // =========================================
    // FILTER MENTORS
    // =========================================

    const filteredMentors =
        mentors.filter((mentor) => {

            const searchValue =
                search.trim().toLowerCase();

            const mentorName =
                String(
                    mentor.name || ""
                ).toLowerCase();

            const mentorRole =
                String(
                    mentor.role || ""
                ).toLowerCase();

            const mentorSkills =
                Array.isArray(
                    mentor.skills
                )
                    ? mentor.skills
                    : [];

            const matchesSearch =
                mentorName.includes(
                    searchValue
                ) ||

                mentorRole.includes(
                    searchValue
                ) ||

                mentorSkills.some(
                    (skill) =>
                        String(skill)
                            .toLowerCase()
                            .includes(
                                searchValue
                            )
                );

            const matchesCategory =
                category ===
                    "All Skills" ||
                mentor.category ===
                    category;

            return (
                matchesSearch &&
                matchesCategory
            );

        });

    // =========================================
    // OPEN MENTOR PROFILE
    // =========================================

    const openMentorProfile = (mentor) => {

        console.log(
            "Opening mentor profile:",
            mentor
        );

        navigate(
            `/mentor/${mentor.id}`
        );

    };

    // =========================================
    // MAIN UI
    // =========================================

    return (
        <>

            <Navbar />

            <div className="mentors-page">

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="mentors-header">

                    <h1>
                        👨‍🏫 Find Your Mentor
                    </h1>

                    <p>
                        Learn directly from experienced
                        mentors around the world.
                        Connect, collaborate, and grow
                        your skills.
                    </p>

                </div>


                {/* =========================================
                    FEATURED MENTOR
                ========================================= */}

                <div className="featured-mentor">

                    <div className="featured-avatar">
                        SJ
                    </div>

                    <div className="featured-content">

                        <span className="featured-tag">
                            ⭐ Featured Mentor of the Week
                        </span>

                        <h2>
                            Sarah Johnson
                        </h2>

                        <h4>
                            Senior React Mentor
                        </h4>

                        <p>
                            Passionate about helping
                            students become industry-ready
                            React Developers.
                        </p>

                        <div className="featured-info">

                            <span>
                                ⭐ 4.9
                            </span>

                            <span>
                                👨‍🎓 850+ Students
                            </span>

                            <span>
                                💼 8 Years Experience
                            </span>

                        </div>

                        <button
                            className="book-btn"
                            onClick={() =>
                                navigate(
                                    "/mentor/1"
                                )
                            }
                        >
                            📅 Book a Session
                        </button>

                    </div>

                </div>


                {/* =========================================
                    SEARCH
                ========================================= */}

                <div className="mentor-search">

                    <input
                        type="text"
                        placeholder="🔍 Search Mentor or Skill..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                    >

                        {categories.map(
                            (item) => (

                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =========================================
                    LOADING
                ========================================= */}

                {loading && (

                    <p
                        style={{
                            textAlign: "center",
                            color: "white",
                            margin: "30px"
                        }}
                    >
                        Loading additional mentors...
                    </p>

                )}


                {/* =========================================
                    MENTORS GRID
                ========================================= */}

                <div className="mentors-grid">

                    {filteredMentors.map(
                        (mentor) => (

                            <div
                                className="mentor-card"
                                key={mentor.id}
                            >

                                {/* AVATAR */}

                                <div className="mentor-avatar">

                                    {mentor.initials ||
                                        getInitials(
                                            mentor.name
                                        )}

                                </div>


                                {/* NAME */}

                                <h2>
                                    {mentor.name}
                                </h2>


                                {/* ROLE */}

                                <h4>
                                    {mentor.role}
                                </h4>


                                {/* DATABASE BADGE */}

                                {mentor.isDatabaseMentor && (

                                    <span
                                        style={{
                                            display: "inline-block",
                                            marginBottom: "8px",
                                            padding: "4px 10px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            background:
                                                "rgba(124, 92, 255, 0.2)",
                                            color: "#b9a7ff"
                                        }}
                                    >
                                        ✓ EduConnect Mentor
                                    </span>

                                )}


                                {/* RATING */}

                                <div className="mentor-rating">

                                    ⭐ {mentor.rating}

                                </div>


                                {/* STATUS */}

                                <div className="mentor-status">

                                    {mentor.status ===
                                    "Available" ? (

                                        <span className="available">
                                            🟢 Available
                                        </span>

                                    ) : (

                                        <span className="busy">
                                            🔴 Busy
                                        </span>

                                    )}

                                </div>


                                {/* SKILLS */}

                                <div className="mentor-skills">

                                    {mentor.skills.map(
                                        (
                                            skill,
                                            index
                                        ) => (

                                            <span
                                                key={index}
                                                className="skill-pill"
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>


                                {/* EXPERIENCE */}

                                <p className="mentor-exp">

                                    💼{" "}
                                    {mentor.experience}

                                </p>


                                {/* STUDENTS */}

                                <p className="mentor-students">

                                    👨‍🎓{" "}
                                    {mentor.students}

                                </p>


                                {/* BUTTONS */}

                                <div className="mentor-buttons">

                                    <button
                                        className="profile-btn"
                                        onClick={() =>
                                            openMentorProfile(
                                                mentor
                                            )
                                        }
                                    >
                                        View Profile
                                    </button>


                                    <button
                                        className="session-btn"
                                        onClick={() =>
                                            openMentorProfile(
                                                mentor
                                            )
                                        }
                                    >
                                        Book Session
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>


                {/* =========================================
                    NO RESULTS
                ========================================= */}

                {!loading &&
                    filteredMentors.length === 0 && (

                        <div
                            style={{
                                textAlign: "center",
                                color: "white",
                                padding: "50px"
                            }}
                        >

                            <h2>
                                👨‍🏫 No mentors found
                            </h2>

                            <p>
                                Try another mentor
                                name or skill.
                            </p>

                        </div>

                    )}

            </div>

        </>
    );
}

export default Mentors;