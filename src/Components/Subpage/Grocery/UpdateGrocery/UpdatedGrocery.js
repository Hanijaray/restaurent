import React, { useState } from "react";
import GroceryTable from "./GroceryList";
import GroceryForm from "./GroceryForm";

export default function UpdateGrocery() {
  const [selectedGrocery, setSelectedGrocery] = useState(null);

  const handleEditGrocery = (grocery) => {
    setSelectedGrocery(grocery); // Set selected grocery when edit is clicked
  };

  return (
    <div className="flex justify-center items-start mt-11 gap-8">
      {/* Left: Grocery List/Table */}
      <div className="h-[600px]">
        <GroceryTable onEditGrocery={handleEditGrocery} />
      </div>

      {/* Right: Grocery Form */}
      <div className="h-[600px]">
        <GroceryForm selectedGrocery={selectedGrocery} setSelectedGrocery={setSelectedGrocery} />
      </div>
    </div>
  );
}