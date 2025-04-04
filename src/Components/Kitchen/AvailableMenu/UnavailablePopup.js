import React, { useState } from 'react';
import image from '../../../assets/Qnmark.jpg';

const UnavailablePopup = ({ onClose, onConfirm }) => {
    const [reason, setReason] = useState('');

    const handleConfirm = (selectedReason) => {
        setReason(selectedReason);
        onConfirm(selectedReason);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white flex p-8 rounded-2xl shadow-lg w-[600px] h-[350px] text-center relative">
                {/* Left Section */}
                <div className="p-4 w-1/2">
                    <h2 className="text-lg text-gray-600">Are you sure <br /> this item is unavailable?</h2>
                    <h1 className="text-4xl font-bold mt-2 mb-2">Reason</h1>
                    <div className="flex justify-center my-4">
                        <img src={image} alt="Question Mark" className="w-32 h-32" />
                    </div>
                </div>

                {/* Right Section - Buttons */}
                <div className="p-4 w-1/2">
                    <button 
                        onClick={() => handleConfirm('CHEF UNAVAILABLE')}
                        className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold my-2 hover:bg-red-700">
                        CHEF UNAVAILABLE
                    </button>
                    <button 
                        onClick={() => handleConfirm('GROCERY UNAVAILABLE')}
                        className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold my-2 hover:bg-red-700">
                        GROCERY UNAVAILABLE
                    </button>
                    <button 
                        onClick={() => handleConfirm('UNAVAILABLE')}
                        className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold my-2 hover:bg-red-700">
                        UNAVAILABLE
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full bg-gray-500 text-white py-3 rounded-lg text-lg font-semibold my-2 hover:bg-gray-600">
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnavailablePopup;

















