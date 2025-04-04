import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Select from "react-select";
import logo from "../../../../assets/cropsuper.png";
import { MdArrowDropDown } from "react-icons/md";

const GroceryHistory = () => {
  const [usedGroceryHistory, setUsedGroceryHistory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedGroceries, setSelectedGroceries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsedGroceryData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/used-grocery");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setUsedGroceryHistory(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUsedGroceryData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).replace(",", ""); // Remove the comma for "Mar-01-2025" format
  };
  

  const toggleTable = (index) => {
    setSelectedIndex(selectedIndex === index ? null : index);
    setSelectedGroceries(selectedIndex === index ? [] : usedGroceryHistory[index]?.groceries || []);
  };

  const months = [
    { value: 0, label: "All Month" }, // Value 0 ensures it includes all months
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ];
  

  const monthOptions = months.map((month, index) => ({
    value: index + 1,
    label: month,
  }));

  let filteredHistory = usedGroceryHistory;

  if (selectedMonth) {
    filteredHistory = filteredHistory.filter((item) => {
      const itemMonth = new Date(item.fromDate).getMonth() + 1;
      return itemMonth === selectedMonth.value;
    });
  }

  if (searchTerm.trim()) {
    filteredHistory = filteredHistory.filter((item) =>
      item.groceries.some((grocery) => {
        const searchLower = searchTerm.toLowerCase();
        return grocery.grocery.toLowerCase().includes(searchLower) || grocery.count.toString().includes(searchLower);
      })
    );
  }
 
  const filterData = () => {
    let filteredHistory = usedGroceryHistory;
  
    // If a month is selected and it's NOT "All Month" (value: 0), filter by that month
    if (selectedMonth && selectedMonth.value !== 0) {
      filteredHistory = filteredHistory.filter((item) => {
        const itemMonth = new Date(item.fromDate).getMonth() + 1;
        return itemMonth === selectedMonth.value;
      });
    }
  
    // Filter by search term (matches grocery name, count, or formatted date)
    if (searchTerm.trim()) {
      filteredHistory = filteredHistory.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const formattedFromDate = formatDate(item.fromDate).toLowerCase(); 
        const formattedToDate = formatDate(item.toDate).toLowerCase();
  
        return (
          formattedFromDate.includes(searchLower) ||  
          formattedToDate.includes(searchLower) ||  
          item.groceries.some((grocery) =>
            grocery.grocery.toLowerCase().includes(searchLower) || 
            grocery.count.toString().includes(searchLower)
          )
        );
      });
    }
  
    return filteredHistory;
  };
  

  return (
    <div className="flex gap-4 w-full">
      {/* Left Panel - Grocery List */}
      <div className="w-1/2 bg-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          {/* Search Input */}
          <div className=" w-80">
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
          </div>
          <div className="relative">
  <button className="bg-red-600 text-white px-4 py-2 w-[240px] rounded-lg flex items-center justify-between ">
    Month<MdArrowDropDown className="ml-2"/>
  </button>
  <select 
  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
  onChange={(e) => {
    const selectedValue = parseInt(e.target.value);
    setSelectedMonth(months.find(month => month.value === selectedValue));
  }}
  value={selectedMonth ? selectedMonth.value : 0} // Default to "All Month"
>
  {months.map((month) => (
    <option key={month.value} value={month.value}>{month.label}</option>
  ))}
</select>

 
</div>
        </div>

        {/* Table */}
        {/* Scrollable History Table */}
<div className="border rounded-lg overflow-hidden ">
  {/* Sticky Header */}
  <div className="bg-black text-white grid grid-cols-4 p-2 font-bold text-center sticky top-0 z-10">
    <span>From Date</span>
    <span>To Date</span>
    <span>Grocery Count</span>
    <span>View More</span>
  </div>

  {/* Scrollable Rows */}
  <div className="overflow-y-auto max-h-96">
  {filterData().map((item, index) => (

      <div
        key={index}
        className={`grid grid-cols-4 p-2 text-center ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b`}
      >
        <span>{formatDate(item.fromDate)}</span>
        <span>{formatDate(item.toDate)}</span>
        <span>{item.groceries.length}</span>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm ml-8 flex items-center gap-1 w-28"
          onClick={() => toggleTable(index)}
        >
          {selectedIndex === index ? "Hide List" : "View List"}
          {selectedIndex === index ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      </div>
    ))}
  </div>
</div>

      </div>

      {/* Right Panel - Used Grocery Details */}
      <div className="w-1/2 bg-white p-4 border-2 border-red-400 rounded-xl shadow-lg">
        <div className="w-full p-4">
           <div className="flex justify-center items-center space-x-2">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full border-2 border-white" />
              <h2 className="text-2xl font-bold">Chraz Management</h2>
              </div>
          <p className="text-center text-gray-600 text-sm mb-4">
            Life Changers Ind
          </p>
          <div className=" bg-white p-4 border-2 border-grey-400 rounded-xl shadow-lg">
         
          {selectedGroceries.length > 0 && (
  <div className="mb-2 font-semibold text-gray-700 flex justify-between">
    {/* Left-aligned From Date */}
    <div className="text-left">
      <span>
        <strong>From Date: </strong>
        {formatDate(usedGroceryHistory[selectedIndex]?.fromDate)}
      </span>
    </div>

    {/* Right-aligned To Date */}
    <div className="text-right">
      <span>
        <strong>To Date:</strong> 
        {formatDate(usedGroceryHistory[selectedIndex]?.toDate)}
      </span>
    </div>
  </div>
)}

          <div className="mt-4 overflow-y-auto max-h-80 border p-2">
          <table className="w-full border-collapse border ">
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
        {selectedGroceries.length > 0 && (
    <>
      <hr className="my-2 border-gray-400" />
      <div className="font-semibold text-gray-700 text-left pr-4">
        <p>
          <strong>Total Count:</strong> {selectedGroceries.reduce((sum, item) => sum + (item.count || 0), 0)}
        </p>
      </div>
    </>
  )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryHistory;