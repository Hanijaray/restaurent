import { useEffect, useState } from "react"; 
import ProductWarningModal from "./ProductWarningModal";
import { useNavigate } from "react-router-dom"; 

const GroceryWarning = () => {
  const [warningGroceries, setWarningGroceries] = useState([]);
  const [showAll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddEditGrocery = (grocery) => {
    navigate("/main", { 
      state: { 
        selectedGrocery: grocery, 
        activeTab: "Update Grocery" 
      } 
    });
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/get-groceriess")
      .then((res) => res.json())
      .then((data) => {
        // Group groceries by name and sum their totalCount
        const groceryMap = new Map();
        data.forEach((grocery) => {
          const { name, totalCount, warningLimit, unit } = grocery;
          if (groceryMap.has(name)) {
            groceryMap.get(name).totalCount += Number(totalCount);
          } else {
            groceryMap.set(name, { name, totalCount: Number(totalCount), warningLimit: Number(warningLimit), unit });
          }
        });

        // Filter groceries based on the summed totalCount and warningLimit
        const filtered = Array.from(groceryMap.values()).filter(
          (grocery) => grocery.totalCount <= grocery.warningLimit
        );

        setWarningGroceries(filtered);
      })
      .catch((error) => console.error("Error fetching groceries:", error));
  }, []);

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
      {/* Header Section */}
      <div className="flex flex-col w-full md:w-[340px]">
        <div className="flex items-center gap-2 text-xl font-bold text-[#2f2f2f] px-6 py-4">
          <span className="text-orange-500 text-3xl">⚠</span>
          <span>Grocery Warning</span>
        </div>
        <button
          className="bg-[#d52a2a] text-white text-lg px-6 py-3 rounded-lg font-bold mt-2 w-full"
          onClick={() => setModalOpen(true)}
        >
          {showAll ? "Show Less" : "View All"}
        </button>
        <ProductWarningModal open={modalOpen} handleClose={() => setModalOpen(false)} />
      </div>

      {/* Grocery List Section */}
      <div 
        className={`pl-0 md:pl-6 w-full md:w-[330px] ${
          showAll ? "h-[120px] overflow-y-auto" : ""
        }`} 
        style={{ maxHeight: showAll ? "180px" : "auto" }} 
      >
        {(showAll ? warningGroceries : warningGroceries.slice(0, 3)).map((product, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center w-full pb-3 gap-4"
          >
            <span className="text-lg min-w-0 flex-1">{product.name}</span>
            <span className="text-lg min-w-0 flex-1 text-center">
              {product.totalCount} {product.unit}
            </span>
            <button className="bg-[#2f2f2f] text-white w-[80px] text-sm px-3 py-1 rounded-lg"
              onClick={() => handleAddEditGrocery(product)}
            >
              ADD
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryWarning;
