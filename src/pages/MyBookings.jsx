import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/MyBookings.css";

function MyBookings() {

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingBookingId, setCompletingBookingId] = useState(null);





  // =========================================
  // GET CURRENT USER
  // =========================================

  const getCurrentUser = () => {

    try {

      const storedUser =
        JSON.parse(localStorage.getItem("user"));

      return storedUser;

    } catch (error) {

      console.error(
        "Unable to read logged-in user:",
        error
      );

      return null;
    }
  };





  // =========================================
  // LOAD BOOKINGS
  // =========================================

  const loadBookings = async () => {

    const user = getCurrentUser();





    if (!user || !user.id) {

      console.error(
        "Logged-in student information not found."
      );

      setBookings([]);

      setLoading(false);

      return;
    }





    try {

      setLoading(true);





      const response = await fetch(
        `http://localhost:8080/api/mentor-bookings/student/${user.id}`
      );





      if (!response.ok) {

        throw new Error(
          "Failed to fetch bookings."
        );
      }





      const backendBookings =
        await response.json();





      setBookings(
        Array.isArray(backendBookings)
          ? backendBookings
          : []
      );





      // =====================================
      // ALSO UPDATE LOCAL STORAGE
      // =====================================

      localStorage.setItem(
        "bookings",
        JSON.stringify(
          Array.isArray(backendBookings)
            ? backendBookings
            : []
        )
      );





    } catch (error) {

      console.error(
        "Error loading bookings:",
        error
      );





      // =====================================
      // FALLBACK TO LOCAL STORAGE
      // =====================================

      try {

        const savedBookings =
          JSON.parse(
            localStorage.getItem("bookings")
          ) || [];





        setBookings(
          Array.isArray(savedBookings)
            ? savedBookings
            : []
        );

      } catch (storageError) {

        console.error(
          "Unable to load local bookings:",
          storageError
        );

        setBookings([]);
      }

    } finally {

      setLoading(false);
    }
  };





  // =========================================
  // LOAD WHEN PAGE OPENS
  // =========================================

  useEffect(() => {

    loadBookings();

  }, []);





  // =========================================
  // FORMAT BOOKED DATE
  // =========================================

  const formatBookedDate = (booking) => {

    // -----------------------------------------
    // Try backend requestedAt
    // -----------------------------------------

    if (booking.requestedAt) {

      const date =
        new Date(
          booking.requestedAt
        );





      if (!isNaN(date.getTime())) {

        return date.toLocaleString();
      }
    }





    // -----------------------------------------
    // Try existing localStorage time
    // -----------------------------------------

    if (booking.time) {

      const date =
        new Date(
          booking.time
        );





      if (!isNaN(date.getTime())) {

        return date.toLocaleString();
      }
    }





    // -----------------------------------------
    // Try bookedOn
    // -----------------------------------------

    if (booking.bookedOn) {

      const date =
        new Date(
          booking.bookedOn
        );





      if (!isNaN(date.getTime())) {

        return date.toLocaleString();
      }
    }





    return "Date not available";
  };





  // =========================================
  // GET BOOKING STATUS
  // =========================================

  const getBookingStatus = (booking) => {

    if (!booking.status) {

      return "PENDING";
    }





    return booking.status.toUpperCase();
  };





  // =========================================
  // COMPLETE SESSION
  // =========================================

  const completeSession = async (bookingId) => {

    if (!bookingId) {

      alert(
        "Booking ID is missing."
      );

      return;
    }





    try {

      setCompletingBookingId(
        bookingId
      );





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

            errorMessage =
              errorText;
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





      // =====================================
      // UPDATE FRONTEND STATE
      // =====================================

      setBookings(
        (currentBookings) =>
          currentBookings.map(
            (booking) =>
              booking.id ===
              completedBooking.id
                ? completedBooking
                : booking
          )
      );





      // =====================================
      // UPDATE LOCAL STORAGE
      // =====================================

      setBookings((currentBookings) => {

        const updatedBookings =
          currentBookings.map(
            (booking) =>
              booking.id ===
              completedBooking.id
                ? completedBooking
                : booking
          );

        localStorage.setItem(
          "bookings",
          JSON.stringify(
            updatedBookings
          )
        );

        return updatedBookings;

      });





      // =====================================
      // UPDATE STAR DISPLAY
      // =====================================

      window.dispatchEvent(
        new Event("starsUpdated")
      );





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

      setCompletingBookingId(
        null
      );
    }
  };





  // =========================================
  // CANCEL BOOKING
  // =========================================

  const cancelBooking = (index) => {

    const booking =
      bookings[index];





    // =====================================
    // DON'T ALLOW CANCEL AFTER COMPLETION
    // =====================================

    if (
      getBookingStatus(booking) ===
      "COMPLETED"
    ) {

      return;
    }





    const updatedBookings =
      [...bookings];





    updatedBookings.splice(
      index,
      1
    );





    setBookings(
      updatedBookings
    );





    localStorage.setItem(
      "bookings",
      JSON.stringify(
        updatedBookings
      )
    );
  };





  // =========================================
  // STATUS UI
  // =========================================

  const renderStatus = (booking) => {

    const status =
      getBookingStatus(booking);





    // =====================================
    // PENDING
    // =====================================

    if (status === "PENDING") {

      return (
        <p className="status">
          ⏳ Booking Request Pending
        </p>
      );
    }





    // =====================================
    // APPROVED
    // =====================================

    if (status === "APPROVED") {

      return (
        <p className="status">
          🟢 Confirmed
        </p>
      );
    }





    // =====================================
    // COMPLETED
    // =====================================

    if (status === "COMPLETED") {

      return (
        <p className="status">
          ✅ Session Completed
        </p>
      );
    }





    // =====================================
    // REJECTED
    // =====================================

    if (status === "REJECTED") {

      return (
        <p className="status">
          ❌ Booking Rejected
        </p>
      );
    }





    // =====================================
    // DEFAULT
    // =====================================

    return (
      <p className="status">
        ℹ️ {status}
      </p>
    );
  };





  // =========================================
  // ACTION BUTTONS
  // =========================================

  const renderActions = (
    booking,
    index
  ) => {

    const status =
      getBookingStatus(booking);





    // =====================================
    // PENDING
    // =====================================

    if (status === "PENDING") {

      return (
        <button
          className="cancel-btn"
          onClick={() =>
            cancelBooking(index)
          }
        >
          Cancel Booking
        </button>
      );
    }





    // =====================================
    // APPROVED
    // =====================================

    if (status === "APPROVED") {

      return (
        <div className="booking-actions">

          <button
            className="attend-btn"
            onClick={() =>
              navigate(
                `/session-room/${booking.id}`
              )
            }
          >
            🎓 Attend Session
          </button>





          <button
            className="cancel-btn"
            onClick={() =>
              cancelBooking(index)
            }
          >
            Cancel Booking
          </button>

        </div>
      );
    }





    // =====================================
    // COMPLETED
    // =====================================

    if (status === "COMPLETED") {

      return (
        <div className="booking-actions">

          <button
            className="feedback-btn"
            onClick={() =>
              navigate(
                `/feedback/${booking.id}`
              )
            }
          >
            <span className="feedback-star"></span>

            <span>
              Give Rating & Feedback
            </span>

            <span className="feedback-arrow">
              →
            </span>
          </button>

        </div>
      );
    }





    // =====================================
    // REJECTED
    // =====================================

    if (status === "REJECTED") {

      return null;
    }





    return null;
  };





  // =========================================
  // LOADING UI
  // =========================================

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="my-bookings-page">

          <h1>
            📚 My Bookings
          </h1>

          <div className="empty-bookings">

            <h2>
              Loading bookings...
            </h2>

          </div>

        </div>
      </>
    );
  }





  // =========================================
  // MAIN UI
  // =========================================

  return (
    <>
      <Navbar />

      <div className="my-bookings-page">

        <h1>
          📚 My Bookings
        </h1>





        {bookings.length === 0 ? (

          <div className="empty-bookings">

            <h2>
              No bookings yet!
            </h2>

            <p>
              Book a mentoring session to see it here.
            </p>

          </div>

        ) : (

          <div className="booking-list">

            {bookings.map(
              (booking, index) => (

                <div
                  className="booking-card"
                  key={
                    booking.id ||
                    index
                  }
                >

                  {/* =================================
                      MENTOR NAME
                  ================================= */}

                  <h2>
                    {booking.mentorName ||
                      "Mentor"}
                  </h2>





                  {/* =================================
                      SESSION TITLE
                  ================================= */}

                  {booking.sessionTitle && (

                    <p>
                      <strong>
                        📚 Session:
                      </strong>{" "}
                      {booking.sessionTitle}
                    </p>

                  )}





                  {/* =================================
                      SLOT
                  ================================= */}

                  <p>
                    <strong>
                      📅 Slot:
                    </strong>{" "}
                    {booking.slot}
                  </p>





                  {/* =================================
                      BOOKED DATE
                  ================================= */}

                  <p>
                    <strong>
                      🕒 Booked On:
                    </strong>{" "}
                    {formatBookedDate(
                      booking
                    )}
                  </p>





                  {/* =================================
                      STATUS
                  ================================= */}

                  {renderStatus(
                    booking
                  )}





                  {/* =================================
                      MENTOR RESPONSE
                  ================================= */}

                  {booking.mentorResponse && (
                    <p>
                      <strong>
                        💬 Mentor Response:
                      </strong>{" "}
                      {booking.mentorResponse}
                    </p>
                  )}





                  {/* =================================
                      ACTION BUTTONS
                  ================================= */}

                  {renderActions(
                    booking,
                    index
                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>
    </>
  );
}





export default MyBookings;