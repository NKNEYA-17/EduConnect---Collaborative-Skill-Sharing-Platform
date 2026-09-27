import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import mentorData from "../data/mentorData";

import "../styles/SkillDetails.css";

function SkillDetails() {

    const { skillName } = useParams();
    const navigate = useNavigate();

    const [mentors, setMentors] = useState([]);

    // =====================================================
    // SKILL INFORMATION
    // =====================================================

    const skillInformation = {

        React: {
            icon: "⚛️",
            category: "Programming",
            description:
                "React is a popular JavaScript library for building modern, interactive and reusable user interfaces. It is widely used for developing fast and scalable web applications.",
            topics: [
                "React Components",
                "JSX",
                "Props and State",
                "Hooks",
                "React Router",
                "API Integration",
                "State Management",
                "Project Development"
            ]
        },

        Java: {
            icon: "☕",
            category: "Programming",
            description:
                "Java is a powerful object-oriented programming language used to build enterprise applications, backend systems, Android applications and many other software solutions.",
            topics: [
                "Java Fundamentals",
                "Object Oriented Programming",
                "Collections",
                "Exception Handling",
                "Multithreading",
                "File Handling",
                "Java Streams",
                "Problem Solving"
            ]
        },

        Python: {
            icon: "🐍",
            category: "Programming",
            description:
                "Python is a beginner-friendly and powerful programming language widely used in web development, automation, data science, artificial intelligence and machine learning.",
            topics: [
                "Python Fundamentals",
                "Functions",
                "Object Oriented Programming",
                "File Handling",
                "Libraries",
                "APIs",
                "Automation",
                "Problem Solving"
            ]
        },

        "Spring Boot": {
            icon: "🍃",
            category: "Programming",
            description:
                "Spring Boot is a Java-based framework used to develop production-ready backend applications and REST APIs quickly and efficiently.",
            topics: [
                "Spring Boot Basics",
                "REST APIs",
                "Controllers",
                "Services",
                "Repositories",
                "JPA and Hibernate",
                "Database Integration",
                "Authentication"
            ]
        },

        "Web Development": {
            icon: "🌐",
            category: "Web Development",
            description:
                "Web development involves creating websites and web applications using frontend, backend and database technologies.",
            topics: [
                "HTML",
                "CSS",
                "JavaScript",
                "Responsive Design",
                "Frontend Development",
                "Backend Development",
                "APIs",
                "Database Integration"
            ]
        },

        Flutter: {
            icon: "📱",
            category: "Mobile Development",
            description:
                "Flutter is a framework developed by Google for building cross-platform mobile, web and desktop applications using a single codebase.",
            topics: [
                "Flutter Fundamentals",
                "Dart",
                "Widgets",
                "Layouts",
                "Navigation",
                "State Management",
                "API Integration",
                "Mobile App Development"
            ]
        },

        "Artificial Intelligence": {
            icon: "🤖",
            category: "Artificial Intelligence",
            description:
                "Artificial Intelligence focuses on creating systems capable of performing tasks that normally require human intelligence, such as reasoning, learning and decision making.",
            topics: [
                "AI Fundamentals",
                "Machine Learning",
                "Deep Learning",
                "Natural Language Processing",
                "Computer Vision",
                "Generative AI",
                "Neural Networks",
                "AI Applications"
            ]
        },

        "Machine Learning": {
            icon: "🧠",
            category: "Artificial Intelligence",
            description:
                "Machine Learning enables computers to learn patterns from data and make predictions or decisions without being explicitly programmed for every task.",
            topics: [
                "Machine Learning Fundamentals",
                "Supervised Learning",
                "Unsupervised Learning",
                "Regression",
                "Classification",
                "Clustering",
                "Model Evaluation",
                "Feature Engineering"
            ]
        },

        "Deep Learning": {
            icon: "📊",
            category: "Artificial Intelligence",
            description:
                "Deep Learning is a branch of machine learning that uses multi-layered neural networks to solve complex problems involving images, text, audio and other forms of data.",
            topics: [
                "Neural Networks",
                "CNN",
                "RNN",
                "Transformers",
                "Computer Vision",
                "Natural Language Processing",
                "Model Training",
                "Deep Learning Projects"
            ]
        },

        AWS: {
            icon: "☁️",
            category: "Cloud Computing",
            description:
                "Amazon Web Services provides cloud computing services that allow developers and organizations to build, deploy and scale applications using cloud infrastructure.",
            topics: [
                "AWS Fundamentals",
                "EC2",
                "S3",
                "Lambda",
                "RDS",
                "IAM",
                "Cloud Deployment",
                "Cloud Security"
            ]
        },

        "UI / UX Design": {
            icon: "🎨",
            category: "UI / UX Design",
            description:
                "UI/UX design focuses on creating visually appealing interfaces and meaningful user experiences for websites, mobile applications and digital products.",
            topics: [
                "UI Design",
                "UX Research",
                "Wireframing",
                "Prototyping",
                "User Research",
                "Design Systems",
                "Figma",
                "Usability Testing"
            ]
        },

        "Data Science": {
            icon: "📈",
            category: "Data Science",
            description:
                "Data Science combines programming, statistics and machine learning to extract meaningful insights from structured and unstructured data.",
            topics: [
                "Python for Data Science",
                "Statistics",
                "Data Cleaning",
                "Data Visualization",
                "Pandas",
                "NumPy",
                "Machine Learning",
                "Data Analysis"
            ]
        },

        Photography: {
            icon: "📷",
            category: "Photography",
            description:
                "Photography involves capturing and creating meaningful visual content using cameras, composition, lighting and creative techniques.",
            topics: [
                "Camera Basics",
                "Composition",
                "Lighting",
                "Portrait Photography",
                "Landscape Photography",
                "Photo Editing",
                "Color Theory",
                "Creative Photography"
            ]
        },

        Music: {
            icon: "🎵",
            category: "Music",
            description:
                "Music learning helps students develop skills in instruments, music theory, rhythm, composition, performance and creative expression.",
            topics: [
                "Music Theory",
                "Rhythm",
                "Instrument Basics",
                "Composition",
                "Songwriting",
                "Performance",
                "Recording",
                "Music Production"
            ]
        },

        "Business Strategy": {
            icon: "💼",
            category: "Business",
            description:
                "Business strategy focuses on planning, decision making, market analysis and developing approaches that help organizations achieve their goals.",
            topics: [
                "Business Fundamentals",
                "Market Research",
                "Business Planning",
                "Competitive Analysis",
                "Marketing Strategy",
                "Financial Planning",
                "Leadership",
                "Entrepreneurship"
            ]
        }

    };


    // =====================================================
    // FIND SELECTED SKILL
    // =====================================================

    const decodedSkillName =
        decodeURIComponent(skillName || "");

    const skill =
        skillInformation[decodedSkillName];


    // =====================================================
    // FIND MENTORS
    // =====================================================

    useEffect(() => {

        if (!decodedSkillName) {
            setMentors([]);
            return;
        }

        const normalizedSkill =
            decodedSkillName.toLowerCase();

        const matchingMentors =
            mentorData.filter((mentor) => {

                if (!mentor.skills) {
                    return false;
                }

                return mentor.skills.some((mentorSkill) =>
                    String(mentorSkill)
                        .toLowerCase()
                        .includes(normalizedSkill)
                    ||
                    normalizedSkill.includes(
                        String(mentorSkill)
                            .toLowerCase()
                    )
                );

            });

        setMentors(matchingMentors);

    }, [decodedSkillName]);


    // =====================================================
    // SKILL NOT FOUND
    // =====================================================

    if (!skill) {

        return (
            <>
                <Navbar />

                <div className="skill-details-page">

                    <div className="skill-not-found">

                        <h1>
                            Skill Not Found
                        </h1>

                        <p>
                            We could not find details for this skill.
                        </p>

                        <button
                            className="back-skills-btn"
                            onClick={() =>
                                navigate("/skills")
                            }
                        >
                            ← Back to Skills
                        </button>

                    </div>

                </div>
            </>
        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <>

            <Navbar />

            <div className="skill-details-page">

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    className="skill-back-btn"
                    onClick={() =>
                        navigate("/skills")
                    }
                >
                    ← Back to Skills
                </button>


                {/* =================================================
                    SKILL HEADER
                ================================================= */}

                <div className="skill-details-header">

                    <div className="skill-details-icon">
                        {skill.icon}
                    </div>

                    <div>

                        <h1>
                            {decodedSkillName}
                        </h1>

                        <span>
                            {skill.category}
                        </span>

                    </div>

                </div>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div className="skill-description-card">

                    <h2>
                        About {decodedSkillName}
                    </h2>

                    <p>
                        {skill.description}
                    </p>

                </div>


                {/* =================================================
                    TOPICS
                ================================================= */}

                <div className="skill-topics-section">

                    <h2>
                        📚 What You Will Learn
                    </h2>

                    <div className="skill-topics-grid">

                        {skill.topics.map(
                            (topic, index) => (

                                <div
                                    className="skill-topic"
                                    key={index}
                                >
                                    <span>
                                        ✓
                                    </span>

                                    {topic}

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* =================================================
                    MENTORS
                ================================================= */}

                <div className="skill-mentors-section">

                    <h2>
                        👨‍🏫 Available Mentors
                    </h2>

                    <p className="skill-mentors-subtitle">
                        Learn {decodedSkillName} from experienced mentors.
                    </p>


                    {mentors.length > 0 ? (

                        <div className="skill-mentors-grid">

                            {mentors.map(
                                (mentor, index) => (

                                    <div
                                        className="skill-mentor-card"
                                        key={mentor.id || index}
                                        onClick={() =>
                                            navigate(
                                                `/mentor/${mentor.id}`
                                            )
                                        }
                                    >

                                        {/* Mentor Avatar */}

                                        <div className="skill-mentor-avatar">

                                            {mentor.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "M"}

                                        </div>


                                        {/* Mentor Information */}

                                        <h3>
                                            {mentor.name}
                                        </h3>

                                        <p className="mentor-role">
                                            {mentor.role ||
                                                "Expert Mentor"}
                                        </p>


                                        <div className="mentor-rating">

                                            ⭐{" "}
                                            {mentor.rating || "5.0"}

                                        </div>


                                        <div className="mentor-skills">

                                            {mentor.skills
                                                ?.slice(0, 3)
                                                .map(
                                                    (mentorSkill, skillIndex) => (

                                                        <span
                                                            key={skillIndex}
                                                        >
                                                            {mentorSkill}
                                                        </span>

                                                    )
                                                )}

                                        </div>


                                        <button
                                            onClick={(event) => {

                                                event.stopPropagation();

                                                navigate(
                                                    `/mentor/${mentor.id}`
                                                );

                                            }}
                                        >
                                            View Mentor →
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="no-skill-mentors">

                            <div>
                                👨‍🏫
                            </div>

                            <h3>
                                No mentors available yet
                            </h3>

                            <p>
                                We are currently adding mentors for{" "}
                                {decodedSkillName}.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/mentors")
                                }
                            >
                                Explore All Mentors
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </>

    );

}

export default SkillDetails;