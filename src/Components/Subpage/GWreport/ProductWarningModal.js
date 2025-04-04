import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook

const ProductWarningModal = ({ open, handleClose }) => {  
    const [warningGroceries, setWarningGroceries] = useState([]);
    const navigate = useNavigate(); // ✅ Initialize navigate function

    useEffect(() => {
        fetch("http://localhost:5000/api/get-groceriess")
            .then((res) => res.json())
            .then((data) => {
                // Group groceries by name and sum their totalCount
                const groceryMap = new Map();
                data.forEach((grocery) => {
                    const { name, totalCount, warningLimit, unit } = grocery;
                    if (groceryMap.has(name)) {
                        groceryMap.get(name).totalCount += Number(totalCount);
                    } else {
                        groceryMap.set(name, { name, totalCount: Number(totalCount), warningLimit: Number(warningLimit), unit });
                    }
                });

                // Filter groceries based on the summed totalCount and warningLimit
                const filtered = Array.from(groceryMap.values()).filter(
                    (grocery) => grocery.totalCount <= grocery.warningLimit
                );

                setWarningGroceries(filtered);
            })
            .catch(error => console.error("Error fetching groceries:", error));
    }, []);

    if (!open) return null; // Don't render if modal is closed

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        style={{ zIndex: 1000 }}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
                <div className="text-center font-bold text-xl p-4 border-b">
                    Product Warning
                </div>
                <div className="p-4">
                    <table className="w-full text-left border border-gray-200">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="px-4 py-2 font-bold">Product Name</th>
                                <th className="px-4 py-2 font-bold">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {warningGroceries.length > 0 ? (
                                warningGroceries.map((product, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">{product.name}</td>
                                        <td className="px-4 py-2">{product.totalCount} {product.unit}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-4 py-2 text-center text-gray-500">
                                        No warnings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between p-4 border-t">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md w-[48%]" 
                        onClick={() => {
                            navigate("/main", { state: { activeTab: "Update Grocery" } }); 
                            handleClose(); 
                        }}>
                        ADD PRODUCT
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-md w-[48%]" onClick={handleClose}>
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductWarningModal;

