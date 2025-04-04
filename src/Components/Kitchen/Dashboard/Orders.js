import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import { IoIosArrowDown } from "react-icons/io";
import { FaTruckMedical } from "react-icons/fa6";

const Card = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
 
  const [username, setUsername] = useState("");
  const [orders, setOrders] = useState([]); // Store all orders
  const [showAllOrders, setShowAllOrders] = useState(FaTruckMedical); // Toggle for showing all orders
  const [profilePic, setProfilePic] = useState();
  const [role, setRole] = useState("");
 

  useEffect(() => {
    // Get the logged-in username from localStorage
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    const storedProfilePic = localStorage.getItem("profilePic");

    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setRole(storedRole);
    if (storedProfilePic && storedProfilePic !== "undefined") {
      setProfilePic(storedProfilePic);
    }
  }, []);


  const getDaysAgo = (orderDate) => {
    const today = new Date();
    const orderDateObj = new Date(orderDate);
    
    today.setHours(0, 0, 0, 0);
    orderDateObj.setHours(0, 0, 0, 0);
  
    const diffTime = today - orderDateObj;
    return Math.floor(diffTime / (1000 * 3600 * 24));
  };
  
  const formatOrderTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };


  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const startTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - startTime) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const remainingMinutes = diffInMinutes % 60;

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (remainingMinutes === 0) {
      return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInHours} hr${
        diffInHours > 1 ? "s" : ""
      } ${remainingMinutes} min${remainingMinutes > 1 ? "s" : ""} ago`;
    }
  };

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = showAllOrders 
        ? "http://localhost:5000/api/orders?all=true" 
        : "http://localhost:5000/api/orders";
        
      const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched Orders:", data); // Check if chefName is included

        

        

        // Ensure every order has default status values
        const updatedData = data.map((order) => ({
          ...order,
          chefName: order.chefName || "", // Ensure chefName is never undefined
          action: order.chefName ? order.chefName : "Take Order",
          result: order.result || "Pending",
          startTime: order.startTime ? new Date(order.startTime) : null, // ✅ Load startTime
        }));

        setOrders(updatedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [showAllOrders]);

  // Update timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          timeElapsed: order.startTime
            ? getRelativeTime(order.startTime)
            : "Just now",
        }))
      );
    }, 60000); // Update every 1 minute

    return () => clearInterval(interval);
  }, []);

  // Function to handle taking an order
  const handleTakeOrder = async (index) => {
    const loggedInUsername = localStorage.getItem("username") || "Unknown User"; // Fetch stored username
    const orderId = orders[index]._id; // Get order ID
    const currentTime = new Date().toISOString(); // Set current time

    try {
      // Send API request to update the order's chef name
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/assign-chef`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chefName: loggedInUsername,
            startTime: currentTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign chef");
      }

      const updatedOrder = await response.json(); // Get updated order from API

      // Update the frontend orders state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                chefName: updatedOrder.order.chefName, // ✅ Update state correctly
                result: "Progress",
                action: loggedInUsername,
                startTime: currentTime, // ✅ Set order start time
              }
            : order
        )
      );

      setShowPopup(false);
    } catch (error) {
      console.error("Error updating chef name:", error);
    }
  };
  
  return (
    <div className="bg-white max-w-full p-2 overflow-x-auto rounded-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex space-x-4">
          <span className="text-xs ">Sort By</span>
          <span className="text-xs text-red-500">Recently</span>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        {" "}
        {/* Set the max height for vertical scroll */}
        <table className="min-w-full  border-collapse">
          <thead className="bg-primary text-white rounded-t-3xl sticky top-0 ">
            <tr>
              <th className="px-6 py-2 whitespace-nowrap w-[80px] rounded-tl-xl rounded-bl-xl ">
                Order
              </th>
              <th className="px-4 py-2 whitespace-nowrap w-[50px] ">Table No</th>
              <th className="px-4 py-2 whitespace-nowrap w-[50px] ">Count</th>

              <th className="px-4 py-2 whitespace-nowrap w-[100px] ">Chef</th>
              <th className="px-4 py-2 whitespace-nowrap w-[100px] rounded-tr-xl rounded-br-xl ">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
          {orders.map((order, index) => (
              <tr key={order._id} className="text-center border-gray-500">
                <td className="px-3 py-2 whitespace-nowrap border-b-2 border-gray-100 text-start">
                  <h3 className="font-semibold">{order.menuName}</h3>
                  <p className="text-xs text-gray-600">{order.extraInfo}</p>
                </td>
                <td className="px-2 py-2 whitespace-nowrap border-b-2 border-gray-100">
  <p className="font-semibold">Table 1</p>
  <div className="text-xs text-gray-600">
    {(() => {
      const daysAgo = getDaysAgo(order.date);
      
      if (daysAgo === 0) { // Today's order
        return (
          <>
            <div>Ordered: {formatOrderTime(order.date)}</div>
            {order.startTime && (
              <div>Taken: {getRelativeTime(order.startTime)}</div>
            )}
          </>
        );
      }
      return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    })()}
  </div>
</td>
                <td className="px-2 py-2 whitespace-nowrap border-b-2 border-gray-100">
                  <p className="font-semibold">{order.quantity}</p>
                  <p className="text-xs text-gray-600">
                    {order.countTimestamp}
                  </p>
                </td>

                <td className="px-2 py-2 whitespace-nowrap border-b-2 border-gray-100">
                  {!order.chefName || order.chefName === "" ? (
                  role === "Chef" ? ( 
                    <button
                      onClick={() => {
                        setSelectedOrderIndex(index);
                        setShowPopup(true);
                      }}
                      className="bg-red-700 text-white w-[90px] p-1 rounded whitespace-nowrap"
                    >
                      Take Order
                    </button>
                  ) : (
                    <button
                    disabled
                    className="bg-red-700 text-white w-[90px] p-1 rounded whitespace-nowrap"
                  >
                    Chef Only
                  </button>
                    )
                  ) : (
                    <div>
                      <p className="text-black font-bold">{order.chefName}</p>
                      <p className="text-xs text-gray-600">
                        {order.startTime
                          ? getRelativeTime(order.startTime)
                          : "Just now"}
                      </p>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap border-b-2 border-gray-100">
                  {order.result === "Progress" ? (
                    <span className="text-green-500 text-sm/6">
                      ✅ Progress
                    </span>
                  ) : order.result === "Pending" ? (
                    <span className="text-orange-500 text-sm/6">
                      ⏳ Pending
                    </span>
                  ) : (
                    <p className="font-semibold text-red-500">{order.result}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && selectedOrderIndex !== null && (
        <Popup
          onClose={() => setShowPopup(false)}
          onTakeOrder={() => handleTakeOrder(selectedOrderIndex)}
          username={username}
          profilePic={profilePic}
          role={role}
        />
      )}

      <div className="flex flex-col items-center mt-3">
      
<button onClick={() => setShowAllOrders(prev => !prev)}>
  {showAllOrders ? "Show Today's Orders" : "Show All Orders"} 
</button>

        <IoIosArrowDown className="text-xl text-red-700" />
      </div>
    </div>
  );
};

export default Card;
