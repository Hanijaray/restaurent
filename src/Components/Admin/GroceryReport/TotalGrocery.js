import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";


export default function GroceryReport({ reportData }) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [groceries, setGroceries] = useState([]);
    const [categories, setCategories] = useState([]); // ✅ Store fetched categories
    const [groceryLoading, setGroceryLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ✅ Define state


    const handleSearch = (e) => {
        setSearch(e.target.value);
    };





    const fetchGroceries = async () => {
        try {
            setGroceryLoading(true); // ✅ Make sure this line is present
            const response = await axios.get("http://localhost:5000/api/groceries");
            setGroceries(response.data);

        } catch (error) {
            console.error("Error fetching groceries:", error);
        } finally {
            setGroceryLoading(false);
        }
    };


    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/grocerycategories"); // ✅ Fetch categories
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };


    const fetchGroceryData = async () => {
        try {
            const categoryResponse = await fetch("http://localhost:5000/api/grocerycategories");
            if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
            const categoryData = await categoryResponse.json();
            setCategories(categoryData); // ✅ Store categories
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {


        fetchGroceryData();
        fetchGroceries();
        fetchCategories();
    }, []);

    // 🔍 Search and Filter Function
    const filteredGroceries = groceries.filter((grocery) => {
        const searchLower = search.toLowerCase();

        return (
            grocery.name.toLowerCase().includes(searchLower) || // Grocery Name
            grocery.category?.toLowerCase().includes(searchLower) || // Grocery Category
            grocery.unit.toLowerCase().includes(searchLower) || // Unit
            grocery.totalCount.toString().includes(searchLower) || // Count
            (grocery.expiryDate &&
                new Date(grocery.expiryDate).toLocaleDateString().includes(search)) // Date
        ) && (selectedCategory === "" || grocery.category === selectedCategory);
    });


    {/* const filteredGroceries = groceries.filter((grocery) =>{
    return (
    grocery.name.toLowerCase().includes(search.toLowerCase())
  (selectedCategory === "" || grocery.category === selectedCategory) // ✅ Filter by category
  );
});*/}




    return (
        <div className=" bg-white rounded-lg ml-4 mr-4 ">
            <h2 className="text-2xl font-bold font-serif  mb-3 ml-2">Total Grocery And Count</h2>
            <div className="flex justify-between mb-4">

                <input
                    type="text"
                    placeholder="Search Item"
                    className="w-48 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ml-4"
                    onChange={handleSearch}
                    value={search}
                />
                <button
                    className="p-3 bg-black text-white rounded-md w-10"
                    onClick={() => handleSearch({ target: { value: search } })}
                >
                    <span className="[&>svg]:h-5 [&>svg]:w-6 ">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </span>
                </button>

                <div className="relative ">
                <select
                    className="bg-red-600 text-white px-4 py-2 w-52 ml-14 text-lg rounded-md appearance-none font-semibold flex items-center justify-center"
                    value={selectedCategory}

                    onChange={(e) => { setSelectedCategory(e.target.value) }}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                  
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-white">
              ▼
            </div>
            </div>

            </div>
            <div className="overflow-x-auto h-[400px]">
                <table className="w-full border-collapse border-gray-300 overflow-auto  rounded-lg">
                    <thead>
                        <tr className="bg-black text-white rounded-lg sticky top-0 z-10">
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Grocery</th>
                            <th className="p-2 border">Count</th>
                            <th className="p-2 border">Unit</th>
                        </tr>
                    </thead>


                    <tbody>

                        {groceryLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center p-4">Loading groceries...</td>
                            </tr>
                        ) : filteredGroceries.length > 0 ? (
                            filteredGroceries.map((grocery) => {

                                const taxAmount = (grocery.price * grocery.vat) / 100;
                                const total = grocery.price + taxAmount;

                                return (
                                    <tr key={grocery._id} className="border-b border-gray-300">
                                        <td className="p-4">
                                            {new Date(grocery.expiryDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <span className="font-bold">{grocery.name}</span> {/* Grocery Name */}
                                                <br />
                                                <span className="text-sm text-gray-800">{grocery.category || "Uncategorized"}</span> {/* Category Name */}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            {grocery.totalCount}</td>
                                        <td className="p-4"> {grocery.unit}
                                        </td>

                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-4">
                                    No groceries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

