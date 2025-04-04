import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from '../assets/logo.png';

const Openingpage = () => {
  const navigate = useNavigate(); // Initialize navigation function

  const handleNavigation = () => {
    navigate("/welcome"); // Navigate to Welcome Page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-600">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center w-[1400px] h-[600px] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center space-y-6">


          <img
            src={logo}
            alt="Chraz Logo"
            className="w-120 h-60"
          />

          <p className="text-black font-bold text-lg">
            Streamline your management with ease and <br /> accuracy
          </p>
          <button
            onClick={handleNavigation} // Navigate on button click
            className="bg-black text-white px-20 py-3 rounded-lg font-semibold hover:bg-black transition w-full"
          >
            Let’s Go!!!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Openingpage;

