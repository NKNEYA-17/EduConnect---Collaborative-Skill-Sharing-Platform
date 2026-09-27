import Navbar from "../components/Navbar";
import "../styles/MentorBookings.css";


function MentorBookings(){



const user =
JSON.parse(
localStorage.getItem("user")
);





const allBookings =
JSON.parse(
localStorage.getItem("bookings")
) || [];





// Only this mentor bookings

const bookings =
allBookings.filter(
(booking)=>

booking.mentorName === String(user?.name)

);






return(

<>


<Navbar />



<div className="mentor-bookings-page">



<div className="mentor-bookings-header">


<h1>
📅 Upcoming Sessions
</h1>


<p>
Manage your upcoming mentoring sessions with learners.
</p>


</div>







<div className="booking-container">



{

bookings.length > 0 ?



bookings.map(
(booking,index)=>(


<div

className="booking-card"

key={index}

>


<h2>

👨‍🎓 {booking.studentName}

</h2>



<p>

<strong>
Skill:
</strong>

{" "}

{booking.skill}

</p>




<p>

<strong>
Date:
</strong>

{" "}

{booking.date}

</p>




<p>

<strong>
Status:
</strong>


<span className="booking-status">

{booking.status}

</span>


</p>





<p>

<strong>
Session:
</strong>

{" "}

{booking.session}

</p>



</div>



)

)



:



<div className="no-bookings">


<h2>
📭 No Upcoming Sessions
</h2>


<p>
You don't have any scheduled sessions yet.
</p>



</div>



}



</div>



</div>



</>

);



}



export default MentorBookings;