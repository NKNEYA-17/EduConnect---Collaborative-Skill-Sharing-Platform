import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/BookingSuccess.css";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { mentorName, slot } = location.state || {};

  const bookingTime = new Date().toLocaleString();

  return (
    <>
      <Navbar />

      <div className="success-page">

        <div className="success-card">

          <div className="success-icon"></div>

          <h1>Booking Confirmed!</h1>

          <p>
            Your mentoring session has been booked successfully.
          </p>

          <div className="booking-details">

            <p>
              <strong>Mentor:</strong> {mentorName}
            </p>

            <p>
              <strong>Time Slot:</strong> {slot}
            </p>

            <p>
              <strong>Booked On:</strong> {bookingTime}
            </p>

          </div>

          <div className="success-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/my-bookings")}
            >
              📚 My Bookings
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/mentors")}
            >
              👨‍🏫 Back to Mentors
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default BookingSuccess;