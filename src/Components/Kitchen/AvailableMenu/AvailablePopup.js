import React from 'react';
import image from '../../../assets/available.png';

const AvailablePopup = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-2 rounded-xl shadow-lg w-[450px] h-[220px] relative">
                {/* Text */}
                <h2 className="text-4xl font-bold text-center mt-1 flex">
                    <div className="content-center w-3/4">
                        <p className="text-center text-gray-600 pl-7 text-sm">Are you sure this item is</p> 
                        <span className="text-black pl-8">Available Now</span> 
                    </div>
                    <span>
                        <img 
                            src={image} 
                            alt="Popup" 
                            className="w-19 h-35 rounded-full mx-auto" 
                        />
                    </span>
                </h2>

                {/* Buttons */}
                <div className="flex justify-center gap-x-6 mt-5">
                    <button 
                        onClick={() => {
                            onConfirm();  // ✅ Remove the "Unavailable" ribbon
                            onClose();    // ✅ Close popup
                        }}
                        className="bg-red-600 text-white px-8 py-2 rounded-lg text-lg font-semibold hover:bg-red-700 transition font-serif">
                        AVAILABLE
                    </button>

                    <button 
                        onClick={onClose}  
                        className="bg-gray-500 text-white px-8 py-2 rounded-lg text-lg font-semibold hover:bg-gray-600 transition font-serif">
                        UNAVAILABLE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvailablePopup;







