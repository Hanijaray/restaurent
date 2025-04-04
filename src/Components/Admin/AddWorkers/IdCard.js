import React from "react";

const IDCard = ({ worker }) => {
  return (
    <div className="border p-4 text-xs rounded-lg shadow-md w-110 flex bg-white mt-5">
      <img
        src={worker?.image ? `http://localhost:5000/${worker.image}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThs9v6ZU0y7bpEACID-tvoDVkQ20uL-jg49g&s"}
        alt="Profile"
        className="w-28 h-40 rounded-md object-cover"
      />

      <div className="ml-4">
        <p className="font-bold">Name: <span className="font-normal">{worker?.name || "-"}</span></p>
        <p className="font-bold">
          Joining Date: 
          <span className="font-normal">
            {worker?.joiningDate ? new Date(worker.joiningDate).toLocaleDateString() : "-"}
          </span>
        </p>
        <p className="font-bold">Role: <span className="font-normal">{worker?.role || "-"}</span></p>
        <p className="font-bold">Worker No: <span className="font-normal">{worker?.workerNumber || "-"}</span></p>
        <p className="font-bold">Counter No: <span className="font-normal">{worker?.counterNumber || "-"}</span></p>
        <p className="font-bold">Phone No: <span className="font-normal">{worker?.phoneNumber || "-"}</span></p>
        <p className="font-bold">Emergency Call: <span className="font-normal">{worker?.emergencyCall || "-"}</span></p>
        <p className="font-bold">Username: <span className="font-normal">{worker?.username || "-"}</span></p>
        <p className="font-bold">Address: <span className="font-normal">{worker?.address || "-"}</span></p>
      </div>
    </div>
  );
};

export default IDCard;
