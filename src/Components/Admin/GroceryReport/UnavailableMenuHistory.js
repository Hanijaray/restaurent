import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

export default function UnavailableMenuHistory() {
  const [menuData, setMenuData] = useState([]);  // Stores all menu items
  const [filteredMenuData, setFilteredMenuData] = useState([]); // Stores filtered items
  const [categories, setCategories] = useState([]); // Stores categories
  const [search, setSearch] = useState(""); // Search input state
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  // Fetch all menu items from MongoDB and filter out empty reason fields
  const fetchMenus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/menus");

      // Filter out items where reason is empty, null, or missing
      const filteredData = response.data.filter(
        (item) => item.reason && item.reason.trim() !== ""
      );

      setMenuData(filteredData);
      setFilteredMenuData(filteredData);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  // Fetch all categories from MongoDB
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Apply search & category filters
  const applyFilters = (searchText, category) => {
    const filtered = menuData.filter((item) => {
      const matchesSearch = item.menuName.toLowerCase().includes(searchText.toLowerCase());

      // Check category match (selectedCategory OR category field)
      const matchesCategory =
        category === "" ||
        item.selectedCategory.toLowerCase() === category.toLowerCase() ||
        item.category.toLowerCase() === category.toLowerCase();

      // Ensure 'reason' is NOT empty and contains 'UNAVAILABLE'
      const matchesReason = item.reason && item.reason.trim() !== "" && item.reason.toUpperCase().includes("UNAVAILABLE");

      return matchesSearch && matchesCategory && matchesReason;
    });

    setFilteredMenuData(filtered);
  };

  // Handle category selection
  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
    setTimeout(() => applyFilters(search, category), 100);
  };

  // Handle search filtering
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    applyFilters(e.target.value, selectedCategory);
  };

  return (
    <div className=" bg-white  rounded-lg ">
      <h2 className="text-2xl font-bold font-serif  mb-3">Unavailable Menu History</h2>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4  relative">
        <input
          type="text"
          placeholder="Search item"
          value={search}
          onChange={handleSearchChange}
          className="w-48 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ml-4"
        />
        <button className="p-3 bg-black text-white rounded-md"> <FaSearch /></button>

        {/* Category Filters Dropdown */}
        <div className="relative ">
          <button
            className="bg-red-600 text-white px-4 py-2 w-52 ml-14 text-lg rounded-md font-semibold flex items-center justify-center"
            onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown
          >
            {selectedCategory ? selectedCategory : "Select Category"} ▼
          </button>
          {isDropdownOpen && (
            <div className="absolute mt-2 w-60 bg-white border border-gray-300 rounded-md shadow-lg z-50 ">
              <ul>
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCategorySelection("")} // Show all categories
                >
                  All Categories
                </li>
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelection(category.name)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto h-[400px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
  <table className="w-full border-collapse border-gray-300 rounded-lg">
   

          <thead>
            <tr className="bg-black text-white rounded-lg sticky top-0 z-10">
              <th className="p-2 ">Date</th>
              <th className="p-2 ">Menu</th>
              <th className="p-2 ">Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenuData.length > 0 ? (
              filteredMenuData.map((item, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="p-2 border-b">
                    {/* ✅ Fetching date from unavailableDate */}
                    {item.unavailableDate
                      ? new Date(item.unavailableDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-2 border-b">
                    {item.menuName}
                    <br />
                    <span className="text-gray-500 text-sm">{item.category}</span>
                  </td>
                  <td className={`p-2 border-b ${item.reason?.includes("GROCERY") ? "text-red-500" : ""}`}>
                    {item.reason || "Unavailable"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  No menus found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}











  






  