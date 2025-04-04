import React from "react";
import logo from "../../../../assets/cropsuper.png";
import TotelCard from "./TotalCard";

const Card = ({ selectedGroceries, filteredGroceries }) => {
    // Use filteredGroceries if available, otherwise use selectedGroceries
    const groceriesToDisplay = filteredGroceries.length > 0 ? filteredGroceries : selectedGroceries;
  return (
    <div className="max-w-md mx-auto bg-gray-100 ms-3  ">
      {/* Header */}
      <div className=" bg-white p-4 rounded-lg shadow-md border border-gray-300">
      <div className="text-center mb-4 w-[300px]">
        <img src={logo} alt="Logo" className="mx-auto w-12 h-12" />
        <h2 className="text-2xl font-bold font-serif">Chraz Management</h2>
        <p className="text-sm text-gray-600">Life Changes Ltd</p>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between text-sm mb-2 border-b pb-2">
        <span>Date:{selectedGroceries.length > 0 ? new Date(selectedGroceries[0].expiryDate).toDateString() : "-"}</span>
      </div>

      {/* Invoice Table */}
      <table className="w-full text-sm border-collapse border-t border-b">
        <thead className="bg-gray-100">
          <tr className="border-b w-full ">
            <th className="p-2 text-left w-2/5">Item</th>
            <th className="p-2 text-left w-1/5">Qty</th>
            <th className="p-2 text-left w-1/5">VAT</th>
            <th className="p-2 text-left w-1/5">Rate</th>
          
          </tr>
        </thead>
      </table>
      
      {/* Scrollable tbody */}
      <div className="max-h-28 overflow-y-auto">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {selectedGroceries.length > 0 ? (
              selectedGroceries.map((grocery, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2 text-left  w-2/5">{grocery.name}</td>
                  <td className="p-2 text-center w-1/5">{grocery.totalCount}</td>
                  <td className="p-2 text-center">{grocery.vat ? `${grocery.vat}%` : "N/A"}</td>
                  <td className="p-2 text-center">{grocery.price}</td>
               
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-2 text-gray-500">No groceries found for this date.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-between text-sm font-semibold my-2 border-t pt-2">
        <span>Tot Count: {selectedGroceries.reduce((sum, g) => sum + g.totalCount, 0)}</span>
        <span>VAT: {selectedGroceries.reduce((sum, g) => sum + (g.vat || 0), 0)}</span>
        <span>Rs. {selectedGroceries.reduce((sum, g) => sum + g.price, 0)}</span>
      </div>
      </div>
     {/* Summary Box */} 
     <div className="bg-white p-4 rounded-lg shadow-md  border-2 border-red-700 mt-3">
     <TotelCard selectedGroceries={groceriesToDisplay} />
     </div>
    </div>
  );
};

export default Card;














