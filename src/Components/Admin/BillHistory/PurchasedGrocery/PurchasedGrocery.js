import React, { useState } from "react";
import History from "./History";
import Card from "./Card";

export default function PurchaseGrocery() {
  const [selectedGroceries, setSelectedGroceries] = useState([]); // For expiry date filtering
  const [filteredGroceries, setFilteredGroceries] = useState([]); // For search results

  // Function to filter groceries by expiryDate (IoMdPlay icon functionality)
  const handleSelectGroceries = (filteredGroceries) => {
    setSelectedGroceries(filteredGroceries);
  };

  // Function to handle search results
  const handleSearchResults = (filteredGroceries) => {
    setFilteredGroceries(filteredGroceries);
  };

  return (
    <div className="flex justify-center items-start">
      {/* Left: History Table */}
      <div className="h-[550px] w-[1200px] flex mt-2">
        <History onSelectGrocery={handleSelectGroceries} onSearchResults={handleSearchResults} />
      </div>

      {/* Right: Invoice Card */}
      <div className="w-[350px]  h-[550px] flex mt-2">
        <Card selectedGroceries={selectedGroceries} filteredGroceries={filteredGroceries} />
      </div>
    </div>
  );
}





