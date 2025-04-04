import React, { useState, useEffect } from 'react';
import { FoodCard } from './FoodCard';
import { MdMessage } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';

export const FoodCategory = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [foodItems, setFoodItems] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchFoodItems();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchFoodItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/menus');
            setFoodItems(response.data);
        } catch (error) {
            console.error('Error fetching food items:', error);
        }
    };

    const filteredItems = selectedCategory === "" || selectedCategory === "All"
        ? foodItems
        : foodItems.filter(item => item.selectedCategory === selectedCategory);

    return (
        <div className="p-6">
            <div className='flex flex-grow justify-between items-center'>
                <div className="mb-4">
                    <h2 className='inline-block p-2 text-xl font-sans'>Food Category</h2>
                    <select
                        className="border border-gray-400 p-2 rounded-full w-56 cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>

                {/* Notification & Message Buttons */}
                <div className="flex space-x-4">
                    <button className="p-2 bg-white rounded-lg shadow-md w-12 h-12 flex items-center justify-center">
                        <MdMessage className="text-gray-700 text-xl" />
                    </button>
                    <button className="p-2 bg-white rounded-lg shadow-md w-12 h-12 flex items-center justify-center me-3">
                        <FaBell className="text-gray-700 text-xl" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {filteredItems.map((item, index) => (
                    <FoodCard key={index} id={item._id} image={item.image} title={item.menuName} state={item.state} />
                ))}
            </div>
        </div>
    );
};