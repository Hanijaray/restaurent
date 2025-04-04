import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GroceryReport = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [groceries, setGroceries] = useState([{ category: "", grocery: "", count: "", unit: "" }]);
    const [categories, setCategories] = useState([]);
    const [allGroceries, setAllGroceries] = useState([]);
    

    // Fetch categories and groceries from backend
    useEffect(() => {
        const fetchGroceryData = async () => {
            try {
                const categoryResponse = await fetch("http://localhost:5000/api/grocerycategories");
                if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
                const categoryData = await categoryResponse.json();

                const groceryResponse = await fetch("http://localhost:5000/api/groceries");
                if (!groceryResponse.ok) throw new Error("Failed to fetch groceries");
                const groceryData = await groceryResponse.json();

                console.log("✅ Fetched Categories:", categoryData);
                console.log("✅ Fetched Groceries:", groceryData);

                const formattedCategories = categoryData.map(cat => ({
                    id: cat._id,
                    name: cat.name,
                }));

                const formattedGroceries = groceryData.map(g => ({
                    id: g._id,
                    name: g.name,
                    category: g.category || "", // Use category string directly
                    unit: g.unit,
                    image: g.image ? `data:image/jpeg;base64,${g.image}` : null,
                }));

                setCategories(formattedCategories);
                setAllGroceries(formattedGroceries);

                console.log("✅ Processed Groceries:", formattedGroceries);
            } catch (error) {
                console.error("❌ Error fetching grocery data:", error);
                setCategories([]);
                setAllGroceries([]);
            }
        };

        fetchGroceryData();
    }, []);

    // Handle changes in grocery fields
    const handleGroceryChange = (index, field, value) => {
        const updatedGroceries = [...groceries];

        if (field === "category") {
            updatedGroceries[index] = { category: value, grocery: "", count: "", unit: "" };
        } else if (field === "grocery") {
            updatedGroceries[index].grocery = value;

            // Find selected grocery and auto-set unit
            const selectedGrocery = allGroceries.find((g) => g.id === value);
            if (selectedGrocery) {
                updatedGroceries[index].unit = selectedGrocery.unit; // Auto-fill unit
            }
        } else {
            updatedGroceries[index][field] = value;
        }

        setGroceries(updatedGroceries);
    };


    // Add new grocery row
    const addGrocery = () => {
        setGroceries([...groceries, { category: "", grocery: "", count: "", unit: "" }]);
    };

    // Submit data to backend
    const submitGroceryData = async () => {
        if (!fromDate || !toDate || groceries.length === 0) {
            alert("Please fill all fields.");
            return;
        }
    
        const validGroceries = groceries.filter(g => g.category && g.grocery && g.count && g.unit);
        if (validGroceries.length === 0) {
            alert("Please enter at least one valid grocery item.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/used-grocery/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fromDate, toDate, groceries: validGroceries }),
            });
    
            if (response.ok) {
                // Reduce totalCount in the database
                for (const grocery of validGroceries) {
                    await fetch(`http://localhost:5000/api/groceries/update-total/${grocery.grocery}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ usedCount: grocery.count }),
                    });
                }
    
                alert("Used grocery data saved successfully!");
                setFromDate("");
                setToDate("");
                setGroceries([{ category: "", grocery: "", count: "", unit: "" }]);
            } else {
                alert("Error saving data.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error.");
        }
    };
    

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-center text-xl font-bold mb-4">Enter Today's Grocery Report</h2>

            {/* Date Inputs */}
            
                  <div className="flex justify-between items-center mb-4">
               {/* From Date Input */}
               <div className="flex items-center border p-2 text-gray-500 rounded relative">
                    <FaCalendarAlt className="mr-2 text-gray-500 h-6 w-6" />
                    <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="w-full placeholder-gray-500"
                        placeholderText="From Date"
                    />
                </div>
                
                {/* To Date Input */}
                <div className="flex items-center border p-2 text-gray-500 rounded relative">
                    <FaCalendarAlt className="mr-2 text-gray-500 h-6 w-6" />
                    <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="w-full placeholder-gray-500"
                        placeholderText="To Date"
                    />
                </div>
            </div>

            {/* Grocery List */}
            <div className="border-2 border-gray-300 bg-white shadow-md rounded-md p-4 ">
      <div className="overflow-y-auto h-60">
        {groceries.map((grocery, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                        <select className="border p-2 rounded-md bg-white" value={grocery.category}
                            onChange={(e) => handleGroceryChange(index, "category", e.target.value)}>
                            <option value="">Category</option>
                            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>


                        {/* Grocery Dropdown */}
                        <select
    className="border p-2 rounded-md bg-white text-black"
    value={grocery.grocery}
    onChange={(e) => handleGroceryChange(index, "grocery", e.target.value)}
    disabled={!grocery.category || allGroceries.length === 0} // Disable if no category selected
>
    <option value="">Grocery</option>

    {allGroceries.length > 0 ? (
        Array.from(
            new Map(
                allGroceries
                    .filter((g) => {
                        const selectedCategoryName = categories.find(c => c.id === grocery.category)?.name; // Convert category ID to name
                        return g.category === selectedCategoryName;
                    })
                    .map((g) => [g.name, g]) // Use Map to remove duplicates
            ).values()
        ).map((g) => (
            <option key={g.id} value={g.id}>
                {g.name}
            </option>
        ))
    ) : (
        <option disabled>No groceries available</option>
    )}
</select>


                        <input type="number" placeholder="Count" className="border p-2 rounded-md bg-white"
                            value={grocery.count} onChange={(e) => handleGroceryChange(index, "count", e.target.value)} />

                        <select
                            className="border p-2 rounded-md bg-white"
                            value={grocery.unit}
                            onChange={(e) => handleGroceryChange(index, "unit", e.target.value)}
                            disabled={!grocery.grocery} // Disable if no grocery selected
                        >
                            <option value="">Unit</option>
                            {grocery.grocery && (
                                <option value={allGroceries.find((g) => g.id === grocery.grocery)?.unit || "N/A"}>
                                    {allGroceries.find((g) => g.id === grocery.grocery)?.unit || "N/A"}
                                </option>
                            )}
                        </select>

                    </div>
                ))}
                </div>

                {/* Buttons */}
                <button onClick={addGrocery} className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 mt-2 w-60">+ Add More Grocery</button>
            </div>

            <div className="flex justify-between mt-4">
                <button onClick={submitGroceryData} className="bg-red-600 text-white px-6 py-2 rounded-md font-bold w-80 text-2xl m-5 ">ENTER GROCERY</button>
                <button onClick={() => setGroceries([{ category: "", grocery: "", count: "", unit: "" }])}
                    className="bg-black text-white px-6 py-2 rounded-md font-bold w-80 text-2xl m-5">CLEAR ALL</button>
            </div>
        </div>
    );
};

export default GroceryReport;
