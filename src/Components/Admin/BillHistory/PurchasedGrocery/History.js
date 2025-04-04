import React, { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdPlay } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import axios from "axios";

const GroceryTable = ({ onSelectGrocery, onSearchResults }) => {
  const [categories, setCategories] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchGroceries();
  }, [selectedCategory, selectedMonth]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/grocerycategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchGroceries = async () => {
    try {
      let endpoint = "http://localhost:5000/api/groceries";
      if (selectedCategory) {
        endpoint += `?category=${encodeURIComponent(selectedCategory)}`;
      }
      const response = await axios.get(endpoint);
      setGroceries(response.data);
    } catch (error) {
      console.error("Error fetching groceries:", error);
    }
  };

  // Function for IoMdPlay icon (expiry date filtering)
  const handlePlayClick = (expiryDate) => {
    if (!onSelectGrocery) {
      console.error("onSelectGrocery is not defined");
      return;
    }

    const filteredGroceries = groceries.filter(
      (grocery) => new Date(grocery.expiryDate).toDateString() === new Date(expiryDate).toDateString()
    );

    onSelectGrocery(filteredGroceries);
  };

  // Function to filter groceries based on search and month
  const filteredGroceries = useMemo(() => {
    return groceries.filter((grocery) => {
      const searchLower = searchQuery.toLowerCase();
      
      // Format the expiry date to match the search input
      const formattedDate = grocery.expiryDate
        ? new Date(grocery.expiryDate).toLocaleDateString("en-GB") // Format: DD/MM/YYYY
        : "";
  
      // Search query matches name OR formatted expiry date
      const matchesSearch = grocery.name.toLowerCase().includes(searchLower) || formattedDate.includes(searchQuery);
      
       // Check if the selected month matches the grocery expiry month
    const groceryMonth = grocery.expiryDate ? new Date(grocery.expiryDate).getMonth() + 1 : null;
    const matchesMonth = selectedMonth === "" || selectedMonth === "All" || groceryMonth === parseInt(selectedMonth);

    return matchesSearch && matchesMonth;
  });
}, [groceries, searchQuery, selectedMonth]);
  

  // Pass search results to Card component
  useEffect(() => {
    if (onSearchResults) {
      onSearchResults(filteredGroceries);
    }
  }, [filteredGroceries, onSearchResults]);

  return (
    <div className="w-[1150px] h-full ml-4">
      <div className="bg-white shadow-lg border rounded-2xl h-full overflow-auto">
        <div className="flex justify-between items-center bg-white p-4 rounded-md shadow w-full">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search Item"
              className="border p-2 rounded-lg w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-3 bg-gray-700 text-white rounded-lg flex items-center justify-center">
              <FaSearch />
            </button>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black text-white w-[200px] px-4 py-2 rounded-lg text-lg border-2 border-black cursor-pointer"
            >
              <option value="">Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
          <select
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(e.target.value)}
  className="bg-red-500 text-white w-[250px] px-4 py-2 rounded-lg text-lg border-2 border-black cursor-pointer"
>
  <option value="" disabled hidden>Sort by Month</option> {/* Placeholder */}
  <option value="All">All Month</option>
  {Array.from({ length: 12 }, (_, i) => (
    <option key={i + 1} value={i + 1}>
      {new Date(0, i).toLocaleString("default", { month: "long" })}
    </option>
  ))}
</select>
            <button className="p-4 bg-red-500 text-white rounded-lg flex items-center justify-center">
              <SlCalender />
            </button>
          </div>
        </div>
        <div className="relative w-full h-[450px] overflow-auto border rounded-lg">
          <table className="w-full border text-lg rounded-lg text-center">
            <thead className="bg-black text-white text-lg sticky top-0 z-10 text-left">
              <tr>
                <th className="p-3 text-center">Image</th>
                <th>Added Date</th>
                <th>Grocery</th>
                <th>Total Count</th>
                <th>Limitation</th>
                <th>VAT</th>
                <th>Price</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroceries.length > 0 ? (
                filteredGroceries.map((grocery) => (
                  <tr key={grocery._id} className="border-b hover:bg-gray-100 text-left">
                    <td>
                      <img
                        src={grocery.image ? `http://localhost:5000${grocery.image}` : "https://via.placeholder.com/40"}
                        alt="Grocery"
                        className="w-10 h-10 rounded-full mx-auto object-cover text-center"
                      />
                    </td>
                    <td>{new Date(grocery.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <span className="font-semibold">{grocery.name}</span>
                      <br />
                      <span className="text-xs text-gray-500">{grocery.category}</span>
                    </td>
                    <td>{grocery.totalCount}</td>
                    <td>{grocery.warningLimit || "N/A"}</td>
                    <td>{grocery.vat ? `${grocery.vat}%` : "N/A"}</td>
                    <td>{grocery.price}</td>
                    <td>
                      <button
                        className="bg-red-600 text-white p-2 rounded-md shadow-md hover:bg-red-700 transition-all flex items-center"
                        onClick={() => handlePlayClick(grocery.expiryDate)}
                      >
                        <IoMdPlay size={20} className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">No groceries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroceryTable;


































