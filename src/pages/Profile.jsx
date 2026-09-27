import Navbar from "../components/Navbar";
import "../styles/Profile.css";

function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  if (!user) {

    return (
      <>
        <Navbar />

        <div className="profile-page">

          <div className="profile-card">

            <h2>
              Please login to view your profile
            </h2>

          </div>

        </div>
      </>
    );

  }


  return (
    <>
      <Navbar />

      <div className="profile-page">

        <div className="profile-card">


          {/* Profile Avatar */}

          <div className="profile-avatar">

            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"
            }

          </div>


          {/* User Name */}

          <h1>
            {user.name || "User"}
          </h1>


          {/* Email */}

          <p className="profile-email">
            {user.email}
          </p>



          {/* Personal Information */}

          <div className="profile-section">

            <h2>
              👤 Personal Information
            </h2>

            <p>
              📧 Email:{" "}
              {user.email || "Not available"}
            </p>

            <p>
              📱 Phone:{" "}
              {user.phone || "Not available"}
            </p>

            <p>
              🎓 Role:{" "}
              {user.role || "STUDENT"}
            </p>

          </div>



          {/* Skills Offered */}

          <div className="profile-section">

            <h2>
              💡 Skills Offered
            </h2>

            <div className="skill-list">

              {user.skills &&
              user.skills.length > 0 ? (

                user.skills.map(
                  (skill, index) => (

                    <span key={index}>
                      {skill}
                    </span>

                  )
                )

              ) : (

                <p>
                  No skills added yet
                </p>

              )}

            </div>

          </div>



          {/* Learning Goals */}

          <div className="profile-section">

            <h2>
              🎯 Learning Goals
            </h2>

            <div className="skill-list">

              {user.learningGoals &&
              user.learningGoals.length > 0 ? (

                user.learningGoals.map(
                  (goal, index) => (

                    <span key={index}>
                      {goal}
                    </span>

                  )
                )

              ) : (

                <p>
                  No learning goals added yet
                </p>

              )}

            </div>

          </div>



          {/* Interests */}

          <div className="profile-section">

            <h2>
              ⭐ Interests
            </h2>

            <div className="skill-list">

              {user.interests &&
              user.interests.length > 0 ? (

                user.interests.map(
                  (interest, index) => (

                    <span key={index}>
                      {interest}
                    </span>

                  )
                )

              ) : (

                <p>
                  No interests added yet
                </p>

              )}

            </div>

          </div>



          {/* Edit Profile */}

          <button className="edit-btn">

            ✏️ Edit Profile

          </button>


        </div>

      </div>

    </>
  );

}


export default Profile;