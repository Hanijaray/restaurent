import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import WorkersReport from "./WorkersReport";
import axios from "axios";
import Gwarning from "./Gwarning";

const GroceryWorkersReport = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  const [logoutTimes, setLogoutTimes] = useState({}); // Store logout times for each row
  const [groceries, setGroceries] = useState([]);
  const [groceryLoading, setGroceryLoading] = useState(true);
  const [grocerySearchQuery, setGrocerySearchQuery] = useState("");
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState("");

  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/groceries");
        setGroceries(response.data);
      } catch (error) {
        console.error("Error fetching groceries:", error);
      } finally {
        setGroceryLoading(false);
      }
    };
    fetchGroceries();
  }, []);

  const handleEnterClick = async (index, attendanceId) => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    try {
      // Send update request to backend
      await axios.put(
        `http://localhost:5000/api/attendances/update/${attendanceId}`,
        {
          logoutTime: currentTime,
        }
      );

      // Update the frontend state
      setLogoutTimes((prevTimes) => {
        const updatedTimes = { ...prevTimes, [attendanceId]: currentTime };
        localStorage.setItem("logoutTimes", JSON.stringify(updatedTimes));
        return updatedTimes;
      });
    } catch (error) {
      console.error("Error updating logout time:", error);
    }
  };

  // Fetch attendance data from MongoDB
  useEffect(() => {
    // Retrieve stored logout times from localStorage
    const storedLogoutTimes = localStorage.getItem("logoutTimes");
    if (storedLogoutTimes) {
      setLogoutTimes(JSON.parse(storedLogoutTimes));
    }
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/attendances"
        );
        console.log("Fetched Attendance Data:", response.data); // Debugging
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };
    fetchAttendance();
  }, []); // ✅ Dependency array added

  const handleToggleStatus = async (attendance) => {
    try {
      const newStatus = attendance.status === "Present" ? "Absent" : "Present";

      await axios.post("http://localhost:5000/api/attendance", {
        name: attendance.name,
        status: newStatus,
        loginTime: newStatus === "Present" ? "10:00 AM" : "Nil", // Example time
        logoutTime: newStatus === "Present" ? "06:00 PM" : "Nil",
      });

      alert(`Status changed to ${newStatus}`);
      setAttendanceData((prevData) =>
        prevData.map((att) =>
          att.name === attendance.name ? { ...att, status: newStatus } : att
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update attendance status.");
    }
  };

  // Get today's date in a comparable format
  const todayDate = new Date().toLocaleDateString();

  const filteredAttendanceData = attendanceData.filter((attendance) => {
    const formattedDate = new Date(attendance.date).toLocaleDateString();
    const searchLower = attendanceSearchQuery.toLowerCase();

    return attendanceSearchQuery
      ? formattedDate.includes(attendanceSearchQuery) ||
          attendance.name.toLowerCase().includes(searchLower) ||
          attendance.status.toLowerCase().includes(searchLower)
      : formattedDate === todayDate; // Show today's records if no search query
  });

  const filteredGroceries = groceries.filter((grocery) => {
    const searchLower = grocerySearchQuery.toLowerCase();
    const date = new Date(grocery.date).toLocaleDateString().toLowerCase();
    const price = grocery.price.toString();
    const vat = grocery.vat.toString();
    const totalCount = grocery.totalCount.toString();

    return (
      grocery.name.toLowerCase().includes(searchLower) ||
      date.includes(searchLower) ||
      price.includes(searchLower) ||
      vat.includes(searchLower) ||
      totalCount.includes(searchLower)
    );
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Left Column: Grocery Warning & Grocery Count */}
        <div className="space-y-6">
          {/* Grocery Warning Section */}
          <Gwarning />

          {/* Total Grocery and Count Section */}
          <div className="bg-white p-5 rounded-lg shadow-lg h-[400px] ">
            <h2 className="text-xl font-bold mb-3">Total Grocery And Count</h2>
            <div className="relative flex items-center mb-4">
              <input
                type="text"
                placeholder="Search Item, Month, Date, Price etc."
                className="w-full p-2 border rounded-lg pl-3"
                value={grocerySearchQuery}
                onChange={(e) => setGrocerySearchQuery(e.target.value)}
              />

              <button className="bg-[#2f2f2f] p-3 rounded-lg ml-2">
                <Search className="text-white" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[250px]">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-[#2f2f2f] text-white text-lg rounded-lg sticky top-0">
                    <th className="p-3 w-[100px]">Date</th>
                    <th className="p-3 ">Grocery</th>
                    <th className="p-3">Count</th>
                    <th className="p-3">Tax</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">VAT</th>
                    <th className="p-3 rounded-tr-lg">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {groceryLoading ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        Loading groceries...
                      </td>
                    </tr>
                  ) : filteredGroceries.length > 0 ? (
                    filteredGroceries.map((grocery) => {
                      const taxAmount = (grocery.price * grocery.vat) / 100;
                      const total = grocery.price + taxAmount;

                      return (
                        <tr
                          key={grocery._id}
                          className="border-b border-gray-300"
                        >
                          <td className="p-4">
                            {new Date(grocery.expiryDate).toLocaleDateString()}
                          </td>
                          <td className="p-4">{grocery.name}</td>
                          <td className="p-4">
                            {grocery.totalCount} {grocery.unit}
                          </td>
                          <td className="p-4">{taxAmount.toFixed(2)}</td>
                          <td className="p-4">{grocery.price.toFixed(2)}</td>
                          <td className="p-4">{grocery.vat}%</td>
                          <td className="p-4">Rs.{total.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        No groceries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Right Column: Worker Daily Attendance */}
        <div>
          <div className="bg-white p-5 rounded-lg shadow-lg h-[450px]">
            <h2 className="text-xl font-bold mb-3">Worker Daily Attendance</h2>
            <div className="relative flex items-center mb-4">
              <input
                type="text"
                placeholder="Search People etc."
                className="w-full p-2 border rounded-lg pl-3"
                value={attendanceSearchQuery}
                onChange={(e) => setAttendanceSearchQuery(e.target.value)}
              />

              <button className="bg-[#2f2f2f] p-3 rounded-lg ml-2">
                <Search className="text-white" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[300px]">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="sticky top-0 bg-[#2f2f2f] text-white z-10">
                    <th className="p-3 rounded-tl-lg">Date</th>
                    <th className="p-3">Worker</th>
                    <th className="p-3">Login</th>
                    <th className="p-3">Logout</th>
                    <th className="p-3">Tot Hr</th>

                    <th className="p-4 rounded-tr-lg pl-10">State</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredAttendanceData.length > 0 ? (
                    filteredAttendanceData.map((attendance, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="p-4">
                          {new Date(attendance.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">{attendance.name}</td>
                        <td className="p-4">{attendance.loginTime}</td>
                        <td className="p-4">
                          {attendance.status === "Absent" ? (
                            <span className="text-red-700 ">Nil</span>
                          ) : logoutTimes[attendance._id] ||
                            attendance.isLogoutEntered ? (
                            <span>{attendance.logoutTime}</span>
                          ) : (
                            <button
                              className="text-[#d52a2a] font-bold"
                              onClick={() =>
                                handleEnterClick(index, attendance._id)
                              }
                            >
                              Enter
                            </button>
                          )}
                        </td>

                        <td>{attendance.totalHours}</td>

                        <td className="p-4">
                          <button
                            className={`px-5 py-1 rounded-lg font-bold text-white ${
                              attendance.status === "Absent"
                                ? "bg-[#d52a2a]"
                                : "bg-green-500"
                            }`}
                            onClick={() => handleToggleStatus(attendance)}
                          >
                            {attendance.status.toUpperCase()}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD ATTENDANCE REPORT button moved outside */}
          <button
            className="w-full bg-[#2f2f2f] text-white text-2xl font-bold py-3 rounded-lg mt-5 flex items-center justify-center gap-2"
            onClick={() => setIsPopupOpen(true)}
          >
            <span className="text-8xl font-extrabold justify-center h-21">
              {" "}
              +{" "}
            </span>
            <span className="justify-center mt-6">ADD ATTENDANCE REPORT</span>
          </button>
          {isPopupOpen && (
            <WorkersReport onClose={() => setIsPopupOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroceryWorkersReport;
