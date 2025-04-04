import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/cropsuper.png";
import Invoice from "./Invoice/Invoice";
import { FoodCategory } from "./product/SetCategory";
import BillHistory from "./BillHistory/BillHistory";
import GroceryWorkersReport from "./GWreport/GWreport";
import GroceryDashboard from "./Grocery/SetGrocery/GroceryDashboard";
import UpdatedGrocery from "./Grocery/UpdateGrocery/UpdatedGrocery";
import UsedGrocery from "./Grocery/UsedGrocery/UsedGrocery";

export default function NavbarMain() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "Set Grocery"); // ✅ Load last active tab
    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [role, setRole] = useState(localStorage.getItem("role") || "");
    const [componentKey, setComponentKey] = useState(0); // ✅ State to force component refresh

    // ✅ Update activeTab from location state OR localStorage (to persist after refresh)
useEffect(() => {
    if (location.state?.activeTab) {
        setActiveTab(location.state.activeTab);
        localStorage.setItem("activeTab", location.state.activeTab); // ✅ Save latest active tab
        navigate("/main", { replace: true, state: {} }); // ✅ Prevent overriding on refresh
    } else {
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }
}, [location.state, navigate]);


    // ✅ Ensure the correct tab persists after refresh
    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
        setComponentKey(prevKey => prevKey + 1); // Force refresh of component when tab changes
    }, [activeTab]);

    const handleManagerClick = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("⚠️ Please log in first!");
            navigate("/login");
            return;
        }

        try {
            const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT
            if (decoded.role === "Manager") {
                navigate("/Admin");
            } else {
                alert("❌ Access Denied! Only Managers can enter this page.");
            }
        } catch (error) {
            console.error("Invalid token", error);
            alert("⚠️ Session expired! Please log in again.");
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    // ✅ Render the selected component dynamically
    const renderComponent = () => {
        switch (activeTab) {
            case "Grocery":
                return <div key={componentKey} className="h-full w-full flex items-center justify-center"><p>Select an option from Grocery dropdown</p></div>;
            case "Set Grocery":
                return <GroceryDashboard key={componentKey} />;
            case "Update Grocery":
                return <UpdatedGrocery key={componentKey} />;
            case "Used Grocery":
                return <UsedGrocery key={componentKey} />;
            case "Food Menu":
                return <FoodCategory key={componentKey} />;
            case "Grocery & Workers Report":
                return <GroceryWorkersReport key={componentKey} />;
            case "Bill History":
                return <BillHistory key={componentKey} />;
            case "Invoice":
                return <Invoice key={componentKey} />;
            case "Admin":
                return <div key={componentKey} className="h-full w-full flex items-center justify-center"><p>Admin Panel</p></div>;
            default:
                return <GroceryDashboard key={componentKey} />;
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <div className="bg-[#2f2f2f] fixed top-0 left-0 w-full z-50 shadow-md">
                <div className="flex items-center pt-3">
                    {/* Left Logo */}
                    <div className="pl-4 pr-6 mr-16 flex justify-start">
                        <img src={logo} alt="Logo" className="w-12 h-12 rounded-full border-2 border-white" />
                    </div>

                    {/* Navigation Links */}
                    <div className="flex space-x-4 text-white text-2xl font-serif font-bold justify-end">
                        {/* Grocery Dropdown */}
                     {/* Grocery Dropdown */}
<div className="relative">
    <button
        className={`px-7 py-3 text-white text-2xl transition-all ${
            ["Set Grocery", "Update Grocery", "Used Grocery"].includes(activeTab)
                ? "bg-red-600 rounded-t-md"
                : "hover:text-red-600"
        }`}
        onClick={() => setShowDropdown(!showDropdown)}
    >
        Grocery ▼
    </button>

    {showDropdown && (
        <div className="absolute left-0 mt-1 w-48 bg-white border rounded-md text-lg shadow-lg">
            {["Set Grocery", "Update Grocery", "Used Grocery"].map((subItem) => (
                <button
                    key={subItem}
                    className="block w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white text-black"
                    onClick={() => {
                        setActiveTab(subItem);
                        localStorage.setItem("activeTab", subItem); // ✅ Save selection
                        setShowDropdown(false);
                    }}
                >
                    {subItem}
                </button>
            ))}
        </div>
    )}
</div>


                        {/* Other Navigation Items */}
                        {["Food Menu", "Grocery & Workers Report", "Bill History", "Invoice"].map((item) => (
                            <button
                                key={item}
                                className={`px-7 py-3 text-white text-2xl transition-all ${activeTab === item ? "bg-red-600 rounded-t-md" : "hover:text-red-600"}`}
                                onClick={() => {
                                    setActiveTab(item);
                                    localStorage.setItem("activeTab", item); // ✅ Save selection
                                }}
                            >
                                {item}
                            </button>
                        ))}

                        {/* Secure Admin Button */}
                        <button
                            className={`px-7 py-3 text-white text-2xl transition-all ${activeTab === "Manager" ? "bg-red-600 rounded-t-md" : "hover:text-red-600"}`}
                            onClick={handleManagerClick}
                        >
                            Admin
                        </button>
                    </div>
                </div>

                {/* Active Tab Display */}
                <div className="bg-red-600 flex justify-between py-3">
                    <h3 className="text-white left-1 items-start text-sm">{role ? role : "Guest"} : {username ? username : "Guest"}</h3>
                    <h3 className="text-white text-xl font-bold font-serif text-center">{activeTab.toUpperCase()}</h3>
                    <h3 className="text-red-600 left-1 items-start text-sm">.</h3>
                </div>
            </div>

            {/* Main Content (Scrollable) */}
            <div className="flex-1 overflow-auto mt-[7rem] bg-gray-50">
                {renderComponent()}
            </div>
        </div>
    );
}