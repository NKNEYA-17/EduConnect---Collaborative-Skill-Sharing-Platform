import { useNavigate } from "react-router-dom";
import "../styles/LearnerSkills.css";

function LearnerSkills() {

  const navigate = useNavigate();

  const learningSkills = [
    {
      id: 1,
      name: "React",
      category: "Web Development",
      mentors: 12,
      description: "Learn modern frontend development with React."
    },
    {
      id: 2,
      name: "Python",
      category: "Programming",
      mentors: 8,
      description: "Master Python programming from basics to advanced."
    },
    {
      id: 3,
      name: "UI/UX Design",
      category: "Design",
      mentors: 6,
      description: "Learn user interface and user experience design."
    },
    {
      id: 4,
      name: "Machine Learning",
      category: "Artificial Intelligence",
      mentors: 5,
      description: "Explore ML concepts with practical projects."
    },
    {
      id: 5,
      name: "Java",
      category: "Programming",
      mentors: 10,
      description: "Improve Java skills with expert guidance."
    },
    {
      id: 6,
      name: "Data Structures",
      category: "Computer Science",
      mentors: 7,
      description: "Build strong problem-solving skills."
    }
  ];


  return (

    <div className="learner-page">


      <div className="learner-header">

        <h1>
          Find Skills to Learn
        </h1>

        <p>
          Connect with mentors and learn skills that help you grow
        </p>

      </div>



      <div className="learner-cards">


        {
          learningSkills.map((skill)=> (

            <div 
              className="learner-card"
              key={skill.id}
            >

              <h2>
                {skill.name}
              </h2>


              <h4>
                {skill.category}
              </h4>


              <p>
                {skill.description}
              </p>


              <div className="mentor-count">

                ⭐ {skill.mentors} Mentors Available

              </div>



              <button
                onClick={() => navigate("/mentors")}
              >
                Find Mentor
              </button>


            </div>

          ))
        }


      </div>


    </div>

  );

}


export default LearnerSkills;