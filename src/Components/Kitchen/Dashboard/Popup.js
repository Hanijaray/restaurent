import React from "react";

const Popup = ({ onClose, onTakeOrder, username, profilePic, role }) => {
  return (
    <div style={{ zIndex: 1000 }} className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 shadow-2xl-black-500/50">
      <div className="bg-white p-10 w-[500px] rounded-xl">
        <h1 className="text-4xl text-center font-semibold mb-2 font-serif">
          {username ? `${username}'s Order` : "Take your Order"}
        </h1>
        <p className="mb-4 text-center text-sm">
          Are you sure you want to take this order?
        </p>

        {/* Profile Section */}
        <div className="flex items-center mb-8 border rounded-xl w-[400px]">
          <img
            src={profilePic} // Display user profile pic
            alt={username || "User"}
            className="w-20 h-20 m-3 rounded-full"
            onError={(e) => { e.target.src = "https://www.w3schools.com/w3images/avatar2.png"; }} // Fallback image
          />
          <div>
            <span className="font-bold text-xl">
              {username || "Guest"}
            </span>
            <p className="font-normal text-sm">{role || "Guest"}</p> {/* Display Role */}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onTakeOrder}
            className="bg-gray-600 text-white py-2 rounded font-serif font-semibold w-[400px] border border-transparent hover:border-white hover:shadow-lg"
          >
            TAKE THIS ORDER
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 rounded font-serif font-semibold w-[400px] border border-transparent hover:border-white hover:shadow-lg"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
