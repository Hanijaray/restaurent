
import { useState } from "react";
import FoodBill from "./FoodBill/FoodBill";
import ParchasedGrocery from "./PurchasedGrocery/PurchasedGrocery";
import UsedGrocery from "./UsedGrocery/UsedGrocery";

const Pallete = () => {
  const [activeTab, setActiveTab] = useState("FOOD BILL");

  const renderComponent = () => {
    switch (activeTab) {
      case "FOOD BILL":
        return <FoodBill />;
      case "PURCHASED GROCERY":
        return   (
          <ParchasedGrocery />
      );
      case "USED GROCERY":
        return  (
         <UsedGrocery />
      );
      default:
        return <FoodBill />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f6f6f6] p-4">
      {/* Navigation Tabs */}
      <div className="flex w-full space-x-2">
        {["FOOD BILL", "PURCHASED GROCERY", "USED GROCERY"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-lg font-semibold rounded-t-lg ${
              activeTab === tab ? "bg-black text-white" : "bg-red-600 text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render Selected Component */}
      <div className="mt-4">{renderComponent()}</div>
    </div>
  );
};

export default Pallete;