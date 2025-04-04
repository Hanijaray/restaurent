import React, { useState, useEffect, useRef } from "react";
import { IoMdPlay } from "react-icons/io";
import { Printer } from "lucide-react";
import logo from "../../../assets/cropsuper.png";

export default function InvoiceTable() {
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // Stores selected month
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState({ items: [] });
  const [sortAscending, setSortAscending] = useState(true);

  const invoiceRef = useRef(null); // ✅ Define invoiceRef


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
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(query);

    if (!query) {
      setFilteredInvoices(invoices);
      return;
    }

    const filtered = invoices.filter((invoice) => {
      const customerName = invoice.customer?.name?.toLowerCase() || "";
      const customerPhone = invoice.customer?.phone?.toLowerCase() || "";
      const customerState = invoice.customer?.state?.toLowerCase() || "";
      const invoiceNumber = String(invoice.invoiceNo || "").toLowerCase();
      const orderType = invoice.orderType?.toLowerCase() || "";

      // Determine if it's "Regular" or "New Customer"
      const customerType = invoice.customer?.name ? "regular" : "new customer";

      return (
        customerName.includes(query) ||
        customerPhone.includes(query) ||
        customerState.includes(query) ||
        invoiceNumber.includes(query) ||
        orderType.includes(query) ||
        customerType.includes(query) // ✅ Now it filters "Regular" or "New Customer"
      );
    });


    setFilteredInvoices(filtered);
  };

  // Function to filter by selected month
  const filterByMonth = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
  
    if (month === "all") {
      // If "Select All" is chosen, show all invoices
      setFilteredInvoices(invoices);
    } else {
      // Otherwise, filter invoices by the selected month
      setFilteredInvoices(invoices.filter(invoice => invoice.month === month));
    }
  };
  

  // Function to filter by selected date
  const filterByDate = (event) => {
    const date = event.target.value;
    setSelectedDate(date);

    if (date) {
      setFilteredInvoices(invoices.filter(invoice => invoice.date === date));
    } else {
      setFilteredInvoices(invoices);
    }
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
      .bg-[#2f2f2f]  { background: black; color: white; }
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
    <div className="flex gap-5 p-5 bg-gray-100 h-[640px]">
      <div className="container w-[1200px] p-6 bg-white ml-5 rounded-lg shadow-lg">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search Customer Name, Phone, or State"
            className="w-[450px] p-2 border border-gray-300 rounded-lg"
            onChange={handleSearch}
          />
          <button
            className="p-2 bg-[#2f2f2f]  text-white rounded-lg"
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
              onChange={filterByMonth}
              value={selectedMonth}
            >
              <option value="" disabled>Sort by Month</option>
              <option value="all">Select All</option>
              {[
                "January", "February", "March", "April", "May", "June",
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
            <thead className="bg-[#2f2f2f]  text-white sticky top-0 z-10">
              <tr>
                <th className="p-4 border">Invoice No</th>
                <th className="p-4 border">Date</th>
                <th className="p-4 border">Details</th>
                <th className="p-4 border">State</th>
                <th className="p-4 border">Count</th>
                <th className="p-4 border">Table</th>
                <th className="p-4 border">GST</th>
                <th className="p-4 border">Total Amount</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr>
                    <td className="p-4 border">{invoice.invoiceNo}</td>
                    <td className="p-4 border">{invoice.date}</td>
                    <td className="p-4 border">
                      {invoice.customer ? (
                        <>
                          {invoice.customer.phone} <br />
                          <span className="text-sm text-gray-400">{invoice.customer.name}</span>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4 border">{invoice.customer?.name ? "Regular" : "New Customer"}</td>
                    <td className="p-4 border">{invoice.items.length}</td>
                    <td className="p-4 border">{invoice.table}</td>
                    <td className="p-4 border">{invoice.gstPercentage}%</td>
                    <td className="p-4 border text-center">Rs.{invoice.totalAmount}</td>
                    <td className="p-4 border">
                    {/* Edit Button */}
                    <button
                     onClick={() => setSelectedInvoice(invoice)}
                        className="bg-red-500 text-white px-3 py-1 rounded">
                        <IoMdPlay size={20} className="text-white" />
                     </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Right Section: Invoice Summary */}

      <div className="w-[30%]  bg-gray-100 ">


        <div ref={invoiceRef} className="p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full border-2 border-white" />
              <h2 className="text-2xl font-bold">Chraz Management</h2>
            </div>
            <p className="text-sm text-gray-600">Life Changes Ind</p>
          </div>

          {/* Invoice Items */}
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-6 bg-[#2f2f2f]  p-3 font-bold text-sm text-white text-center">
              <span>Item</span>
              <span>Qty</span>
              <span>Price</span>
              <span>VAT</span>
              <span>Discount</span>
              <span>Total</span>
            </div>

            <div className="max-h-60 h-[240px] overflow-y-auto border-t flex flex-col">
  {/* Render actual items */}
{selectedInvoice?.items?.length > 0 ? (
  selectedInvoice.items.map((item, index) => (
    <div key={index} className="grid grid-cols-6 border-t p-3 text-sm text-center items-center">
      <span>{item.name}</span>
      <span>{item.quantity}</span>
      <span>Rs. {item.price}</span>
      <span>{item.vat}%</span>
      <span>{item.discount}%</span>
      <span>Rs. {item.total}</span>
    </div>
  ))
) : (
  <div className="text-center p-2 mt-5 text-gray-500">No Items found for this date.</div>
)}
</div>
</div>
          {/* Invoice Totals */}
          <div className="mt-4 text-sm flex justify-between">
            <p className="text-center ">Total Invoices: {filteredInvoices.length}</p>
            <p className="text-center">GST: {selectedInvoice.gstPercentage ? `${selectedInvoice.gstPercentage}%` : "0"}</p>
            <p className="text-center">Total Amount: Rs.{selectedInvoice.totalAmount || 0}</p>
          </div>
        </div>


        <button onClick={handlePrint} className="mt-4 w-full h-[80px] bg-[#2f2f2f]  text-white text-3xl p-3 rounded-lg flex items-center justify-center gap-2">
          <Printer className="h-8 w-8" /> PRINT AGAIN
        </button>
      </div>

    </div>
  );
}






