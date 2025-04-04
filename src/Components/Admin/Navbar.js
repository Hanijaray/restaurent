import { useState, useEffect } from "react";
import logo from "../../assets/cropsuper.png";
import Pallete from "./BillHistory/Pallete";
import GroceryReport from "./GroceryReport/GroceryReport";
import WorkersAttendance from "./WorkerAttendance/WorkerAttendance";
import AddWorkers from "./AddWorkers/AddWorkers";
import Accounts from "./Accounts/Accounts";

export default function NavbarMain() {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("activeTab") || "Accounts"; // Retrieve active tab from localStorage
    });
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");

    // ✅ Store active tab in localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    // ✅ Get username and role from localStorage on component mount
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (storedUsername) setUsername(storedUsername);
        if (storedRole) setRole(storedRole);
    }, []);

    // Function to render the active component
    const renderComponent = () => {
        switch (activeTab) {
            case "Accounts":
                return <Accounts />;
            case "Add Workers":
                return <AddWorkers />;
            case "Workers Attendance":
                return <WorkersAttendance />;
            case "Product Report":
                return <GroceryReport />;
            case "Bill History":
                return <Pallete />;
            case "Admin":
                return (
                    <div className="h-full w-full flex items-center justify-center">
                        <p>Admin Panel</p>
                    </div>
                );
            default:
                return <Accounts />;
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Navbar (Fixed at Top) */}
            <div className="bg-[#2f2f2f] fixed top-0 left-0 w-full z-50 shadow-md">
                <div className="flex items-center pt-3">
                    {/* Left Logo */}
                    <div className="pl-4 pr-6 mr-16 justify-start">
                        <img src={logo} alt="Logo" className="w-12 h-12 rounded-full border-2 border-white" />
                    </div>
                    {/* Navigation Links */}
                    <div className="flex space-x-4 text-white text-2xl font-serif font-bold justify-end">
                        {[
                            "Accounts",
                            "Add Workers",
                            "Workers Attendance",
                            "Product Report",
                            "Bill History",
                            "Admin",
                        ].map((item) => (
                            <button
                                key={item}
                                className={`px-7 py-3 text-white text-2xl transition-all ${
                                    activeTab === item ? "bg-red-600 rounded-t-md" : "hover:text-red-600"
                                }`}
                                onClick={() => setActiveTab(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Active Tab Display */}
                <div className="bg-red-600 flex justify-between py-3">
                    <h3 className="text-white left-1 items-start text-sm">
                        {role ? role : "Guest"} : {username ? username : "Guest"}
                    </h3>
                    <h3 className="text-white text-xl font-bold font-serif text-center">
                        {activeTab.toUpperCase()}
                    </h3>
                    <h3 className="text-red-600 left-1 items-start text-sm">.</h3>
                </div>
            </div>

            {/* Main Content (Scrollable) */}
            <div className="flex-1 overflow-auto mt-[7rem]">
                {renderComponent()}
            </div>
        </div>
    );
}
