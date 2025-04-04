import axios from "axios";
import React, { useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { LuEye } from "react-icons/lu";
import { useNavigate } from 'react-router-dom'; 
import logo from '../assets/9.jpeg';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const navigate = useNavigate(); 
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [loginError, setLoginError] = useState(''); // State for login error


const handleLogin = async (e) => {
  e.preventDefault();
 
  console.log("Logging in with:", username, password);
  if (!username || !password) {
    alert("⚠️ Username and password are required.");
    return;
  }

  try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          password,
      });

      const { token, role, username: loggedInUsername, userType } = response.data;
      console.log("Server Response:", response.data);

      if (!token) {
          alert("⚠️ Authentication failed! No token received.");
          return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", loggedInUsername);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userType", userType);
      localStorage.setItem("profilePic", response.data.profilePic);
console.log("Stored profilePic:", response.data.profilePic);


      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("Token received:", token);

      if (role === "Manager") {  
        alert("✅ You have access to the Manager page!");
        navigate("/Admin"); // Redirect to Manager page instead of Admin
    }
     else if (role === "Chef" ) {
      alert("✅ Welcome to Kitchen Page");
      navigate("/dashboard");
    }  else if ( role === "Waiter") {
      alert("✅ Welcome to Ordering Page");
      navigate("/customer");
    } else {
      alert("✅ Welcome to Invoice Page");
      navigate("/main");
    }
  } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("❌ Login failed! Please check your credentials.");
  }
};




  const handleSignUp = () => {
    navigate('/signup');
   
  };


  return (
    <div className="flex justify-center items-center h-screen bg-sec">
      <div className="w-full max-w-[800px] rounded-3xl shadow-lg bg-primary flex justify-between">
        {/* Login */}
        <center>
          <div className='w-[400px] p-5'>
            <form className="space-y-4 max-w-sm ps-11" onSubmit={handleLogin}>
              <h1 className="w-1/2 text-xl font-bold text-center mt-8 mb-5 bg-white rounded-xl font-serif p-2">ADMIN</h1>
              <h1 className="text-2xl text-center font-bold text-white mt-3 mb-0 font-serif ">Login to Your Account</h1>
              <p className="text-center text-white mb-10 font-serif ">Login Using </p>
              {loginError && <p className="text-red-500">{loginError}</p>} {/* Display login error */}
              <div className="relative">
                <FaRegUser className="absolute left-5 top-1/2 transform -translate-y-1/2 text-black" />
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="font-serif w-[300px] px-9 py-2 font-bold border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black "
                />
              </div>

              <div className="relative">
                <RiLockPasswordLine className="absolute left-5 top-1/2 transform -translate-y-1/2 text-black" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="font-serif w-[300px] px-9 py-2 border font-bold border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black "
                />
                <LuEye
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              </div>

              <button
                type="submit"
                className="fond-bold font-serif w-1/2 bg-black text-white py-2 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
              >
                Login
              </button>

              <div className="mt-10 mb-15 text-center">
                <a href="https://www.youtube.com/?authuser=0" className="font-serif mt-4 text-white text-center text-sm underline">Forgot your password?</a>
              </div>
            </form>
          </div>
        </center>

        {/* Sign Up */}
        <div className="bg-white p-10 w-[350px] flex flex-col items-center justify-center rounded-3xl">
          <div className="mb-10 mt-0 mx-auto w-1500px h-auto rounded-3xl">
          <img src={logo} alt="Chef Logo" />
          </div>
          <h2 className="text-3xl font-bold font-serif mt-0 mb-5">NEW HERE?</h2>
          <p className="text-center mb-6 font-serif">Sign Up and create your own Account!</p>
          <button onClick={handleSignUp} className="bg-red-600 w-1/2 text-white py-2 px-6 rounded-2xl font-serif focus:outline-none focus:ring-2 focus:ring-black">Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;






