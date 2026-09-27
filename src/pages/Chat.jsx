import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";

import Navbar from "../components/Navbar";
import "../styles/Chat.css";

function Chat() {

    const navigate = useNavigate();
    const location = useLocation();

    const storedUser =
        JSON.parse(localStorage.getItem("user")) || null;

    const token =
        localStorage.getItem("token");

    // =========================================
    // STATE
    // =========================================

    const [bookings, setBookings] = useState([]);

    const [selectedBooking, setSelectedBooking] =
        useState(null);

    const [messages, setMessages] = useState([]);

    const [message, setMessage] = useState("");

    const [loadingBookings, setLoadingBookings] =
        useState(true);

    const [loadingMessages, setLoadingMessages] =
        useState(false);

    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");

    const [mentorProfile, setMentorProfile] =
        useState(null);

    const [socketConnected, setSocketConnected] =
        useState(false);

    const messagesEndRef = useRef(null);

    const stompClientRef = useRef(null);

    const subscriptionRef = useRef(null);

    const bookingSubscriptionRef =
        useRef(null);

    // =========================================
    // CURRENT USER
    // =========================================

    const currentUserId =
        storedUser?.id || null;

    const currentUserName =
        storedUser?.name ||
        storedUser?.username ||
        "User";

    // =========================================
    // DETERMINE USER ROLE
    // =========================================

    const storedRole =
        storedUser?.role?.toUpperCase() || "";

    const mentorStatus =
        storedUser?.mentorStatus?.toUpperCase() || "";

    const isMentorRole =
        storedRole === "MENTOR" ||
        mentorStatus === "APPROVED";

    // =========================================
    // LOAD MENTOR PROFILE
    // =========================================

    const loadMentorProfile = async () => {

        if (!currentUserId) {
            return null;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/mentor-profiles/user/${currentUserId}`,
                {
                    headers: token
                        ? {
                            Authorization:
                                `Bearer ${token}`
                        }
                        : {}
                }
            );

            if (!response.ok) {

                console.log(
                    "Current user does not have a mentor profile."
                );

                return null;
            }

            const data =
                await response.json();

            setMentorProfile(data);

            return data;

        } catch (err) {

            console.error(
                "Error loading mentor profile:",
                err
            );

            return null;
        }
    };

    // =========================================
    // LOAD USER BOOKINGS
    // =========================================

    const loadBookings = async () => {

        if (!currentUserId) {

            setBookings([]);

            setLoadingBookings(false);

            setError(
                "Please login to use Chat."
            );

            return;
        }

        try {

            setLoadingBookings(true);

            setError("");

            let bookingList = [];

            // =====================================
            // MENTOR BOOKINGS
            // =====================================

            if (isMentorRole) {

                console.log(
                    "💬 Chat - User is an approved mentor"
                );

                console.log(
                    "💬 Chat - Mentor User ID:",
                    currentUserId
                );

                const profile =
                    mentorProfile ||
                    await loadMentorProfile();

                if (!profile?.id) {

                    console.error(
                        "Mentor profile not found for user:",
                        currentUserId
                    );

                    setBookings([]);

                    setError(
                        "Mentor profile not found. Please complete your mentor profile."
                    );

                    return;
                }

                console.log(
                    "💬 Chat - Mentor Profile ID:",
                    profile.id
                );

                const response = await fetch(
                    `http://localhost:8080/api/mentor-bookings/mentor/${profile.id}`,
                    {
                        headers: token
                            ? {
                                Authorization:
                                    `Bearer ${token}`
                            }
                            : {}
                    }
                );

                if (!response.ok) {

                    throw new Error(
                        "Unable to load your student bookings."
                    );
                }

                const data =
                    await response.json();

                bookingList =
                    Array.isArray(data)
                        ? data
                        : [];

            }

            // =====================================
            // STUDENT BOOKINGS
            // =====================================

            else {

                console.log(
                    "💬 Chat - User is student"
                );

                const response = await fetch(
                    `http://localhost:8080/api/mentor-bookings/student/${currentUserId}`,
                    {
                        headers: token
                            ? {
                                Authorization:
                                    `Bearer ${token}`
                            }
                            : {}
                    }
                );

                if (!response.ok) {

                    throw new Error(
                        "Unable to load your booked sessions."
                    );
                }

                const data =
                    await response.json();

                bookingList =
                    Array.isArray(data)
                        ? data
                        : [];
            }

            // =====================================
            // REMOVE REJECTED BOOKINGS
            // =====================================

            const chatBookings =
                bookingList.filter(
                    (booking) =>
                        booking &&
                        booking.id &&
                        booking.status?.toUpperCase() !==
                            "REJECTED"
                );

            setBookings(chatBookings);

            // =====================================
            // SUPPORT NAVIGATION STATE
            // =====================================

            const stateBooking =
                location.state?.booking;

            if (
                stateBooking &&
                stateBooking.id
            ) {

                const matchingBooking =
                    chatBookings.find(
                        (booking) =>
                            booking.id ===
                            stateBooking.id
                    );

                if (matchingBooking) {

                    setSelectedBooking(
                        matchingBooking
                    );
                }
            }

        } catch (err) {

            console.error(
                "Error loading chat bookings:",
                err
            );

            setError(
                err.message ||
                "Unable to load your chat sessions."
            );

        } finally {

            setLoadingBookings(false);
        }
    };

    // =========================================
    // LOAD BOOKINGS WHEN CHAT OPENS
    // =========================================

    useEffect(() => {

        loadBookings();

    }, [
        currentUserId,
        isMentorRole
    ]);

    // =========================================
    // LOAD MESSAGES
    // =========================================

    const loadMessages = async (
        bookingId,
        showLoading = true
    ) => {

        if (!bookingId) {
            return;
        }

        try {

            if (showLoading) {
                setLoadingMessages(true);
            }

            const response = await fetch(
                `http://localhost:8080/api/chat/session/${bookingId}`,
                {
                    headers: token
                        ? {
                            Authorization:
                                `Bearer ${token}`
                        }
                        : {}
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to load messages."
                );
            }

            const data =
                await response.json();

            setMessages(
                Array.isArray(data)
                    ? data
                    : []
            );

            // =====================================
            // MARK RECEIVED MESSAGES AS READ
            // =====================================

            if (currentUserId) {

                try {

                    await fetch(
                        `http://localhost:8080/api/chat/session/${bookingId}/read/${currentUserId}`,
                        {
                            method: "PUT",

                            headers: token
                                ? {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                                : {}
                        }
                    );

                } catch (readError) {

                    console.error(
                        "Unable to mark messages as read:",
                        readError
                    );
                }
            }

        } catch (err) {

            console.error(
                "Error loading messages:",
                err
            );

            setError(
                err.message ||
                "Unable to load conversation."
            );

        } finally {

            setLoadingMessages(false);
        }
    };

    // =========================================
    // SUBSCRIBE TO BOOKING-SPECIFIC CHAT
    // =========================================

    const subscribeToBooking = (
        client,
        bookingId
    ) => {

        if (
            !client ||
            !client.connected ||
            !bookingId
        ) {

            console.log(
                "⚠️ Cannot subscribe to booking yet."
            );

            return;
        }

        // =====================================
        // REMOVE OLD BOOKING SUBSCRIPTION
        // =====================================

        if (
            bookingSubscriptionRef.current
        ) {

            bookingSubscriptionRef.current.unsubscribe();

            bookingSubscriptionRef.current =
                null;
        }

        const destination =
            `/topic/chat/${bookingId}`;

        console.log(
            "📡 Subscribing to booking:",
            destination
        );

        bookingSubscriptionRef.current =
            client.subscribe(
                destination,
                (frame) => {

                    try {

                        const incomingMessage =
                            JSON.parse(
                                frame.body
                            );

                        console.log(
                            "📩 Booking WebSocket message:",
                            incomingMessage
                        );

                        // =================================
                        // CHECK CURRENT BOOKING
                        // =================================

                        if (
                            incomingMessage.bookingId !==
                            bookingId
                        ) {

                            console.log(
                                "⚠️ Message belongs to another booking."
                            );

                            return;
                        }

                        // =================================
                        // ADD MESSAGE TO CHAT
                        // =================================

                        setMessages(
                            (previousMessages) => {

                                const alreadyExists =
                                    previousMessages.some(
                                        (existingMessage) =>
                                            existingMessage.id &&
                                            incomingMessage.id &&
                                            existingMessage.id ===
                                            incomingMessage.id
                                    );

                                if (
                                    alreadyExists
                                ) {

                                    return previousMessages;
                                }

                                return [
                                    ...previousMessages,
                                    incomingMessage
                                ];
                            }
                        );

                    } catch (err) {

                        console.error(
                            "❌ Unable to process booking WebSocket message:",
                            err
                        );
                    }
                }
            );
    };

    // =========================================
    // CONNECT WEBSOCKET
    // =========================================

    useEffect(() => {

        if (
            !currentUserId ||
            !token
        ) {
            return;
        }

        console.log(
            "🔌 Connecting to WebSocket..."
        );

        const client =
            new Client({

                brokerURL:
                    "ws://localhost:8080/ws",

                connectHeaders: {
                    Authorization:
                        `Bearer ${token}`
                },

                reconnectDelay: 5000,

                debug: (str) => {

                    console.log(
                        "STOMP:",
                        str
                    );
                },

                onConnect: () => {

                    console.log(
                        "✅ WebSocket connected"
                    );

                    setSocketConnected(true);

                    // =================================
                    // GENERAL USER SUBSCRIPTION
                    // =================================

                    subscriptionRef.current =
                        client.subscribe(
                            "/user/queue/messages",
                            (frame) => {

                                try {

                                    const incomingMessage =
                                        JSON.parse(
                                            frame.body
                                        );

                                    console.log(
                                        "📩 User WebSocket message:",
                                        incomingMessage
                                    );

                                } catch (err) {

                                    console.error(
                                        "Unable to process user WebSocket message:",
                                        err
                                    );
                                }
                            }
                        );
                },

                onDisconnect: () => {

                    console.log(
                        "🔌 WebSocket disconnected"
                    );

                    setSocketConnected(false);
                },

                onStompError: (frame) => {

                    console.error(
                        "❌ STOMP error:",
                        frame
                    );

                    setSocketConnected(false);
                },

                onWebSocketError: (error) => {

                    console.error(
                        "❌ WebSocket error:",
                        error
                    );

                    setSocketConnected(false);
                }
            });

        stompClientRef.current =
            client;

        client.activate();

        return () => {

            // =====================================
            // REMOVE BOOKING SUBSCRIPTION
            // =====================================

            if (
                bookingSubscriptionRef.current
            ) {

                bookingSubscriptionRef.current.unsubscribe();

                bookingSubscriptionRef.current =
                    null;
            }

            // =====================================
            // REMOVE USER SUBSCRIPTION
            // =====================================

            if (
                subscriptionRef.current
            ) {

                subscriptionRef.current.unsubscribe();

                subscriptionRef.current =
                    null;
            }

            // =====================================
            // DISCONNECT SOCKET
            // =====================================

            if (
                stompClientRef.current
            ) {

                stompClientRef.current.deactivate();

                stompClientRef.current =
                    null;
            }

            setSocketConnected(false);
        };

    }, [
        currentUserId,
        token
    ]);

    // =========================================
    // SUBSCRIBE WHEN BOOKING IS SELECTED
    // =========================================

    useEffect(() => {

        if (
            !selectedBooking?.id ||
            !socketConnected ||
            !stompClientRef.current
        ) {

            return;
        }

        subscribeToBooking(
            stompClientRef.current,
            selectedBooking.id
        );

        return () => {

            if (
                bookingSubscriptionRef.current
            ) {

                bookingSubscriptionRef.current.unsubscribe();

                bookingSubscriptionRef.current =
                    null;
            }
        };

    }, [
        selectedBooking?.id,
        socketConnected
    ]);

    // =========================================
    // SELECT CHAT
    // =========================================

    const selectBooking = (
        booking
    ) => {

        if (
            !booking ||
            !booking.id
        ) {
            return;
        }

        console.log(
            "💬 Selected booking:",
            booking
        );

        setSelectedBooking(
            booking
        );

        setMessages([]);

        setError("");

        loadMessages(
            booking.id,
            true
        );
    };

    // =========================================
    // AUTO SCROLL
    // =========================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    // =========================================
    // GET MENTOR USER ID
    // =========================================

    const getMentorUserId = async (
        mentorProfileId
    ) => {

        if (!mentorProfileId) {
            return null;
        }

        // =====================================
        // CURRENT USER IS THE MENTOR
        // =====================================

        if (
            isMentorRole &&
            mentorProfile?.id === mentorProfileId
        ) {

            return currentUserId;
        }

        // =====================================
        // GET MENTOR PROFILE
        // =====================================

        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/mentor-profiles/${mentorProfileId}`,
                    {
                        headers: token
                            ? {
                                Authorization:
                                    `Bearer ${token}`
                            }
                            : {}
                    }
                );

            if (!response.ok) {

                console.error(
                    "Mentor profile could not be found."
                );

                return null;
            }

            const profile =
                await response.json();

            return profile?.userId || null;

        } catch (err) {

            console.error(
                "Error resolving mentor User ID:",
                err
            );

            return null;
        }
    };

    // =========================================
    // SEND MESSAGE
    // =========================================

    const handleSendMessage = async () => {

        const trimmedMessage =
            message.trim();

        if (
            !trimmedMessage ||
            !selectedBooking ||
            !currentUserId ||
            sending
        ) {
            return;
        }

        const bookingId =
            selectedBooking.id;

        const studentId =
            selectedBooking.studentId;

        const studentName =
            selectedBooking.studentName ||
            (
                studentId === currentUserId
                    ? currentUserName
                    : "Student"
            );

        const mentorProfileId =
            selectedBooking.mentorId;

        const mentorName =
            selectedBooking.mentorName ||
            "Mentor";

        const isCurrentUserStudent =
            currentUserId === studentId;

        const isCurrentUserMentor =
            isMentorRole &&
            !isCurrentUserStudent;

        const senderId =
            currentUserId;

        const senderName =
            isCurrentUserStudent
                ? studentName
                : currentUserName;

        let receiverId = null;

        let receiverName = null;

        // =====================================
        // STUDENT → MENTOR
        // =====================================

        if (isCurrentUserStudent) {

            receiverId =
                await getMentorUserId(
                    mentorProfileId
                );

            receiverName =
                mentorName;
        }

        // =====================================
        // MENTOR → STUDENT
        // =====================================

        else if (isCurrentUserMentor) {

            receiverId =
                studentId;

            receiverName =
                studentName;
        }

        // =====================================
        // INVALID USER
        // =====================================

        else {

            setError(
                "Unable to determine your role for this chat."
            );

            return;
        }

        if (!receiverId) {

            setError(
                "Unable to determine the other user's ID. Please try again."
            );

            return;
        }

        if (
            receiverId === currentUserId
        ) {

            setError(
                "You cannot send a message to yourself."
            );

            return;
        }

        try {

            setSending(true);

            setError("");

            // =====================================
            // WEBSOCKET SEND
            // =====================================

            if (
                stompClientRef.current &&
                stompClientRef.current.connected
            ) {

                const chatMessage = {

                    bookingId,

                    studentId,

                    studentName,

                    mentorId:
                        mentorProfileId,

                    mentorName,

                    senderId,

                    senderName,

                    receiverId,

                    receiverName,

                    message:
                        trimmedMessage
                };

                console.log(
                    "📤 Sending WebSocket message:",
                    chatMessage
                );

                stompClientRef.current.publish({

                    destination:
                        "/app/chat.send",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(
                            chatMessage
                        )
                });

                setMessage("");

            } else {

                // =================================
                // FALLBACK TO REST API
                // =================================

                console.warn(
                    "WebSocket not connected. Using REST fallback."
                );

                const formData =
                    new URLSearchParams();

                formData.append(
                    "bookingId",
                    bookingId
                );

                formData.append(
                    "studentId",
                    studentId
                );

                formData.append(
                    "studentName",
                    studentName
                );

                formData.append(
                    "mentorId",
                    mentorProfileId
                );

                formData.append(
                    "mentorName",
                    mentorName
                );

                formData.append(
                    "senderId",
                    senderId
                );

                formData.append(
                    "senderName",
                    senderName
                );

                formData.append(
                    "receiverId",
                    receiverId
                );

                formData.append(
                    "receiverName",
                    receiverName
                );

                formData.append(
                    "message",
                    trimmedMessage
                );

                const response =
                    await fetch(
                        "http://localhost:8080/api/chat/send",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded",

                                ...(token
                                    ? {
                                        Authorization:
                                            `Bearer ${token}`
                                    }
                                    : {})
                            },

                            body:
                                formData.toString()
                        }
                    );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to send message."
                    );
                }

                setMessage("");

                await loadMessages(
                    bookingId,
                    false
                );
            }

        } catch (err) {

            console.error(
                "Error sending message:",
                err
            );

            setError(
                err.message ||
                "Unable to send message."
            );

        } finally {

            setSending(false);
        }
    };

    // =========================================
    // ENTER KEY
    // =========================================

    const handleKeyDown = (
        event
    ) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSendMessage();
        }
    };

    // =========================================
    // FORMAT TIME
    // =========================================

    const formatTime = (
        timestamp
    ) => {

        if (!timestamp) {
            return "";
        }

        const date =
            new Date(timestamp);

        if (
            isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        return date.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (
        timestamp
    ) => {

        if (!timestamp) {
            return "";
        }

        const date =
            new Date(timestamp);

        if (
            isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        return date.toLocaleDateString(
            [],
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    // =========================================
    // CHECK DATE CHANGE
    // =========================================

    const shouldShowDate = (
        index
    ) => {

        if (index === 0) {
            return true;
        }

        const currentDate =
            formatDate(
                messages[index]?.timestamp
            );

        const previousDate =
            formatDate(
                messages[index - 1]?.timestamp
            );

        return (
            currentDate !==
            previousDate
        );
    };

    // =========================================
    // GET BOOKING STATUS
    // =========================================

    const getStatus = (
        booking
    ) => {

        return (
            booking?.status ||
            "PENDING"
        ).toUpperCase();
    };

    // =========================================
    // GET CHAT PERSON NAME
    // =========================================

    const getChatPersonName = (
        booking
    ) => {

        if (isMentorRole) {

            return (
                booking?.studentName ||
                "Student"
            );
        }

        return (
            booking?.mentorName ||
            "Mentor"
        );
    };

    // =========================================
    // GET CHAT DESCRIPTION
    // =========================================

    const getChatDescription = (
        booking
    ) => {

        return (
            booking?.skill ||
            booking?.sessionTitle ||
            "Mentoring Session"
        );
    };

    // =========================================
    // BACK TO CHAT LIST
    // =========================================

    const backToChatList = () => {

        setSelectedBooking(null);

        setMessages([]);

        setError("");
    };

    // =========================================
    // NO LOGIN
    // =========================================

    if (!storedUser) {

        return (
            <>
                <Navbar />

                <div className="chat-page">

                    <div className="chat-empty">

                        <div className="chat-empty-icon">
                            💬
                        </div>

                        <h2>
                            Login Required
                        </h2>

                        <p>
                            Please login to use Chat.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </button>

                    </div>

                </div>
            </>
        );
    }

    // =========================================
    // LOADING BOOKINGS
    // =========================================

    if (loadingBookings) {

        return (
            <>
                <Navbar />

                <div className="chat-page">

                    <div className="chat-container">

                        <div className="chat-loading">

                            <div className="chat-loader">
                                💬
                            </div>

                            <p>
                                Loading your chats...
                            </p>

                        </div>

                    </div>

                </div>
            </>
        );
    }

    // =========================================
    // CHAT LIST
    // =========================================

    if (!selectedBooking) {

        return (
            <>
                <Navbar />

                <div className="chat-page">

                    <div className="chat-container chat-list-container">

                        <div className="chat-header">

                            <div className="chat-user-avatar">
                                💬
                            </div>

                            <div className="chat-header-info">

                                <h2>
                                    My Chats
                                </h2>

                                <p>
                                    {isMentorRole
                                        ? "Chat with students from your sessions"
                                        : "Chat with mentors from your sessions"}
                                </p>

                            </div>

                            <div
                                className={
                                    `chat-socket-status ${
                                        socketConnected
                                            ? "connected"
                                            : "disconnected"
                                    }`
                                }
                                title={
                                    socketConnected
                                        ? "Real-time chat connected"
                                        : "Real-time chat disconnected"
                                }
                            >
                                {socketConnected
                                    ? "●"
                                    : "○"}
                            </div>

                        </div>

                        {error && (

                            <div className="chat-error">
                                {error}
                            </div>

                        )}

                        {bookings.length === 0 ? (

                            <div className="chat-no-messages">

                                <div>
                                    📚
                                </div>

                                <h3>
                                    No Chat Sessions
                                </h3>

                                <p>
                                    {isMentorRole
                                        ? "Students who book your mentoring sessions will appear here."
                                        : "Once you book a mentoring session, your mentor will appear here."}
                                </p>

                                {!isMentorRole && (

                                    <button
                                        className="chat-find-mentor-btn"
                                        onClick={() =>
                                            navigate("/mentors")
                                        }
                                    >
                                        Find a Mentor
                                    </button>

                                )}

                            </div>

                        ) : (

                            <div className="chat-booking-list">

                                {bookings.map(
                                    (booking) => (

                                        <div
                                            className="chat-booking-card"
                                            key={
                                                booking.id
                                            }
                                            onClick={() =>
                                                selectBooking(
                                                    booking
                                                )
                                            }
                                        >

                                            <div className="chat-booking-avatar">
                                                👤
                                            </div>

                                            <div className="chat-booking-info">

                                                <h3>
                                                    {
                                                        getChatPersonName(
                                                            booking
                                                        )
                                                    }
                                                </h3>

                                                <p>
                                                    📚{" "}
                                                    {
                                                        getChatDescription(
                                                            booking
                                                        )
                                                    }
                                                </p>

                                                <span>
                                                    📅{" "}
                                                    {
                                                        booking.slot ||
                                                        "Session booked"
                                                    }
                                                </span>

                                            </div>

                                            <div className="chat-booking-right">

                                                <span
                                                    className={
                                                        `chat-booking-status ${getStatus(
                                                            booking
                                                        ).toLowerCase()}`
                                                    }
                                                >
                                                    {
                                                        getStatus(
                                                            booking
                                                        )
                                                    }
                                                </span>

                                                <span className="chat-arrow">
                                                    →
                                                </span>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>
            </>
        );
    }

    // =========================================
    // CONVERSATION VIEW
    // =========================================

    const chatPersonName =
        getChatPersonName(
            selectedBooking
        );

    return (
        <>
            <Navbar />

            <div className="chat-page">

                <div className="chat-container">

                    <div className="chat-header">

                        <button
                            className="chat-back-button"
                            onClick={
                                backToChatList
                            }
                        >
                            ←
                        </button>

                        <div className="chat-user-avatar">
                            👤
                        </div>

                        <div className="chat-header-info">

                            <h2>
                                {chatPersonName}
                            </h2>

                            <p>
                                {
                                    getChatDescription(
                                        selectedBooking
                                    )
                                }
                            </p>

                        </div>

                        <div
                            className={
                                `chat-socket-status ${
                                    socketConnected
                                        ? "connected"
                                        : "disconnected"
                                }`
                            }
                        >
                            {socketConnected
                                ? "●"
                                : "○"}
                        </div>

                    </div>

                    {error && (

                        <div className="chat-error">
                            {error}
                        </div>

                    )}

                    <div className="chat-messages">

                        {loadingMessages ? (

                            <div className="chat-loading">

                                <div className="chat-loader">
                                    💬
                                </div>

                                <p>
                                    Loading conversation...
                                </p>

                            </div>

                        ) : messages.length === 0 ? (

                            <div className="chat-no-messages">

                                <div>
                                    💬
                                </div>

                                <h3>
                                    Start the Conversation
                                </h3>

                                <p>
                                    Send a message to{" "}
                                    {chatPersonName}.
                                </p>

                            </div>

                        ) : (

                            messages.map(
                                (
                                    chatMessage,
                                    index
                                ) => {

                                    const isSent =
                                        chatMessage.senderId ===
                                        currentUserId;

                                    return (
                                        <div
                                            key={
                                                chatMessage.id ||
                                                `${chatMessage.timestamp}-${index}`
                                            }
                                        >

                                            {shouldShowDate(
                                                index
                                            ) && (

                                                <div className="chat-date">

                                                    {
                                                        formatDate(
                                                            chatMessage.timestamp
                                                        )
                                                    }

                                                </div>

                                            )}

                                            <div
                                                className={
                                                    `chat-message-row ${
                                                        isSent
                                                            ? "sent"
                                                            : "received"
                                                    }`
                                                }
                                            >

                                                <div
                                                    className={
                                                        `chat-message ${
                                                            isSent
                                                                ? "message-sent"
                                                                : "message-received"
                                                        }`
                                                    }
                                                >

                                                    {!isSent && (

                                                        <div className="message-sender">

                                                            {
                                                                chatMessage.senderName ||
                                                                (
                                                                    isMentorRole
                                                                        ? "Student"
                                                                        : "Mentor"
                                                                )
                                                            }

                                                        </div>

                                                    )}

                                                    <div className="message-text">

                                                        {
                                                            chatMessage.message
                                                        }

                                                    </div>

                                                    <div className="message-time">

                                                        {
                                                            formatTime(
                                                                chatMessage.timestamp
                                                            )
                                                        }

                                                        {isSent && (

                                                            <span
                                                                className={
                                                                    chatMessage.read
                                                                        ? "message-read"
                                                                        : "message-sent-status"
                                                                }
                                                            >
                                                                {" "}
                                                                ✓✓
                                                            </span>

                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )
                        )}

                        <div
                            ref={
                                messagesEndRef
                            }
                        />

                    </div>

                    <div className="chat-input-area">

                        <textarea
                            value={message}
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            placeholder="Type a message..."
                            disabled={sending}
                            rows={1}
                        />

                        <button
                            onClick={
                                handleSendMessage
                            }
                            disabled={
                                !message.trim() ||
                                sending
                            }
                            title="Send message"
                        >
                            {sending
                                ? "..."
                                : "➤"}
                        </button>

                    </div>

                    <div className="chat-input-hint">

                        Press Enter to send •
                        Shift + Enter for new line

                    </div>

                </div>

            </div>
        </>
    );
}

export default Chat;