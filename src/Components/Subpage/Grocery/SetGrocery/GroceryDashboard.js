import React, { useState } from "react";
import AddGroceryCard from "./AddGroceryCard";
import SetProduct from "./SetProduct";

export default function GroceryDashboard() {
  const [selectedGrocery, setSelectedGrocery] = useState(null); // State for selected grocery

  return (
    <div className="flex justify-center mt-8 items-start gap-10 bg-gray-50 mx-10">
      {/* Left: SetProduct */}
      <div className=" h-[550px] ml-11 flex ">
        <SetProduct setSelectedGrocery={setSelectedGrocery} /> {/* Pass setter */}
      </div>

      {/* Right: AddGroceryCard */}
      <div className=" h-[600px] flex  mr-6">
        <AddGroceryCard
          selectedGrocery={selectedGrocery} // Pass selected grocery
          setSelectedGrocery={setSelectedGrocery} // Pass setter to reset after update
        />
      </div>
    </div>
  );
}