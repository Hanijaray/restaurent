import React, { useState, useEffect } from "react";
import axios from "axios";
import AvailablePopup from "../product/AvailablePopup";
import UnavailablePopup from "../product/UnavailablePopup";

export const FoodCard = ({ menuId, image, title, amount, tax }) => {
    const [showAvailablePopup, setShowAvailablePopup] = useState(false);
    const [showUnavailablePopup, setShowUnavailablePopup] = useState(false);
    const [isUnavailable, setIsUnavailable] = useState(false);

    // Fetch menu state from backend
    useEffect(() => {
        const fetchMenuState = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/menu/${menuId}`);
                if (response.status === 200) {
                    setIsUnavailable(response.data.state === 0);
                } else {
                    console.error("Failed to fetch menu state:", response.data.error);
                }
            } catch (error) {
                console.error("Failed to fetch menu state:", error);
            }
        };

        fetchMenuState();
    }, [menuId]);

    // Function to mark menu as unavailable with date
    const handleUnavailableConfirm = async (reason) => {
        try {
            const unavailableDate = new Date(); // Get current timestamp

            const response = await axios.put(`http://localhost:5000/api/menu/${menuId}/state`, {
                state: 0, // Mark as unavailable
                reason,
                unavailableDate,
            });

            if (response.status === 200) {
                setIsUnavailable(true); // ✅ Update UI
                setShowUnavailablePopup(false); // ✅ Close popup
                alert("Menu updated successfully!");
            } else {
                console.error("Failed to update menu:", response.data.error);
            }
        } catch (error) {
            console.error("Failed to update menu:", error);
        }
    };

    // Function to mark menu as available
    const handleAvailableConfirm = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/menu/${menuId}/state`, {
                state: 1, // Mark as available
                reason: "",
                unavailableDate: null, // Reset unavailable date
            });

            if (response.status === 200) {
                setIsUnavailable(false); // ✅ Update UI
                setShowAvailablePopup(false); // ✅ Close popup
                alert("Menu is now available!");
            } else {
                console.error("Failed to update menu:", response.data.error);
            }
        } catch (error) {
            console.error("Failed to update menu:", error);
        }
    };

    return (
        <div className="relative bg-white rounded-2xl shadow-lg p-4 w-58">
            {/* 🔴 "Unavailable" Ribbon */}
            {isUnavailable && (
                <div
                    className="absolute top-[160px] left-[-30px] bg-red-600 text-white font-bold text-lg px-10 py-5 rotate-[-45deg] origin-top-left w-[280px] flex justify-center items-center"
                    style={{ clipPath: "polygon(22% 0%, 77% 0%, 100% 100%, 0% 100%)" }}
                >
                    Unavailable
                </div>
            )}

            <img src={image} alt={title} className="w-full h-40 object-cover rounded-xl" />
            <h3 className="text-lg font-semibold text-center mt-3 text-red-600">{title}</h3>
            <div className="flex justify-between px-2 mt-2 text-xs text-gray-600">
                <p>
                    Amount: <span className="font-semibold">₹{amount}</span>
                </p>
                <p>
                    Tax: <span className="font-semibold">{tax}%</span>
                </p>
            </div>

            <div className="flex justify-between mt-3">
                <button
                    onClick={() => setShowAvailablePopup(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg w-1/2 mr-1"
                >
                    Available
                </button>
                <button
                    onClick={() => setShowUnavailablePopup(true)}
                    className="bg-gray-900 text-white px-2 py-2 rounded-lg w-1/2 ml-1"
                >
                    Unavailable
                </button>
            </div>

            {/* 🛑 Popups */}
            {showAvailablePopup && (
                <AvailablePopup
                    onClose={() => setShowAvailablePopup(false)}
                    onConfirm={handleAvailableConfirm} // ✅ Marks as available
                />
            )}

            {showUnavailablePopup && (
                <UnavailablePopup
                    onClose={() => setShowUnavailablePopup(false)}
                    onConfirm={handleUnavailableConfirm} // ✅ Marks as unavailable
                />
            )}
        </div>
    );
};

export default FoodCard;
