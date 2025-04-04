import React, { useEffect, useState } from "react";  // ✅ Import hooks
import { FaBars } from 'react-icons/fa'; // Menu Icon (Hamburger menu)
import defaultProfile from '../../assets/th.jpeg'; // Default Profile Image

const Header = ({ isSidebarVisible, toggleSidebar }) => {
    const [username, setUsername] = useState("");

  const [role, setRole] = useState("");
const [profilePic, setProfilePic] = useState(defaultProfile); // Default profile pic
     // ✅ Get username and role from localStorage on component mount
     useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        const storedProfilePic = localStorage.getItem("profilePic");

        console.log("Retrieved username:", storedUsername);
        console.log("Retrieved role:", storedRole);
        console.log("Retrieved profilePic:", storedProfilePic || "No profile pic found");

        if (storedUsername) setUsername(storedUsername);
        if (storedRole) setRole(storedRole);
        if (storedProfilePic && storedProfilePic !== "undefined") {
            setProfilePic(storedProfilePic);
        }
    }, []);

    return (
        <div className={`flex ${isSidebarVisible ? 'w-full' : 'w-full'}`}>
            <nav className="bg-primary w-full h-32 flex justify-between items-center px-6">
                {/* Menu Button */}
                <button
                    className="text-white text-3xl menu-icon"
                    onClick={toggleSidebar} // Toggle Sidebar visibility
                >
                    <FaBars />
                </button>

                {/* Welcome Message */}
                <div className="text-white flex flex-col p-6">
                    <h1 className="text-4xl font-bold font-sans">Welcome back, {username ? username : "Guest"}</h1>
                    <div className='flex gap-2 p-3'>
                    <p className="text-sm font-serif">Todays Special:Chicken Biriyani</p>
                    <p className="text-sm bg-white text-red-600 font-serif pl-2 pr-2">Order Now</p>
                    </div>
                </div>

                {/* Centered Search Bar */}
                <div className="flex flex-grow justify-center items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search here"
                        className="p-2 rounded-full w-72 h-10"
                    />
                    <button className="p-2 border-2 border-white text-white rounded-full flex items-center justify-center w-10 h-10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35m2.35-6.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                            />
                        </svg>
                    </button>
                </div>

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                    <div className="text-white text-sm">
                        <h2 className="font-bold">{username ? username : "Guest"}</h2>
                        <p className="float-right">{role ? role : "Guest"}</p>
                    </div>
                    <img
                        src={profilePic}  // ✅ Use stored profilePic, fallback to default
                        alt={username || "User"}
                        className="w-12 h-12 rounded-full"
                        onError={(e) => { e.target.src = defaultProfile; }} // Fallback to default
                    />
                </div>
            </nav>
        </div>
    );
};

export default Header;
