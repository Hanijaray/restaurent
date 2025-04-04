import React, { useState } from "react";
import { Printer, Search } from "lucide-react";
import user from '../../../assets/user.png';
import { PiPhoneCallFill } from "react-icons/pi";


const AddNewCustomer= () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [countryCode, setCountryCode] = useState("+91"); // Default to India


  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setInput1(""); // Clear fields when closing
    setInput2("");
    setErrorMessage(""); // Reset error message
    setIsPopupOpen(false);
  };
  

   // Validate phone number format
   const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/; 
    return regex.test(phone);
  };


  const handleSave = async () => {
    if (!input1 || !input2 || !countryCode) {
      alert("Please fill in all fields");
      return;
    }
  
    if (input2.length !== 10) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
  
    // Format request data
    const customerData = {
      name: input1.trim(),
      phone: input2.trim(),
      countryCode: countryCode.trim().replace("+", ""), // Remove '+' if user enters it
    };
  
    console.log("Sending Data:", customerData); // Debugging Log
  
    try {
      const response = await fetch("http://localhost:5000/api/add-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
  
      const data = await response.json();
      console.log("Response Data:", data); // Debugging Log
  
      if (response.ok) {
        alert(data.message);
        setInput1("");
        setInput2("");
        setCountryCode("+91"); // Reset to default country code
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Failed to add customer. Please try again.");
    }
  };
  

  return (
    <div className="p-6" style={{ zIndex: 1000 }}>
      {/* Button to open popup */}
      <button
        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold relative left-6 bottom-4 w-[320px] text-xl border-black h-12"
        onClick={openPopup}
      >
        + Add New Customer
      </button>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px] h-[300px]">
            <h2 className="text-xl font-bold mb-4 relative left-24 font-serif">Add New Customer</h2>
            

            <div className="relative mb-4">
              <img 
                src={user} 
                alt="User Icon" 
                className="absolute left-3 top-3 w-6 h-6"
              />
            <input
              type="text"
              placeholder="Enter Customer Name"
              className="w-full border p-3 pl-12 rounded mb-2 border-black "
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            />
            <div className="flex items-center space-x-2 relative">
  <PiPhoneCallFill className="text-2xl text-black" />
  
  <input
    type="text"
    placeholder="+91"
    className="border p-2 rounded w-[70px] text-center"
    value={countryCode}
    onChange={(e) => setCountryCode(e.target.value)}
  />

  <input
    type="text"
    placeholder="Enter Mobile Number"
    className="border p-2 rounded w-[200px]"
    value={input2}
    onChange={(e) => setInput2(e.target.value)}
  />
</div>

            </div>

            <div className="flex justify-between gap-4">
              <button
                className="bg-red-600 text-white font-serif px-2 py-2 rounded-lg  w-44 h-12 relative top-2"
                onClick={handleSave}
              >
                
                ADD CUSTOMER
              </button>
              <button
                className="bg-red-600 text-white  font-serif  px-14 py-2 rounded-lg flex items-center gap-1 w-40 relative top-2 "
                onClick={closePopup}
              >
                
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewCustomer;






