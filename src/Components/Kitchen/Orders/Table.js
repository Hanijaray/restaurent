import React, { useState,useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { GoXCircleFill } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";



import OrderPopup from "./OrderPopup";
import moment from 'moment';


const TableOrder = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([
        { name: "Biryani", count: 2, time: "30m", chef: "", result: "New", state: "In Progress", id: 1 },
        { name: "Fried Rice", count: 1, time: "5m", chef: "", result: "New", state: "In Progress", id: 2 },
        { name: "Sandwich", count: 1, time: "5m", chef: "", result: "Cancelled", state: "Canceled", id: 3 },
        { name: "Fried Rice", count: 1, time: "5m", chef: "", result: "Progress", state: "Ordered", id: 4 },
        { name: "Black Forest", count: 2, time: "5m", chef: "", result: "New", state: "In Progress", id: 5 }
    ]);

    const getResultTextColor = (result) => {
        switch (result) {
            case "Progress": return "text-orange-500 pb-3";
            case "Cancelled": return "text-red-500";
            case "New": return "text-green-500";
            default: return "";
        }
    };

    const getStateIcon = (state) => {
        switch (state) {
            case "In Progress": return <FaExclamationCircle className="text-orange-500 text-2xl" />;
            case "Canceled": return <GoXCircleFill className="text-red-500 text-2xl" />;
            case "Ordered": return <FaCheckCircle className="text-green-500 text-2xl" />;
            default: return null;
        }
    };

    const openPopup = (order) => {
        setSelectedOrder(order);
        setIsPopupOpen(true);
    };

    const handleTakeOrder = (orderId, chef) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, chef, result: "Progress", state: "Ordered",startTime: moment() } : order
            )
        );
        setIsPopupOpen(false);
    };
     const [elapsedTimes, setElapsedTimes] = useState({});
    
    
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTimes(prevTimes => {
                const newTimes = {};
                orders.forEach(order => {
                    if (order.startTime) {
                        newTimes[order.id] = moment(order.startTime).fromNow(); // Calculate elapsed time
                    }
                });
                return newTimes;
            });
        }, 60000); // Update every 60 seconds
    
        return () => clearInterval(interval);
    }, [orders]); // 

    const [allOrdersProgress, setAllOrdersProgress] = useState(false);

    useEffect(() => {
        // Check if all orders are "Progress"
        const allProgress = orders.every(order => order.result === "Progress");
        setAllOrdersProgress(allProgress);
    }, [orders]); // 

    const handleCompleteAll = () => {
        alert("All orders are in progress."); // Keep the alert
        setOrders(prevOrders =>
            prevOrders.map(order => ({ ...order, result: "Completed", state: "Completed", endTime: moment() }))
        );
    };




    return (
        <div className="min-h-screen w-full bg-full p-4 font-montserrat">
            <div className="border-b-6 border-[#d52a2a]"></div>

            <div className="flex mt-2 flex-grow justify-between">
                <div className="grid grid-cols-2 gap-2 mt-5">
                    {Array.from({ length: 14 }, (_, i) => (
                        <button
                            key={i}
                            className={`px-24 rounded-lg ${selectedTable === i + 1 ? "bg-black text-white" : "bg-[#d52a2a] text-white"}`}
                            onClick={() => setSelectedTable(i + 1)}
                        >
                            Table {i + 1}
                        </button>
                    ))}
                </div>

                <div className="w-full md:w-3/5 bg-white p-4 shadow rounded-lg ml-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl text-red-500 pr-8 font-semibold">Table {selectedTable || 1}</h2>
                        <p className="text-center text-sm font-semibold">
                            Invoice No: <span className="text-red-500 text-base">20021</span>
                        </p>
                        <p className="text-right text-sm text-gray-500">
                            Placed by <span className="text-red-500 text-base">Waiter Joe</span> at <b className="text-lg text-black">12:30 PM</b>
                        </p>
                    </div>

                    <div className="mt-4 space-y-5">
                        <div className="grid grid-cols-6 bg-[#d52a2a] text-white p-2 rounded-md font-semibold text-center">
                            <p>Order</p>
                            <p>Count</p>
                            <p className="whitespace-nowrap">Time Taken</p>
                            <p>Chef</p>
                            <p>Result</p>
                            <p>State</p>
                        </div>
                        {orders.map((order) => (
                            <div key={order.id} className="grid grid-cols-6 p-2 border-b-[0.5px] border-gray-300 text-sm text-center items-center">
                                <p className="truncate pb-3">{order.name}</p>
                                <p className="truncate pb-3">{order.count}</p>
                                <p className="pb-3">{order.time}</p>
                                <p className="pb-3">{order.chef ?(
                                <>
                                <span>{order.chef}</span> 
                                <br />
                                <span className="text-gray-500 text-xs">
                                    {elapsedTimes[order.id] || "Just now"}
                                </span> {/* Show dynamic elapsed time */}
                            </>
                        ) :( 
                                        <button
                                            onClick={() => openPopup(order)}
                                            className="bg-[#d52a2a] text-white text-sm py-1 px-3 rounded-md"
                                        >
                                            Take Order
                                        </button>
                                    )}
                                </p>
                                <p className={getResultTextColor(order.result)} >{order.result}</p>
                                <p className="flex justify-center pb-3">{getStateIcon(order.state)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 bg-[#d52a2a] text-white text-center py-0 rounded-lg flex justify-center items-center  ">
                {allOrdersProgress ? (
                    <button className="relative w-full flex justify-center items-center gap-2 bg-green-500 hover:bg-green-700 text-white transition duration-300 whitespace-nowrap py-2 px-4 rounded-lg" onClick={handleCompleteAll}
                    >
                        <IoMdCheckmarkCircleOutline className="text-white text-2xl " /> {/* Added Icon */}
                        <span>COMPLETED</span> {/* Text remains */}
                    </button>
                ) : (
                    <p className="flex justify-center items-center gap-2 h-10">
            <FaExclamationCircle className="text-white-400 text-2xl"/>ON PROGRESS</p>
                )}
                        
                    </div>
                </div>
            </div>

            <OrderPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onTakeOrder={handleTakeOrder}
                order={selectedOrder}
            />
        </div>
    );
};

export default TableOrder;