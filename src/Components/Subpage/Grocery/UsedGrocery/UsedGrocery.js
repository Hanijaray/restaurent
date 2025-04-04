import React from "react";
import GroceryReport from "./GroceryReport";
import GroceryHistory from "./GroceryHistory";

const UsedGrocery = () => {
  return (
    <div className="flex gap-6 bg-gray-100 p-6 rounded-md shadow-md w-full">
      <GroceryReport />
      <GroceryHistory />
    </div>
  );
};

export default UsedGrocery;
