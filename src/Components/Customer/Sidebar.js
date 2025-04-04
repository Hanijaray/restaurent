import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { 
    FaClipboardList, FaShoppingBasket, 
    FaStickyNote, FaBell, FaBoxOpen, FaUserCircle, 
    FaSignOutAlt, FaAppleAlt 
} from 'react-icons/fa';
import { BiSolidDashboard } from "react-icons/bi";
import logo from '../../assets/11.png';

const Sidebar = ({ isSidebarVisible }) => {
    const navigate = useNavigate(); // Hook for navigation
    const location = useLocation(); // Hook to get the current route

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('authToken');  // Example: Remove JWT token
        sessionStorage.removeItem('user');  // Remove session data if stored
        // Redirect to login page
        navigate('/login');
    };  

    return (
        <div className={`sidebar ${isSidebarVisible ? 'w-1/4' : 'w-0'} transition-all duration-300 ease-in-out`}>
            {/* Sidebar */}
            <div className="bg-secondary text-white w-full h-screen">
                {/* Logo and Title */}
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="Logo" className="w-full h-44 mt-0" />
                </div>

                {/* Navigation List */}
                <ul className="font-semibold w-full mx-auto flex flex-col justify-center items-start space-y-3 text-xl">
                    <li className="w-full">
                        <button 
                            onClick={() => navigate('/customer')} 
                            className={`flex items-center w-full p-2 pl-10 hover:bg-[#d52a2a] text-left ${
                                location.pathname === '/customer' ? 'bg-[#d52a2a]' : ''
                            }`}
                        >
                            <BiSolidDashboard className="mr-4" />
                            <span>Dashboard</span>
                        </button>
                    </li>
                    <li className="w-full">
                        <button 
                            onClick={() => navigate('/corder')} 
                            className={`flex items-center w-full p-2 pl-10 hover:bg-[#d52a2a] text-left ${
                                location.pathname === '/corder' ? 'bg-[#d52a2a]' : ''
                            }`}
                        >
                            <FaClipboardList className="mr-4" />
                            <span>Orders</span>
                        </button>
                    </li>
                    <li className="w-full">
                        <button 
                            onClick={() => navigate('/cmenu')} 
                            className={`flex items-center w-full p-2 pl-10 hover:bg-[#d52a2a] text-left ${
                                location.pathname === '/cmenu' ? 'bg-[#d52a2a]' : ''
                            }`}
                        >
                            <FaShoppingBasket className="mr-4" />
                            <span>Available Menu</span>
                        </button>
                    </li>
                    <li className="w-full">
                        <button 
                            onClick={() => navigate('/cgrocery')} 
                            className={`flex items-center w-full p-2 pl-10 hover:bg-[#d52a2a] text-left ${
                                location.pathname === '/cgrocery' ? 'bg-[#d52a2a]' : ''
                            }`}
                        >
                            <FaAppleAlt className="mr-4" />
                            <span>Grocery</span>
                        </button>
                    </li>
                    <li className="w-full">
                        <button 
                            onClick={() => navigate('/cnotes')} 
                            className={`flex items-center w-full p-2 pl-10 hover:bg-[#d52a2a] text-left ${
                                location.pathname === '/cnotes' ? 'bg-[#d52a2a]' : ''
                            }`}
                        >
                            <FaStickyNote className="mr-4" />
                            <span>My Card</span>
                        </button>
                    </li>
                    <li className="w-full">
                        <button 
                            onClick={() => navigate('/cnotifications')} 
                            className={`flex items-center w-full p-2 pl-10 hover:bg-[#d52a2a] text-left ${
                                location.pathname === '/cnotifications' ? 'bg-[#d52a2a]' : ''
                            }`}
                        >
                            <FaBell className="mr-4" />
                            <span>Notifications</span>
                        </button>
                    </li>
                    

                    {/* Divider */}
                    <div className="w-4/5 justify-end border-t border-white my-4 h-20 mx-auto"></div>

                    <li className="w-full">
                        <button 
                            onClick={() => navigate('/account')} 
                            className={`flex items-center w-full p-2 pl-10 hover:bg-[#d52a2a] text-left ${
                                location.pathname === '/account' ? 'bg-[#d52a2a]' : ''
                            }`}
                        >
                            <FaUserCircle className="mr-4" />
                            <span>Account</span>
                        </button>
                    </li>
                    <li className="w-full">
                          <button 
                             onClick={handleLogout} 
                               className="flex items-center w-full p-2 pl-10 hover:bg-[#d52a2a] text-left"
                              >
                                <FaSignOutAlt className="mr-4" />
                                 <span>Log Out</span>
                                 </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
