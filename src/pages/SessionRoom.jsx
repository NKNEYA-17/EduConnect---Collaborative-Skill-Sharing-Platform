import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/SessionRoom.css";

function SessionRoom() {

  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);


  // =========================================
  // LOAD BOOKING
  // =========================================

  useEffect(() => {

    const loadBooking = async () => {

      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {

        const response = await fetch(
          `http://localhost:8080/api/mentor-bookings/${bookingId}`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load session."
          );
        }

        const data = await response.json();

        setBooking(data);

      } catch (error) {

        console.error(
          "Error loading session:",
          error
        );

        alert(
          "Unable to load the session."
        );

        navigate("/my-bookings");

      } finally {

        setLoading(false);

      }
    };


    loadBooking();

  }, [bookingId, navigate]);


  // =========================================
  // COMPLETE SESSION
  // =========================================

  const completeSession = async () => {

    if (!bookingId) {
      alert("Booking ID is missing.");
      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to complete this session?"
      );

    if (!confirmed) {
      return;
    }


    try {

      setCompleting(true);


      const response = await fetch(
        `http://localhost:8080/api/mentor-bookings/${bookingId}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );


      if (!response.ok) {

        let errorMessage =
          "Unable to complete the session.";

        try {

          const errorText =
            await response.text();

          if (errorText) {
            errorMessage = errorText;
          }

        } catch (error) {

          console.error(
            "Unable to read error response:",
            error
          );

        }

        throw new Error(
          errorMessage
        );
      }


      const completedBooking =
        await response.json();


      setBooking(
        completedBooking
      );


      // Update localStorage as well
      try {

        const savedBookings =
          JSON.parse(
            localStorage.getItem("bookings")
          ) || [];

        const updatedBookings =
          savedBookings.map(
            (item) =>
              item.id === completedBooking.id
                ? completedBooking
                : item
          );

        localStorage.setItem(
          "bookings",
          JSON.stringify(
            updatedBookings
          )
        );

      } catch (storageError) {

        console.error(
          "Unable to update local bookings:",
          storageError
        );

      }


      alert(
        "Session completed successfully!"
      );


      // Return to My Bookings
      navigate("/my-bookings");

    } catch (error) {

      console.error(
        "Error completing session:",
        error
      );

      alert(
        error.message ||
        "Unable to complete the session."
      );

    } finally {

      setCompleting(false);

    }

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="session-room-page">

          <div className="session-room-card">

            <h2>
              Loading Session...
            </h2>

          </div>

        </div>
      </>
    );

  }


  // =========================================
  // BOOKING NOT FOUND
  // =========================================

  if (!booking) {

    return (
      <>
        <Navbar />

        <div className="session-room-page">

          <div className="session-room-card">

            <h2>
              Session Not Found
            </h2>

            <button
              className="back-btn"
              onClick={() =>
                navigate("/my-bookings")
              }
            >
              ← Back to My Bookings
            </button>

          </div>

        </div>
      </>
    );

  }


  // =========================================
  // SESSION ROOM
  // =========================================

  return (
    <>
      <Navbar />

      <div className="session-room-page">

        <div className="session-room-card">

          <div className="session-room-header">

            <h1>
              🎓 Session Room
            </h1>

            <p>
              Your mentoring session is ready.
            </p>

          </div>


          <div className="session-info">

            <div className="info-item">

              <span className="info-label">
                📚 Session
              </span>

              <span className="info-value">
                {booking.sessionTitle ||
                  "Mentoring Session"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                👨‍🏫 Mentor
              </span>

              <span className="info-value">
                {booking.mentorName ||
                  "Mentor"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                🧑‍🎓 Student
              </span>

              <span className="info-value">
                {booking.studentName ||
                  "Student"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                💡 Skill
              </span>

              <span className="info-value">
                {booking.skill ||
                  "Not specified"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                📅 Slot
              </span>

              <span className="info-value">
                {booking.slot ||
                  "Not specified"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                ⏱️ Duration
              </span>

              <span className="info-value">
                {booking.duration ||
                  "Not specified"}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                💻 Mode
              </span>

              <span className="info-value">
                {booking.mode ||
                  "Online"}
              </span>

            </div>

          </div>


          {/* =========================================
              GOOGLE MEET
              ========================================= */}

          {booking.googleMeetLink && (

            <div className="meeting-section">

              <h3>
                🔗 Session Meeting
              </h3>

              <p>
                Join the meeting using the link below.
              </p>

              <a
                href={booking.googleMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="join-meeting-btn"
              >
                🎥 Join Meeting
              </a>

            </div>

          )}


          {/* =========================================
              SESSION STATUS
              ========================================= */}

          <div className="session-status">

            <span>
              🟢 Session In Progress
            </span>

          </div>


          {/* =========================================
              COMPLETE BUTTON
              ========================================= */}

          <button
            className="complete-session-btn"
            onClick={completeSession}
            disabled={
              completing ||
              booking.status === "COMPLETED"
            }
          >

            {completing
              ? "Completing Session..."
              : booking.status === "COMPLETED"
                ? "✅ Session Completed"
                : "✅ Complete Session"}

          </button>


          <button
            className="back-btn"
            onClick={() =>
              navigate("/my-bookings")
            }
          >
            ← Back to My Bookings
          </button>

        </div>

      </div>
    </>
  );
}

export default SessionRoom;