import React, { useState, useEffect } from "react";

import { CiSearch } from "react-icons/ci";
import axios from "axios";

const WorkerAttendanceTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");



  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/attendances"
        );
        setAttendanceData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchAttendance();
  }, []);

  useEffect(() => {
    let filtered = attendanceData.filter((attendance) => {
      const attendanceDate = new Date(attendance.date);
      const formattedMonth = attendanceDate.toLocaleString("default", {
        month: "long",
      });
      const formattedDate = attendanceDate.toISOString().split("T")[0]; // Define formattedDate here

      // Apply filters properly
      const matchesMonth =
        selectedMonth === "" || formattedMonth === selectedMonth;
      const matchesDate = selectedDate === "" || formattedDate === selectedDate;
      const matchesSearch =
        searchQuery === "" ||
        attendance.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendance.workerNumber?.toString().includes(searchQuery) ||
        attendance.loginTime?.includes(searchQuery) ||
        attendance.logoutTime?.includes(searchQuery) ||
        attendance.totalHours?.toString().includes(searchQuery) ||
        attendance.status?.toLowerCase().includes(searchQuery.toLowerCase());
      formattedDate.includes(searchQuery); //  Allow searching by date

      return matchesMonth && matchesDate && matchesSearch;
    });
    setFilteredData(filtered);
  }, [searchQuery, selectedMonth, selectedDate, attendanceData]);

  // Function to handle date selection
  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);

    if (dateValue) {
      const filtered = attendanceData.filter((attendance) => {
        const formattedDate = new Date(attendance.date)
          .toISOString()
          .split("T")[0]; // Convert to YYYY-MM-DD
        return formattedDate === dateValue;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(attendanceData); // Reset if no date selected
    }
  };

  const handleViewAll = () => {
    setSearchQuery("");
    setSelectedMonth("");
    setSelectedDate("");
    setFilteredData(attendanceData);
  };

  return (
    <div className="bg-white p-7 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      {/* Search & Filters Row */}
      <div className="flex items-center gap-2 mb-4 justify-between">
        <div className="relative flex items-center border-2 border-black rounded-md overflow-hidden bg-white w-[250px]">
          <input
            type="text"
            placeholder="Search People etc."
            className="w-full h-10 pl-4 pr-10 border-2 border-black rounded- outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="bg-black text-white p-2 rounded-lg flex items-center justify-center h-10 w-10">
          <CiSearch />
        </button>
        <button
          className="bg-black text-white px-6 py-2 h-10 rounded-lg font-bold flex-1"
          onClick={handleViewAll}
        >
          View All
        </button>
        <select
          className="bg-red-600 text-white font-bold p-2 h-10 rounded-lg flex-1 text-center"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Month</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        {/* Date Picker */}
        <input
          type="date"
          className="bg-red-600 text-white w-[240px] px-4 py-2 rounded-lg cursor-pointer"
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>

      {/* Table Container */}
      <div className="border rounded-xl max-h-[400px] overflow-y-auto min-h-[470px] ">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead className="bg-black text-white sticky top-0 z-10">
            <tr>
              <th className="p-3 w-[15%] text-center">Date</th>
              <th className="w-[15%] text-center">Worker No</th>
              <th className="w-[20%] text-center">Worker</th>
              <th className="w-[15%] text-center">Login</th>
              <th className="w-[15%] text-center">Logout</th>
              <th className="w-[10%] text-center">Tot Hr</th>
              <th className="w-[10%] text-center">State</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((attendance, index) => (
                <tr key={index} className="border-b text-center">
                  <td className="p-4">
                    {new Date(attendance.date).toLocaleDateString()}
                  </td>
                  <td>{attendance.workerNumber || "120"}</td>
                  <td>{attendance.name}</td>
                  <td>{attendance.loginTime}</td>
                  <td>{attendance.logoutTime || "Nil"}</td>
                  <td>{attendance.totalHours}</td>
                  <td>
                    <button
                      className={`px-5 py-1 rounded-lg font-bold text-white ${
                        attendance.status === "Absent"
                          ? "bg-red-600"
                          : "bg-green-500"
                      }`}
                    >
                      {attendance.status.toUpperCase()}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
    </div>
  );
};

export default WorkerAttendanceTable;
