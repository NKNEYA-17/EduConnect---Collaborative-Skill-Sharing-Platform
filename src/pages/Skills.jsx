import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import "../styles/Skills.css";

function Skills() {

    const navigate = useNavigate();

    const skills = [
        {
            icon: "⚛️",
            name: "React",
            category: "Programming",
            mentors: "120 Mentors",
            rating: "★★★★★",
            level: "Beginner",
        },
        {
            icon: "☕",
            name: "Java",
            category: "Programming",
            mentors: "95 Mentors",
            rating: "★★★★☆",
            level: "Intermediate",
        },
        {
            icon: "🐍",
            name: "Python",
            category: "Programming",
            mentors: "180 Mentors",
            rating: "★★★★★",
            level: "Beginner",
        },
        {
            icon: "🍃",
            name: "Spring Boot",
            category: "Programming",
            mentors: "75 Mentors",
            rating: "★★★★★",
            level: "Advanced",
        },
        {
            icon: "🌐",
            name: "Web Development",
            category: "Web Development",
            mentors: "140 Mentors",
            rating: "★★★★★",
            level: "Beginner",
        },
        {
            icon: "📱",
            name: "Flutter",
            category: "Mobile Development",
            mentors: "55 Mentors",
            rating: "★★★★☆",
            level: "Intermediate",
        },
        {
            icon: "🤖",
            name: "Artificial Intelligence",
            category: "Artificial Intelligence",
            mentors: "80 Mentors",
            rating: "★★★★★",
            level: "Advanced",
        },
        {
            icon: "🧠",
            name: "Machine Learning",
            category: "Artificial Intelligence",
            mentors: "65 Mentors",
            rating: "★★★★★",
            level: "Intermediate",
        },
        {
            icon: "📊",
            name: "Deep Learning",
            category: "Artificial Intelligence",
            mentors: "45 Mentors",
            rating: "★★★★★",
            level: "Advanced",
        },
        {
            icon: "☁️",
            name: "AWS",
            category: "Cloud Computing",
            mentors: "40 Mentors",
            rating: "★★★★☆",
            level: "Intermediate",
        },
        {
            icon: "🎨",
            name: "UI / UX Design",
            category: "UI / UX Design",
            mentors: "60 Mentors",
            rating: "★★★★☆",
            level: "Beginner",
        },
        {
            icon: "📈",
            name: "Data Science",
            category: "Data Science",
            mentors: "50 Mentors",
            rating: "★★★★★",
            level: "Intermediate",
        },
        {
            icon: "📷",
            name: "Photography",
            category: "Photography",
            mentors: "30 Mentors",
            rating: "★★★★☆",
            level: "Beginner",
        },
        {
            icon: "🎵",
            name: "Music",
            category: "Music",
            mentors: "28 Mentors",
            rating: "★★★★☆",
            level: "Beginner",
        },
        {
            icon: "💼",
            name: "Business Strategy",
            category: "Business",
            mentors: "42 Mentors",
            rating: "★★★★☆",
            level: "Advanced",
        },
    ];


    const [search, setSearch] = useState("");

    const [category, setCategory] =
        useState("All Categories");


    const filteredSkills = skills.filter((skill) => {

        const matchesSearch =
            skill.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                );


        const matchesCategory =
            category === "All Categories" ||
            skill.category === category;


        return matchesSearch && matchesCategory;

    });


    return (

        <>

            <Navbar />

            <div className="skills-page">

                {/* ================= HEADER ================= */}

                <div className="skills-header">

                    <h1>
                        Explore Skills
                    </h1>

                    <p>
                        Discover new skills, connect with expert mentors,
                        and begin your learning journey.
                    </p>


                    {/* Trending Skills */}

                    <div className="trending-section">

                        <h3>
                            🔥 Trending Skills
                        </h3>

                        <div className="trending-skills">

                            <button
                                onClick={() => {
                                    setSearch("React");
                                    setCategory("Programming");
                                }}
                            >
                                ⚛ React
                            </button>


                            <button
                                onClick={() => {
                                    setSearch(
                                        "Artificial Intelligence"
                                    );

                                    setCategory(
                                        "Artificial Intelligence"
                                    );
                                }}
                            >
                                🤖 AI
                            </button>


                            <button
                                onClick={() => {
                                    setSearch("AWS");
                                    setCategory("Cloud Computing");
                                }}
                            >
                                ☁ AWS
                            </button>


                            <button
                                onClick={() => {
                                    setSearch("Spring Boot");
                                    setCategory("Programming");
                                }}
                            >
                                🍃 Spring Boot
                            </button>


                            <button
                                onClick={() => {
                                    setSearch("Python");
                                    setCategory("Programming");
                                }}
                            >
                                🐍 Python
                            </button>

                        </div>

                    </div>


                    {/* Search */}

                    <div className="search-container">

                        <input
                            type="text"
                            placeholder="🔍 Search Skills..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />


                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                        >

                            <option>
                                All Categories
                            </option>

                            <option>
                                Programming
                            </option>

                            <option>
                                Artificial Intelligence
                            </option>

                            <option>
                                Web Development
                            </option>

                            <option>
                                Mobile Development
                            </option>

                            <option>
                                Cloud Computing
                            </option>

                            <option>
                                UI / UX Design
                            </option>

                            <option>
                                Data Science
                            </option>

                            <option>
                                Photography
                            </option>

                            <option>
                                Music
                            </option>

                            <option>
                                Business
                            </option>

                        </select>


                        <button
                            className="reset-btn"
                            onClick={() => {
                                setSearch("");
                                setCategory(
                                    "All Categories"
                                );
                            }}
                        >
                            🔄 Reset
                        </button>

                    </div>

                </div>


                {/* ================= SKILLS GRID ================= */}

                <div className="skills-grid">

                    {filteredSkills.length > 0 ? (

                        filteredSkills.map(
                            (skill, index) => (

                                <div
                                    className="skill-card"
                                    key={index}
                                >

                                    <div className="skill-icon">
                                        {skill.icon}
                                    </div>


                                    <h3>
                                        {skill.name}
                                    </h3>


                                    <p>
                                        {skill.category}
                                    </p>


                                    <span>
                                        {skill.rating}
                                    </span>


                                    <h4>
                                        {skill.mentors}
                                    </h4>


                                    <div
                                        className={`level-badge ${skill.level.toLowerCase()}`}
                                    >
                                        {skill.level}
                                    </div>


                                    {/* VIEW SKILL */}

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/skill-details/${encodeURIComponent(
                                                    skill.name
                                                )}`
                                            )
                                        }
                                    >
                                        View Skill →
                                    </button>

                                </div>

                            )

                        )

                    ) : (

                        <div className="no-results">

                            <h2>
                                😔 No Skills Found
                            </h2>

                            <p>
                                Try another search keyword or select another category.
                            </p>


                            <button
                                className="reset-btn"
                                onClick={() => {
                                    setSearch("");
                                    setCategory(
                                        "All Categories"
                                    );
                                }}
                            >
                                Show All Skills
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </>

    );

}

export default Skills;