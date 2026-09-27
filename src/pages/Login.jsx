import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

import "../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    // =========================================
    // HANDLE INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // =========================================
    // HANDLE LOGIN
    // =========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        if (
            !formData.email.trim() ||
            !formData.password
        ) {

            alert(
                "Please enter email and password."
            );

            return;
        }


        try {

            setLoading(true);


            // =====================================
            // STEP 1: CHECK ADMIN LOGIN
            // =====================================

            console.log(
                "Checking admin login..."
            );


            const adminResponse =
                await fetch(
                    "http://localhost:8080/api/admin/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            email:
                                formData.email.trim(),

                            password:
                                formData.password,
                        }),
                    }
                );


            // =====================================
            // ADMIN LOGIN SUCCESS
            // =====================================

            if (adminResponse.ok) {

                const adminData =
                    await adminResponse.json();


                console.log(
                    "Admin Login Response:",
                    adminData
                );


                // ---------------------------------
                // Store admin user
                // ---------------------------------

                localStorage.setItem(
                    "user",
                    JSON.stringify(adminData)
                );


                localStorage.setItem(
                    "admin",
                    JSON.stringify(adminData)
                );


                console.log(
                    "Admin login successful"
                );


                // ---------------------------------
                // Go to Admin Dashboard
                // ---------------------------------

                navigate(
                    "/admin-dashboard"
                );

                return;
            }


            // =====================================
            // STEP 2: CHECK NORMAL USER LOGIN
            // =====================================

            console.log(
                "Not an admin. Checking normal user login..."
            );


            const userResponse =
                await fetch(
                    "http://localhost:8080/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            email:
                                formData.email.trim(),

                            password:
                                formData.password,
                        }),
                    }
                );


            // =====================================
            // USER LOGIN SUCCESS
            // =====================================

            if (userResponse.ok) {

                const loginData =
                    await userResponse.json();


                console.log(
                    "User Login Response:",
                    loginData
                );


                // =================================
                // CHECK JWT RESPONSE
                // =================================

                if (
                    !loginData.token ||
                    !loginData.user
                ) {

                    console.error(
                        "JWT token or user data missing:",
                        loginData
                    );

                    alert(
                        "Login response is missing authentication data."
                    );

                    return;
                }


                // =================================
                // STORE JWT TOKEN
                // =================================

                localStorage.setItem(
                    "token",
                    loginData.token
                );


                // =================================
                // STORE USER
                // =================================

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        loginData.user
                    )
                );


                // =================================
                // REMOVE OLD ADMIN DATA
                // =================================

                localStorage.removeItem(
                    "admin"
                );


                console.log(
                    "JWT token stored successfully."
                );

                console.log(
                    "User stored successfully."
                );


                // =================================
                // NORMAL USER
                // =================================

                navigate("/home");

                return;
            }


            // =====================================
            // BOTH LOGINS FAILED
            // =====================================

            alert(
                "Invalid email or password."
            );

        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );


            alert(
                "Server connection failed. Please make sure the backend is running."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // =========================================
    // UI
    // =========================================

    return (

        <div className="login-page">


            {/* =====================================
                LEFT SIDE
            ===================================== */}

            <div className="login-left">

                <div className="login-brand">

                    <h1>
                        🎓 EduConnect
                    </h1>

                    <h2>
                        Welcome Back!
                    </h2>

                    <p>
                        Learn.
                        <br />
                        Teach.
                        <br />
                        Grow Together.
                    </p>

                </div>


                <div className="login-features">

                    <div className="login-feature">
                        🚀 Learn from experienced mentors
                    </div>

                    <div className="login-feature">
                        💡 Share your skills with learners
                    </div>

                    <div className="login-feature">
                        🌍 Connect with a global community
                    </div>

                    <div className="login-feature">
                        📚 Book one-to-one learning sessions
                    </div>

                </div>

            </div>


            {/* =====================================
                RIGHT SIDE
            ===================================== */}

            <div className="login-right">

                <div className="login-card">


                    <h2>
                        Login
                    </h2>


                    <p className="login-subtitle">
                        Continue your learning journey
                    </p>


                    <form
                        className="login-form"
                        onSubmit={handleLogin}
                    >


                        {/* =================================
                            EMAIL
                        ================================= */}

                        <div className="login-input-group">

                            <FaEnvelope
                                className="login-icon"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* =================================
                            PASSWORD
                        ================================= */}

                        <div className="login-input-group">

                            <FaLock
                                className="login-icon"
                            />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />


                            <button
                                type="button"
                                className="login-eye-btn"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {showPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}

                            </button>

                        </div>


                        {/* =================================
                            FORGOT PASSWORD
                        ================================= */}

                        <div className="login-options">

                            <button
                                type="button"
                                className="login-forgot-btn"
                            >
                                Forgot Password?
                            </button>

                        </div>


                        {/* =================================
                            LOGIN BUTTON
                        ================================= */}

                        <button
                            type="submit"
                            className="login-btn-main"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"}

                        </button>


                    </form>


                    {/* =================================
                        DIVIDER
                    ================================= */}

                    <div className="login-divider">

                        <span>
                            OR
                        </span>

                    </div>


                    {/* =================================
                        REGISTER
                    ================================= */}

                    <button
                        className="login-register-link"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create Account
                    </button>


                </div>

            </div>

        </div>

    );

}

export default Login;