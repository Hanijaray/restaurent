import React, { useEffect, useState } from "react";
import axios from "axios";

const AttendanceCard = () => {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkerSummary = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/worker-summary");
        setWorkers(response.data);
      } catch (error) {
        console.error("Failed to fetch worker summary", error);
      }
    };

    fetchWorkerSummary();
  }, []);

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-lg">
      <h1 className="text-center text-2xl font-bold mb-4">TOTAL ATTENDANCE PERCENTAGE</h1>
      <div className="max-h-[510px] overflow-y-auto space-y-2">
        {workers.map((worker) => (
          <div
            key={worker.workerNumber}
            className="flex items-center border-2 p-3 rounded-lg bg-white shadow-md border-black"
          >
            <img
              src={`http://localhost:5000/${worker.image}`}
              alt="Worker"
              className="w-14 h-14 rounded-full border-2 border-gray-300"
            />
            <div className="ml-6 flex-grow">
              <h2 className="font-bold text-lg">{worker.name}</h2>
              <p className="text-gray-500 text-sm">({worker.workerNumber})</p>
              <p className="text-gray-500 text-sm">{worker.phoneNumber}</p>
            </div>
            <div className="text-center">
              <span className="bg-green-600 text-white px-9 py-2 rounded-md text-xs font-semibold">
                Present: {worker.presentPercentage}%
              </span>
              <span className="bg-red-600 text-white px-9 py-2 rounded-md text-xs font-semibold ml-1">
                Leave: {worker.leavePercentage}%
              </span>
              <div className="mt-2 bg-black text-white px-10 py-2 rounded-md text-sm font-bold">
                Total Working Hours: {worker.totalHours.toFixed(2)} hrs
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCard;








