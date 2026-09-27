import { Routes, Route } from "react-router-dom";


// Main Pages
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Skills from "./pages/Skills";
import Mentors from "./pages/Mentors";
import MentorProfile from "./pages/MentorProfile";
import Notifications from "./pages/Notifications";
import Feedback from "./pages/Feedback";
import StarHistory from "./pages/StarHistory";
import Chat from "./pages/Chat";


// Booking
import BookSession from "./pages/BookSession";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import SessionRoom from "./pages/SessionRoom";


// Dashboards
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";


// Mentor
import MentorHub from "./pages/MentorHub";
import MentorApplication from "./pages/MentorApplication";
import MentorForm from "./components/MentorForm";


// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";


// User
import Profile from "./pages/Profile";


// Other Pages
import Community from "./pages/Community";
import About from "./pages/About";
import LearnerSkills from "./pages/LearnerSkills";


// Mentor Management
import MyMentorProfile from "./pages/MyMentorProfile";
import MentorSkillManagement from "./pages/MentorSkillManagement";
import MentorBookings from "./pages/MentorBookings";
import MentorReviews from "./pages/MentorReviews";


// AI
import AICareerReport from "./pages/AICareerReport";


// Admin (create later if not available)
// import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RejectionFeedback from "./pages/RejectionFeedback";
import MentorSessionManagement from "./pages/MentorSessionManagement";
import MentorBookingRequests from "./pages/MentorBookingRequests";

import "./algorithms/testSkillGap";

import SkillDetails from "./pages/SkillDetails";

function App() {


  return (


    <Routes>



      {/* Landing */}

      <Route

        path="/"

        element={<LandingPage />}

      />



      {/* Main Pages */}


      <Route

        path="/home"

        element={<Home />}

      />



      <Route

        path="/skills"

        element={<Skills />}

      />



      <Route

        path="/mentors"

        element={<Mentors />}

      />



      <Route

        path="/mentor/:id"

        element={<MentorProfile />}

      />





      {/* Booking */}


      <Route

        path="/book/:id"

        element={<BookSession />}

      />



      <Route

        path="/booking-success"

        element={<BookingSuccess />}

      />



      <Route

        path="/my-bookings"

        element={<MyBookings />}

      />

      <Route
      path="/session-room/:bookingId"
      element={<SessionRoom />}
      />






      {/* Authentication */}


      <Route

        path="/login"

        element={<Login />}

      />



      <Route

        path="/register"

        element={<Register />}

      />







      {/* Common Dashboard */}

      <Route

        path="/dashboard"

        element={<Dashboard />}

      />





      {/* Student Dashboard */}


      <Route

        path="/student-dashboard"

        element={<StudentDashboard />}

      />







      {/* Mentor Dashboard */}


      <Route

        path="/mentor-dashboard"

        element={<MentorDashboard />}

      />







      {/* Mentor Application */}

      <Route

        path="/mentor-application"

        element={<MentorApplication />}

      />



      <Route

        path="/mentor-form"

        element={<MentorForm />}

      />



      <Route

        path="/mentor-hub"

        element={<MentorHub />}

      />






      {/* Profile */}


      <Route

        path="/profile"

        element={<Profile />}

      />





      {/* Community */}


      <Route

        path="/community"

        element={<Community />}

      />





      {/* About */}


      <Route

        path="/about"

        element={<About />}

      />







      {/* Learner */}


      <Route

        path="/learner-hub"

        element={<LearnerSkills />}

      />








      {/* Mentor Management */}


      <Route

        path="/my-mentor-profile"

        element={<MyMentorProfile />}

      />



      <Route

        path="/mentor-skill-management"

        element={<MentorSkillManagement />}

      />



      <Route

        path="/mentor-bookings"

        element={<MentorBookings />}

      />



      <Route

        path="/mentor-reviews"

        element={<MentorReviews />}

      />








      {/* AI Career Report */}


      <Route

        path="/ai-career-report"

        element={<AICareerReport />}

      />

      <Route
      path="/admin-dashboard"
      element={<AdminDashboard />}
      />

      <Route
    path="/rejection-feedback"
    element={<RejectionFeedback />}
      />

      <Route
      path="/skill-details/:skillName"
      element={<SkillDetails />}
      />

      <Route
    path="/mentor-session-management"
    element={<MentorSessionManagement />}
    />

    <Route
    path="/mentor-booking-requests"
    element={<MentorBookingRequests />}
    />

    <Route
    path="/notifications"
    element={<Notifications />}
    />

    <Route
    path="/feedback/:bookingId"
    element={<Feedback />}
    />

    <Route path="/star-history" element={<StarHistory />} />

    <Route
    path="/chat"
    element={<Chat />}
    />











    </Routes>


  );


}



export default App;