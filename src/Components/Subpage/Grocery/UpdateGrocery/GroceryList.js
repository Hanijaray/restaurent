import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import axios from "axios";

const GroceryList = ({ onEditGrocery }) => {
  const [categories, setCategories] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchGroceries();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/grocerycategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchGroceries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-groceriess");
      setGroceries(response.data);
    } catch (error) {
      console.error("Error fetching groceries:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/groceries/${id}`);
      setGroceries((prev) => prev.filter((grocery) => grocery._id !== id));
      console.log("Grocery item deleted successfully");
    } catch (error) {
      console.error("Error deleting grocery item:", error);
    }
  };

  const handleEdit = (grocery) => {
    onEditGrocery(grocery); // Pass the selected grocery to the parent component
  };

  const filteredGroceries = groceries.filter((grocery) => {
    const matchesSearch = grocery.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? grocery.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-[1050px] h-full mt-4 ml-4">
      <div className="bg-white shadow-lg border rounded-2xl h-full overflow-auto">
        <div className="flex justify-between items-center bg-white p-4 rounded-md shadow w-full">
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search Item"
              className="border p-2 rounded-lg w-[300px] font-serif"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-3 bg-gray-700 text-white rounded-lg flex items-center justify-center">
              <FaSearch />
            </button>
          </div>

          {/* Category Button with Dropdown */}
          <div className="relative w-[300px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-red-500 text-white w-full px-4 py-2 font-serif rounded-lg text-lg flex items-center justify-between border-2 border-black appearance-none cursor-pointer"
            >
              <option value="" className="bg-white text-black">
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.name} className="bg-white text-black">
                  {category.name}
                </option>
              ))}
            </select>
            {/* Dropdown Indicator */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-white">
              ▼
            </div>
          </div>
        </div>

        {/* Grocery Table */}
        <div className="relative w-full h-[500px] overflow-auto border rounded-lg">
          <table className="w-full border text-left text-lg rounded-lg">
            <thead className="bg-black text-white text-lg sticky top-0 z-10 font-serif rounded-t-lg">
              <tr>
                <th className="p-2 rounded-tl-xl rounded-bl-xl">Image</th>
                <th className="p-2">Added Date</th>
                <th className="p-2">Grocery</th>
                <th className="p-2">Total Count</th>
                <th className="p-2">Limitation</th>
                <th className="p-2">VAT</th>
                <th className="p-2">Price</th>
                <th className="p-2 rounded-tr-xl rounded-br-xl">State</th>
              </tr>
            </thead>

            <tbody>
              {filteredGroceries.length > 0 ? (
                filteredGroceries.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-2">
                      {item.image ? (
                        <div className="flex justify-center">
                          <img
                            src={`http://localhost:5000${item.image}`}
                            alt="Grocery"
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>

                    <td className="p-2">
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    <td className="p-2">
                      {item.name}
                    </td>
                    <td className="p-2">{item.totalCount}</td>
                    <td className="p-2">{item.warningLimit || "N/A"}</td>
                    <td className="p-2">{item.vat ? `${item.vat}%` : "N/A"}</td>
                    <td className="p-2">{item.price}</td>
                    <td className="p-2 flex justify-center gap-2">
                      <button className="p-2 bg-gray-600 text-white rounded" onClick={() => handleEdit(item)}>
                        <FaEdit />
                      </button>
                      <button className="p-2 bg-red-600 text-white rounded" onClick={() => handleDelete(item._id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">No grocery items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroceryList;