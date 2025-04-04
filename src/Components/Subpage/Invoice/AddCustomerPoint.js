import React, { useState,useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FaStar } from "react-icons/fa";

function AddCustomerPoint({ setShowPopup, setShowAddPointsPopup, customer }) {
  const [customerName, setCustomerName] = useState(" ");
  const [customerPoints, setCustomerPoints] = useState("");

  // Set customer name when customer is passed from invoice
  useEffect((customer) => {
    if (customer ) {
      setCustomerName(customer.name);
    }
  }, [customer]);


  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const customerData = { 
        name: customer, points: Number(customerPoints) 
    };

    console.log("Sending data to backend:", customerData); // For debugging


    try {
        const response = await fetch("http://localhost:5000/api/add-customer-points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });
  
        if (response.ok) {
          alert(`Customer points added successfully!: ${customer}`);
          setCustomerName(""); // Clear input fields
          setCustomerPoints("");
          setShowPopup(false); // Close the popup
        } else {
          alert("Error adding customer points!");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server.");
      }
    
  };

  return (
    <div className="max-w-md mx-auto   p-6 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-center text-black mb-4">Add Customer Point</h2>
      <form onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Enter Customer Name"
            value={customer}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full pl-10 p-2 border rounded-md focus:outline-black-600 focus:ring-2"
          />
        </div>

        <div className="relative mb-4">
          <FaStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="number"
            placeholder="Enter Customer Points"
            value={customerPoints}
            onChange={(e) => setCustomerPoints(e.target.value)}
            required
            className="w-full pl-10 p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button type="submit" className="w-5/12 bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
            Enter Points
          </button>
          <button
            type="button"
            className="w-5/12 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-600"
            onClick={() => setShowAddPointsPopup(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
);
}



export default AddCustomerPoint;



