import React, { useState, useEffect , useRef} from "react";
import { FaSort } from "react-icons/fa";
import { Printer, Space } from "lucide-react";
import logo from "../../../../assets/cropsuper.png";
import { IoMdPlay } from "react-icons/io";
import axios from "axios";

export default function InvoiceTable() { 
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // Stores selected month
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState({ items: [] });
  const [sortAscending, setSortAscending] = useState(true);
  const [bills, setBills] = useState([]);  // ✅ Correctly define useState
  const invoiceRef = useRef(null); // ✅ Define invoiceRef
  const [selectedBill, setSelectedBill] = useState(null); // ✅ Initialize state
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Define searchTerm


  
  
  
 
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bills"); // Adjust URL as needed
        const data = await response.json();
        setBills(data); // Assuming 'setBills' updates the state
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };
  
    fetchBills();
  }, []);

  useEffect(() => {
    calculateSummary(filteredBills); 
  }, [filteredBills]);
  
  // Fetch invoices from backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bills");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        
        // Convert createdAt to a readable date format
        const formattedData = data.map(invoice => ({
          ...invoice,
          date: new Date(invoice.createdAt).toISOString().split("T")[0], // Store YYYY-MM-DD format
          month: new Date(invoice.createdAt).toLocaleString("default", { month: "long" }), // Extract month
          itemCount: invoice.items.reduce((acc, item) => acc + item.qty, 0), 
        }));

        setInvoices(formattedData);
        setFilteredInvoices(formattedData);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

//search function
const handleSearch = (e) => {
  const value = e.target.value.toLowerCase();
  setSearch(value);

  if (value === "") {
      setFilteredBills(bills); // Reset to all bills when search is empty
  } else {
      const filtered = bills.filter((bill) =>{
        const isRegular = bill.customer ? "regular" : "new customer"; // ✅ Convert to lowercase
      return(
        String( bill.invoiceNo).toLowerCase().includes(value) ||
          new Date(bill.createdAt).toLocaleDateString().includes(value) ||
          (bill.customer?.name.toLowerCase().includes(value)) ||
          (bill.customer?.phone.includes(value))||
          isRegular.includes(value) // ✅ Match "regular" or "new customer"
      );
      
      })
      
      setFilteredBills(filtered);
  }
};
useEffect(() => {
  calculateSummary(filteredBills); 
}, [filteredBills]);

// useEffect to update when `bills` change
useEffect(() => {
  setFilteredBills(bills);
}, [bills]);


  // Function to filter by month and search term
  useEffect(() => {
    let filtered = bills;

   // If "All Month" is selected, show all bills
  if (selectedMonth && selectedMonth !== "All Month") {
    filtered = filtered.filter((bill) => {
      const billDate = new Date(bill.createdAt);
      const billMonth = billDate.toLocaleString("default", { month: "long" });
      return billMonth === selectedMonth;
    });
  }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((bill) =>
        bill.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bill.customer?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBills(filtered);
  }, [selectedMonth, searchTerm, bills]);


  // Function to filter by selected date
  const filterByDate = (event) => {
    const selectedDate = event.target.value; // ✅ Get selected date from input
    if (selectedDate) {
      setFilteredBills(
        invoices.filter(invoice => 
          new Date(invoice.createdAt).toLocaleDateString("en-CA") === selectedDate
        )
      );
    } else {
      setFilteredBills(invoices);
    }
  };

  const [summary, setSummary] = useState({
    totalNewCustomers: 0,
    totalRegularCustomers: 0,
    totalFoodCount: 0,
    totalFoodTax: 0,
    totalFoodVAT: 0,
    totalFoodBillIncome: 0,
  });

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bills");
        const data = await response.json();
        setBills(data);
        calculateSummary(data); // Calculate summary after fetching bills
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };

    fetchBills();
  }, []);
 
  const calculateSummary = (billsData) => {
    let totalNewCustomers = 0;
    let totalRegularCustomers = 0;
    let totalFoodCount = 0;
    let totalFoodTax = 0;
    let totalFoodVAT = 0;
    let totalFoodBillIncome = 0;

    billsData.forEach((bill) => {
      if (bill.customer && bill.customer.phone) {
        totalRegularCustomers++;
      } else {
        totalNewCustomers++;
      }

      if (bill.items) {
        bill.items.forEach((item) => {
          totalFoodCount += item.quantity || 0;
          totalFoodTax += item.tax || 0;
          totalFoodVAT += item.vat || 0;
        });
      }

      totalFoodBillIncome += bill.totalAmount || 0;
    });

    setSummary({
      totalNewCustomers,
      totalRegularCustomers,
      totalFoodCount,
      totalFoodTax,
      totalFoodVAT,
      totalFoodBillIncome,
    });
  };
  
    
    
    
    
    const handlePrint = () => {
      if (!invoiceRef.current) return;
  
      const printContent = invoiceRef.current.cloneNode(true);

    // Remove any interactive elements (buttons, inputs)
    printContent.querySelectorAll("button, input").forEach(el => el.remove());

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
      <head>
        <title>Receipt</title>
        <style>
      body { font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; }
      .invoice-card { width: 400px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
      .grid { display: grid; gap: 10px; }
      .grid-cols-6 { grid-template-columns: repeat(6, 1fr); text-align: center; }
      .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
      .border { border: 1px solid #ddd; }
      .border-t { border-top: 1px solid #ddd; }
      .bg-black { background: black; color: white; }
      .bg-red-600 { background: red; color: white; }
      .text-white { color: white; }
      .text-black { color: black; }
      .px-4 { padding-left: 16px; padding-right: 16px; }
      .py-2 { padding-top: 8px; padding-bottom: 8px; }
      .rounded { border-radius: 4px; }
      .font-bold { font-weight: bold; }
      .text-lg { font-size: 1.25rem; }
      .shadow-lg { box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); }
      .mt-4 { margin-top: 16px; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .p-3 { padding: 12px; }
      .text-sm { font-size: 0.875rem; }
      .text-center { text-align: center; }
      .cursor-pointer { cursor: pointer; }
      .receipt {text-align: center}
      .text-center { text-align: center; }
      .bold { font-weight: bold; }
      .line { border-top: 1px solid #000; margin: 10px 0; }
      img{ width:50px; height:50px;}
    </style>
      </head>
      <body>
        <div class="invoice-card">
          <h2 class="text-center">Chraz Store</h2>
          <p class="text-center">123 Market Street, City</p>
          <p>Date: ${new Date().toLocaleString()}</p>
          <div class="line"></div>
          ${printContent.innerHTML}
          <div class="line"></div>
          <p class="bold">Order Type: <span>${selectedInvoice.orderType || "N/A"}</span></p>
          <p class="bold">Payment Method: <span>${selectedInvoice.paymentMethod || "N/A"}</span></p>
          <div class="line"></div>
          <p class="text-center bold">Thank You!</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

 



  return (
    <div className="flex gap-5  bg-gray-100 h-[640px]">
      <div className="container w-[1000px] p-6 bg-white ml-5 rounded-lg shadow-lg">
        <div className="flex justify-between mb-4">
        <input
  type="text"
  placeholder="Search Customer Name, Phone, or State"
  className="w-[450px] p-2 border border-gray-300 rounded-lg"
  onChange={handleSearch}
  value={search}
/>
<button
  className="p-2 bg-gray-700 text-white rounded-lg"
  onClick={() => handleSearch({ target: { value: search } })}
>
  <span className="[&>svg]:h-5 [&>svg]:w-6">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  </span>
</button>

           <div className="flex space-x-2">
            {/* Sort by Month Dropdown */}
            <select 
  className="bg-red-600 text-white px-4 py-2 w-[240px] rounded-lg cursor-pointer"
  onChange={(e) => setSelectedMonth(e.target.value)}
  value={selectedMonth}
>
  <option value="" disabled hidden>Sort by Month</option> 
  {[
    "All Month", "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ].map(month => (
    <option key={month} value={month}>{month}</option>
  ))}
</select>


            {/* Date Picker */}
            <input 
              type="date" 
              className="bg-red-600 text-white w-[240px] px-4 py-2 rounded-lg cursor-pointer" 
              onChange={filterByDate} 
              value={selectedDate}
            />
          </div>
          
        </div>

        <div className="overflow-y-auto max-h-[500px] border border-gray-300 rounded-lg">
          
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-black text-white sticky top-0 z-10">
              <tr>
                <th className="p-4 border">Invoice No</th>
                <th className="p-4 border">Date</th>
                <th className="p-4 border">Details</th>
                <th className="p-4 border">State</th>
                <th className="p-4 border">Count</th>
                <th className="p-4 border">Tax</th>
                <th className="p-4 border">Price</th>
                <th className="p-4 border">Vat</th>
                <th className="p-4 border">Total</th>
                <th className="p-4 border">View</th>
               
                        
              </tr>
            </thead>
            <tbody>

            {filteredBills.length > 0 ? (
           
            filteredBills.map((bill,index) => (
    <tr key={bill._id} className="text-center">
      <td className="border px-4 py-2">{bill.invoiceNo}</td>
      <td className="border px-4 py-2">
        {new Date(bill.createdAt).toLocaleDateString()} {/* ✅ Format Date */}
      </td>
      <td className="border px-4 py-2">
        {bill.customer ? bill.customer.phone : "-"} <br />
        <span className="text-gray-500">{bill.customer ? bill.customer.name : "-"}</span>
      </td>
      <td className="border px-4 py-2">
        {bill.customer ? "Regular" : "New Customer"} {/* ✅ Check if customer exists */}
      </td>
      <td className="border px-4 py-2">
        {bill.items ? bill.items.reduce((sum, item) => sum + item.quantity, 0) : 0}
      </td>
      <td className="border px-4 py-2">
        {bill.items ? bill.items.reduce((sum, item) => sum + (item.tax || 0), 0) : 0}%
      </td>
      <td className="border px-4 py-2">
        Rs. {bill.items ? bill.items.reduce((sum, item) => sum + (item.price || 0), 0) : 0}
      </td>
      <td className="border px-4 py-2">
        {bill.items ? bill.items.reduce((sum, item) => sum + (item.vat || 0), 0) : 0}%
      </td>
      <td className="border px-4 py-2">Rs. {bill.totalAmount || 0}</td> {/* ✅ Fix totalAmount */}
      <td className="border px-4 py-2">
      <button
  className="bg-red-600 text-white p-2 rounded-md shadow-md hover:bg-red-700 transition-all flex items-center"
  onClick={() => setSelectedInvoice(bill)}
>
  <IoMdPlay size={20} className="text-white" />
</button>

      </td>
              
 
  
 
                  </tr>
                   ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-2 text-center text-gray-500">
                        No bills found.
                      </td>
                    </tr>
                )}
            
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Section: Invoice Summary */}
      
<div>
  

  <div ref={invoiceRef} className="p-4 bg-white rounded-lg shadow-lg h-[400px] w-[420px] ">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full border-2 border-white" />
              <h2 className="text-xl font-bold">Chraz Management</h2>
            </div>
            <p className="text-sm bg-white text-gray-600">Life Changes Ind</p>
          </div>

         
<div className="flex justify-between text-sm mb-2 border-b pb-2">
  <span>Date: {selectedInvoice.createdAt ? new Date(selectedInvoice.createdAt).toLocaleDateString() : "N/A"}</span> 
</div>
            {/* Invoice Items */}
            <div className="border h-[200px] rounded-md overflow-y-auto ">
            <div className="grid grid-cols-5 bg-gray-100 p-3 font-bold text-sm text-black text-center ">
              <span>Item</span>
              <span>Qty</span>
              
              <span>VAT</span>
              <span>Rate</span>
              <span>Amount</span>
            </div>
            
            <div className="max-h-60 ">
            {selectedInvoice.items.length > 0 ? (
                selectedInvoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 border-t p-3 text-sm text-center items-center">
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                   
                    <span>{item.vat}%</span>
                    <span>Rs. {item.price}</span>
                    <span>Rs. {item.total}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">No items available</div>
              )}
          </div>
          </div>

          {/* Invoice Totals */}
          <div className="mt-4 text-sm flex   ">
          <p className="text-center">Total Invoices: {filteredInvoices.length}</p>
          <p className="text-center">Total GST: {selectedInvoice.gstPercentage ? `${selectedInvoice.gstPercentage}%` : "N/A"}</p>
            <p className="text-center">Total Amount: Rs.{selectedInvoice.totalAmount || 0}</p>
          </div>
        </div>


<space> <div className="p-3" ></div> </space>

    {/* Summary Stats - Also expands */}
<div className="bg-white p-4 rounded-lg shadow-lg flex flex-col flex-grow border-2 border-red-700">
      {[
        { label: "Total New Customers", value: summary.totalNewCustomers },
        { label: "Total Regular Customers", value: summary.totalRegularCustomers },
        { label: "Total Food Count", value: summary.totalFoodCount },
        { label: "Total Food Tax", value: summary.totalFoodTax },
        { label: "Total Food VAT", value: summary.totalFoodVAT },
        { label: "Total Food Bill Income", value: summary.totalFoodBillIncome },
      ].map((item, i) => (
        <p key={i} className="flex justify-between border-b py-1 text-sm text-black font-semibold">
          <span>{item.label}</span> <span>{item.value}</span>
        </p>
      ))}
    </div>

 
</div>

    </div>
  );
} 
