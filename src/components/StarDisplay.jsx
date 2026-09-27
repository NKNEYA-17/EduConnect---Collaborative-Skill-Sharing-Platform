
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getTotalStars,
    addDefaultStars,
    getStarHistory
} from "../services/starService";

import {
    getStarLevel
} from "../services/starLevelService";

import "../styles/StarDisplay.css";

function StarDisplay() {

    const [stars, setStars] = useState(0);
    const [history, setHistory] = useState([]);

    // =========================================
    // STAR LEVEL STATE
    // =========================================

    const [levelInfo, setLevelInfo] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    const navigate = useNavigate();


    // =========================================
    // GET CURRENT USER
    // =========================================

    const getCurrentUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Error reading user:",
                error
            );

            return null;
        }
    };


    // =========================================
    // GET USER ID
    // =========================================

    const getUserId = () => {

        const user = getCurrentUser();

        if (!user) {
            return null;
        }

        return (
            user.id ||
            user._id ||
            user.userId
        );
    };


    // =========================================
    // FETCH STAR DATA
    // =========================================

    const fetchStars = async () => {

        const userId = getUserId();

        if (!userId) {

            setStars(0);
            setHistory([]);
            setLevelInfo(null);

            return;
        }

        try {

            // -----------------------------------------
            // ADD DEFAULT 10 STARS ONLY ONCE
            // -----------------------------------------

            await addDefaultStars(userId);


            // -----------------------------------------
            // GET TOTAL STARS
            // -----------------------------------------

            const total =
                await getTotalStars(userId);

            const totalStars =
                Number(total) || 0;

            setStars(totalStars);


            // -----------------------------------------
            // GET STAR HISTORY
            // -----------------------------------------

            const starHistory =
                await getStarHistory(userId);

            if (Array.isArray(starHistory)) {

                setHistory(
                    starHistory.slice(0, 5)
                );

            } else {

                setHistory([]);
            }


            // -----------------------------------------
            // GET STAR LEVEL
            // -----------------------------------------

            const level =
                await getStarLevel(userId);

            if (level) {

                setLevelInfo(level);

            } else {

                setLevelInfo(null);
            }


            // -----------------------------------------
            // DEBUG
            // -----------------------------------------

            console.log(
                "⭐ Star System - User ID:",
                userId
            );

            console.log(
                "⭐ Star System - Total:",
                totalStars
            );

            console.log(
                "🏆 Star Level:",
                level
            );

        } catch (error) {

            console.error(
                "Error loading stars:",
                error
            );

            setStars(0);
            setHistory([]);
            setLevelInfo(null);
        }
    };


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        fetchStars();

        const interval =
            setInterval(
                fetchStars,
                5000
            );


        // -----------------------------------------
        // REFRESH WHEN STARS CHANGE
        // -----------------------------------------

        const handleStarsUpdated = () => {

            console.log(
                "⭐ Stars updated. Refreshing..."
            );

            fetchStars();
        };


        window.addEventListener(
            "starsUpdated",
            handleStarsUpdated
        );


        return () => {

            clearInterval(interval);

            window.removeEventListener(
                "starsUpdated",
                handleStarsUpdated
            );

        };

    }, []);


    // =========================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =========================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {

                setShowDropdown(false);
            }
        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =========================================
    // TRANSACTION ICON
    // =========================================

    const getTransactionIcon = (type) => {

        switch (
            type?.toUpperCase()
        ) {

            case "DEFAULT":
                return "🎁";

            case "LEARNING":
                return "📚";

            case "TEACHING":
                return "🎓";

            case "SKILL_COMPLETION":
                return "🏆";

            case "FEEDBACK":
                return "⭐";

            default:
                return "⭐";
        }
    };


    // =========================================
    // TRANSACTION TITLE
    // =========================================

    const getTransactionTitle = (transaction) => {

        switch (
            transaction?.type?.toUpperCase()
        ) {

            case "DEFAULT":
                return "Welcome Bonus";

            case "LEARNING":
                return "Learning Session";

            case "TEACHING":
                return "Teaching Session";

            case "SKILL_COMPLETION":
                return "Skill Completed";

            case "FEEDBACK":
                return "Feedback Received";

            default:
                return "Stars Earned";
        }
    };


    // =========================================
    // VIEW FULL HISTORY
    // =========================================

    const handleViewHistory = () => {

        setShowDropdown(false);

        navigate("/star-history");
    };


    // =========================================
    // COMPONENT
    // =========================================

    return (

        <div
            className="star-display-wrapper"
            ref={dropdownRef}
        >

            {/* =====================================
                NAVBAR STAR BUTTON
               ===================================== */}

            <button
                type="button"
                className="star-display"
                onClick={() =>
                    setShowDropdown(
                        !showDropdown
                    )
                }
                title="View your stars"
            >

                <span className="star-icon">
                    ⭐
                </span>

                <span className="star-count">
                    {stars}
                </span>

            </button>


            {/* =====================================
                STAR DROPDOWN
               ===================================== */}

            {showDropdown && (

                <div className="star-dropdown">

                    {/* =================================
                        HEADER
                       ================================= */}

                    <div className="star-dropdown-header">

                        <div>

                            <h3>
                                ⭐ My Stars
                            </h3>

                            <span>
                                Your star activity
                            </span>

                        </div>

                        <strong>
                            {stars} ⭐
                        </strong>

                    </div>


                    {/* =================================
                        STAR LEVEL
                       ================================= */}

                    {levelInfo && (

                        <div className="star-level-section">

                            {/* Rank */}

                            <div className="star-level-header">

                                <div className="star-level-rank">

                                    <span className="star-level-emoji">
                                        {levelInfo.emoji}
                                    </span>

                                    <div>

                                        <span className="star-level-label">
                                            Current Rank
                                        </span>

                                        <strong className="star-level-name">
                                            {levelInfo.level}
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* Progress */}

                            <div className="star-progress-container">

                                <div className="star-progress-info">

                                    <span>
                                        Progress
                                    </span>

                                    <span>
                                        {
                                            levelInfo.progressPercentage
                                        }%
                                    </span>

                                </div>


                                <div className="star-progress-bar">

                                    <div
                                        className="star-progress-fill"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    Number(
                                                        levelInfo.progressPercentage
                                                    ) || 0
                                                )
                                            )}%`
                                        }}
                                    />

                                </div>

                            </div>


                            {/* Next level */}

                            {levelInfo.nextLevel ? (

                                <div className="star-next-level">

                                    <span>

                                        ⭐{" "}
                                        {
                                            levelInfo.starsToNextLevel
                                        }{" "}
                                        stars to{" "}

                                        <strong>
                                            {
                                                levelInfo.nextLevel
                                            }
                                        </strong>

                                    </span>

                                </div>

                            ) : (

                                <div className="star-next-level star-max-level">

                                    👑 Maximum Rank Achieved!

                                </div>

                            )}

                        </div>

                    )}


                    {/* =================================
                        DIVIDER
                       ================================= */}

                    <div className="star-dropdown-divider" />


                    {/* =================================
                        RECENT ACTIVITY
                       ================================= */}

                    <div className="star-dropdown-content">

                        {history.length === 0 ? (

                            <div className="star-dropdown-empty">

                                <span>
                                    ⭐
                                </span>

                                <p>
                                    No star activity yet.
                                </p>

                            </div>

                        ) : (

                            history.map(
                                (transaction, index) => (

                                    <div
                                        className="star-dropdown-item"
                                        key={
                                            transaction.id ||
                                            index
                                        }
                                    >

                                        <div className="dropdown-transaction-icon">

                                            {
                                                getTransactionIcon(
                                                    transaction.type
                                                )
                                            }

                                        </div>


                                        <div className="dropdown-transaction-details">

                                            <strong>

                                                {
                                                    getTransactionTitle(
                                                        transaction
                                                    )
                                                }

                                            </strong>

                                            <span>

                                                {
                                                    transaction.description ||
                                                    "Stars earned"
                                                }

                                            </span>

                                        </div>


                                        <div className="dropdown-transaction-stars">

                                            +
                                            {
                                                transaction.stars
                                            }
                                            ⭐

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>


                    {/* =================================
                        VIEW ALL
                       ================================= */}

                    <button
                        type="button"
                        className="view-star-history-button"
                        onClick={
                            handleViewHistory
                        }
                    >

                        View All Star History

                        <span>
                            →
                        </span>

                    </button>

                </div>

            )}

        </div>
    );
}

export default StarDisplay;

