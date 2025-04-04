import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function GroceryTable({ setSelectedGrocery }) {
  const [groceries, setGroceries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-groceries");
      setGroceries(response.data);
    } catch (error) {
      console.error("Error fetching groceries:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this grocery item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/delete-grocery/${id}`);
        fetchGroceries(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting grocery:", error);
      }
    }
  };

  const filteredGroceries = groceries.filter(
    (grocery) =>
      grocery.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || grocery.category === selectedCategory)
  );

  return (
    <div className="p-6 w-full bg-white shadow-xl rounded-xl">
      {/* Search and Category Filter */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 w-1/2">
          <input
            type="text"
            placeholder="Search grocery..."
            className="border p-2 pl-10 rounded-md w-[350px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-3 bg-gray-700 text-white rounded-lg flex items-center justify-center">
            <FaSearch />
          </button>
        </div>

                {/* Category Button with Dropdown */}
                <div className="relative w-[300px]">
        <select
          className="p-2 border rounded-md bg-red-600 text-white w-[300px] appearance-none "
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {[...new Set(groceries.map((g) => g.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-white">
              ▼
            </div>
            </div>

      </div>

      {/* Grocery Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed"> {/* Added table-fixed class */}
          <thead>
            <tr className="bg-black text-white">
              <th className="p-3 text-left w-1/4 rounded-tl-xl rounded-bl-xl">Image</th> {/* Added width classes */}
              <th className="p-3 text-left w-1/4">Grocery</th>
              <th className="p-3 text-left w-1/4">Category</th>
              <th className="p-3 text-center w-1/4 rounded-tr-xl rounded-br-xl">State</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-[400px] overflow-y-auto"> {/* Set max height and enable vertical scrolling */}
          <table className="w-full border-collapse table-fixed"> {/* Added table-fixed class */}
            <tbody>
              {filteredGroceries.map((grocery) => (
                <tr key={grocery._id} className="border-b">
                  <td className="p-3 w-1/4"> {/* Added width classes */}
                    <img
                      src={`http://localhost:5000${grocery.image}`} // Image from backend
                      alt={grocery.name}
                      className="w-10 h-10 rounded-md"
                    />
                  </td>
                  <td className="p-3 text-left w-1/4">{grocery.name}</td>
                  <td className="p-3 text-left w-1/4">{grocery.category}</td>
                  <td className="p-3 flex gap-3 w-full justify-center">
                    <button
                      className="bg-gray-500 text-white p-2 rounded-md"
                      onClick={() => setSelectedGrocery(grocery)} // Pass grocery to parent
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-600 text-white p-2 rounded-md"
                      onClick={() => handleDelete(grocery._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}










