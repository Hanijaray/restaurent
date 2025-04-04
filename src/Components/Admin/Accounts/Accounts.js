import React from "react";
import GroceryExpense from "./GroceryExpense";
import FoodIncome from "./FoodIncome";

const Accounts = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
     
      <div className="grid grid-cols-2 gap-4">
        {/* Food Income */}
        <FoodIncome />

        {/* Grocery Expense */}
        <GroceryExpense />
      </div>
    </div>
  );
};

export default Accounts;