import React from 'react';

const TotelCard = ({ selectedGroceries = [] }) => {
  // Calculate totals
  const totalCount = selectedGroceries.reduce((sum, g) => sum + g.totalCount, 0);
  const totalVAT = selectedGroceries.reduce((sum, g) => sum + (g.vat || 0), 0);
  const totalExpense = selectedGroceries.reduce((sum, g) => sum +  g.price, 0);

  return (

<div className="bg-white p-4  flex flex-col flex-grow ">
      {[
        { label: "Total Grocery Count", value: totalCount },
        { label: "Total Grocery Tax", value: totalVAT },
        { label: "Total Grocery Expense", value: `Rs. ${totalExpense}` }
      ].map((item, i) => (
        <div key={i} className="flex justify-between border-b last:border-0 py-1 border-red-700">
          <span>{item.label}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default TotelCard;
