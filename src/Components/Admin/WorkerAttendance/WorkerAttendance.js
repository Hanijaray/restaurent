import React from "react";
import WorkerAttendanceTable from "./WorkerAttendanceTable";
import AttendanceCard from "./AttendanceCard";

export default function WorkersAttendance() {
  return (
    <div className="h-full w-full p-4 bg-gray-100">
      <div className="flex gap-4 items-start">
        {/* Left Side - Attendance Cards (40%) */}
        <div className="w-2/5">
          <AttendanceCard />
        </div>

        {/* Right Side - Attendance Table (60%) */}
        <div className="w-3/5">
          <WorkerAttendanceTable />
        </div>
      </div>
    </div>
  );
}