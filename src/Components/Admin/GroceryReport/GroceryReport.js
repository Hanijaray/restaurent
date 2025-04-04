import React from "react";
import GroceryWarning from "./Gwarning";
import UnavailableMenu from "./UnavailableMenuHistory";
import TotalGrocery from "./TotalGrocery";


const GroceryReport = () => {
 
  return (
    <div className="p-4 bg-gray-100 h-screen">

      {/* Main Layout Container */}
      <div className="flex gap-4 mt-4 h-[600px]">
        {/* Unavailable Menu History */}
        <div className="w-2/5 bg-white shadow-md rounded-lg border border-black p-4 h-[550px] ">
        <UnavailableMenu />
        </div>

        {/* Total Grocery and Count */}
        <div className="w-2/5 bg-white shadow-md rounded-lg border border-red-600 p-4 h-[550px]">
          <TotalGrocery />
        </div>

        {/* Grocery Warning */}
        <div className="w-1/5 border-red-600 bg-white shadow-md rounded-lg border  p-4 h-[550px]">
          <GroceryWarning />
        </div>
      </div>
    </div>
  );
};

export default GroceryReport;
