import Navbar from "../components/Navbar";
import "../styles/Community.css";

function Community() {

  return (

    <>

      <Navbar />

      <div className="community-page">


        <div className="community-header">

          <h1>
            🌍 EduConnect Community
          </h1>

          <p>
            Connect, collaborate and grow together with learners
            and mentors.
          </p>

        </div>



        <div className="community-cards">


          <div className="community-card">

            <h2>
              💬 Discussions
            </h2>

            <p>
              Share ideas, ask questions and learn from
              other members.
            </p>

          </div>





          <div className="community-card">

            <h2>
              🤝 Collaboration
            </h2>

            <p>
              Work together on projects and exchange knowledge.
            </p>

          </div>






          <div className="community-card">

            <h2>
              🚀 Skill Growth
            </h2>

            <p>
              Track your learning journey with the community.
            </p>

          </div>



        </div>



      </div>


    </>

  );

}


export default Community;