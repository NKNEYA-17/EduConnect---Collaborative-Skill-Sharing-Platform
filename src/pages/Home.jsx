import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import FeatureSection from "../components/FeatureSection";

import "../styles/Home.css";


function Home() {


const navigate = useNavigate();



const [loggedInUser,setLoggedInUser] = useState(null);



// Load user from localStorage

useEffect(()=>{


const user = JSON.parse(
localStorage.getItem("user")
);


setLoggedInUser(user);



},[]);




// Mentor status

const mentorStatus =
loggedInUser?.mentorStatus || "NOT_APPLIED";




return (

<>


<Navbar />



<div className="home">



<section className="hero">



{/* Welcome */}

{loggedInUser && (

<p className="welcome-message">

Welcome back, {loggedInUser.name}! 👋

</p>

)}





<h1>

Learn Skills.

<br />

Teach Others.

<br />

Grow Together.

</h1>




<p>

Connect with learners and mentors from around the world.

Share your knowledge, discover new skills,

and build your learning journey with EduConnect.

</p>





<div className="hero-buttons">





{/* Explore Skills */}

<button

className="primary-btn"

onClick={()=>navigate("/skills")}

>

🚀 Explore Skills

</button>







{/* Student Dashboard */}

<button

className="secondary-btn"

onClick={()=>navigate("/student-dashboard")}

>

📚 Student Dashboard

</button>







{/* Learner */}

<button

className="secondary-btn"

onClick={()=>navigate("/learner-hub")}

>

🎓 Become a Learner

</button>







{/* =====================
     MENTOR STATUS FLOW
===================== */}





{
mentorStatus === "NOT_APPLIED" &&

<button

className="secondary-btn"

onClick={()=>navigate("/mentor-hub")}

>

👨‍🏫 Become a Mentor

</button>

}






{
mentorStatus === "PENDING" &&

<button

className="secondary-btn"

disabled

>

⏳ Application Pending

</button>

}







{
mentorStatus === "APPROVED" &&

<button

className="secondary-btn"

onClick={()=>navigate("/mentor-dashboard")}

>

👨‍🏫 Mentor Dashboard

</button>

}







{
mentorStatus === "REJECTED" &&

<button
    className="secondary-btn"
    onClick={() => navigate("/rejection-feedback")}
>
    🔄 Apply Again
</button>

}





</div>



</section>






<FeatureSection />





</div>



</>

);

}



export default Home;