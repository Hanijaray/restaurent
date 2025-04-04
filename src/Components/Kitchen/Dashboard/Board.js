import React, { useEffect, useState } from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const API_URL = "http://localhost:5000/api/workers";

const Button = ({ children, className = "", onClick }) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const Dashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chefs, setChefs] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders/count")
      .then((response) => response.json())
      .then((data) => setTotalOrders(data.totalOrders))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setWorkers(data);
        setChefs(data.filter(worker => worker.role === "Chef")); // Filter chefs
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, []);

  return (
    <div className="bg-white w-full shadow-md text-xl p-5 rounded-2xl">
      {/* Ongoing Orders */}
      <h2 className="text-lg font-bold mb-4">Ongoing Orders</h2>
      <div className="grid grid-cols-2 gap-3">
        {/* New Order */}
          <div className="bg-primary text-white p-3 rounded-2xl w-full h-[90px] shadow-md">
          <p className="text-sm font-semibold">New Order</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{totalOrders}</span> 
            <div className="flex flex-col items-center">
              <FaArrowTrendDown className="text-3xl"/>
              <span className="text-sm">5</span>
            </div>
          </div>
        </div>

        {/* Old Order */}
        <div className="bg-gray-200 text-black p-3 rounded-2xl w-full h-[90px] shadow-md">
          <p className="text-sm font-semibold">Old Order</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">759</span>
            <div className="flex flex-col items-center text-red-600">
              <FaArrowTrendUp className="text-3xl" />
              <span className="text-sm font-semibold text-black">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Chefs */}
      <div className="mt-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Available Chefs</h2>
          <Button onClick={() => setIsModalOpen(true)} className="text-gray-500 text-lg">See All</Button>
        </div>
        <div className="flex gap-6 overflow-x-auto">
          {chefs.length > 0 ? (
            chefs.slice(0, 5).map((chef, index) => (
              <div key={index} className="text-center">
                {chef.image ? (
                  <img
                    src={`http://localhost:5000/${chef.image}`}
                    alt={chef.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                    No Image
                  </div>
                )}
                <p className="text-sm mt-2 font-medium">{chef.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No chefs available</p>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"style={{ zIndex: 1000 }}>
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">All Chefs</h2>
              <button onClick={() => setIsModalOpen(false)} className="border px-3 py-1 rounded">
                X
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {chefs.map((chef, index) => (
                <div key={index} className="text-center">
                  {chef.image ? (
                    <img
                      src={`http://localhost:5000/${chef.image}`}
                      alt={chef.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                      No Image
                    </div>
                  )}
                  <p className="text-sm mt-2 font-medium">{chef.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comment & Message */}
      <div className="flex justify-between items-center mt-5 mb-4">
        <h2 className="text-lg font-bold">Comment & Message</h2>
        <Button className="text-gray-500 text-lg">See All</Button>
      </div>

      {/* Comment Section */}
      <div className="max-w-full mx-auto mt-4">
        <div className="bg-primary text-white rounded-xl p-4 flex items-center">
          <div className="flex-1 ml-4">
            {/* Display only the first chef as the commenter */}
            {chefs.length > 0 ? (
              <img
                src={`http://localhost:5000/${chefs[0].image}`}
                alt={chefs[0].name}
                className="ml-12 w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
            <p className="font-bold ml-8">{chefs.length > 0 ? chefs[0].name : "Anonymous"}</p>
            <p className="text-sm ml-8">1 Minute Ago</p>
          </div>
          <p className="flex-1 mr-9 text-sm">Lorem ipsum dolor sit amet, consectetur?</p>
          <button className="bg-white text-black px-5 py-2 rounded-lg font-semibold">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

