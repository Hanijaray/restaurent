import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../assets/cropsuper.png";
import name from "../assets/cropname.png";
import user from "../assets/user.png";

export const Welcome = () => {
  const navigate = useNavigate(); // Initialize navigation function

  const handleLogin = () => {
    navigate("/login"); // Navigate to Login Page
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-white">
        {/* Left Section */}
        <div className="bg-primary h-screen w-full md:w-11/20 rounded-r-3xl shadow-2xl flex flex-col items-center justify-center">
          <div className="w-3/5 space-y-6">
            {["MANAGER", "CASHIER", "WAITER", "KITCHEN"].map((role) => (
              <div
                key={role}
                className="flex items-center justify-between bg-white p-0 rounded-lg shadow-md w-full font-serif"
              >
                <div className="flex">
                  <img src={user} alt="profile" className="w-12 h-12 m-4 ml-8" />
                  <h3 className="font-bold uppercase text-lg content-center">{role}</h3>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogin} // Navigate to Login Page
                    className="bg-primary text-white px-4 py-2 rounded-full w-40 font-semibold mr-8"
                  >
                    Login
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center justify-center w-full md:w-9/20 text-center">
          <h3 className="text-3xl font-bold uppercase font-serif mb-4">
            Welcome
          </h3>
          <div className="flex flex-col items-center">
            <img src={logo} alt="logo" className="w-48 h-64 mb-2" />
            <img src={name} alt="logo" className="w-3/4 h-36" />
          </div>
          <p className="mt-8 text-lg font-semibold">Life Changers Ind</p>
        </div>
      </div>
    </>
  );
};

export default Welcome;

