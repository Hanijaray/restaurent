import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, Printer } from "lucide-react";
// import logo from './croplogo.png';
import tick from '../../../assets/tick.png';
import cancel from '../../../assets/cancel.png';
import AddNewCustomer from "./AddNewCust"; // Import the component
import BonusPopup from "./BonusPopup";
import QRCode from "qrcode"; // Import the QRCode library

const Invoice = () => {
  const initialTotalAmount = 0; // Initialize initialTotalAmount
  const [invoiceNo, setInvoiceNo] = useState(null); // Start with null
  const [filteredItems, setFilteredItems] = useState([]);  // Filtered items based on selected category
  const [searchItem, setSearchItem] = useState("");  // Search input for items
  const [invoiceItems, setInvoiceItems] = useState([]); // Stores selected items for invoice
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState([]);
  const [menuType, setMenuType] = useState(""); // For tracking selected menu type (Indian/Saudi)
  const [selectedCategory, setSelectedCategory] = useState(""); // For tracking selected category
  const [orderType, setOrderType] = useState("Dine");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [items, setItems] = useState(Array(10).fill({ name: "Biryani", qty: 2, price: 2, vat: 2, total: 2 }));
  const [isCustomerPopupOpen, setIsCustomerPopupOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchedCustomer, setSearchedCustomer] = useState("");
  const [isAddCustomerPointOpen, setIsAddCustomerPointOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [gstAmount, setGstAmount] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount); // Store total amount
  const [buttonText, setButtonText] = useState("Get");



  const fetchInvoiceNo = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/latest-invoice");
      const data = await response.json();
      setInvoiceNo(data.invoiceNo);
    } catch (error) {
      console.error("Error fetching invoice number:", error);
    }
  };

  // Fetch invoice number when component loads
  useEffect(() => {
    fetchInvoiceNo();
  }, []);


  // Fetch invoice number when component loads
  useEffect(() => {
    fetchInvoiceNo();
  }, []);



  const removeItem = (index) => {
    console.log("Removing item at index:", index);
  
    // Remove the selected item from invoiceItems
    setInvoiceItems((prevInvoiceItems) => {
      const updatedItems = prevInvoiceItems.filter((_, i) => i !== index);
      console.log("Updated invoiceItems:", updatedItems);
      return updatedItems;
    });
  
    // Optionally, update the quantities state if needed
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      const itemName = invoiceItems[index]?.menuName; // Get the name of the item being removed
      if (itemName) {
        delete updatedQuantities[itemName]; // Remove the item's quantity
      }
      console.log("Updated quantities:", updatedQuantities);
      return updatedQuantities;
    });
  };
  

  const [selectedTable, setSelectedTable] = useState(null);
  const [showNextTables, setShowNextTables] = useState(false);

  const tablesFirstSet = [...Array.from({ length: 7 }, (_, i) => `Table ${i + 1}`), "Next Table →"];
  const tablesSecondSet = ["← Previous Table", ...Array.from({ length: 7 }, (_, i) => `Table ${i + 8}`)];

  const handleTableClick = (table) => {
    if (table === "Next Table →") {
      setShowNextTables(true); // Switch to Tables 8-14
    } else if (table === "← Previous Table") {
      setShowNextTables(false); // Switch back to Tables 1-7
    } else {
      setSelectedTable(table);
      setIsOpen(false);
    }
  };

  const invoiceRef = useRef();


  // ... (existing state and functions)

  const handlePrint = async () => {
    const printContent = invoiceRef.current.cloneNode(true);
    printContent.querySelectorAll("button").forEach((button) => button.remove());

    const receiptData = {
      invoiceNo,
      items: invoiceItems.map((item) => ({
        name: item.menuName,
        quantity: item.quantity,
        price: item.amount,
        vat: item.tax,
        discount: item.discount,
        total: item.amount * item.quantity,
      })),
      totalAmount,
      gstPercentage,
      orderType,
      paymentMethod,
      table: selectedTable,
      customer: selectedCustomer ? {
        name: selectedCustomer.name,
        phone: selectedCustomer.phone,
        pointsUsed: selectedCustomer.points,
      } : null,
    };

    const formattedReceiptData = `
      Invoice No: ${receiptData.invoiceNo}
      Date: ${new Date().toLocaleString()}
      Order Type: ${receiptData.orderType}
      Payment Method: ${receiptData.paymentMethod}
      Table: ${receiptData.table || 'N/A'}
      Customer: ${receiptData.customer ? receiptData.customer.name : 'N/A'}
      Phone: ${receiptData.customer ? receiptData.customer.phone : 'N/A'}
      Points Used: ${receiptData.customer ? receiptData.customer.pointsUsed : 'N/A'}
      
      Items:
      ${receiptData.items.map(item => `
        - ${item.name} (Qty: ${item.quantity}, Price: Rs. ${item.price}, VAT: ${item.vat}%, Discount: ${item.discount}%, Total: Rs. ${item.total})
      `).join('')}
      
      Total Amount: Rs. ${receiptData.totalAmount.toFixed(2)}
      GST: ${receiptData.gstPercentage}%
    `;

    try {
      const qrCodeData = await QRCode.toDataURL(formattedReceiptData);
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
              <p class="bold">Order Type: <span>${orderType}</span></p>
              <p class="bold">Payment Method: <span>${paymentMethod}</span></p>
              <div class="qr-code" style="text-align: center;">
                <img src="${qrCodeData}" alt="QR Code" />
                <p>Scan this QR code to view the receipt offline.</p>
              </div>
              <p class="text-center bold">Thank You!</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      // Send SMS to the customer
      if (selectedCustomer && selectedCustomer.phone) {
        const response = await fetch('http://localhost:5000/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: selectedCustomer.phone,
            body: formattedReceiptData,
          }),
        });

        if (!response.ok) throw new Error('Failed to send SMS');
        console.log('SMS sent successfully!');
      }
    } catch (error) {
      console.error('Error generating QR code or sending SMS:', error);
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem('invoiceNo', invoiceNo);
  }, [invoiceNo]);

  useEffect(() => {
    fetchItems(menuType); // Fetch all items based on selected menu type (Indian/Saudi)
  }, [menuType]); // Dependency array, will trigger re-fetch when menuType changes

  useEffect(() => {
    // Filter items based on selected category
    if (selectedCategory) {
      const filtered = items.filter(item => item.selectedCategory === selectedCategory);
      setFilteredItems(filtered);
      setQuantities(new Array(filtered.length).fill(1)); // Default quantity is 1
    } else {
      setFilteredItems(items);
    }
  }, [items, selectedCategory]); // Trigger filtering whenever items or selectedCategory changes

  useEffect(() => {
    // Filter items based on search input
    if (searchItem) {
      const filtered = items.filter(item => item.menuName.toLowerCase().includes(searchItem.toLowerCase()));
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchItem]); // Trigger filtering whenever search input changes

  useEffect(() => {
    // Update the totalAmount whenever filteredItems or quantities change
    const total = filteredItems.reduce((acc, item, index) => {
      return acc + item.amount * quantities[index];
    }, 0);
    setTotalAmount(total);
  }, [filteredItems, quantities]);

  useEffect(() => {
    const total = invoiceItems.reduce((acc, item) => {
      const itemTotal = item.amount * item.quantity;
      return acc + itemTotal;
    }, 0);
    setTotalAmount(total);
  }, [invoiceItems]);

  useEffect(() => {
    const totalBeforeTax = invoiceItems.reduce((acc, item) => acc + item.amount * item.quantity, 0);
    const gstTotal = invoiceItems.reduce((acc, item) => acc + (item.amount * item.quantity * item.tax) / 100, 0);

    const gstPercent = totalBeforeTax > 0 ? (gstTotal / totalBeforeTax) * 100 : 0;

    setGstAmount(gstTotal);
    setGstPercentage(gstPercent.toFixed(2));
  }, [invoiceItems]);




  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      setCategories(data); // Store full category objects
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  // Fetch customer details from MongoDB Atlas
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers?search=${searchTerm}`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }, [searchTerm]);


  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, fetchCustomers]);

  const [isBonusPopupOpen, setIsBonusPopupOpen] = useState(false);



  const fetchItems = async (type) => {
    try {
      let url = `http://localhost:5000/api/menus?`;
      if (type) url += `type=${type}`;
      const response = await fetch(url);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);  // Update the items based on the type selected (Indian/Saudi)
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  // const updateQuantity = (itemName, change) => {
  //   setInvoiceItems((prevInvoiceItems) =>
  //     prevInvoiceItems
  //       .map((item) =>
  //         item.menuName === itemName
  //           ? { ...item, quantity: Math.max(0, item.quantity + change) } // Only reduce selected item
  //           : item
  //       )
  //       .filter((item) => item.quantity > 0) // Remove item if quantity is 0
  //   );

  //   setQuantities((prevQuantities) => {
  //     const updatedQuantities = [...prevQuantities]; // Clone array
  //     const itemIndex = invoiceItems.findIndex((item) => item.menuName === itemName);

  //     if (itemIndex !== -1) {
  //       updatedQuantities[itemIndex] = Math.max(0, updatedQuantities[itemIndex] + change);
  //     }

  //     return updatedQuantities;
  //   });
  // };

  const updateQuantity = (itemName, change) => {
    setInvoiceItems((prevInvoiceItems) =>
      prevInvoiceItems
        .map((item) =>
          item.menuName === itemName
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0) // Remove item if quantity is 0
    );

    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities }; // Convert to an object
      updatedQuantities[itemName] = Math.max(0, (updatedQuantities[itemName] || 1) + change);
      return updatedQuantities;
    });
  };


  const handleClear = () => {
    setInvoiceNo((prev) => prev + 1);
    setQuantities([]);
    setInvoiceItems([]); // Clear the invoice items
  };





  // Function to open AddCustomerPoint popup
  const handleOpenAddCustomerPoint = () => {
    setIsAddCustomerPointOpen(true);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleAddToInvoice = (item) => {
    setInvoiceItems((prevInvoiceItems) => {
      const existingItemIndex = prevInvoiceItems.findIndex((invItem) => invItem.menuName === item.menuName);

      if (existingItemIndex !== -1) {
        return prevInvoiceItems.map((invItem, index) =>
          index === existingItemIndex ? { ...invItem, quantity: invItem.quantity + 1 } : invItem
        );
      } else {
        return [...prevInvoiceItems, { ...item, quantity: 1 }];
      }
    });

    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      updatedQuantities[item.menuName] = (updatedQuantities[item.menuName] || 0) + 1;
      return updatedQuantities;
    });
  };

  const handleSaveBill = async () => {
    try {
      const billData = {
        items: invoiceItems.map(item => ({
          name: item.menuName,
          quantity: item.quantity,
          price: item.amount,
          vat: item.tax,
          discount: item.discount,
          total: item.amount * item.quantity
        })),
        totalAmount,
        gstPercentage,
        orderType,
        paymentMethod,
        table: selectedTable,
        customer: selectedCustomer ? {
          name: selectedCustomer.name,
          phone: selectedCustomer.phone,
          pointsUsed: selectedCustomer.points
        } : null
      };

      const response = await fetch("http://localhost:5000/api/save-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });

      if (!response.ok) throw new Error("Failed to save bill");

      const result = await response.json();
      alert("Bill saved successfully!");

      handleClear();
      setInvoiceNo(result.invoiceNo); // Update UI with next invoice number
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Failed to save bill");
    }
  };






  return (
    <div>
      {/* Container */}
      <div className="flex gap-5 p-5 bg-gray-100 h-[630px]">

        {/* Invoice */}
        <div ref={invoiceRef} className="w-[420px] mx-auto bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="mb-2 text-sm">
              <p className="font-bold">Invoice No: <span className="text-gray-700">{invoiceNo}</span></p>
              <p>Item count: {invoiceItems.length}</p>
            </div>
            <div className="relative inline-block text-left">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
              >
                {selectedTable ? selectedTable : "Select Table ▼"}
              </button>

              {isOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  {(showNextTables ? tablesSecondSet : tablesFirstSet).map((table) => (
                    <div
                      key={table}
                      onClick={() => handleTableClick(table)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {table}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-6 bg-black p-3 font-bold text-sm text-white text-center">
              <span>Item</span>
              <span>Qty</span>
              <span>Price</span>
              <span>GST</span>
              <span>Discount</span>
              <span>Total</span>
            </div>

            {/* Scrollable Table Body */}
            <div className="h-[300px] overflow-y-auto">
              {invoiceItems.map((item, index) => (
                <div key={index} className="grid grid-cols-6 border-t py-3 px-1 text-sm text-center items-center">
                  <div className="flex items-center">
                    <button onClick={() => removeItem(index)} className="bg-red-600 text-white text-xs mr-1 px-1 rounded">X</button>
                    <span>{item.menuName}</span>
                  </div>
                  <span>{item.quantity}</span>
                  <span>Rs. {item.amount}</span>
                  <span>{item.tax}%</span>
                  <span>{item.discount}%</span>
                  <span>
                    Rs. {(((item.amount * item.quantity) * (1 + item.tax / 100)) * (1 - item.discount / 100)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-red-600 text-white px-4 py-2 rounded-md mt-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">GST :</span>
              <span className="bg-white text-black font-bold text-sm px-4 py-1 rounded border border-black">
                {gstPercentage}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">Total :</span>
              <span className="bg-white text-black font-bold px-4 py-1 text-sm rounded border border-black">
                Rs.{(totalAmount || 0).toFixed(2)} {/* ✅ Updated total after points deduction */}
              </span>
            </div>
          </div>


          <div className="grid grid-cols-3 gap-2 mt-4">
            {["Dine", "Takeaway", "Delivery"].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`${orderType === type ? "bg-red-600" : "bg-black"} text-white py-2 rounded`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            {["Cash", "Card", "Credit"].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`${paymentMethod === method ? "bg-black" : "bg-red-600"} text-white py-2 rounded`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Billing */}
        <div className="container mx-auto p-4 w-[700px] mr-3 bg-white shadow-lg rounded-lg">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search Item"
              className="border p-2 rounded w-[300px]"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <button className="p-2 bg-gray-700 text-white rounded-lg">
              <span className="[&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </span>
            </button>

            <div className="grid grid-cols-3 w-[400px] gap-2">
              <button
                className="bg-red-600 text-white text-xl p-2 rounded-lg"
                onClick={() => { setMenuType("Indian"); setSelectedCategory(""); }}
              >
                Indian
              </button>
              <button
                className="bg-red-600 text-white text-xl p-2 rounded-lg"
                onClick={() => { setMenuType("Saudi"); setSelectedCategory(""); }}
              >
                Saudi
              </button>
              <button
                className="bg-red-600 text-white text-xl p-2 rounded-lg"
                onClick={() => { setMenuType("Chinese"); setSelectedCategory(""); }} // Added Chinese button
              >
                Chinese
              </button>
            </div>
          </div>

          {/* Scrollable Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full border text-left text-lg rounded-lg">
              <thead>
                <tr className="p-20 bg-black text-white text-lg">
                  <th className="p-2">Item</th>
                  <th className="p-2 text-center">Discount</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">GST</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
            </table>

            {/* Table Body (Scrollable) */}
            <div className="h-[200px] overflow-y-auto">
            <table className="w-full text-left text-lg">
  <tbody>
    {filteredItems.map((item, index) => {
      const quantity = quantities[item.menuName] || 0;
      const amount = item.amount ?? 0;
      const tax = item.tax ?? 0;
      const discount = item.discount ?? 0;

      // Total Calculation: (Amount * Quantity) -> Add Tax -> Subtract Discount
      const total = ((amount * quantity) * (1 + tax / 100)) * (1 - discount / 100);

      return (
        <tr key={index} className="border-b py-4">
          <td className="p-2">{item.menuName}</td>
          <td className="p-2">{discount}%</td>
          <td className="flex items-center gap-2 my-2">
            <button
              onClick={() => handleAddToInvoice(item, index)}
              className="bg-red-600 text-white w-8 h-8 text-3xl rounded flex items-center justify-center"
            >
              +
            </button>
            <div className="w-20 h-8 flex items-center justify-center border rounded bg-gray-100 text-lg font-semibold">
              {quantity}
            </div>
            <button
              onClick={() => updateQuantity(item.menuName, -1)}
              className="bg-red-600 text-white w-8 h-8 text-3xl rounded flex items-center justify-center"
            >
              -
            </button>
          </td>
          <td className="p-2">Rs. {amount.toFixed(2)}</td>
          <td className="p-2">{tax}%</td>
          <td className="p-2">Rs. {total.toFixed(2)}</td>
        </tr>
      );
    })}
  </tbody>
</table>

            </div>
            <div>
              <div className="flex gap-2 mt-4 ">
                <input
                  type="text"
                  placeholder="Search Customer"
                  className="border p-2 rounded w-[300px] h-10 mt-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="p-2 bg-gray-700 text-white rounded-lg h-10 mt-4">
                  <span className="[&>svg]:h-5 [&>svg]:w-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </span>
                </button>
                {/* AddNewCustomer Component */}
                <AddNewCustomer
                  isOpen={isCustomerPopupOpen}
                  onClose={() => setIsCustomerPopupOpen(false)}
                />
              </div>

              {/* Customer Display - Two Rows Only */}
              <div className="border rounded-lg p-4 bg-white relative bottom-50 h-[60px] ">

                {customers.length > 0 ? (
                  <div className="flex flex-col gap-2 ">
                    {customers.slice(0, 1).map((customer, index) => (  // Show searched customer
                      <div key={index} className="flex justify-between bg-gray-100 p-2 rounded-lg border h-[50px] relative bottom-3 w-[660px] right-3">
                        <span className="text-lg font-semibold w-1/3">{customer.name}</span>
                        <span className="text-lg w-1/3">{customer.phone}</span>
                        <span className="text-lg text-black w-1/3">{customer.points || 0} Points</span>


                        {/* BonusPopup Component */}
                        {customer &&
                          <BonusPopup
                            isOpen={isBonusPopupOpen}
                            onClose={() => setIsBonusPopupOpen(false)}
                            customerName={customer.name}

                          />}

                        <button
                          className="bg-red-500 text-white p-2 rounded-lg font-bold h-10"
                          onClick={async () => {
                            if (buttonText === "Get" && customer && customer.points > 0) {
                              const pointsToUse = Math.min(customer.points, totalAmount); // ✅ Use min to avoid negative total
                              const remainingAmount = totalAmount - pointsToUse;
                              const updatedPoints = customer.points - pointsToUse;

                              setSelectedCustomer((prevCustomer) => ({
                                ...prevCustomer,
                                points: updatedPoints,
                              }));

                              setTotalAmount(remainingAmount); // ✅ Subtract points from total amount

                              try {
                                const response = await fetch(`http://localhost:5000/api/update-customer-points/${customer._id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ points: updatedPoints }),
                                });

                                if (!response.ok) throw new Error("Failed to update points");

                                console.log(`Customer points updated! Remaining: ${updatedPoints}`);
                                setButtonText("Used"); // ✅ Change button text after using points
                              } catch (error) {
                                console.error("Error updating points:", error);
                              }
                            }
                          }}
                        >
                          {buttonText} {/* ✅ Button text dynamically changes */}
                        </button>



                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No search results</p>
                )}
              </div>


              <div className="border rounded-lg p-1 bg-white shadow-lg mt-4 relative bottom-30 h-[60px] ">

                {customers.length > 1 ? (
                  <div className="flex flex-col gap-2">
                    {customers.slice(1, 2).map((customer, index) => (  // Show last stored customer
                      <div key={index} className="flex justify-between  p-2 rounded-lg border h-[50px] relative bottom-0 w-[660px] right-6 left-0">
                        <span className="text-lg font-semibold w-1/3">{customer.name}</span>
                        <span className="text-lg w-1/3">{customer.phone}</span>
                        <span className="text-lg text-black w-1/3">{customer.points || 0} Points</span>

                        {/* BonusPopup Component */}
                        <BonusPopup
                          isOpen={isBonusPopupOpen}
                          onClose={() => setIsBonusPopupOpen(false)}
                          customerName={customer.name}
                        />

                        <button
                          className="bg-red-500 text-white p-2 rounded-lg font-bold h-10"
                          onClick={async () => {
                            if (buttonText === "Get" && customer && customer.points > 0) { // ✅ Prevent multiple deductions
                              const pointsToUse = Math.min(customer.points, totalAmount);
                              const remainingAmount = totalAmount - pointsToUse;
                              const updatedPoints = customer.points - pointsToUse;

                              setSelectedCustomer({ ...customer, points: updatedPoints });

                              if (remainingAmount > 0) {
                                setTotalAmount(remainingAmount); // ✅ Subtract only if button is "Get"
                              }

                              try {
                                const response = await fetch(`http://localhost:5000/api/update-customer-points/${customer._id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ points: updatedPoints }),
                                });

                                if (!response.ok) throw new Error("Failed to update points");

                                console.log(`Customer points updated successfully! Remaining: ${updatedPoints}`);
                                setButtonText("Used"); // ✅ Change button text after successful update
                              } catch (error) {
                                console.error("Error updating customer points:", error);
                              }
                            }
                          }}
                        >
                          {buttonText} {/* ✅ Dynamic button text */}
                        </button>

                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No recent customers</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category */}

        <div className="w-[300px] mr-5 p-4 bg-white shadow-lg rounded-lg">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Categories"
              className="w-full p-2 border rounded-lg pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
          </div>
          <div className="h-80 overflow-y-scroll border p-4 scrollbar">
            <div className="flex flex-col gap-2">
              {categories
                .filter(category => category.name.toLowerCase().includes(search.toLowerCase()))
                .map(category => (
                  <button
                    key={category._id}
                    className="w-full p-2 bg-red-600 text-white rounded-lg text-center"
                    onClick={() => { setSelectedCategory(category.name); setMenuType(""); setMenuType(""); }}
                  >
                    {category.name}
                  </button>
                ))}
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button className="bg-black text-white px-5 py-2 w-[130px] h-11 rounded-lg flex items-center gap-1 font-bold hover:bg-gray-400"
              onClick={handleSaveBill}>
              <img src={tick} alt="Logo" className="w-6 h-6 rounded-lg" />
              DONE
            </button>
            <button onClick={handleClear} className="bg-black text-white px-5 py-2 w-[130px] rounded-lg flex items-center gap-1 font-bold hover:bg-gray-400">
              <img src={cancel} alt="Logo" className="w-7 h-7" />
              CLEAR
            </button>
          </div>
          <button
            onClick={() => {
              handlePrint();
              handleSaveBill();
            }}
            className="mt-4 w-full h-[80px] text-white bg-red-600 text-3xl font-bold rounded-lg flex justify-center items-center">
            <Printer className="text-white w-10 h-10" />
            Print
          </button>
        </div>

      </div>
    </div>
  );
};

export default Invoice;
