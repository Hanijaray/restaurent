import React, { useState } from "react";
import Popup from './CategoryPopup';

const SelectCategory = () => {
  const categories = [
    "Starters",
    "Salad",
    "Veg Starters",
    "Non-Veg Starters",
    "Veg Main Course",
    "Main Course",
    "Special",
    "Ice cream",
    "Dessert",
    "Coffee",
    "Juice",
  ];

  const [selected, setSelected] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
    const [orders, setOrders] = useState([
      { order: 'Biriyani', tableNo: 'Table1', count: 3, result: 'Pending', action: 'Take Order', extraInfo: 'Medium Spicy', tableTimestamp: '2min ago', countTimestamp: 'New', chefTimestamp: '2min ago' },
      { order: 'Fried Rice', tableNo: 'Table2', count: 2, result: 'Pending', action: 'Take Order', extraInfo: 'Medium Spicy', tableTimestamp: '5min ago', countTimestamp: 'New', chefTimestamp: '5min ago' },
      { order: 'Noodle', tableNo: 'Table3', count: 2, result: 'Pending', action: 'Take Order', extraInfo: 'Medium Spicy', tableTimestamp: '10min ago', countTimestamp: 'Added', chefTimestamp: '10min ago' },
      { order: 'Sandwich', tableNo: 'Table4', count: 6, result: 'Pending', action: 'Take Order', extraInfo: 'Medium Spicy', tableTimestamp: '7min ago', countTimestamp: 'New', chefTimestamp: '7min ago' },
      { order: 'Burger', tableNo: 'Table5', count: 8, result: 'Pending', action: 'Take Order', extraInfo: 'Medium Spicy', tableTimestamp: '3min ago', countTimestamp: 'New', chefTimestamp: '3min ago' },
      { order: 'Grape juice', tableNo: 'Table6', count: 2, result: 'Pending', action: 'Take Order', extraInfo: 'Medium Spicy', tableTimestamp: '3min ago', countTimestamp: 'New', chefTimestamp: '3min ago' },
      { order: 'Black Forest', tableNo: 'Table7', count: 2, result: 'Pending', action: 'Take Order', extraInfo: 'Medium', tableTimestamp: '3min ago', countTimestamp: 'New', chefTimestamp: '3min ago' },
    ]);
  
    const handleTakeOrder = (index) => {
      const updatedOrders = [...orders];
      updatedOrders[index].result = 'Progress'; 
      updatedOrders[index].action = 'Chef A'; 
      updatedOrders[index].chefTimestamp = 'Now'; 
      setOrders(updatedOrders);
      setShowPopup(false);
    };

  return (
    <div className="flex mt-2 justify-between gap-6" >
      {/* left Section */}
    <div className="bg-white w-full p-2 overflow-x-auto rounded-2xl ">
      <h2 className="text-2xl font-bold text-center text-black mb-3 ">
        <span className="font-bold"> Select Your Order Category</span>
      </h2>
      <div className={`grid grid-cols-2 md:grid-cols-2 gap-2 ${categories.length % 2 !== 0 ? 'justify-center' : ''}`}>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`py-4 px-3 rounded-lg shadow-md font-semibold text-lg text-left transition-all 
              ${selected === category
                ? "bg-black text-white"
                : "bg-gradient-to-r from-[#b61f1f] to-[#b61f1f] via-[#d52a2a] text-white"
            }
            flex justify-between items-center pl-12`}
            onClick={() => setSelected(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>

    {/* Right Section */}
    <div className="bg-white w-full p-2 overflow-x-auto rounded-2xl  ">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mt-3 mb-3 ml-3">Salad</h1>
      <div className="flex space-x-4">
        <span className="text-xs ">Sort By</span>
        <span className="text-xs  text-red-500">Recently</span>
      </div>
    </div>

    <table className="min-w-full table-fixed border-collapse overflow-hidden">
      <thead className="bg-primary text-white rounded-t-3xl"> 
        <tr>
          <th className="px-4 py-2 whitespace-nowrap w-[100px] rounded-tl-xl rounded-bl-xl">Order</th>
          <th className="px-4 py-2 whitespace-nowrap w-[100px]">Table No</th>
          <th className="px-4 py-2 whitespace-nowrap w-[100px]">Count</th>
          <th className="px-4 py-2 whitespace-nowrap w-[100px]">Chef</th>
          <th className="px-4 py-2 whitespace-nowrap w-[100px] rounded-tr-xl rounded-br-xl">Result</th>
        </tr>
      </thead>
      <tbody >
        {orders.map((order, index) => (
          <tr key={index} className="text-center border-gray-500">
            <td className="px-3 py-2  whitespace-nowrap border-b-2 border-gray-100 text-start">
              <h3 className='font-semibold'>{order.order}</h3>
              <p className='text-xs text-gray-600'>{order.extraInfo}</p> 
            </td>
            <td className="px-2 py-2  whitespace-nowrap border-b-2 border-gray-100">
              <p className='font-semibold'>{order.tableNo}</p>
              <p className='text-xs  text-gray-600'>{order.tableTimestamp}</p> 
            </td>
            <td className="px-2 py-2 whitespace-nowrap border-b-2 border-gray-100">
              <p className='font-semibold'>{order.count}</p>
              <p className='text-xs  text-gray-600'>{order.countTimestamp}</p> 
            </td>
            <td className="px-2 py-2  whitespace-nowrap border-b-2 border-gray-100">
              {order.action === 'Take Order' ? (
                <button
                  onClick={() => {
                    setSelectedOrderIndex(index);
                    setShowPopup(true);
                  }}
                  className="bg-red-700 text-white w-[90px] p-1 rounded whitespace-nowrap"
                >
                  Take Order
                </button>
              ) : (
                <p className="text-black font-bold">{order.action}</p>
              )}
              {/* Display the chef timestamp below the chef's name */}
              {order.action === 'Chef A' && (
                <p className="text-xs text-gray-600">{order.chefTimestamp}</p>
              )}
            </td>
            <td className="px-3 py-2  whitespace-nowrap border-b-2 border-gray-100">
              {order.result === 'Progress' ? (
                <div className="w-6 h-6 rounded-full left-1">
                  <span className="text-green-500 text-sm/6">✅ progress</span>
                </div>

              ) : (
                <p className='font-semibold text-red-500'>{order.result}</p>
              )}
              {/* Timestamp under Result */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {showPopup && selectedOrderIndex !== null && (
      <Popup
        onClose={() => setShowPopup(false)}
        onTakeOrder={() => handleTakeOrder(selectedOrderIndex)}
      />
    )}
  </div>
  </div>
  );
};

export default SelectCategory;