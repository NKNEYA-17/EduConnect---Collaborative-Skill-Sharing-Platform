import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/MentorSkillManagement.css";


function MentorSkillManagement() {


const user = JSON.parse(
    localStorage.getItem("user")
);



const [skill, setSkill] = useState("");



const [skills, setSkills] = useState(
    user?.skills || []
);



// ===============================
// ADD SKILL AND UPDATE MONGODB
// ===============================

const addSkill = async () => {


if(skill.trim() === ""){

    alert("Please enter a skill");

    return;

}



try{


const userResponse = await fetch(

    `http://localhost:8080/api/users/${user.id}`

);



const latestUser = await userResponse.json();



const updatedSkills = [

    ...(latestUser.skills || []),

    skill.trim()

];





const response = await fetch(

`http://localhost:8080/api/users/${user.id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

    ...latestUser,

    skills:updatedSkills

})


}

);




const data = await response.json();



if(response.ok){


setSkills(updatedSkills);



localStorage.setItem(

"user",

JSON.stringify(data)

);



setSkill("");



alert(
"Skill added successfully!"
);



}

else{


alert(
"Failed to update skills"
);


}


}

catch(error){


console.log(error);


alert(
"Server error while updating skill"
);


}


};





// ===============================
// REMOVE SKILL
// ===============================


const removeSkill = async(index)=>{


try{


const updatedSkills = skills.filter(

(_,i)=>i!==index

);



const response = await fetch(

`http://localhost:8080/api/users/${user.id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

...user,

skills:updatedSkills

})


}

);



const data = await response.json();



if(response.ok){


setSkills(updatedSkills);



localStorage.setItem(

"user",

JSON.stringify(data)

);



alert(
"Skill removed successfully!"
);


}


}

catch(error){

console.log(error);

}


};







return(

<>


<Navbar />


<div className="mentor-skill-management-page">



<div className="mentor-skill-header">


<h1>
💡 My Skills Offered
</h1>


<p>
Add and manage the skills you teach to learners.
</p>


</div>






<div className="skill-management-card">


<h2>
Add New Skill
</h2>




<div className="skill-input-section">


<input

type="text"

placeholder="Example: React, Java, Python"

value={skill}

onChange={(e)=>
setSkill(e.target.value)
}

/>



<button onClick={addSkill}>

Add Skill

</button>



</div>






<div className="added-skills">


<h3>
Skills You Teach
</h3>



{

skills.length > 0 ?


skills.map((item,index)=>(


<div 
className="skill-item"
key={index}
>


<span>
{item}
</span>



<button

onClick={()=>
removeSkill(index)
}

>

✖

</button>


</div>


))


:

<p>
No skills added yet
</p>


}



</div>



</div>



</div>


</>


);


}


export default MentorSkillManagement;