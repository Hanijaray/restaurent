import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker"; // Import a datepicker library
import "react-datepicker/dist/react-datepicker.css"; // Import its CSS
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import { Printer } from "lucide-react";
import logo from "../../../assets/cropsuper.png";

export default function GroceryExpenseCard() {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalVAT, setTotalVAT] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Add selectedDate state
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Grocery Expense</title>
         <style>
  body { 
    font-family: Arial, sans-serif; 
    padding: 20px; 
    text-align: center; 
  }
  
  img { 
    width: 120px; /* Adjusted for smaller size */
    display: block; 
    margin: 0 auto 20px auto; /* Added bottom margin for spacing */
  } 
  
  table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 20px; 
  }
  
  th, td { 
    border: 1px solid black; 
    padding: 10px; 
    text-align: center; 
  }
  
  th { 
    background-color: #f2f2f2; 
  }
  
  /* Zebra Striping for Table Rows */
  tr:nth-child(even) { 
    background-color: #f9f9f9; 
  }
  
  /* Summary section with spacing */
  .summary {
    margin-top: 20px; 
    font-weight: bold; 
    text-align: center; 
    font-size: 16px;
  }
  
  .summary span {
    display: inline-block;
    margin: 5px 15px; /* Adds spacing between total summary items */
  }
  
  /* Adjust print settings */
  @media print {
    .no-scroll { 
      overflow: visible !important; 
      height: auto !important; 
    }
    
    body {
      padding: 10px; /* Reduce padding for print layout */
    }
  }
</style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // ✅ Fetch groceries from the backend
  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get-groceriess");

        setGroceries(response.data);

        // ✅ Calculate totals
        let totalExpense = 0;
        let totalCount = 0;
        let totalVAT = 0;
        let daysSet = new Set();

        response.data.forEach((item) => {
          const itemTotal = item.totalCount * item.price;
          totalExpense += itemTotal;
          totalCount += item.totalCount;
          totalVAT += item.vat;
          daysSet.add(new Date(item.expiryDate).toLocaleDateString());
        });

        setTotalExpense(totalExpense);
        setTotalCount(totalCount);
        setTotalVAT(totalVAT);
        setTotalDays(daysSet.size);
      } catch (error) {
        console.error("Error fetching groceries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroceries();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

 
  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setIsMonthDropdownOpen(false);
  };

  const handleViewAllClick = () => {
    setSelectedMonth(null); // Reset selected month
    setSelectedDate(null);  // Reset selected date
    setSearchQuery("");     // Clear search query (optional, if needed)
  };
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const filteredGroceries = groceries.filter((item) => {
    const itemName = item.name.toLowerCase();
    const itemCount = item.totalCount.toString();
    const itemDate = new Date(item.expiryDate).toLocaleDateString("en-GB"); // Format: "dd/MM/yyyy"
    const itemMonth = new Date(item.expiryDate).getMonth();
  
    // Convert selectedDate to "dd/MM/yyyy" format for accurate comparison
    const formattedSelectedDate =
      selectedDate !== null ? selectedDate.toLocaleDateString("en-GB") : null;
  
    // Search filter: Checks if name, count, or date starts with the query
    const searchFilter =
      searchQuery === "" ||
      itemName.startsWith(searchQuery) ||
      itemCount.startsWith(searchQuery) ||
      itemDate.startsWith(searchQuery);
  
    // Month filter: Ensures the item's month matches the selected month
    const monthFilter = selectedMonth === null || itemMonth === selectedMonth;
  
    // Date filter: Matches only if a date is selected and equals the item's date
    const dateFilter = selectedDate === null || itemDate === formattedSelectedDate;
  
    return searchFilter && monthFilter && dateFilter;
  });
  
  

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
        <div className="bg-gray-800 text-white p-3 rounded-t-lg text-center font-bold text-lg">
          GROCERY EXPENSE
        </div>
        <div className="p-4 bg-white">
          <div className="flex justify-between items-center mb-3 mt-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search Name, Date or Count..."
                value={searchQuery}
                onChange={handleSearch}
                className="border p-2 rounded-lg w-[300px]"
              />
              <button className="p-3 bg-gray-700 text-white rounded-lg ">
                <FaSearch />
              </button>
            </div>
            <div className="relative flex gap-1">
              <button className="bg-gray-700 text-white px-4 py-2 w-32 rounded" onClick={handleViewAllClick}>
                View All
              </button>
              <div className="relative">
                <button
                  className="bg-red-600 text-white p-4 py-2 text-center rounded w-32 flex items-center gap-2"
                  onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                >
                  {selectedMonth !== null ? monthNames[selectedMonth] : "Month"} ▼
                </button>
                {isMonthDropdownOpen && (
                  <div className="absolute bg-white shadow-lg rounded-md w-36 mt-1 z-10">
                    {monthNames.map((month, index) => (
                      <button
                        key={index}
                        className="block w-full text-center p-1 hover:bg-gray-100"
                        onClick={() => handleMonthClick(index)}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)} // Update selectedDate state
                dateFormat="dd/MM/yyyy" // Customize date format if needed
                customInput={
                  <button className="p-3 bg-red-600 text-white rounded flex items-center justify-center">
                    <FaCalendarAlt />
                  </button>
                }
                popperPlacement="bottom-start"
                calendarClassName="border rounded-lg shadow-md bg-white p-0"
              />
            </div>
          </div>
          <div ref={printRef}>
            <div className="hidden print:flex items-center justify-center mb-1 mt-2">
              <img src={logo} alt="Logo" className="w-12 h-12 mr-3" />
              <h2 className="font-bold text-lg">Company Name (Expense)</h2>
            </div>
            <div className="text-sm text-gray-600 text-center flex justify-between mb-4 mt-2">
              <div> Total Invoice No: 209448 to 209479</div>
              <div>
                {groceries.length > 0
                  ? `${new Date(Math.min(...groceries.map(g => new Date(g.expiryDate))))
                    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })} 
       to  
       ${new Date(Math.max(...groceries.map(g => new Date(g.expiryDate))))
                    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })}`
                  : "N/A"}
              </div>

            </div>
            <div className="overflow-x-auto">
              <div className="h-[250px] overflow-y-auto border rounded-md relative">
                <table className="w-full border text-sm text-left">
                  <thead className="bg-gray-200 text-center sticky top-0 ">
                    <tr>
                      <th className="border p-2 bg-gray-200">From Date</th>
                      <th className="border p-2 bg-gray-200">Grocery Name</th>
                      <th className="border p-2 bg-gray-200">Grocery Count</th>
                      <th className="border p-2 bg-gray-200">VAT</th>
                      <th className="border p-2 bg-gray-200">Tax</th>
                      <th className="border p-2 bg-gray-200">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center p-4">
                          Loading data...
                        </td>
                      </tr>
                    ) : filteredGroceries.length > 0 ? (
                      filteredGroceries.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td className="border p-2">
                            {new Date(item.expiryDate).toLocaleDateString("en-US", {
                              weekday: "short",  // Fri, Sat, Sun
                              month: "short",    // Mar, Apr, May
                              day: "2-digit",    // 01, 09, 15
                              year: "numeric"    // 2024, 2025
                            })}
                          </td>

                          <td className="border p-2">{item.name}</td>
                          <td className="border p-2">{item.totalCount} {item.unit}</td>
                          <td className="border p-2">{item.vat}</td>
                          <td className="border p-2">₹{item.price}</td>
                          <td className="border p-2">
                            ₹{item.totalCount * item.price}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center p-4">
                          No groceries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-2 text-sm font-semibold">
                <span>
                  Total Days: {new Set(filteredGroceries.map(item =>
                    new Date(item.expiryDate).toDateString())).size}
                </span>
                <span>
                  Grocery Count: {filteredGroceries.reduce((sum, item) => sum + item.totalCount, 0)}
                </span>
                <span>
                  Total VAT: ₹{filteredGroceries.reduce((sum, item) => sum + (item.vat || 0), 0).toFixed(2)}/-
                </span>
                <span>
                  Total Expense: ₹{filteredGroceries.reduce((sum, item) => sum + (item.totalCount * item.price), 0).toFixed(2)}/-
                </span>
              </div>


            </div>
          </div>
        </div>
      </div>
      <div className="bg-black rounded-md p-2 mt-4">
        <div className="flex justify-between">
          <div className="text-white p-3 text-lg font-bold text-center">
            TOTAL EXPENSE: ₹{filteredGroceries.reduce((sum, item) => sum + (item.totalCount * item.price), 0).toFixed(2)}/-
          </div>
          <div className="text-sm text-white flex flex-col">
            <p>Total Days: {new Set(filteredGroceries.map(item =>
              new Date(item.expiryDate).toDateString())).size} </p>
            <p> Grocery Count: {filteredGroceries.reduce((sum, item) => sum + item.totalCount, 0)}</p>
            <p>Tot VAT: ₹{filteredGroceries.reduce((sum, item) => sum + (item.vat || 0), 0).toFixed(2)}/- </p>
            <p> Tot Expense: ₹{filteredGroceries.reduce((sum, item) => sum + (item.totalCount * item.price), 0).toFixed(2)}/-</p>
          </div>
        </div>
        <div className="bg-white rounded-xl">
          <button
            onClick={handlePrint} // Print function triggered on click
            className="bg-red-600 text-white px-6 py-3 w-full rounded text-2xl font-bold flex justify-center"
          >
            <Printer className="text-white w-10 h-10" /> PRINT INCOME
          </button>
        </div>
      </div>
    </div>
  );
}
