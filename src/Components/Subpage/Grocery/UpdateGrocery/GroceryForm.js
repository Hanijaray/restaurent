import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const UpdateGrocery = ({ selectedGrocery, setSelectedGrocery }) => {
  const [categories, setCategories] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroceryId, setSelectedGroceryId] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);
  const [formData, setFormData] = useState({
    totalCount: "",
    unit: "Kg",
    price: "",
    vat: "",
    expiryDate: "",
    warningLimit: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/grocerycategories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios.get("http://localhost:5000/api/get-groceries").then((res) => {
        const filteredGroceries = res.data.filter(
          (grocery) => grocery.category === selectedCategory
        );
        setGroceries(filteredGroceries);
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedGrocery) {
      setSelectedCategory(selectedGrocery.category);
      setSelectedGroceryId(selectedGrocery._id);
      setFormData({
        totalCount: selectedGrocery.totalCount,
        unit: selectedGrocery.unit,
        price: selectedGrocery.price,
        vat: selectedGrocery.vat,
        expiryDate: selectedGrocery.expiryDate,
        warningLimit: selectedGrocery.warningLimit,
      });
      setExpiryDate(new Date(selectedGrocery.expiryDate));
    }
  }, [selectedGrocery]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a grocery is selected (for adding new groceries)
    if (!selectedGrocery && !selectedGroceryId) {
      alert("❌ Please select a grocery item!");
      return;
    }

    // Find the selected grocery from the dropdown
    const selectedGroceryFromDropdown = groceries.find((g) => g._id === selectedGroceryId);

    // Prepare the data for the backend
    const data = {
      name: selectedGrocery ? selectedGrocery.name : selectedGroceryFromDropdown.name, // Use name from selectedGrocery or dropdown
      category: selectedCategory,
      totalCount: formData.totalCount,
      unit: formData.unit,
      price: formData.price,
      vat: formData.vat,
      expiryDate: formData.expiryDate,
      warningLimit: formData.warningLimit,
    };

    try {
      if (selectedGrocery) {
        // Update existing grocery
        await axios.put(`http://localhost:5000/api/edit-groceriess/${selectedGrocery._id}`, data);
        alert("✅ Grocery updated successfully!");
      } else {
        // Add new grocery
        await axios.post("http://localhost:5000/api/add-groceriess", data);
        alert("✅ Grocery added successfully!");
      }

      // Reset the form and selected grocery
      setSelectedGrocery(null);
      setFormData({
        totalCount: "",
        unit: "Kg",
        price: "",
        vat: "",
        expiryDate: "",
        warningLimit: "",
      });
      setExpiryDate(null);
    } catch (error) {
      console.error("❌ Frontend Error:", error.response?.data);
      alert("❌ Error: " + error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">{selectedGrocery ? "Edit Grocery" : "Update Grocery"}</h2>
      <form onSubmit={handleSubmit}>
        <select className="w-full p-2 border rounded mb-2" onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>{category.name}</option>
          ))}
        </select>

        <select className="w-full p-2 border rounded mb-2" onChange={(e) => setSelectedGroceryId(e.target.value)} value={selectedGroceryId}>
          <option value="">Select Grocery</option>
          {groceries.map((grocery) => (
            <option key={grocery._id} value={grocery._id}>{grocery.name}</option>
          ))}
        </select>

        <div className="flex mb-2">
          <input type="text" name="totalCount" placeholder="Enter Total Count" className="w-3/4 p-2 border rounded" value={formData.totalCount} onChange={handleInputChange} />
          <select name="unit" className="w-1/4 p-2 border rounded" value={formData.unit} onChange={handleInputChange}>
            <option value="Kg">Kg</option>
            <option value="L">L</option>
            <option value="Gram">Gram</option>
          </select>
        </div>

        <input type="text" name="price" placeholder="Enter Price" className="w-full p-2 border rounded mb-2" value={formData.price} onChange={handleInputChange} />
        <input type="text" name="vat" placeholder="Enter VAT" className="w-full p-2 border rounded mb-2" value={formData.vat} onChange={handleInputChange} />
        <div className="flex items-center mb-2 border p-2 text-gray-500 rounded relative">
          <FaCalendarAlt className="mr-2 text-gray-600 h-6 w-6 " />
          <DatePicker
            selected={expiryDate}
            onChange={(date) => {
              setExpiryDate(date);
              setFormData({ ...formData, expiryDate: date });
            }}
            dateFormat="dd/MM/yyyy"
            className="w-full "
            placeholderText="Enter Date"
          />
        </div>
        <input type="text" name="warningLimit" placeholder="Warning Limitation" className="w-full p-2 border rounded mb-2" value={formData.warningLimit} onChange={handleInputChange} />

        <button type="submit" className="w-full mt-9  bg-black text-white p-8 text-2xl font-serif rounded-xl">{selectedGrocery ? "EDIT GROCERY" : "UPDATE GROCERY"}</button>
      </form>
    </div>
  );
};

export default UpdateGrocery;
