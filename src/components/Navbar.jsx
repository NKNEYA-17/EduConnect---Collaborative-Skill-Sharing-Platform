import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./../styles/Navbar.css";
import UserIcon from "./UserIcon";
import { FaBell, FaComments } from "react-icons/fa";

// ⭐ STAR
import StarDisplay from "./StarDisplay";


function Navbar() {

    // =========================================
    // GET LOGGED-IN USER
    // =========================================

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // =========================================
    // NOTIFICATION COUNT
    // =========================================

    const [unreadCount, setUnreadCount] =
        useState(0);


    // =========================================
    // CHAT UNREAD COUNT
    // =========================================

    const [unreadChatCount, setUnreadChatCount] =
        useState(0);


    // =========================================
    // LOAD UNREAD NOTIFICATION COUNT
    // =========================================

    const loadUnreadCount = async () => {

        if (!user?.id) {

            setUnreadCount(0);

            return;

        }

        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/notifications/user/${user.id}/count`
                );


            if (response.ok) {

                const count =
                    await response.json();

                setUnreadCount(count);

            }

        } catch (error) {

            console.error(
                "Error loading notification count:",
                error
            );

        }

    };


    // =========================================
    // LOAD UNREAD CHAT COUNT
    // =========================================

    const loadUnreadChatCount = async () => {

        if (!user?.id) {

            setUnreadChatCount(0);

            return;

        }

        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/chat/unread/${user.id}`
                );


            if (response.ok) {

                const messages =
                    await response.json();


                if (Array.isArray(messages)) {

                    setUnreadChatCount(
                        messages.length
                    );

                } else {

                    setUnreadChatCount(0);

                }

            } else {

                setUnreadChatCount(0);

            }

        } catch (error) {

            console.error(
                "Error loading unread chat count:",
                error
            );

            setUnreadChatCount(0);

        }

    };


    // =========================================
    // LOAD NOTIFICATIONS + CHAT
    // =========================================

    useEffect(() => {

        if (!user?.id) {

            setUnreadCount(0);

            setUnreadChatCount(0);

            return;

        }


        // Initial load
        loadUnreadCount();

        loadUnreadChatCount();


        // =====================================
        // REFRESH EVERY 5 SECONDS
        // =====================================

        const interval =
            setInterval(() => {

                loadUnreadCount();

                loadUnreadChatCount();

            }, 5000);


        return () => {

            clearInterval(interval);

        };

    }, [user?.id]);


    // =========================================
    // RENDER NAVBAR
    // =========================================

    return (

        <nav className="navbar">


            {/* =================================
                LOGO
            ================================= */}

            <div className="logo">

                <span className="logo-icon">
                    🎓
                </span>

                <span className="logo-text">
                    EduConnect
                </span>

            </div>


            {/* =================================
                NAVIGATION
            ================================= */}

            <ul className="nav-links">


                {/* HOME */}

                <li>

                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            isActive
                                ? "active-link"
                                : ""
                        }
                    >
                        Home
                    </NavLink>

                </li>


                {/* SKILLS */}

                <li>

                    <NavLink
                        to="/skills"
                        className={({ isActive }) =>
                            isActive
                                ? "active-link"
                                : ""
                        }
                    >
                        Skills
                    </NavLink>

                </li>


                {/* MENTORS */}

                <li>

                    <NavLink
                        to="/mentors"
                        className={({ isActive }) =>
                            isActive
                                ? "active-link"
                                : ""
                        }
                    >
                        Mentors
                    </NavLink>

                </li>


                {/* COMMUNITY */}

                <li>

                    <NavLink
                        to="/community"
                        className={({ isActive }) =>
                            isActive
                                ? "active-link"
                                : ""
                        }
                    >
                        Community
                    </NavLink>

                </li>


                {/* ABOUT */}

                <li>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive
                                ? "active-link"
                                : ""
                        }
                    >
                        About
                    </NavLink>

                </li>


            </ul>


            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="nav-buttons">


                {/* =================================
                    LOGIN & REGISTER
                ================================= */}

                {!user && (

                    <>

                        <NavLink to="/login">

                            <button className="login-btn">
                                Login
                            </button>

                        </NavLink>


                        <NavLink to="/register">

                            <button className="register-btn">
                                Register
                            </button>

                        </NavLink>

                    </>

                )}


                {/* =================================
                    USER + STAR + NOTIFICATION + CHAT
                ================================= */}

                <div className="nav-actions">


                    {/* =================================
                        USER ICON
                    ================================= */}

                    <div className="user-icon-wrapper">

                        <UserIcon />

                    </div>


                    {/* =================================
                        ⭐ STAR COUNT
                    ================================= */}

                    {user && (

                        <StarDisplay />

                    )}


                    {/* =================================
                        🔔 NOTIFICATION BELL
                    ================================= */}

                    {user && (

                        <NavLink
                            to="/notifications"
                            className="notification-link"
                            title="Notifications"
                            aria-label="Open Notifications"
                        >

                            <FaBell />


                            {/* UNREAD NOTIFICATION BADGE */}

                            {unreadCount > 0 && (

                                <span className="notification-badge">

                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}

                                </span>

                            )}

                        </NavLink>

                    )}


                    {/* =================================
                        💬 CHAT
                    ================================= */}

                    {user && (

                        <NavLink
                            to="/chat"
                            className={({ isActive }) =>
                                `chat-nav-link ${
                                    isActive
                                        ? "chat-nav-active"
                                        : ""
                                }`
                            }
                            title="Chat"
                            aria-label="Open Chat"
                        >

                            <span className="chat-icon-wrapper">

                                <FaComments />


                                {/* =================================
                                    UNREAD CHAT BADGE
                                ================================= */}

                                {unreadChatCount > 0 && (

                                    <span className="chat-unread-badge">

                                        {unreadChatCount > 99
                                            ? "99+"
                                            : unreadChatCount}

                                    </span>

                                )}

                            </span>

                        </NavLink>

                    )}


                </div>


            </div>


        </nav>

    );

}


export default Navbar;