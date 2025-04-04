import React, { useState, useEffect } from 'react';

const AddMenu = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState("add-menu");
  const [newMenu, setNewMenu] = useState("");
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("Non-Veg");
  const [type, setType] = useState("Indian");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/menus");
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !category) {
      alert("Please select both categories");
      return;
    }

    const formData = {
      menuName: newMenu,
      amount,
      tax,
      selectedCategory,
      category,
      type,
      discount,
      image,
    };

    try {
      const response = await fetch("http://localhost:5000/api/add-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Menu added successfully!");
        setNewMenu("");
        setAmount("");
        setTax("");
        setSelectedCategory("");
        setCategory("Non-Veg");
        setDiscount("");
        setImage(null);
        onClose();
      } else {
        alert(data.error || "Failed to add menu");
      }
    } catch (error) {
      console.error("Error adding menu:", error);
      alert("Something went wrong");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingMenu) {
      alert("Please select a menu to edit.");
      return;
    }

    const updatedData = {
      menuName: newMenu,
      amount,
      tax,
      selectedCategory,
      category,
      type,
      discount,
      image,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/update-menu/${editingMenu._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Menu updated successfully!");
        fetchMenus();
        setEditingMenu(null);
        setNewMenu("");
        setAmount("");
        setTax("");
        setSelectedCategory("");
        setCategory("Non-Veg");
        setDiscount("");
        setImage(null);
      } else {
        alert(data.error || "Failed to update menu");
      }
    } catch (error) {
      console.error("Error updating menu:", error);
      alert("Something went wrong");
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/add-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Category added successfully!");
        setCategoryName("");
        fetchCategories();
      } else {
        alert(data.error || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-hidden">
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-900 text-xl">
          ✖
        </button>

        <div className="flex justify-between border-b mb-4 mt-5">
          <button onClick={() => setSelectedTab("add-menu")} className={`border-1 border-black px-4 py-4 bg-red-600 text-white text-xl font-serif font-bold ${selectedTab === "add-menu" ? "border-2 border-black" : ""}`}>Add Menu</button>
          <button onClick={() => setSelectedTab("edit-menu")} className={`border-1 border-black px-4 py-4 bg-red-600 text-white text-xl font-serif font-bold ${selectedTab === "edit-menu" ? "border-2 border-black" : ""}`}>Edit Menu</button>
          <button onClick={() => setSelectedTab("add-category")} className={`border-1 border-black px-4 py-4 bg-red-600 text-white text-xl font-serif font-bold ${selectedTab === "add-category" ? "border-2 border-black" : ""}`}>Add Category</button>
        </div>

        {selectedTab === "add-menu" && (
          <div>
            <h2 className="text-center text-lg font-bold mb-4">Add New Menu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Menu Name</label>
                <input 
                  type="text" 
                  placeholder="Enter menu name" 
                  value={newMenu} 
                  onChange={(e) => setNewMenu(e.target.value)} 
                  className="border p-2 border-gray-500 rounded w-full" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    className="border p-2 border-gray-500 rounded w-full" 
                    required 
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Tax (%)</label>
                  <input 
                    type="number" 
                    placeholder="Enter tax" 
                    value={tax} 
                    onChange={(e) => setTax(e.target.value)} 
                    className="border p-2 border-gray-500 rounded w-full" 
                    required 
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Discount (%)</label>
                  <input 
                    type="number" 
                    placeholder="Enter discount" 
                    value={discount} 
                    onChange={(e) => setDiscount(e.target.value)} 
                    className="border p-2 border-gray-500 rounded w-full" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Food Category</label>
                  <select 
                    className="border p-2 rounded border-gray-500 w-full" 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Food Type</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="border p-2 border-gray-500 rounded w-full"
                  >
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Veg">Veg</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Country</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    className="border p-2 border-gray-500 rounded w-full"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Saudi">Saudi</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Menu Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="border p-2 border-gray-500 rounded w-full" 
                />
              </div>

              <div className="flex justify-between pt-4">
                <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded font-semibold">ADD NEW MENU</button>
                <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded font-semibold">CANCEL</button>
              </div>
            </form>
          </div>
        )}

        {selectedTab === "edit-menu" && (
          <div>
            <h2 className="text-center text-lg font-bold mb-4">Edit Menu</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Menu to Edit</label>
              <select
                className="border p-2 rounded w-full border-gray-500"
                onChange={(e) => {
                  const selected = menuItems.find((item) => item._id === e.target.value);
                  if (selected) {
                    setEditingMenu(selected);
                    setNewMenu(selected.menuName);
                    setAmount(selected.amount);
                    setTax(selected.tax);
                    setSelectedCategory(selected.selectedCategory);
                    setCategory(selected.category);
                    setType(selected.type);
                    setDiscount(selected.discount || "");
                    setImage(selected.image);
                  }
                }}
              >
                <option value="">Select a menu...</option>
                {menuItems.map((menu) => (
                  <option key={menu._id} value={menu._id}>
                    {menu.menuName}
                  </option>
                ))}
              </select>
            </div>

            {editingMenu && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Menu Name</label>
                  <input 
                    type="text" 
                    value={newMenu} 
                    onChange={(e) => setNewMenu(e.target.value)} 
                    className="border p-2 border-gray-500 rounded w-full" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Amount (₹)</label>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      className="border p-2 border-gray-500 rounded w-full" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Tax (%)</label>
                    <input 
                      type="number" 
                      value={tax} 
                      onChange={(e) => setTax(e.target.value)} 
                      className="border p-2 border-gray-500 rounded w-full" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Discount (%)</label>
                    <input 
                      type="number" 
                      placeholder="Enter discount" 
                      value={discount} 
                      onChange={(e) => setDiscount(e.target.value)} 
                      className="border p-2 border-gray-500 rounded w-full" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Food Category</label>
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)} 
                      className="border p-2 border-gray-500 rounded w-full"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Food Type</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="border p-2 border-gray-500 rounded w-full"
                    >
                      <option value="Non-Veg">Non-Veg</option>
                      <option value="Veg">Veg</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Cuisine</label>
                    <select 
                      value={type} 
                      onChange={(e) => setType(e.target.value)} 
                      className="border p-2 border-gray-500 rounded w-full"
                    >
                      <option value="Indian">Indian</option>
                      <option value="Saudi">Saudi</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Menu Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="border p-2 border-gray-500 rounded w-full" 
                  />
                  {image && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Current image will be replaced</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded font-semibold">UPDATE MENU</button>
                  <button type="button" onClick={() => setEditingMenu(null)} className="bg-gray-500 text-white py-2 px-4 rounded font-semibold">CANCEL</button>
                </div>
              </form>
            )}
          </div>
        )}

        {selectedTab === "add-category" && (
          <div>
            <h2 className="text-center text-lg font-bold mb-4">Add New Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Category Name</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="border p-2 border-gray-500 rounded w-full"
                  placeholder="Enter category name (e.g., Starters, Main Course)"
                />
              </div>
              <button
                onClick={handleAddCategory}
                className="w-full bg-red-600 text-white py-2 px-4 rounded font-semibold"
              >
                ADD CATEGORY
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMenu;