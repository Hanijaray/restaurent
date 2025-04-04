import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import React, { useState } from 'react';
import { TbLockPassword } from "react-icons/tb";
import { TfiEmail } from "react-icons/tfi";
import { CgProfile } from "react-icons/cg";
import { LuEye } from "react-icons/lu";
import loginImage from '../assets/9.jpeg';

function SignupPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        restaurantName: "" // ✅ Changed from RestaurantId to restaurantName
    });

    const [showPassword, setShowPassword] = useState(false); 
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/admin/signup", {
                ...formData,
                role: "Manager" // ✅ Assign Manager role
            });

            console.log("Response:", res.data);

            if (res.status === 201) {
                navigate("/login");
            } else {
                setMessage(res.data.message);
            }
        } catch (error) {
            console.error("Signup Request Error:", error.response?.data || error);
            setMessage(error.response?.data?.message || "⚠️ Error signing up! Check console for details.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-[800px] rounded-3xl shadow-lg bg-primary flex justify-between">
                {/* Left Side - Image and Welcome Message */}
                <div>
                    <div className='w-[350px] h-full bg-white shadow-lg rounded-3xl'>
                        <img src={loginImage} alt="Login" className="w-full h-auto rounded-3xl" />
                        <h1 className='font-semibold text-3xl text-center font-serif'>WELCOME BACK!</h1>
                        <p className='text-center text-sm font-serif'>To Continue Login Your Account</p>
                        <center>
                            <a href='/login' className='block w-1/2 text-white py-2 mt-5 rounded-lg bg-primary text-center'>
                                Login
                            </a>
                        </center>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className='w-[600px] p-5'>
                    <center>
                        <h1 className="w-1/2 text-xl font-bold text-center bg-white rounded-xl p-3 font-serif">ADMIN</h1>
                    </center>
                    <h1 className="text-2xl text-center font-bold text-white mt-3 mb-2 font-serif">
                        Signup to Your Account
                    </h1>
                    <p className="text-center text-white mb-4">Signup using</p>

                    {message && <p className="text-center text-red-500">{message}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm ps-11">
                        {/* Username Input */}
                        <div className="relative">
                            <CgProfile className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 icon" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-[300px] px-4 pl-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <TfiEmail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-[300px] pl-12 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <TbLockPassword className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 icon" />
                            <input
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-[300px] pl-12 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                            <LuEye
                                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer icon"
                                onClick={togglePasswordVisibility}
                            />
                        </div>

                        {/* Restaurant Name Input */}
                        <div className="relative">
                            <CgProfile className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 icon" />
                            <input
                                type="text"
                                name="restaurantName" // ✅ Updated from RestaurantId
                                placeholder="Enter Restaurant Name"
                                value={formData.restaurantName}
                                onChange={handleChange}
                                className="w-[300px] px-4 pl-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>

                        {/* Sign Up Button */}
                        <center>
                            <button 
                                type="submit" 
                                className='bg-black text-white mt-9 py-2 px-12 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white'
                            >
                                Sign Up
                            </button>
                        </center>
                    </form>

                    {/* Forgot Password Link */}
                    <div className="mt-4 text-center">
                        <a href='/home' className="text-white text-sm underline">Forgot your password?</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;



































