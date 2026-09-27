import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/UserIcon.css";


function UserIcon(){


const [showMenu,setShowMenu]=useState(false);


const navigate=useNavigate();



const user =
JSON.parse(
localStorage.getItem("user")
);




const isMentor =
user?.role?.toUpperCase()
===
"MENTOR";




const dashboardPath =
isMentor
?
"/mentor-dashboard"
:
"/student-dashboard";



const profilePath =
isMentor
?
"/my-mentor-profile"
:
"/profile";




const bookingPath =
isMentor
?
"/mentor-booking-requests"
:
"/my-bookings";



const bookingText =
isMentor
?
"My Sessions"
:
"My Bookings";





const logout=()=>{


localStorage.removeItem("user");

navigate("/login");


};





return(


<div className="user-icon-container">



<button

className="user-icon"

onClick={()=>
setShowMenu(!showMenu)
}

>

<FaUser />

</button>






{

showMenu &&

<div className="user-dropdown">



<p
onClick={()=>
navigate(profilePath)
}
>

My Profile

</p>





<p

onClick={()=>
navigate(dashboardPath)
}

>

Dashboard

</p>





<p

onClick={()=>
navigate(bookingPath)
}

>

{bookingText}

</p>





<p

onClick={logout}

>

Logout

</p>




</div>


}





</div>


);



}



export default UserIcon;