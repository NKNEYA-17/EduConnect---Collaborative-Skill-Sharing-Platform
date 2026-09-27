import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(data);
  }, []);

  const totalBookings = bookings.length;

  const favoriteMentors = [
    ...new Set(bookings.map((b) => b.mentorName)),
  ];

  return (
    <>
      <Navbar />

      <div className="dashboard">

        {/* Header */}
        <div className="dashboard-header">
          <h1>👋 Welcome Back!</h1>
          <p>Your learning progress at a glance</p>
        </div>


        {/* Stats Cards */}
        <div className="stats-container">

          <div className="stat-card">
            <h2>{totalBookings}</h2>
            <p>📚 Total Bookings</p>
          </div>

          <div className="stat-card">
            <h2>{favoriteMentors.length}</h2>
            <p>⭐ Favorite Mentors</p>
          </div>

          <div className="stat-card">
            <h2>3</h2>
            <p>🎯 Skills Enrolled</p>
          </div>

          <div className="stat-card">
            <h2>{totalBookings}</h2>
            <p>📅 Upcoming Sessions</p>
          </div>

        </div>


        {/* Recent Sessions */}
        <div className="section">

          <h2>📚 Recent Sessions</h2>

          {bookings.length === 0 ? (
            <p className="empty-text">
              No sessions booked yet.
            </p>
          ) : (

            <div className="booking-preview">

              {bookings
                .slice(-3)
                .reverse()
                .map((b, i) => (

                  <div 
                    key={i} 
                    className="preview-card"
                  >
                    <h3>{b.mentorName}</h3>
                    <p>{b.slot}</p>
                  </div>

              ))}

            </div>

          )}

        </div>


        {/* Favorite Mentors */}
        <div className="section">

          <h2>⭐ Favorite Mentors</h2>

          <div className="mentor-tags">

            {favoriteMentors.length === 0 ? (

              <p className="empty-text">
                No favorites yet.
              </p>

            ) : (

              favoriteMentors.map((m, i) => (

                <span 
                  key={i} 
                  className="tag"
                >
                  {m}
                </span>

              ))

            )}

          </div>

        </div>


      </div>
    </>
  );
}

export default Dashboard;