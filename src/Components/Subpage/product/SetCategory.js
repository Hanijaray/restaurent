import React, { useState, useEffect } from "react";
import FoodCard from "./FoodCard";
import { IoMdAdd } from "react-icons/io";
import AddMenu from "./AddMenu";

export const FoodCategory = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filteredCategory, setFilteredCategory] = useState("");
  const [filteredType, setFilteredType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/menus");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories([{ name: "All Categories" }, ...data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredFoodItems = foodItems.filter((item) => {
    const isSearchMatch = item.menuName.toLowerCase().includes(searchQuery.toLowerCase());
    const isFilteredCategoryMatch = filteredCategory ? item.category === filteredCategory : true;
    const isFilteredTypeMatch = filteredType ? item.type === filteredType : true;
    const isCategoryMatch = selectedCategory === "All Categories" || !selectedCategory
      ? true
      : item.selectedCategory === selectedCategory;

    return isSearchMatch && isFilteredCategoryMatch && isFilteredTypeMatch && isCategoryMatch;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-start space-x-4 mb-6">
        <button
          className="flex items-center justify-center bg-gray-900 text-white p-2 w-[100px] rounded-lg cursor-pointer"
          onClick={() => setIsPopupOpen(true)}
        >
          <IoMdAdd className="w-7 h-7" />
          <span className="font-bold text-lg">ADD</span>
        </button>
        {isPopupOpen && (
          <div className="fixed inset-0 z-50">
            <AddMenu onClose={() => setIsPopupOpen(false)} />
          </div>
        )}

        <input
          type="text"
          placeholder="Search Categories, Item"
          className="p-2 border border-gray-300 rounded-md w-96 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="relative">
          <button
            className="bg-red-600 text-white px-4 py-2 w-[250px] text-lg rounded-md font-semibold flex items-center justify-center"
            onClick={() => {
              setIsDropdownOpen((prev) => !prev);
              setFilteredType("");
              setFilteredCategory("");
            }}
          >
            {selectedCategory} ▼
          </button>
          {isDropdownOpen && (
            <div className="absolute mt-2 w-[250px] bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <ul>
                {categories.map((category) => (
                  <li
                    key={category.name}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button className="bg-gray-900 text-white p-2 text-lg w-[150px] rounded-lg" onClick={() => { setFilteredCategory("Veg"); setFilteredType(""); }}>
          Veg
        </button>
        <button className="bg-gray-900 text-white p-2 text-lg w-[150px] rounded-lg" onClick={() => { setFilteredCategory("Non-Veg"); setFilteredType(""); }}>
          Non-Veg
        </button>
        <button className="bg-red-600 text-white p-2 text-lg w-[150px] rounded-lg" onClick={() => { setFilteredType("Chinese"); setFilteredCategory(""); }}>
          Chinese
        </button>
        <button className="bg-red-600 text-white p-2 text-lg w-[150px] rounded-lg" onClick={() => { setFilteredType("Indian"); setFilteredCategory(""); }}>
          Indian
        </button>
        <button className="bg-red-600 text-white p-2 text-lg w-[150px] rounded-lg" onClick={() => { setFilteredType("Saudi"); setFilteredCategory(""); }}>
          Saudi
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {filteredFoodItems.map((item) => (
          <FoodCard
            menuId={item._id}
            key={item._id}
            image={item.image}
            title={item.menuName}
            amount={item.amount}
            tax={item.tax}
          />
        ))}
      </div>
    </div>
  );
};








