import React, { useState } from "react";
import waiter from '../../../assets/waiter.jpg';  // Ensure the correct image path

const OrderHistory = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const [orders] = useState([
    {
      invoiceNo: "21/01/24",
      date: "21/01/24",
      time: "12:30 pm",
      order: "Biriyani",
      extraInfo: "Medium Spice",
      waiterImg: waiter,
      tableNo: "Table 1",
      members: "5 Members",
      count: 3,
      countStatus: "New",
      chefImages: [waiter, waiter, waiter],
      result: "Completed",
    },
    {
      invoiceNo: "21/01/25",
      date: "21/01/25",
      time: "1:30 pm",
      order: "Fried Rice",
      extraInfo: "Medium Spice",
      waiterImg: waiter,
      tableNo: "Table 2",
      members: "2 Members",
      count: 2,
      countStatus: "New",
      chefImages: [waiter, waiter],
      result: "Completed",
    },
    {
      invoiceNo: "21/01/26",
      date: "21/01/26",
      time: "2:30 pm",
      order: "Noodle",
      extraInfo: "Medium Spice",
      waiterImg: waiter,
      tableNo: "Table 3",
      members: "3 Members",
      count: 2,
      countStatus: "Added",
      chefImages: [waiter, waiter, waiter],
      result: "Pending",
    },
    {
      invoiceNo: "21/02/01",
      date: "21/02/01",
      time: "3:30 pm",
      order: "Sandwich",
      extraInfo: "Medium Spice",
      waiterImg: waiter,
      tableNo: "Table 4",
      members: "4 Members",
      count: 6,
      countStatus: "New",
      chefImages: [waiter, waiter],
      result: "Completed",
    },
    {
      invoiceNo: "21/02/02",
      date: "21/02/02",
      time: "4:30 pm",
      order: "Burger",
      extraInfo: "Medium Spice",
      waiterImg: waiter,
      tableNo: "Table 5",
      members: "1 Member",
      count: 8,
      countStatus: "New",
      chefImages: [waiter, waiter, waiter],
      result: "Completed",
    },
    {
      invoiceNo: "21/02/05",
      date: "21/02/05",
      time: "5:30 pm",
      order: "Grape Juice",
      extraInfo: "Medium",
      waiterImg: waiter,
      tableNo: "Table 6",
      members: "2 Members",
      count: 2,
      countStatus: "New",
      chefImages: [waiter],
      result: "Completed",
    },
    {
      invoiceNo: "21/02/06",
      date: "21/02/06",
      time: "6:30 pm",
      order: "Black Forest",
      extraInfo: "Medium",
      waiterImg: waiter,
      tableNo: "Table 7",
      members: "3 Members",
      count: 2,
      countStatus: "New",
      chefImages: [waiter, waiter],
      result: "Completed",
    },
    {
      invoiceNo: "22/02/01",
      date: "22/02/01",
      time: "7:00 pm",
      order: "Pizza",
      extraInfo: "Extra Cheese",
      waiterImg: waiter,
      tableNo: "Table 8",
      members: "4 Members",
      count: 4,
      countStatus: "New",
      chefImages: [waiter, waiter],
      result: "Completed",
    },
    {
      invoiceNo: "22/02/02",
      date: "22/02/02",
      time: "8:00 pm",
      order: "Pasta",
      extraInfo: "Garlic Bread",
      waiterImg: waiter,
      tableNo: "Table 9",
      members: "2 Members",
      count: 5,
      countStatus: "Added",
      chefImages: [waiter, waiter],
      result: "Completed",
    },
  ]);

  // Filter orders based on the search query
  const filteredOrders = orders.filter(order => {
    return (
      order.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.count.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.result.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.members.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="rounded-lg border bg-white p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All History</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Invoice No, Date, Order, etc..."
            className="border rounded-full pl-4 pr-10 py-2 text-sm w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600">
            🔍
          </button>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto rounded-lg border">
        {/* Table Header */}
        <div className="bg-red-600 text-white text-left rounded-t-lg pl-5 pr-6">
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-left">
                <th className="p-3 w-1/8">Invoice No</th>
                <th className="p-3 w-1/8">Date</th>
                <th className="p-3 w-1/8">Order</th>
                <th className="p-3 w-1/8">Waiter</th>
                <th className="p-3 w-1/8">Table No</th>
                <th className="p-3 w-1/8">Count</th>
                <th className="p-3 w-1/8">Chef</th>
                <th className="p-3 w-1/8">Result</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto pl-7 pr-8 pb-6">
          <table className="w-full border-collapse">
            <tbody className="bg-white text-left">
              {filteredOrders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-100 text-sm"
                >
                  <td className="p-3 w-1/8">{order.invoiceNo}</td>
                  <td className="p-3 w-1/8">
                    <span className="font-semibold">{order.date}</span>
                    <br />
                    <span className="text-gray-500 text-xs">{order.time}</span>
                  </td>
                  <td className="p-3 w-1/8">
                    <span className="font-semibold">{order.order}</span>
                    <br />
                    <span className="text-gray-500 text-xs">{order.extraInfo}</span>
                  </td>
                  <td className="p-5 pr-2 w-1/8 text-center">
                    <img
                      src={order.waiterImg}
                      alt="Waiter"
                      className="w-6 h-6 rounded-full"
                    />
                  </td>
                  <td className="p-3 w-1/8">
                    <span className="font-semibold">{order.tableNo}</span>
                    <br />
                    <span className="text-gray-500 text-xs">{order.members}</span>
                  </td>
                  <td className="p-3 w-1/8">
                    {order.count}
                    <br />
                    <span className="text-gray-500 text-xs">{order.countStatus}</span>
                  </td>
                  <td className="p-2">
                    <div className="flex -space-x-2">
                      {order.chefImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Chef"
                          className="w-6 h-6 rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-green-600 font-semibold">
                    ✅ {order.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;