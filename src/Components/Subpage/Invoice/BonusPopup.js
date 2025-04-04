import { useState,useEffect } from "react";
import AddCustomerPoint from "./AddCustomerPoint";

const BonusPopup =({customerName  }) => {
    console.log("Prop received in BonusPopup:", customerName);
    const [isOpen, setIsOpen] = useState(false);
    const [showAddPointsPopup, setShowAddPointsPopup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    


    //  Set selected customer name when customerName changes
    useEffect(() => {
        if (customerName) {
            console.log("Received customer name:", customerName);
            setSelectedCustomer(customerName);
        }
    }, [customerName]);




    return (
        <div className="flex justify-center items-center min-h-screen "style={{ zIndex: 1000 }}>
            <button 
                className="bg-gray-600 text-white px-4 py-2  rounded-md font-bold relative bottom-[350px] right-4 h-10 mb-9"
                onClick={() =>{ 
                    console.log("Add button clicked. Customer name passed:", selectedCustomer);
                    setIsOpen(true);setShowAddPointsPopup(true)}}
            >
                Add
            </button>


            {/*  Show AddCustomerPoint popup if showAddPointsPopup is true */}
            {showAddPointsPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <AddCustomerPoint setShowAddPointsPopup={setShowAddPointsPopup} 
                        setShowPopup={setShowPopup}
                        customer={selectedCustomer} // Pass selected customer
                        />
                    </div>
                </div>
            )}
        </div>
    );
};


export default  BonusPopup ;





