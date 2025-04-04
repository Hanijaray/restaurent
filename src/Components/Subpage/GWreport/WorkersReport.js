import React, { useState ,useEffect } from "react";
import axios from "axios";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoIosTime } from "react-icons/io";
import { MdTimerOff } from "react-icons/md";

const WorkersReport = ({ onClose,refreshAttendance }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Present");
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [workerNames, setWorkerNames] = useState([]); // Store worker names
  const [selectedWorker, setSelectedWorker] = useState("");

  // Fetch stored worker names when component mounts
  useEffect(() => {
    axios.get("http://localhost:5000/api/workers")
      .then((response) => {
        setWorkerNames(response.data); // Store workers
      })
      .catch((error) => {
        console.error("Error fetching worker names:", error);
      });

    // Fetch attendance data for the selected worker
    if (selectedWorker) {
      axios.get(`http://localhost:5000/api/attendance?name=${selectedWorker}`)
        .then((response) => {
          const attendance = response.data;
          if (attendance) {
            setLoginTime(attendance.loginTime);
            setLogoutTime(attendance.logoutTime);
          }
        })
        .catch((error) => {
          console.error("Error fetching attendance data:", error);
        });
    }
  }, [selectedWorker]);

   // Convert 24-hour time to 12-hour AM/PM format
   const convertToAMPM = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let hours = parseInt(hour, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM case
    return `${hours}:${minute} ${ampm}`;
  };

  const handleAddAttendance = async () => {
    if (!selectedWorker) {
      alert("Name is required!");
      return;
    }
  
    if (status === "Present" && (!loginTime || !logoutTime)) {
      alert("Login and Logout times are required for Present workers!");
      return;
    }

  try{
      const response = await axios.post("http://localhost:5000/api/attendance", {
        name: selectedWorker,
        workerNumber:workerNames.find((worker) => worker.name === selectedWorker).workerNumber,
        status,
        loginTime: status === "Present" ? convertToAMPM(loginTime) : "Nil",
      logoutTime: status === "Present" ? convertToAMPM(logoutTime) : "Nil",
      });

      alert(response.data.message);
      refreshAttendance(); // ✅ Refresh attendance after adding
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  function calculateTotalHours(loginTime, logoutTime) {
    if (loginTime === "Nil" || logoutTime === "Nil") return "N/A";
  
    const parseTime = (time) => {
      let hours, minutes;
  
      // Check if time is in 24-hour format (e.g., "14:30")
      if (time.includes(":") && !time.includes("AM") && !time.includes("PM")) {
        [hours, minutes] = time.split(":").map((t) => parseInt(t, 10));
      } else {
        // Handle 12-hour format with AM/PM
        let [hour, minute, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
        hours = parseInt(hour, 10);
        minutes = parseInt(minute, 10);
  
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
      }
  
      return hours * 60 + minutes; // Convert to total minutes
    };
  
    const loginMinutes = parseTime(loginTime);
    const logoutMinutes = parseTime(logoutTime);
  
    if (logoutMinutes < loginMinutes) return "N/A"; // Invalid time case
  
    const diffMinutes = logoutMinutes - loginMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
  
    return `${hours}.${minutes.toString().padStart(2, "0")} hrs`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-[500px] p-8 rounded-xl bg-white shadow-2xl text-center">
        <h1 className="text-3xl mb-4 font-bold font-serif">Workers Report</h1>

        <div className="flex gap-4 mb-4">
          <div className="relative w-full">
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="w-full p-3 border rounded-lg pl-10 bg-white"
            >
              <option value="" >
                Enter Name
              </option>
              {workerNames.length > 0 ? (
                workerNames.map((worker) => (
                  <option key={worker._id} value={worker.name}>
                    {worker.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-3xl">
              <RiAccountCircleFill />
            </div>
          </div>

          <div className="relative w-full">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border rounded-lg pl-10 bg-white"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-3xl">
              <RiAccountCircleFill />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative w-full">
            <input
              type="time"
              value={loginTime}
              onChange={(e) => setLoginTime(e.target.value)}
              className="w-full p-3 border rounded-lg pl-10"
              disabled={status === "Absent"}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-3xl">
              <IoIosTime />
            </div>
          </div>

          <div className="relative w-full">
            <input
              type="time"
              value={logoutTime}
              onChange={(e) => setLogoutTime(e.target.value)}
              className="w-full p-3 border rounded-lg pl-10"
              disabled={status === "Absent"}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-3xl">
              <MdTimerOff />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddAttendance}
            className="w-full py-4 bg-red-600 text-white rounded-lg font-serif text-xl"
          >
            ADD ATTENDANCE
          </button>
          <button className="w-full py-4 bg-gray-600 text-white rounded-lg font-serif text-xl" onClick={onClose}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkersReport;







