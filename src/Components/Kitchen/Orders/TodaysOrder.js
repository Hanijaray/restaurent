import React, { useState } from "react";
import TableOrder from "./Table";
import { MdMessage } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import RecentOrder from './RecentOrder';
import OrderHistory from "./OrderHistory";
import CategoryOrder from "./SelectCategory.js";


export default function OrdersTab() {
    const [activeTab, setActiveTab] = useState("tableOrder");

    const tabs = [
        { id: "recentOrder", label: "Recent Order" },
        { id: "tableOrder", label: "Table Order" },
        { id: "categoryOrder", label: "Category Order" },
        { id: "orderHistory", label: "Order History" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "recentOrder":
                return <RecentOrder />;
            case "tableOrder":
                return <TableOrder />;
            case "categoryOrder":
                return <CategoryOrder />;
            case "orderHistory":
                return <OrderHistory />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-full mx-auto mt-1">
            {/* Today's Order */}
            <div className="flex justify-between items-center mb-1 h-[60px]">
                    <h2 className=" p-6  text-xl font-semibold">Today's Order</h2>

                    {/* Notification & Message Buttons */}
                    <div className="flex space-x-4">
                        <button className="p-2 bg-white rounded-lg shadow-md w-12 h-12 flex items-center justify-center">
                            <MdMessage className="text-gray-700 text-xl" />
                        </button>

                        <button className="p-2 bg-white rounded-lg shadow-md w-12 h-12 flex items-center justify-center me-3">
                            <FaBell className="text-gray-700 text-xl" />
                        </button>

                    </div>
                </div>
            {/* Tabs Navigation */}
            <div className="flex border-b-8 border-red-700  ">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-6 text-lg font-semibold transition-all relative w-1/4
                            ${activeTab === tab.id
                                ? "bg-red-700 text-white border-b-4 hover:text-white border-red-700"
                                : "bg-gradient-to-r from-white to-gray-400 text-black border-b-4 border-gray-300"
                            } hover:bg-red-700 hover:text-red-700`}
                        style={{
                            clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-full shadow-md mt-0 p-1">
                {renderContent()}
            </div>
        </div>
    );
}


