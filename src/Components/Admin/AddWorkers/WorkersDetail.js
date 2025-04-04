import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdPlay } from "react-icons/io";
import {  FaEdit, FaTrash, FaSave } from "react-icons/fa";
const API_URL = "http://localhost:5000/api/workers";

const WorkersDetail = ({ onSelectWorker }) => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]); // ✅ Fixed: Defined state
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'saudi', 'others'
 const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [deleteWorkerId, setDeleteWorkerId] = useState(null); // For delete confirmation modal

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
  
        // ✅ Sort workers so newest appear first
        const sortedWorkers = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        setWorkers(sortedWorkers);
        setFilteredWorkers(sortedWorkers);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
  
    fetchWorkers();
  }, []);
  

  // **Filter & Search Logic**
  useEffect(() => {
    let filtered = workers;

    if (filter === "saudi") {
      filtered = workers.filter((worker) => worker.country?.toLowerCase() === "saudi");
    } else if (filter === "others") {
      filtered = workers.filter((worker) => worker.country?.toLowerCase() !== "saudi");
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (worker) =>
          worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker.phoneNumber.includes(searchTerm) ||
          worker.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredWorkers(filtered); // ✅ Update filteredWorkers when search or filter changes
  }, [searchTerm, filter, workers]);

   // Handle edit
   const handleEdit = (worker) => {
    onSelectWorker(worker); // Pass selected worker to parent state
  };
  

  // Handle save
  const handleSave = (workerId) => {
    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) =>
        worker._id === workerId ? { ...worker, name: editValue } : worker
      )
    );
    setEditingId(null);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteWorkerId) return;

    try {
      const response = await fetch(`${API_URL}/${deleteWorkerId}`, { method: "DELETE" });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete error response:", errorText);
        throw new Error(errorText);
      }

      setWorkers((prev) => prev.filter((worker) => worker._id !== deleteWorkerId));
      setFilteredWorkers((prev) => prev.filter((worker) => worker._id !== deleteWorkerId));

      console.log(`Worker ${deleteWorkerId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting worker:", error);
    } finally {
      setDeleteWorkerId(null); // Close modal after delete
    }
  };
  
  
  
  

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg ">
      {/* Search Bar and Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search Worker by Name, Phone, or Username"
            className="p-2 border rounded w-[400px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-3 bg-black text-white rounded-md">
            <FaSearch />
          </button>
        </div>
        <div className="space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "others" ? "bg-red-600" : "bg-red-500"
            } text-white`}
            onClick={() => setFilter("others")}
          >
            Others
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "saudi" ? "bg-red-800" : "bg-red-700"
            } text-white`}
            onClick={() => setFilter("saudi")}
          >
            Saudi
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "all" ? "bg-gray-900" : "bg-black"
            } text-white`}
            onClick={() => setFilter("all")}
          >
            View All
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg overflow-hidden border">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="min-w-full text-left border-collapse">
            {/* Fixed Header */}
            <thead className="bg-black text-white sticky top-0">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Worker Detail</th>
                <th className="p-3">Phone No.</th>
                <th className="p-3">Emergency Call</th>
                <th className="p-3">Worker Address</th>
                <th className="p-3">User Name</th>
                <th className="p-3">Password</th>
                <th className="p-3">Edit</th>
              </tr>
            </thead>

            {/* Scrollable Table Body */}
            <tbody>
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">
                      <img
                        src={`http://localhost:5000/${worker.image}`}
                        alt="Worker"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="p-3">{worker.name}</td>
                    <td className="p-3 whitespace-pre-line">
                      {worker.workerNumber}
                      <br />
                      {worker.counterNumber || "N/A"}
                    </td>
                    <td className="p-3">{worker.phoneNumber}</td>
                    <td className="p-3">{worker.emergencyCall || "N/A"}</td>
                    <td className="p-3">{worker.address}</td>
                    <td className="p-3">{worker.username}</td>
                    <td className="p-3">{worker.password}</td>
                     <td className="p-2 flex justify-center gap-2">
                     {editingId === worker._id ? (
                                           <button className="p-2 bg-green-600 text-white rounded" onClick={() => handleSave(worker._id)}>
                                             <FaSave />
                                           </button>
                                         ) : (
                                          <button className="p-2 bg-gray-600 text-white rounded" onClick={() => handleEdit(worker)}>
                                          <FaEdit />
                                        </button>
                                        
                                         )}
                                         <button className="p-2 bg-red-600 text-white rounded" onClick={() => setDeleteWorkerId(worker._id)}>
  <FaTrash />
</button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-3 text-center">
                    No workers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
   

     {/* Delete Confirmation Modal */}
     {deleteWorkerId && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg font-semibold mb-4">Are you sure you want to delete this worker?</p>
          <div className="flex justify-end space-x-4">
            <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setDeleteWorkerId(null)}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDelete}>
              OK
            </button>
          </div>
        </div>
      </div>
    )}
</div>
  );
};

export default WorkersDetail;
