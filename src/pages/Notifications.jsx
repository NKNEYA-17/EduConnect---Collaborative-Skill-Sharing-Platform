import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Notifications.css";

function Notifications() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================
    // LOAD USER NOTIFICATIONS
    // =========================================

    const loadNotifications = async () => {

        if (!user?.id) {

            setLoading(false);

            return;
        }

        try {

            setLoading(true);

            setError("");

            const response =
                await fetch(
                    `http://localhost:8080/api/notifications/user/${user.id}`
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to load notifications."
                );

            }


            const data =
                await response.json();


            setNotifications(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Error loading notifications:",
                error
            );

            setError(
                "Unable to load notifications."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD WHEN PAGE OPENS
    // =========================================

    useEffect(() => {

        loadNotifications();

    }, [user?.id]);


    // =========================================
    // MARK ONE NOTIFICATION AS READ
    // =========================================

    const handleNotificationClick = async (
        notification
    ) => {

        if (!notification?.id) {

            return;
        }


        try {

            if (!notification.read) {

                await fetch(
                    `http://localhost:8080/api/notifications/${notification.id}/read`,
                    {
                        method: "PUT"
                    }
                );


                setNotifications(
                    (previousNotifications) =>
                        previousNotifications.map(
                            (item) =>
                                item.id === notification.id
                                    ? {
                                        ...item,
                                        read: true
                                    }
                                    : item
                        )
                );

            }


            // =================================
            // BOOKING REQUEST
            // =================================

            if (
                notification.type ===
                "BOOKING_REQUEST"
            ) {

                navigate(
                    "/mentor-bookings"
                );

                return;

            }


            // =================================
            // BOOKING APPROVED / REJECTED
            // =================================

            if (
                notification.type ===
                    "BOOKING_APPROVED" ||
                notification.type ===
                    "BOOKING_REJECTED"
            ) {

                navigate(
                    "/my-bookings"
                );

            }

        } catch (error) {

            console.error(
                "Error marking notification as read:",
                error
            );

        }

    };


    // =========================================
    // MARK ALL AS READ
    // =========================================

    const handleMarkAllAsRead = async () => {

        if (!user?.id) {

            return;
        }


        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/notifications/user/${user.id}/read-all`,
                    {
                        method: "PUT"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to mark notifications as read."
                );

            }


            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) => ({
                            ...notification,
                            read: true
                        })
                    )
            );


        } catch (error) {

            console.error(
                "Error marking all notifications as read:",
                error
            );

        }

    };


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (dateValue) => {

        if (!dateValue) {

            return "";

        }


        try {

            return new Date(
                dateValue
            ).toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        } catch {

            return "";

        }

    };


    // =========================================
    // NOTIFICATION ICON
    // =========================================

    const getNotificationIcon = (
        notification
    ) => {

        if (
            notification?.type ===
            "BOOKING_REQUEST"
        ) {

            return "📩";

        }

        if (
            notification?.type ===
            "BOOKING_APPROVED"
        ) {

            return "✅";

        }

        if (
            notification?.type ===
            "BOOKING_REJECTED"
        ) {

            return "❌";

        }

        return "🔔";

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="notifications-page">

                <div className="notifications-loading">

                    <div className="notification-spinner">
                        🔔
                    </div>

                    <p>
                        Loading notifications...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================
    // MAIN UI
    // =========================================

    return (

        <div className="notifications-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="notifications-header">

                <div>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Stay updated with your
                        bookings and sessions.
                    </p>

                </div>


                {notifications.length > 0 && (

                    <button
                        className="mark-all-read-btn"
                        onClick={
                            handleMarkAllAsRead
                        }
                    >
                        Mark All as Read
                    </button>

                )}

            </div>


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="notifications-error">

                    {error}

                    <button
                        onClick={
                            loadNotifications
                        }
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =================================
                EMPTY STATE
            ================================= */}

            {!error &&
                notifications.length === 0 && (

                    <div className="notifications-empty">

                        <div className="empty-notification-icon">
                            🔔
                        </div>

                        <h2>
                            No Notifications
                        </h2>

                        <p>
                            You don't have any
                            notifications yet.
                        </p>

                    </div>

                )}


            {/* =================================
                NOTIFICATION LIST
            ================================= */}

            {!error &&
                notifications.length > 0 && (

                    <div className="notifications-list">

                        {notifications.map(
                            (notification) => (

                                <div
                                    key={
                                        notification.id
                                    }

                                    className={
                                        `notification-card ${
                                            notification.read
                                                ? "notification-read"
                                                : "notification-unread"
                                        }`
                                    }

                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                >


                                    {/* ICON */}

                                    <div className="notification-icon">

                                        {getNotificationIcon(
                                            notification
                                        )}

                                    </div>


                                    {/* CONTENT */}

                                    <div className="notification-content">

                                        <div className="notification-title-row">

                                            <h2>
                                                {
                                                    notification.title ||
                                                    "Notification"
                                                }
                                            </h2>


                                            {!notification.read && (

                                                <span className="unread-dot">
                                                </span>

                                            )}

                                        </div>


                                        <p className="notification-message">

                                            {
                                                notification.message ||
                                                ""
                                            }

                                        </p>


                                        {/* BOOKING DETAILS */}

                                        {notification.sessionTitle && (

                                            <div className="notification-booking-info">

                                                <span>
                                                    📚{" "}
                                                    {
                                                        notification.sessionTitle
                                                    }
                                                </span>


                                                {notification.slot && (

                                                    <span>
                                                        🕐{" "}
                                                        {
                                                            notification.slot
                                                        }
                                                    </span>

                                                )}

                                            </div>

                                        )}


                                        <span className="notification-date">

                                            {
                                                formatDate(
                                                    notification.createdAt
                                                )
                                            }

                                        </span>

                                    </div>


                                    {/* ARROW */}

                                    <div className="notification-arrow">

                                        →

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

        </div>

    );

}


export default Notifications;

