import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/StudentDashboard.css";


function AICareerReport(){


const location = useLocation();


const {
aiReport,
skillAnalysis,
llmAnalysis
} = location.state || {};



return(

<>

<Navbar/>


<div className="student-dashboard">


<div className="skill-gap-card">


<h2>

📊 AI Career Analysis Report

</h2>



<h3>
🎯 Career Readiness Score
</h3>

<p>

{aiReport?.score}% Ready for {aiReport?.role}

</p>





<h3>
💼 Job Match Prediction
</h3>


{

aiReport?.jobMatches?.map(

(job,index)=>(

<p key={index}>
✓ {job}
</p>

)

)

}






<h3>
📊 Skill Gap Report
</h3>


{

aiReport?.missingSkills?.map(

(skill,index)=>(

<p key={index}>
❌ Improve {skill}
</p>

)

)

}







<h3>
📅 Personalized Learning Roadmap
</h3>



{

aiReport?.roadmap?.map(

(item,index)=>(

<p key={index}>
{item}
</p>

)

)

}





<h3>
📚 Recommended Courses
</h3>



{

aiReport?.courses?.map(

(course,index)=>(

<p key={index}>
📘 {course}
</p>

)

)

}






<h3>
💻 Recommended Project
</h3>


<p>

{llmAnalysis?.recommendedProject || aiReport?.project}

</p>






<h3>
🎤 Interview Questions
</h3>


{

aiReport?.interview?.map(

(question,index)=>(

<p key={index}>

{index+1}. {question}

</p>

)

)

}






<h3>
💡 AI Learning Recommendation
</h3>


<p>

{llmAnalysis?.analysis}

</p>



</div>


</div>


</>

);


}


export default AICareerReport;