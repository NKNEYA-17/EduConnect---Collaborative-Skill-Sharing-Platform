import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/FormCommon.css";
import "../styles/MentorApplication.css";
import "../styles/Stepper.css";
import "../styles/PersonalInfo.css";
import "../styles/Education.css";
import "../styles/MentorSkills.css";
import "../styles/Portfolio.css";
import "../styles/ReviewSubmit.css";
import "../styles/LivePreview.css";

import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import { validateStep } from "../utils/mentorValidation";

import {
  saveMentorData,
  loadMentorData,
  clearMentorData,
} from "../utils/mentorStorage";

import PersonalInfo from "../components/PersonalInfo";
import Education from "../components/Education";
import MentorSkills from "../components/MentorSkills";
import Portfolio from "../components/Portfolio";
import ReviewSubmit from "../components/ReviewSubmit";
import LivePreview from "../components/LivePreview";


function MentorApplication() {


const navigate = useNavigate();


const initialData = {

  profilePhoto: null,

  fullName: "",
  email: "",
  phone: "",
  city: "",
  country: "",

  degree: "",
  department: "",
  university: "",
  graduationYear: "",
  experience: "",
  profession: "",

  skills: [],
  primarySkill: "",
  languages: "",

  bio: "",
  linkedin: "",
  portfolio: "",

  resume: null,

};



const [currentStep,setCurrentStep] = useState(1);



const [mentorData,setMentorData] = useState(()=>{

  return loadMentorData() || initialData;

});



// =========================
// AUTO SAVE LOCAL STORAGE
// =========================

useEffect(()=>{


const isEmpty =

mentorData.fullName === "" &&
mentorData.email === "" &&
mentorData.phone === "" &&
mentorData.city === "" &&
mentorData.country === "" &&
mentorData.degree === "" &&
mentorData.department === "" &&
mentorData.university === "" &&
mentorData.graduationYear === "" &&
mentorData.experience === "" &&
mentorData.profession === "" &&
mentorData.skills.length === 0 &&
mentorData.primarySkill === "" &&
mentorData.languages === "" &&
mentorData.bio === "" &&
mentorData.linkedin === "" &&
mentorData.portfolio === "" &&
mentorData.profilePhoto === null &&
mentorData.resume === null;



if(!isEmpty){

 saveMentorData(mentorData);

}


},[mentorData]);




// =========================
// HANDLE INPUT
// =========================


const handleChange = (e) => {

    const { name, value } = e.target;

    console.log("FIELD CHANGED:", name, value);

    setMentorData(prev => ({
        ...prev,
        [name]: value
    }));

};




// =========================
// PHOTO UPLOAD
// =========================


const handlePhotoChange=(e)=>{


const file=e.target.files[0];


if(file){

setMentorData(prev=>({

 ...prev,

 profilePhoto:URL.createObjectURL(file)

}));

}


};




// =========================
// SKILL UPDATE
// =========================


const handleSkillChange=(selectedSkills)=>{


setMentorData(prev=>({

 ...prev,

 skills:selectedSkills

}));

};




// =========================
// RESET
// =========================


const resetForm=()=>{


clearMentorData();


setMentorData(initialData);


setCurrentStep(1);


};





// =========================
// SUBMIT APPLICATION
// =========================


const handleSubmit=async()=>{


const errors=validateStep(
 currentStep,
 mentorData
);



if(Object.keys(errors).length>0){


alert(Object.values(errors)[0]);

return;

}



try{


const loggedInUser=
JSON.parse(
localStorage.getItem("user")
);



// 1. SAVE MENTOR APPLICATION IN MONGODB

const applicationResponse=
await fetch(

"http://localhost:8080/api/mentor-applications",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

...mentorData,

userId:loggedInUser.id,

status:"PENDING"

})

}

);



if(!applicationResponse.ok){

throw new Error(
"Mentor application saving failed"
);

}




// 2. UPDATE USER STATUS


const userResponse=
await fetch(

`http://localhost:8080/api/users/${loggedInUser.id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

...loggedInUser,

mentorStatus:"PENDING",

})

}

);




if(!userResponse.ok){

throw new Error(
"User status update failed"
);

}




// 3. UPDATE LOCAL STORAGE


const updatedUser=
await userResponse.json();


localStorage.setItem(

"user",

JSON.stringify(updatedUser)

);




// SUCCESS


alert(

"🎉 Mentor Application Submitted Successfully!\n\nYour application is pending admin approval."

);



resetForm();



setTimeout(()=>{


navigate("/home");


},1000);



}

catch(error){


console.error(error);


alert(
"Unable to submit mentor application."
);


}


};





// =========================
// STEP RENDER
// =========================


const renderStep=()=>{


switch(currentStep){


case 1:

return (

<PersonalInfo

mentorData={mentorData}

handleChange={handleChange}

handlePhotoChange={handlePhotoChange}

/>

);



case 2:

return (

<Education

mentorData={mentorData}

handleChange={handleChange}

/>

);



case 3:

return (

<MentorSkills

mentorData={mentorData}

handleChange={handleChange}

handleSkillChange={handleSkillChange}

/>

);



case 4:

return (

<Portfolio

mentorData={mentorData}

handleChange={handleChange}

/>

);



case 5:

return (

<ReviewSubmit

mentorData={mentorData}

handleSubmit={handleSubmit}

/>

);



default:

return null;


}



};






return (

<>


<Navbar />


<div className="mentor-page">


<div className="mentor-container">



<h1>
Become an EduConnect Mentor
</h1>



<p className="mentor-subtitle">

Complete your mentor profile to inspire learners around the world.

</p>




<Stepper currentStep={currentStep}/>





<div className="wizard-layout">



<div className="form-panel">



<div className="step-content">

{renderStep()}

</div>





<div className="wizard-buttons">



{currentStep>1 &&

<button

className="next-btn"

onClick={()=>setCurrentStep(prev=>prev-1)}

>

← Back

</button>

}





{currentStep<5 &&

<button

className="next-btn"

onClick={()=>{


const errors=
validateStep(
currentStep,
mentorData
);



if(Object.keys(errors).length>0){

alert(Object.values(errors)[0]);

return;

}



setCurrentStep(prev=>prev+1);


}}

>

Next →

</button>

}



</div>



</div>







<div className="preview-panel">


<LivePreview

mentorData={mentorData}

/>


</div>





</div>




</div>


</div>


</>


);


}


export default MentorApplication;