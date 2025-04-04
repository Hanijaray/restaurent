import { useState, useEffect } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaLock, FaUserTie, FaBuilding, FaExclamationTriangle, FaGlobe, FaCalendarAlt } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function WorkersDetailForm({ selectedWorker, onWorkerUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    workerNumber: "",
    phoneNumber: "",
    address: "",
    country: "",
    username: "",
    password: "",
    joiningDate: "",
    image: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
  const [successMessage, setSuccessMessage] = useState(""); // For success message
    const [selectedDate, setSelectedDate] = useState(null); // Add selectedDate state
    const [selectedImageName, setSelectedImageName] = useState(""); // Store selected image name
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [customCountry, setCustomCountry] = useState(""); // Track custom country

    const handleCountryChange = (e) => {
      const selectedValue = e.target.value;
      setFormData((prevData) => ({
        ...prevData,
        country: selectedValue === "Others" ? customCountry : selectedValue,
      }));
      setIsOtherSelected(selectedValue === "Others");
      if (selectedValue !== "Others") {
        setCustomCountry(""); // Reset custom country input
      }
    };

   const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setSelectedImageName(file.name);
    }
  };
  

  useEffect(() => {
    if (selectedWorker) {
      setFormData(selectedWorker);
    }
  }, [selectedWorker]);

 

useEffect(() => {
  if (selectedWorker) {
    setFormData((prevData) => ({
      ...prevData,
      ...selectedWorker,
      image: selectedWorker.image || prevData.image, // Keep existing image if not provided
    }));
  }
}, [selectedWorker]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleDateChange = (date) => {
  setFormData((prevData) => ({
    ...prevData,
    joiningDate: date || "", // Ensures it's never empty
  }));
  setSelectedDate(date);
};






const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const url = selectedWorker
      ? `http://localhost:5000/api/workers/${selectedWorker._id}`
      : "http://localhost:5000/api/workers";
    const method = selectedWorker ? "PUT" : "POST";

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formDataToSend.append("image", value);
      } else {
        formDataToSend.append(key, value);
      }
    });

    const response = await fetch(url, {
      method: method,
      body: formDataToSend, 
    });

    const data = await response.json();
    if (response.ok) {
      alert(selectedWorker ? "Worker updated successfully!" : "Worker added successfully!");
      onWorkerUpdated();

      setFormData({
        name: "",
        workerNumber: "",
        phoneNumber: "",
        address: "",
        country: "",
        username: "",
        password: "",
        joiningDate: "",
        image: null,
      });
      setSelectedDate(null);
      setSelectedImageName("");
    } else {
      alert("Error: " + data.error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to submit worker.");
  }
};


  
  

  return (
    <div className="max-w-sm mx-auto bg-white p-4 shadow-lg rounded-lg border mt-2 border-gray-300">
    <form onSubmit={handleSubmit} >
    
   <div className="flex justify-between items-center mb-4">
     <h2 className="text-2xl font-bold font-serif">Workers Detail</h2>
     {/* <div className="flex items-center border p-2 text-gray-500 rounded relative w-28">
<FaCalendarAlt className="mr-2 text-gray-500 h-6 w-6" />
<DatePicker
 selected={formData.joiningDate}
 onChange={handleDateChange}
 value={formData.joiningDate}
 dateFormat="dd/MM/yyyy"
 className="w-full placeholder-gray-500 text-sm "
 placeholderText="Joining Date"
 /> */}
     <DatePicker

                   // selected={selectedDate}
                   // onChange={(date) => setSelectedDate(date)} // Update selectedDate state
                   
                   selected={formData.joiningDate}
                   onChange={handleDateChange}
                   dateFormat="dd/MM/yyyy"
                   customInput={
                   <div className="p-3 bg-black text-white rounded flex items-center justify-center">
                     <FaCalendarAlt />
                   </div>
                   }
                    popperPlacement="bottom-start"
                   calendarClassName="border rounded-lg shadow-md bg-white p-1"
                   />
                   
{/* </div> */}
   </div>

   {/* Error Message Display */}
   {errorMessage && <p className="text-red-600 text-sm mb-2">{errorMessage}</p>}
   
   {/* Success Message Display */}
   {successMessage && <p className="text-green-600 text-sm mb-2">{successMessage}</p>}
   <div className="grid grid-cols-2 gap-2">
   {/* <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2"> */}
   <div>
   <label
 htmlFor="name"
 className=" text-black text-sm justify-center" >
Worker Name
</label>
   <div className="flex items-center border p-2 rounded text-gray-500 relative w-full h-10">
<FaUser className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
<input
 type="text"
 name="name"
 id="name"
 className="w-full placeholder:text-gray-500 peer outline-none text-sm pl-8  "
 placeholder="Enter Name"
 value={formData.name}
 onChange={handleChange}
/>

</div>
</div>

<div>
<label
 htmlFor="image"
 className=" text-black text-sm justify-center" >
 Add Image
</label>
<div className="flex items-center pl-0 border p-2 rounded justify-center w-full text-gray-500 relative h-10">
<input
 type="file"
 accept="image/*"
 className="absolute inset-0 opacity-0 ml-0 cursor-pointer"
 onChange={handleImageUpload}
/>
<button
 type="button"
 className="flex items-center p-2 rounded  text-left justify-start ml-0 w-full border border-transparent focus:ring-2 focus:ring-gray-300"
>
 <MdAddAPhoto className="mr-2 text-lg" />
 <span className="truncate max-w-[80%] text-sm">{selectedImageName ? selectedImageName : "Add Image"}</span>
</button>
</div>
</div>

<div>
<label
 htmlFor="workerNumber"
 className=" text-black text-sm justify-center" >
 Worker Number
</label>
<div className="flex items-center border p-2 text-gray-500 rounded relative w-full h-10">
<FaUserTie className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
<input
 type="text"
 name="workerNumber"
 id="workerNumber"
 className="w-full placeholder:text-gray-500 peer outline-none text-sm pl-8 "
 placeholder="Worker Number"
 value={formData.workerNumber}
 onChange={handleChange}
/>

</div>
</div>        
<div>
<label
 htmlFor="phoneNumber"
 className=" text-black text-sm justify-center" >
 Phone Number
</label>
<div className="flex items-center border p-2 text-gray-500 rounded relative w-full h-10">
<FaPhone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
<input
 type="text"
 name="phoneNumber"
 id="phoneNumber"
 className="w-full placeholder:text-gray-500 peer outline-none text-sm pl-8 "
 placeholder="Phone Number"
 value={formData.phoneNumber}
 onChange={handleChange}
/>

</div>
</div>
<div>
<label
 htmlFor="emergencyCall"
 className=" text-black text-sm justify-center" >
 Emergency Call
</label>
<div className="flex items-center border p-2 text-gray-500 rounded relative w-full h-10">
<FaExclamationTriangle className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
<input
 type="text"
 name="emergencyCall"
 id="emergencyCall"
 className="w-full placeholder:text-gray-500 peer outline-none text-sm pl-8 "
 placeholder="Emergency Call"
 value={formData.emergencyCall}
 onChange={handleChange}
/>

</div>
</div>
<div>
<label
 htmlFor="address"
 className=" text-black text-sm justify-center" >
 Address
</label>
<div className="flex items-center border p-2 text-gray-500 rounded relative w-full h-10">
<FaMapMarkerAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
<input
 type="text"
 name="address"
 id="address"
 className="w-full placeholder:text-gray-500 peer outline-none text-sm pl-8 "
 placeholder="Address"
 value={formData.address}
 onChange={handleChange}
/>

</div>
</div>

<div> 
<label
 htmlFor="address"
 className=" text-black text-sm justify-center" >
 Country
</label>    
<div className="flex items-center border p-2 text-gray-500 rounded h-10">
<FaGlobe className="mr-2" />

{!isOtherSelected ? (
 <select
   name="country"
   className="w-full placeholder-gray-500 outline-none" 
   value={formData.country}
   onChange={handleCountryChange}
 >
   <option value="">Country</option>
   <option value="Saudi">Saudi</option>
   <option value="India">India</option>
   <option value="Others">Others</option>
 </select>
) : (
 <input
   type="text"
   name="country"
   placeholder="Enter Country "
   className="w-full placeholder-gray-500 peer outline-none" 
   value={formData.country}
   onChange={(e) => setFormData({ ...formData, country: e.target.value })}
   onBlur={() => {
     if (!formData.country.trim()) {
       setIsOtherSelected(false); // Revert to dropdown if empty
       setFormData({ ...formData, country: "" });
     }
   }}
 />
)}
</div>
</div> 
<div>
<label
 htmlFor="address"
 className=" text-black text-sm justify-center" >
 Role
</label>
 <div className="flex items-center border p-2 rounded text-gray-500 h-10">
       <FaUserTie className="mr-2" />
       <select name="role" className="w-full bg-transparent peer outline-none" value={formData.role} onChange={handleChange}>
         <option value="">Select Role</option>
         <option value="Manager">Manager</option>
         <option value="Cashier">Cashier</option>
         <option value="Chef">Chef</option>
         <option value="Waiter">Waiter</option>
       </select>
     </div>
</div>
<div>
<label
htmlFor="username"
className=" text-black text-sm justify-center" 
>
User Name
</label>
 <div className="flex items-center border p-2 rounded text-gray-500 relative w-full h-10">
<FaUser className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
<input
 type="text"
 name="username"
 id="username"
 className="w-full placeholder:text-gray-500 peer outline-none text-sm pl-8 "
 placeholder="User Name"
 value={formData.username}
 onChange={handleChange}
/>


</div>
</div>

<div>
<label
 htmlFor="password"
 className=" text-black text-sm justify-center" 
>
 Password
</label>
<div className="flex items-center border p-2 rounded text-gray-500 relative w-full h-10">
<FaLock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
<input
 type="password"
 name="password"
 id="password"
 className="w-full placeholder:text-gray-500 peer outline-none text-sm pl-8 "
 placeholder="Password"
 value={formData.password}
 onChange={handleChange}
/>

</div>
</div>

    
    

     <button type="submit" className="bg-red-600 font-serif text-white w-72 ml-3  py-2 mt-4 rounded-lg text-2xl font-bold hover:bg-red-700">
       {selectedWorker ? "UPDATE WORKER" : "ADD WORKER"}
     </button>
     </div>
   </form>
   
 </div>
  );
}

