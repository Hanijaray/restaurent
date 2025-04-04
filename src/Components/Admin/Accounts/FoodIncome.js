import { useEffect, useState ,useRef} from "react";
import { FaSearch } from "react-icons/fa";
import { Printer } from "lucide-react";
import logo from "../../../assets/cropsuper.png";

export default function GroceryExpenseCard() {
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const printRef = useRef(); // Create a reference for the printable section

  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Grocery Expense</title>
         <style>
  body { 
    font-family: Arial, sans-serif; 
    padding: 20px; 
    text-align: center; 
  }
  
  img { 
    width: 120px; /* Adjusted for smaller size */
    display: block; 
    margin: 0 auto 20px auto; /* Added bottom margin for spacing */
  } 
  
  table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 20px; 
  }
  
  th, td { 
    border: 1px solid black; 
    padding: 10px; 
    text-align: center; 
  }
  
  th { 
    background-color: #f2f2f2; 
  }
  
  /* Zebra Striping for Table Rows */
  tr:nth-child(even) { 
    background-color: #f9f9f9; 
  }
  
  /* Summary section with spacing */
  .summary {
    margin-top: 20px; 
    font-weight: bold; 
    text-align: center; 
    font-size: 16px;
  }
  
  .summary span {
    display: inline-block;
    margin: 5px 15px; /* Adds spacing between total summary items */
  }
  
  /* Adjust print settings */
  @media print {
    .no-scroll { 
      overflow: visible !important; 
      height: auto !important; 
    }
    
    body {
      padding: 10px; /* Reduce padding for print layout */
    }
  }
</style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
  
  useEffect(() => {
    fetch("http://localhost:5000/api/bills")
      .then((response) => response.json())
      .then((data) => setBills(data))
      .catch((error) => console.error("Error fetching bills:", error));
  }, []);

  // Months list
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // 1️⃣ **Apply filters BEFORE grouping**
  const filteredBills = bills.filter((bill) => {
    const invoiceNo = String(bill.invoiceNo);
    const billDate = new Date(bill.createdAt);
    const billMonth = billDate.toLocaleString("default", { month: "long" });

    return (
      invoiceNo.includes(searchQuery) &&
      (selectedMonth ? billMonth === selectedMonth : true)
    );
  });

  // 2️⃣ **Group bills by date AFTER filtering**
  const groupedBills = filteredBills.reduce((acc, bill) => {
    const dateKey = new Date(bill.createdAt).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        invoices: [],
        invoiceCount: 0,
        totalQty: 0,
        totalTax: 0,
        totalAmount: 0
      };
    }

    acc[dateKey].invoices.push(bill.invoiceNo);
    acc[dateKey].invoiceCount += 1;
    acc[dateKey].totalQty += bill.items.reduce((sum, item) => sum + item.quantity, 0);
    acc[dateKey].totalTax += bill.items.reduce((sum, item) => sum + (item.vat || 0), 0);
    acc[dateKey].totalAmount += bill.totalAmount;

    return acc;
  }, {});

  // Convert object to array
  const groupedBillsArray = Object.values(groupedBills);

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
        <div className="bg-gray-800 text-white p-3 rounded-t-lg text-center font-bold text-lg">
          FOOD INCOME
        </div>
        <div className="p-4 bg-white">
          {/* 🔍 Search & Filter Section */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by Invoice No..."
                className="border p-2 rounded-lg w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="p-3 bg-gray-700 text-white rounded-lg">
                <FaSearch />
              </button>
            </div>
            <div className="p-2 flex gap-2">
              <button
                className="bg-gray-700 text-white px-4 py-2 w-36 rounded"
                onClick={() => {
                  setSelectedMonth("");
                  setSearchQuery("");
                }}
              >
                View All
              </button>
              <div className="relative">
                <button
                  className="bg-red-600 text-white p-4 py-2 rounded w-36"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {selectedMonth || "Month"} ▼
                </button>
                {showDropdown && (
                  <div className="absolute bg-white shadow-lg rounded-md w-36 mt-1 z-10">
                    {months.map((month) => (
                      <div
                        key={month}
                        className="p-1 hover:bg-gray-200 cursor-pointer text-center"
                        onClick={() => {
                          setSelectedMonth(month);
                          setShowDropdown(false);
                        }}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div ref={printRef}>
          <div className="hidden print:flex items-center justify-center mb-1 ">
  <img src={logo} alt="Logo" className="w-12 h-12 mr-3" />
  <h2 className="font-bold text-lg">
    {bills.length > 0 ? bills[0].companyName || "Company Name" : "Loading..."} (Expense)
  </h2>
</div>

<div className="text-sm text-gray-600 text-center flex justify-between mb-4">
  <div>
  Total Invoice No: {bills.length > 0 
    ? `${Math.min(...bills.map(b => b.invoiceNo))} to ${Math.max(...bills.map(b => b.invoiceNo))}`
    : "N/A"}
</div>

<div>
  {bills.length > 0
    ? `${new Date(Math.min(...bills.map(b => new Date(b.createdAt))))
        .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })} 
       to  
       ${new Date(Math.max(...bills.map(b => new Date(b.createdAt))))
        .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })}`
    : "N/A"}
</div>

</div>


          {/* 🧾 Invoice Table */}
          <div className="overflow-x-auto">
            <div className="h-[250px] overflow-y-auto border rounded-md">
              <table className="w-full border text-sm text-left">
                <thead className="bg-gray-200 text-center sticky top-0">
                  <tr>
                    <th className="p-2"> Date</th>
                    <th className="p-2">Invoice No</th>
                    <th className="p-2">Invoice Count</th>
                    <th className="p-2">Tot Qty</th>
                    <th className="p-2">Tax</th>
                    <th className="p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedBillsArray.length > 0 ? (
                    groupedBillsArray.map((bill, i) => (
                      <tr key={i} className="border-t">
                        <td className="border p-2 text-center">{bill.date}</td>
                        <td className="border p-2 text-center">{Math.min(...bill.invoices)} - {Math.max(...bill.invoices)}</td>
                        <td className="border p-2 text-center">{bill.invoiceCount}</td>
                        <td className="border p-2 text-center">{bill.totalQty}</td>
                        <td className="border p-2 text-center">{bill.totalTax.toFixed(2)}</td>
                        <td className="border p-2 text-center">{bill.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="border p-2 text-center">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-2 text-sm font-semibold">
  <span>Total Days: {groupedBillsArray.length}</span>
  <span>Invoice Count: {filteredBills.length}</span>
  <span>Tot Qty: {filteredBills.reduce((sum, bill) => 
    sum + bill.items.reduce((qty, item) => qty + item.quantity, 0), 0
  )}</span>
  <span>Total Income: ₹{groupedBillsArray.reduce((sum, bill) => sum + bill.totalAmount, 0)}/-</span>
</div>


</div>
</div>

          

        </div>
      </div>
      {/* 📊 Summary */}
      <div className="bg-black rounded-md p-2 mt-4">
  <div className="flex justify-between">
    <div className="text-white p-3 text-lg font-bold text-center">
      TOTAL INCOME: ₹{groupedBillsArray.reduce((sum, bill) => sum + bill.totalAmount, 0)}/-
    </div>
    <div className="text-sm text-white flex flex-col">
      <p>Total Days: {groupedBillsArray.length}</p>
      <p>Invoice Count: {filteredBills.length}</p>
      <p>Tot VAT: ₹{groupedBillsArray.reduce((sum, bill) => sum + bill.totalTax, 0).toFixed(2)}</p>
      <p>Tot Expense: ₹{groupedBillsArray.reduce((sum, bill) => sum + bill.totalAmount, 0)}/-</p>
    </div>
  </div>
  <div className="bg-white rounded-xl">
  <button
            onClick={handlePrint} // Print function triggered on click
            className="bg-red-600 text-white px-6 py-3 w-full rounded text-2xl font-bold flex justify-center"
          >
            <Printer className="text-white w-10 h-10" /> PRINT INCOME
          </button>
  </div>
</div>
    </div>
  );
}

