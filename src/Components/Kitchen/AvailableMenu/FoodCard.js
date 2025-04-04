import React, { useState } from 'react';
import axios from 'axios';
import AvailablePopup from './AvailablePopup';
import UnavailablePopup from './UnavailablePopup';

export const FoodCard = ({ id, image, title, state }) => {
    const [showAvailablePopup, setShowAvailablePopup] = useState(false);
    const [showUnavailablePopup, setShowUnavailablePopup] = useState(false);
    const [isUnavailable, setIsUnavailable] = useState(state === 0);

    const handleAvailable = () => {               
        setShowAvailablePopup(true);
    };

    const confirmAvailable = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/menu/${id}/state`, {
                state: 1,
                reason: "",
                unavailableDate: null
            });
            setIsUnavailable(false);
            setShowAvailablePopup(false);
        } catch (error) {
            console.error('Error updating menu state:', error);
        }
    };

    const confirmUnavailable = async (reason) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/menu/${id}/state`, {
                state: 0,
                reason: reason,
                unavailableDate: new Date().toISOString()
            });
            setIsUnavailable(true);
            setShowUnavailablePopup(false);
        } catch (error) {
            console.error('Error updating menu state:', error);
        }
    };

    return (
        <div className="relative bg-white rounded-2xl shadow-lg p-4 w-64">
            {/* 🔴 "Unavailable" Ribbon */}
            {isUnavailable && (
                <div
                    className="absolute top-[160px] left-[-30px] bg-red-600 text-white font-bold text-lg px-10 py-5 rotate-[-45deg] origin-top-left w-[280px] flex justify-center items-center"
                    style={{
                        clipPath: "polygon(22% 0%, 77% 0%, 100% 100%, 0% 100%)", 
                    }}
                >
                    Unavailable
                </div>
            )}

            <img src={image} alt={title} className="w-full h-40 object-cover rounded-xl" />
            <h3 className="text-lg font-semibold text-center mt-3">{title}</h3>

            <div className="flex justify-between mt-3">
                <button
                    onClick={handleAvailable}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg w-1/2 mr-1"
                >
                    Available
                </button>
                <button
                    onClick={() => setShowUnavailablePopup(true)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg w-1/2 ml-1"
                >
                    Unavailable
                </button>
            </div>

            {/* 🛑 Popups */}
            {showAvailablePopup && (
                <AvailablePopup 
                    onClose={() => setShowAvailablePopup(false)} 
                    onConfirm={confirmAvailable} // ✅ Updates the state to available
                />
            )}
            {showUnavailablePopup && (
                <UnavailablePopup
                    onClose={() => setShowUnavailablePopup(false)}
                    onConfirm={confirmUnavailable}  
                />
            )}
        </div>
    );
};

export default FoodCard;







