import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Select from "react-select";

const GroceryHistory = () => {
  const [usedGroceryHistory, setUsedGroceryHistory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedGroceries, setSelectedGroceries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  useEffect(() => {
    const fetchUsedGroceryData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/used-grocery");
        if (!response.ok) throw new Error("Failed to fetch used grocery data");
        const data = await response.json();
        setUsedGroceryHistory(data);
      } catch (error) {
        console.error("Error fetching used grocery data:", error);
      }
    };
    fetchUsedGroceryData();
  }, []);

  const toggleTable = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setSelectedGroceries([]);
    } else {
      setSelectedIndex(index);
      setSelectedGroceries(usedGroceryHistory[index]?.groceries || []);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthOptions = months.map((month, index) => ({
    value: index + 1,
    label: month,
  }));

  // **Filtering Grocery History Based on Selected Month**
  let filteredHistory = usedGroceryHistory;
  if (selectedMonth) {
    filteredHistory = filteredHistory.filter((item) => {
      const itemMonth = new Date(item.fromDate).getMonth() + 1;
      return itemMonth === selectedMonth;
    });
  }

  // **Search Filtering (Supports Numbers & Text)**
  if (searchTerm.trim()) {
    filteredHistory = filteredHistory.filter((item) =>
      item.groceries.some((grocery) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          grocery.grocery.toLowerCase().includes(searchLower) ||  // Match name
          grocery.count.toString().includes(searchLower)           // Match number
        );
      })
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-[600px]">
      <h2 className="text-center text-xl font-bold mb-4">Used Grocery History</h2>
      <div className="flex items-center mb-3">
        <input
          type="text"
          placeholder="Search item"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-64"
        />
        <button className="bg-black text-white p-2 rounded-md ml-2">
          <FaSearch />
        </button>
        <Select
          className="ml-40 w-48"
          styles={{
            control: (base) => ({ ...base, backgroundColor: "red", color: "white" }),
            singleValue: (base) => ({ ...base, color: "white" }),
          }}
          placeholder="Select Month"
          options={monthOptions}
          onChange={(selected) => setSelectedMonth(selected.value)}
        />
      </div>
      <div className="flex justify-between bg-black text-white p-2 rounded-md text-sm">
        <span>From Date</span>
        <span>To Date</span>
        <span>View More</span>
      </div>
      <div className="mt-3 overflow-y-auto max-h-60">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item, index) => (
            <div key={index} className="border-b p-2">
              <div className="flex justify-between items-center">
                <span>{item.fromDate.split("T")[0]}</span>
                <span>{item.toDate.split("T")[0]}</span>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                  onClick={() => toggleTable(index)}
                >
                  {selectedIndex === index ? "Hide List" : "View List"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-2">No records found.</p>
        )}
      </div>
      
        <div className="mt-4 overflow-y-auto max-h-40 border p-2">
          <table className="w-full border-collapse border border-gray-400">
            <thead className="sticky top-0 bg-red-300">
              <tr>
                <th className="border p-2">S.no</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Used Grocery</th>
                <th className="border p-2">Count</th>
                <th className="border p-2">Unit</th>
              </tr>
            </thead>
            {selectedGroceries.length > 0 && (
            <tbody>
              {selectedGroceries.map((row, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{row.category || "Unknown"}</td>
                  <td className="border p-2">{row.grocery || "Unknown"}</td>
                  <td className="border p-2">{row.count || 0}</td>
                  <td className="border p-2">{row.unit || "N/A"}</td>
                </tr>
              ))}
            </tbody>
            )}
          </table>
        </div>
      
    </div>
  );
};

export default GroceryHistory;
