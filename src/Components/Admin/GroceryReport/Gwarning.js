import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import warning from "../../../assets/warning.jpg";

const GroceryWarning = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [groceries, setGroceries] = useState([]);

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:5000/api/grocerycategories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch groceries
    fetch("http://localhost:5000/api/groceries")
      .then((res) => res.json())
      .then((data) => {
        // Group groceries by name and sum their totalCount
        const groceryMap = new Map();
        data.forEach((item) => {
          const { name, totalCount, warningLimit, unit, category } = item;
          if (groceryMap.has(name)) {
            groceryMap.get(name).totalCount += Number(totalCount);
          } else {
            groceryMap.set(name, { name, totalCount: Number(totalCount), warningLimit: Number(warningLimit), unit, category });
          }
        });

        // Filter groceries based on summed totalCount and warningLimit
        const warningItems = Array.from(groceryMap.values()).filter(
          (item) => item.totalCount <= item.warningLimit
        );

        setGroceries(warningItems);
      })
      .catch((error) => console.error("Error fetching groceries:", error));
  }, []);

  return (
    <div className="text-center bg-white rounded-lg  p-5">
      <div className="flex flex-col items-center">
        <div className="flex items-center w-full justify-between">
          <img src={warning} alt="Warning" className="w-20 h-20" />
          <div className="text-right">
            <h2 className="font-bold text-2xl font-serif">Grocery</h2>
            <h2 className="font-bold text-2xl font-serif">Warning</h2>
          </div>
        </div>

        <p className="text-sm text-black font-serif mt-2">
          Select a category to view all its groceries
        </p>

        {/* Dropdown */}
        <div className="relative w-full mt-3">
          <select
            className="w-56 p-2 border rounded-xl bg-red-600 text-white cursor-pointer appearance-none"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute top-3 right-6 text-white pointer-events-none" />
        </div>
      </div>

      {/* Scrollable Grocery List */}
      <div className="mt-3 text-left max-h-96 overflow-y-auto p-2">
        {groceries.length === 0 ? (
          <p className="text-center text-gray-500">No grocery warnings</p>
        ) : (
          groceries
            .filter((item) => selectedCategory === "" || item.category === selectedCategory)
            .map((item) => (
              <div key={item.name} className="flex justify-between border-b p-2 text-gray-700">
                <span>{item.name}</span>
                <span className="font-semibold">{item.totalCount} {item.unit}</span>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default GroceryWarning;
