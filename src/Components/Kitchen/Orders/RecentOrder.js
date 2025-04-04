import { useState, useEffect } from "react";
import Popup from "../Orders/RecentPopup";

const Modal = ({ onClose, onFilter }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-black text-xl font-semibold"
        >
          ✖
        </button>
        <h3 className="text-2xl font-bold mb-2">Sort Your Place</h3>
        <p className="text-sm text-gray-600 mb-6">Sort Take your Order with</p>
        <div className="flex flex-col gap-3">
          <button
            className="bg-gray-700 text-white font-bold px-6 py-2 rounded-md w-full"
            onClick={() => onFilter("New")}
          >
            NEW ORDER
          </button>
          <button
            className="bg-red-600 text-white font-bold px-6 py-2 rounded-md w-full"
            onClick={() => onFilter("Pending")}
          >
            PENDING ORDERS
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OrderManagement() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  const [takenOrders, setTakenOrders] = useState([]);

  // Fetch username from localStorage
  const username = localStorage.getItem("username");
  const [profilePic, setProfilePic] = useState();
  const [role, setRole] = useState("");

  // Fetch user data from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedProfilePic = localStorage.getItem("profilePic");

    if (storedRole) setRole(storedRole);
    if (storedProfilePic && storedProfilePic !== "undefined") {
      setProfilePic(storedProfilePic);
    }
  }, []);

  // Load orders from localStorage
  const loadOrdersFromStorage = () => {
    const storedOrders = localStorage.getItem("orders");
    const storedTakenOrders = localStorage.getItem("takenOrders");

    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      const parsedTakenOrders = storedTakenOrders
        ? JSON.parse(storedTakenOrders)
        : [];

      // Filter out taken orders from the orders list
      const filteredOrders = parsedOrders.filter(
        (order) =>
          !parsedTakenOrders.some((takenOrder) => takenOrder._id === order._id)
      );

      setOrders(filteredOrders);
      setFilteredOrders(filteredOrders); // Initialize filtered orders
    }

    if (storedTakenOrders) {
      setTakenOrders(JSON.parse(storedTakenOrders));
    }
  };

  useEffect(() => {
    loadOrdersFromStorage();
  }, []);

  // Function to take an order
  const takeOrder = async (order) => {
    console.log("Order being taken:", order); // Check if the order is passed correctly.
    const takenTime = Date.now();
    const updatedOrder = {
      ...order,
      chefName: username,
      takenTime,
      takenTimeText: "Just now",
    };

    // Update the order in the database
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${order._id}/take-order`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chefName: username, // Pass the chef's username
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to take the order");
      }

      // Update the state to reflect the order has been taken
      setTakenOrders((prevTakenOrders) => {
        const newTakenOrders = [...prevTakenOrders, updatedOrder];
        localStorage.setItem("takenOrders", JSON.stringify(newTakenOrders)); // Sync with localStorage
        console.log("Updated Taken Orders:", newTakenOrders); // Debug: Check updated orders
        return newTakenOrders;
      });

      // Remove the taken order from available orders
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.filter((o) => o._id !== order._id);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        return updatedOrders;
      });

      setFilteredOrders((prevFilteredOrders) =>
        prevFilteredOrders.filter((o) => o._id !== order._id)
      );

      setShowPopup(false);
    } catch (error) {
      console.error("Error taking order:", error);
    }
  };

  // Automatically update taken order time
  useEffect(() => {
    const interval = setInterval(() => {
      setTakenOrders((prevTakenOrders) =>
        prevTakenOrders.map((order) => {
          const elapsedMinutes = Math.floor(
            (Date.now() - order.takenTime) / 60000
          );
          return {
            ...order,
            takenTimeText:
              elapsedMinutes < 1 ? "Just now" : `${elapsedMinutes} min ago`,
          };
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Update "New" and "Added" orders to "Pending" after 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const elapsedTime = (Date.now() - order.createdAt) / 60000; // Convert to minutes
          if (
            (order.status === "New" || order.status === "Added") &&
            elapsedTime >= 5
          ) {
            return { ...order, status: "Pending" };
          }
          return order;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [showModal, setShowModal] = useState(false);

  const handleFilter = (type) => {
    setFilteredOrders(orders.filter((order) => order.result === type));
    setShowModal(false);
  };

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders"); // Adjust your API endpoint

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();

      console.log("Fetched orders:", data); // Check if chef is in the data
      // Retrieve taken orders from localStorage
      const storedTakenOrders =
        JSON.parse(localStorage.getItem("takenOrders")) || [];

      // Filter out orders that have been taken
      const availableOrders = data.filter(
        (order) =>
          !storedTakenOrders.some((takenOrder) => takenOrder._id === order._id)
      );
      setOrders(availableOrders);
      setFilteredOrders(availableOrders);

      // Persist orders to localStorage
      localStorage.setItem("orders", JSON.stringify(data));
      {
        /*localStorage.setItem(
        "takenOrders",
        JSON.stringify(data.filter((order) => order.chef === username))
      );*/
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    loadOrdersFromStorage();
  }, []);

  useEffect(() => {
    fetchOrders(); // Fetch orders when the component mounts
  }, []);

  return (
    <div className="flex gap-6 p-1 h-[430px]">
      {/* Taken Orders Section */}
      <div className="bg-white shadow-lg rounded-lg p-2 w-1/2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold p-3">On Progress Orders</h2>
          <div className="flex space-x-4 mr-6">
            <span className="text-xs">Sort By</span>
            <button className="text-xs text-red-600">Recently</button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden">
          <div className="overflow-y-auto max-h-[300px]">
            {" "}
            {/* Adjust max-height here */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-500 text-white rounded-lg">
                  <th className="p-2">Order</th>
                  <th className="p-2">Table No</th>
                  <th className="p-2">Count</th>
                  <th className="p-2">Chef</th>
                  <th className="p-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {takenOrders.length > 0 ? (
                  takenOrders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-2 text-center font-semibold">
                        {order.menuName}
                      </td>
                      <td className="p-2 text-center">
                        Table 1
                        <br />
                        <span className="text-gray-500">{order.time}</span>
                      </td>
                      <td className="p-2 text-center">{order.quantity}</td>
                      <td className="p-2 text-center">
                        {order.chefName}
                        <br />
                        <span className="text-gray-500">
                          {order.takenTimeText}
                        </span>
                      </td>
                      <td className="p-2 text-center text-orange-500 font-semibold">
                        Progress
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No Orders in Progress
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Take Your Orders Section (Hidden when empty) */}
      <div className="bg-white shadow-lg rounded-lg p-4 w-1/2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold p-3">Take Your Orders</h2>
          <div className="flex space-x-4 mr-6">
            <span className="text-xs">Sort By</span>
            <button
              className="text-xs text-red-600"
              onClick={() => setShowModal(true)}
            >
              Recently
            </button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden">
          <div className="overflow-y-auto max-h-[300px]">
            {" "}
            {/* Adjust max-height here */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Order</th>
                  <th className="p-2">Table No</th>
                  <th className="p-2">Count</th>
                  <th className="p-2">Chef</th>
                  <th className="p-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-2 text-center font-semibold">
                        {order.menuName}
                      </td>
                      <td className="p-2 text-center">
                        Table 1
                        <br />
                        <span className="text-gray-500">{order.time}</span>
                      </td>
                      <td className="p-2 text-center">{order.quantity}</td>
                      <td className="p-2 text-center">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setShowPopup(true);
                            setSelectedOrder(order);
                          }}
                        >
                          Take Order
                        </button>
                      </td>
                      <td
                        className={`p-2 text-center font-semibold ${
                          order.status === "Pending"
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {order.status === "New" || order.status === "Added"
                          ? "✅ New"
                          : "⏳ Pending"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No Orders Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showPopup && selectedOrder && (
        <Popup
          onClose={() => setShowPopup(false)}
          onTakeOrder={() => takeOrder(selectedOrder)}
          username={username}
          profilePic={profilePic}
          role={role}
        />
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)} onFilter={handleFilter} />
      )}
    </div>
  );
}
