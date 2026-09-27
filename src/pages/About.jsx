import Navbar from "../components/Navbar";
import "../styles/About.css";

function About() {

  return (

    <>

      <Navbar />


      <div className="about-page">


        <div className="about-card">


          <h1>
            🎓 About EduConnect
          </h1>


          <p>

            EduConnect is a collaborative skill-sharing platform
            that connects learners and mentors.

          </p>



          <p>

            Our mission is to make learning accessible by
            allowing users to teach skills, learn from experts,
            book sessions and grow together.

          </p>



          <div className="about-features">


            <div>
              💡 Learn Skills
            </div>


            <div>
              👨‍🏫 Connect With Mentors
            </div>


            <div>
              🚀 Grow Together
            </div>


          </div>



        </div>


      </div>


    </>

  );

}


export default About;