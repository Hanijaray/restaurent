import React from "react";

const OrderPopup = ({ isOpen, onClose, onTakeOrder, order }) => {
  if (!isOpen || !order) return null;

  const handleTakeOrder = () => {
   
    onTakeOrder(order.id, "Chef A");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
        <h2 className="text-2xl font-bold">Take your Order</h2>
        <p className="text-gray-600 text-sm mt-1">
          Are you sure want to Take this Order
        </p>

        <div className="flex items-center bg-gray-100 p-3 rounded-lg mt-4">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Chef"
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-3 text-left">
            <p className="font-semibold">Chef A</p>
            <p className="text-sm text-gray-500">Main Chef</p>
          </div>
        </div>

        <button
          onClick={handleTakeOrder}
          className="w-full bg-gray-700 text-white py-2 mt-4 rounded-md font-semibold"
        >
          TAKE THIS ORDER
        </button>
        <button
          className="w-full bg-red-500 text-white py-2 mt-2 rounded-md font-semibold"
          onClick={onClose}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;