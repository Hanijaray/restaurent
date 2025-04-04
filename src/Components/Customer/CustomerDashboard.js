import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Dashboard = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(["Veg", "Non-Veg"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Fetch Menu Items from Backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/menus");
        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to fetch menu items");
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Handle quantity input change
  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  // Handle Order Now button click
  const handleOrderNow = async (item) => {
    const quantity = quantities[item._id] || 1; // Default to 1 if quantity is not set

    if (!quantity || quantity < 1) {
      alert("Please enter a valid quantity.");
      return;
    }

    // Check if the item is available
    if (item.state !== 1) {
      alert("This item is currently unavailable.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuId: item._id,
          menuName: item.menuName,
          quantity: quantity,
          amount: item.amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const data = await response.json();
      alert(data.message); // Show success message
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  // Filtered menu items based on selected category
  const filteredMenuItems =
    selectedCategory && selectedCategory !== "All"
      ? menuItems.filter((item) => item.category === selectedCategory)
      : menuItems;

  return (
    <div className="flex h-screen">
      <Sidebar isSidebarVisible={isSidebarVisible} />

      <div className="flex flex-col w-full">
        <Header
          isSidebarVisible={isSidebarVisible}
          toggleSidebar={toggleSidebar}
        />

        <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] bg-gray-100">
          <div className="bg-gray-100 p-4 font-sans">
            {/* Header with Dropdown */}
            <div className="flex items-center mb-4 font-bold text-lg">
              <span className="text-black text-xl">FOOD TYPE :</span>
              <select
                className="ml-2 text-red-600 text-xl border-b-2 border-red-600 outline-none bg-transparent cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Loading or Error Message */}
            {loading ? (
              <p className="text-center text-gray-600 text-lg">
                Loading menu items...
              </p>
            ) : error ? (
              <p className="text-center text-red-600 text-lg">{error}</p>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-5 rounded-lg shadow-lg h-[440px] w-[260px] flex flex-col items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.menuName}
                      className="w-[240px] h-[160px] rounded-lg object-cover"
                    />
                    <h3 className="text-center font-bold text-md text-red-700 mt-3">
                      {item.menuName}
                    </h3>
                    <p className="text-center text-black text-lg font-semibold">
                      ₹{item.amount}/-
                    </p>
                    <p
                      className={`text-center text-md font-medium mt-1 ${
                        item.state === 1 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.state === 1 ? "Available" : "Unavailable"}
                    </p>
                    <div className="flex flex-col items-center min-h-[30px]">
                      <p className="text-center text-gray-600 text-md">
                        11:30 am - 08:30 pm
                      </p>
                      {item.endingSoon && (
                        <p className="text-center text-red-600 text-sm font-semibold mt-1">
                          ⚠ Ending Soon
                        </p>
                      )}
                    </div>

                    {/* Quantity Input Field */}
                    <div className="flex items-center justify-between w-full px-6 mt-2">
                      <label className="text-md font-medium">Qty:</label>
                      <input
                        type="number"
                        value={quantities[item._id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(item._id, e.target.value)
                        }
                        className="border-b border-black w-24 text-center outline-none"
                        placeholder=""
                        disabled={item.state !== 1} // Disable input if item is unavailable
                      />
                    </div>

                    <button
                      onClick={() => handleOrderNow(item)}
                      className={`bg-red-600 text-white w-full mt-3 py-3 rounded-lg text-md font-semibold ${
                        item.state === 1
                          ? "hover:bg-red-700"
                          : "opacity-50 cursor-not-allowed"
                      } transition`}
                      disabled={item.state !== 1} // Disable button if item is unavailable
                    >
                      {item.state === 1 ? "ORDER NOW" : "Unavailable"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

