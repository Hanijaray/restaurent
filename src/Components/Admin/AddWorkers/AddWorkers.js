import React, { useState } from "react";
import AddWorkersDetail from "./AddWorkersDetail";
import WorkersDetail from "./WorkersDetail";
import IDCard from "./IdCard";

const AddWorkers = () => {
  const [selectedWorker, setSelectedWorker] = useState(null);

  const handleWorkerUpdated = () => {
    setSelectedWorker(null); // Reset selected worker after update
  };

  return (
    <div className="p-2 bg-gray-100 ">
      {/* Two-column Layout */}
      <div className="flex gap-2">
        {/* Left Side - Add Worker Form */}
        <div className="w-1/4 p-4 rounded">
          <AddWorkersDetail selectedWorker={selectedWorker} onWorkerUpdated={handleWorkerUpdated} />
          {/* Pass selectedWorker as a prop */}
          <IDCard worker={selectedWorker} />
        </div>

        {/* Right Side - Workers List Table */}
        <div className="w-3/4 p-4 rounded">
          <WorkersDetail onSelectWorker={setSelectedWorker} />
        </div>
      </div>
    </div>
  );
};

export default AddWorkers;


