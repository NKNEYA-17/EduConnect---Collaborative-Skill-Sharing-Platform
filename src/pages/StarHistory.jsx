
import { useEffect, useState } from "react";

import { getStarHistory } from "../services/starService";

import { getStarLevel } from "../services/starLevelService";

import "../styles/StarHistory.css";

function StarHistory() {

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [totalStars, setTotalStars] = useState(0);

    const [levelInfo, setLevelInfo] = useState(null);

    const [error, setError] = useState("");


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
    // LOAD STAR HISTORY + LEVEL
    // =========================================

    const loadStarHistory = async () => {

        const user = getCurrentUser();

        if (!user) {

            setError(
                "Please login to view your star history."
            );

            setLoading(false);

            return;
        }


        // =========================================
        // GET USER ID
        // =========================================

        const userId =
            user.id ||
            user._id ||
            user.userId;


        if (!userId) {

            setError(
                "User ID not found."
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");


            // =========================================
            // GET STAR HISTORY
            // =========================================

            const data =
                await getStarHistory(userId);


            const transactions =
                Array.isArray(data)
                    ? data
                    : [];


            setHistory(
                transactions
            );


            // =========================================
            // CALCULATE TOTAL FROM HISTORY
            // =========================================

            const total =
                transactions.reduce(
                    (
                        sum,
                        transaction
                    ) =>
                        sum +
                        (
                            Number(
                                transaction.stars
                            ) || 0
                        ),
                    0
                );


            setTotalStars(total);


            // =========================================
            // GET STAR LEVEL
            // =========================================

            const level =
                await getStarLevel(userId);


            if (level) {

                setLevelInfo(level);

            } else {

                setLevelInfo(null);
            }


            // =========================================
            // DEBUG
            // =========================================

            console.log(
                "⭐ Star History - Total:",
                total
            );

            console.log(
                "🏆 Star History - Level:",
                level
            );

        } catch (error) {

            console.error(
                "Error loading star history:",
                error
            );

            setError(
                "Unable to load your star history."
            );

            setHistory([]);

            setLevelInfo(null);

        } finally {

            setLoading(false);
        }
    };


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        loadStarHistory();


        // =========================================
        // REFRESH WHEN STARS CHANGE
        // =========================================

        const handleStarsUpdated = () => {

            loadStarHistory();
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


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "Recently";
        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {
            return "Recently";
        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


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

    const getTransactionTitle = (
        transaction
    ) => {

        const type =
            transaction?.type?.toUpperCase();


        switch (type) {

            case "DEFAULT":
                return "Welcome Bonus";

            case "LEARNING":
                return "Learning Session Completed";

            case "TEACHING":
                return "Teaching Session Completed";

            case "SKILL_COMPLETION":
                return "Skill Completed";

            case "FEEDBACK":
                return "Feedback Received";

            default:
                return "Stars Earned";
        }
    };


    // =========================================
    // COMPONENT
    // =========================================

    return (

        <div className="star-history-page">


            {/* =====================================
                HEADER
               ===================================== */}

            <div className="star-history-header">

                <div>

                    <h1>
                        ⭐ My Stars
                    </h1>

                    <p>
                        Track your progress and see
                        how you earned your stars.
                    </p>

                </div>

            </div>


            {/* =====================================
                TOTAL STARS CARD
               ===================================== */}

            <div className="star-total-card">

                <div className="star-total-icon">
                    ⭐
                </div>


                <div className="star-total-info">

                    <span>
                        Total Stars Earned
                    </span>

                    <strong>
                        {totalStars}
                    </strong>

                </div>

            </div>


            {/* =====================================
                STAR LEVEL CARD
               ===================================== */}

            {!loading &&
                !error &&
                levelInfo && (

                <div className="star-level-card">


                    {/* =================================
                        LEVEL HEADER
                       ================================= */}

                    <div className="star-level-card-header">

                        <div className="star-level-card-rank">

                            <div className="star-level-large-emoji">

                                {
                                    levelInfo.emoji
                                }

                            </div>


                            <div>

                                <span className="star-level-card-label">
                                    Current Rank
                                </span>

                                <h2>
                                    {
                                        levelInfo.level
                                    }
                                </h2>

                            </div>

                        </div>


                        <div className="star-level-card-stars">

                            ⭐{" "}
                            {
                                levelInfo.totalStars ??
                                totalStars
                            }

                        </div>

                    </div>


                    {/* =================================
                        PROGRESS
                       ================================= */}

                    <div className="star-history-progress-section">

                        <div className="star-history-progress-info">

                            <span>
                                Progress to next rank
                            </span>

                            <strong>
                                {
                                    levelInfo.progressPercentage
                                }%
                            </strong>

                        </div>


                        <div className="star-history-progress-bar">

                            <div
                                className="star-history-progress-fill"
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


                    {/* =================================
                        NEXT LEVEL
                       ================================= */}

                    {levelInfo.nextLevel ? (

                        <div className="star-history-next-level">

                            <span>
                                ⭐{" "}
                                {
                                    levelInfo.starsToNextLevel
                                }{" "}
                                more stars needed to reach
                            </span>

                            <strong>
                                {
                                    levelInfo.nextLevel
                                }
                            </strong>

                        </div>

                    ) : (

                        <div className="star-history-max-level">

                            👑 Congratulations!
                            You have reached the
                            maximum rank.

                        </div>

                    )}

                </div>

            )}


            {/* =====================================
                ACTIVITY SECTION
               ===================================== */}

            <div className="star-activity-section">

                <h2>
                    Recent Activity
                </h2>


                {/* =================================
                    LOADING
                   ================================= */}

                {loading && (

                    <div className="star-history-message">

                        Loading your star history...

                    </div>

                )}


                {/* =================================
                    ERROR
                   ================================= */}

                {!loading &&
                    error && (

                    <div className="star-history-message error">

                        {error}

                    </div>

                )}


                {/* =================================
                    EMPTY
                   ================================= */}

                {!loading &&
                    !error &&
                    history.length === 0 && (

                    <div className="star-history-message">

                        <div className="empty-star-icon">
                            ⭐
                        </div>

                        <h3>
                            No stars earned yet
                        </h3>

                        <p>
                            Complete learning sessions,
                            teach skills, or receive
                            feedback to earn stars.
                        </p>

                    </div>

                )}


                {/* =================================
                    HISTORY LIST
                   ================================= */}

                {!loading &&
                    !error &&
                    history.length > 0 && (

                    <div className="star-history-list">

                        {history.map(
                            (
                                transaction,
                                index
                            ) => (

                            <div
                                className="star-history-item"
                                key={
                                    transaction.id ||
                                    index
                                }
                            >


                                {/* =====================
                                    ICON
                                   ===================== */}

                                <div className="transaction-icon">

                                    {
                                        getTransactionIcon(
                                            transaction.type
                                        )
                                    }

                                </div>


                                {/* =====================
                                    DETAILS
                                   ===================== */}

                                <div className="transaction-details">

                                    <h3>

                                        {
                                            getTransactionTitle(
                                                transaction
                                            )
                                        }

                                    </h3>


                                    <p>

                                        {
                                            transaction.description ||
                                            "Stars earned"
                                        }

                                    </p>


                                    {transaction.skill && (

                                        <span className="transaction-skill">

                                            Skill:{" "}

                                            {
                                                transaction.skill
                                            }

                                        </span>

                                    )}


                                    <small>

                                        {
                                            formatDate(
                                                transaction.createdAt
                                            )
                                        }

                                    </small>

                                </div>


                                {/* =====================
                                    STARS
                                   ===================== */}

                                <div className="transaction-stars">

                                    <span>
                                        +
                                        {
                                            transaction.stars
                                        }
                                    </span>

                                    <span>
                                        ⭐
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default StarHistory;

