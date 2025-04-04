import { useState, useEffect } from "react";
import { RxDashboard } from "react-icons/rx";
import { MdAdd } from "react-icons/md";
import axios from "axios";

export default function GroceryForm({ selectedGrocery, setSelectedGrocery }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [groceryName, setGroceryName] = useState("");
  const [image, setImage] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  // Populate form when a grocery is selected for editing
  useEffect(() => {
    if (selectedGrocery) {
      setGroceryName(selectedGrocery.name);
      setSelectedCategory(selectedGrocery.category);
      setImage(null); // Image cannot be pre-filled
    }
  }, [selectedGrocery]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/grocerycategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle category addition
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/add-grocerycategory", { name: newCategory });
      setNewCategory(""); // Clear input
      fetchCategories(); // Refresh category list
      alert("✅ Your category was added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("❌ Error adding category. Please try again.");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle adding grocery
  const addGrocery = async () => {
    if (!groceryName || !selectedCategory || !image) {
      alert("❌ Please fill in all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", groceryName);
    formData.append("category", selectedCategory);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/add-grocery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGroceryName("");
      setSelectedCategory("");
      setImage(null);
      alert("✅ Grocery added successfully!");
    } catch (error) {
      console.error("Error adding grocery:", error);
      alert("❌ Error adding grocery. Please try again.");
    }
  };

  // Handle updating grocery
  const updateGrocery = async () => {
    if (!groceryName || !selectedCategory) {
      alert("❌ Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", groceryName);
    formData.append("category", selectedCategory);
    if (image) formData.append("image", image); // Append the new image if provided

    try {
      await axios.put(`http://localhost:5000/api/update-grocery/${selectedGrocery._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Grocery updated successfully!");
      setSelectedGrocery(null); // Reset after update
      setGroceryName("");
      setSelectedCategory("");
      setImage(null);
    } catch (error) {
      console.error("Error updating grocery:", error);
      alert("❌ Error updating grocery. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6  bg-gray-50 ">
      {/* Add New Grocery Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 ">
        <h2 className="text-lg font-bold text-center mb-4">
          {selectedGrocery ? "Update Grocery" : "Add New Grocery"}
        </h2>
        <input
          type="text"
          placeholder="Enter Grocery"
          className="w-full p-2 border rounded-md mb-2"
          value={groceryName}
          onChange={(e) => setGroceryName(e.target.value)}
        />
        <input type="file" className="w-full p-2 border rounded-md mb-2" onChange={handleFileChange} />
        <select
          className="w-full p-2 border rounded-md mb-4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          onClick={selectedGrocery ? updateGrocery : addGrocery}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-md text-lg font-bold"
        >
          <MdAdd className="text-3xl" /> {selectedGrocery ? "UPDATE GROCERY" : "ADD GROCERY"}
        </button>
      </div>

      {/* Add New Grocery Category Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
        <h2 className="text-lg font-bold text-center mb-4">Add New Grocery Category</h2>
        <div className="flex gap-2 mb-4 bg-red-600 p-2 rounded-md">
          <input
            type="text"
            placeholder="Enter New Category"
            className="w-full p-1 rounded-md bg-red-600 text-white placeholder-white"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={addCategory} className="text-white text-xl">
            <RxDashboard />
          </button>
        </div>
        <button
          onClick={addCategory}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-md text-lg font-bold"
        >
          <MdAdd className="text-3xl" /> ADD CATEGORY
        </button>
      </div>
    </div>
  );
}


































