import React from 'react';
import Orders from './Orders';
import Board from './Board';// Import the Board component
import { FaBell } from "react-icons/fa";
import { MdMessage } from "react-icons/md";

const TodaysOverview = () => {
 

    return (
        <div className="space-y-1">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-2">
                <h2 className="p-6 text-xl font-semibold">Today's Overview</h2>
                <div className="flex space-x-4">
                    <button className="p-2 bg-white rounded-lg shadow-md w-12 h-12 flex items-center justify-center">
                        <MdMessage className="text-gray-700 text-xl" />
                    </button>
                    <button className="p-2 bg-white rounded-lg shadow-md w-12 h-12 flex items-center justify-center me-3">
                        <FaBell className="text-gray-700 text-xl" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex flex-row gap-4 w-full'>
                 {/* Use the new Board component here */}
                <Board  />
                {/* Orders Section */}
                <div className="bg-white shadow-md p-6 w-full rounded-2xl">
                    <Orders  />
                </div>
            </div>
        </div>
    );
};

export default TodaysOverview;



