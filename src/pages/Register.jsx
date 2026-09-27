import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
} from "react-icons/fa";

import "../styles/Register.css";


function Register() {


  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const [formData, setFormData] = useState({

    fullName: "",

    email: "",

    phone: "",

    skill: "",

    password: "",

    confirmPassword: "",

  });



  const [isLoading, setIsLoading] = useState(false);





  const handleChange = (e) => {


    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });


  };







  const handleRegister = async (e) => {


    e.preventDefault();




    if(formData.password !== formData.confirmPassword){

      alert("Passwords do not match!");

      return;

    }






    // Default user registration

    const userData = {

  name: formData.fullName,

  email: formData.email,

  password: formData.password,

  phone: formData.phone,

  // Every user starts as STUDENT
  role: "STUDENT",

  // Save selected skill as current skill
  skills: formData.skill
    ? [formData.skill]
    : [],

  // Initially no learning interests
  interests: [],

  learningGoals: [],

  profileImage: "",

};





    try{


      setIsLoading(true);




      const response = await fetch(

        "http://localhost:8080/api/auth/register",

        {

          method:"POST",


          headers:{

            "Content-Type":"application/json",

          },


          body:JSON.stringify(userData),

        }

      );






      const data = await response.json();






      if(response.ok){


        alert(

          "Registration successful! Please login."

        );


        navigate("/login");


      }


      else{


        alert(

          data || "Registration failed. Please try again."

        );


      }




    }


    catch(error){


      console.error(

        "Registration Error:",

        error

      );



      alert(

        "Unable to connect to server. Make sure Spring Boot backend is running."

      );


    }



    finally{


      setIsLoading(false);


    }


  };









  return (


    <div className="register-page">



      {/* LEFT SIDE */}


      <div className="register-left">


        <div className="register-brand">


          <h1>

            🎓 EduConnect

          </h1>



          <h2>

            Create Account

          </h2>




          <p>

            Join our learning community.

            <br/>

            Learn new skills.

            <br/>

            Share your knowledge.

          </p>



        </div>


      </div>









      {/* RIGHT SIDE */}


      <div className="register-right">


        <div className="register-card">



          <h2 className="register-title">

            Registration

          </h2>




          <p className="register-subtitle">

            Start your learning journey today

          </p>









          <form

            className="register-form"

            onSubmit={handleRegister}

          >








            {/* NAME */}


            <div className="register-input-group">


              <FaUser className="register-icon"/>



              <input

                type="text"

                name="fullName"

                placeholder="Full Name"

                value={formData.fullName}

                onChange={handleChange}

                required

              />



            </div>









            {/* EMAIL */}


            <div className="register-input-group">


              <FaEnvelope className="register-icon"/>



              <input

                type="email"

                name="email"

                placeholder="Email Address"

                value={formData.email}

                onChange={handleChange}

                required

              />


            </div>









            {/* PHONE */}


            <div className="register-input-group">


              <FaPhone className="register-icon"/>



              <input

                type="tel"

                name="phone"

                placeholder="Phone Number"

                value={formData.phone}

                onChange={handleChange}

                required

              />


            </div>









            {/* INTERESTED SKILL */}


            <div className="register-input-group">


              <FaGraduationCap className="register-icon"/>



              <select

                name="skill"

                value={formData.skill}

                onChange={handleChange}


              >


                <option value="" hidden>

                  Select Interested Skill

                </option>


                <option>Java</option>

                <option>Python</option>

                <option>React</option>

                <option>UI/UX</option>

                <option>Machine Learning</option>

                <option>Data Science</option>

                <option>Cyber Security</option>



              </select>


            </div>









            {/* PASSWORD */}


            <div className="register-input-group">


              <FaLock className="register-icon"/>




              <input

                type={
                  showPassword
                  ?
                  "text"
                  :
                  "password"
                }

                name="password"

                placeholder="Password"

                value={formData.password}

                onChange={handleChange}

                required

              />





              <button

                type="button"

                className="register-eye-btn"

                onClick={()=>setShowPassword(!showPassword)}

              >


                {

                  showPassword

                  ?

                  <FaEyeSlash/>

                  :

                  <FaEye/>

                }


              </button>



            </div>









            {/* CONFIRM PASSWORD */}


            <div className="register-input-group">


              <FaLock className="register-icon"/>




              <input


                type={

                  showConfirmPassword

                  ?

                  "text"

                  :

                  "password"

                }


                name="confirmPassword"


                placeholder="Confirm Password"


                value={formData.confirmPassword}


                onChange={handleChange}


                required


              />






              <button

                type="button"

                className="register-eye-btn"

                onClick={()=>setShowConfirmPassword(!showConfirmPassword)}

              >


                {

                  showConfirmPassword

                  ?

                  <FaEyeSlash/>

                  :

                  <FaEye/>

                }


              </button>



            </div>









            {/* BUTTON */}



            <button

              type="submit"

              className="register-btn-main"

              disabled={isLoading}


            >


              {

                isLoading

                ?

                "Creating Account..."

                :

                "Register"

              }



            </button>





          </form>








          <div className="register-divider">


            <span>

              Already have an account?

            </span>


          </div>







          <button

            className="register-login-btn"

            onClick={()=>navigate("/login")}

          >

            Login


          </button>






        </div>


      </div>





    </div>


  );


}



export default Register;