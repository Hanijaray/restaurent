import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";
import TodaysOverview from "./TodaysOverview";


const Dashboard = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar isSidebarVisible={isSidebarVisible} />

            {/* Main Content Wrapper */}
            <div className="flex flex-col w-full">
                {/* Fixed Header */}
                <Header isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />

                {/* Scrollable Content Section */}
                <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] bg-gray-100">
                    <Outlet />
                    <TodaysOverview />
                    
                    
                </div>
            </div>
        </div>
    );
};

export default Dashboard;