"use client"

import { useState, useEffect } from "react"
import AutocompleteSelect from "./AutocompleteSelect"

export default function ManualSaleForm({ onAddManualSale, onSuccess, isMobile, editMode = false, saleData = null }) {
  const [manualSaleData, setManualSaleData] = useState({
    amount: 0,
    profit: 0,
    paymentMethod: "Cash",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  })

  // If in edit mode and saleData is provided, initialize form with that data
  useEffect(() => {
    if (editMode && saleData) {
      setManualSaleData({
        amount: saleData.total || 0,
        profit: saleData.profit || 0,
        paymentMethod: saleData.paymentMethod || "Cash",
        description: saleData.description || "",
        date: saleData.date
          ? new Date(saleData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      })
    }
  }, [editMode, saleData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setManualSaleData({
      ...manualSaleData,
      [name]: value,
    })
  }

  const handlePaymentMethodChange = (method) => {
    setManualSaleData({
      ...manualSaleData,
      paymentMethod: method,
    })
  }

  const handleSubmit = () => {
    // Validate the form
    if (manualSaleData.amount <= 0 || manualSaleData.profit < 0) {
      alert("Amount must be greater than 0 and profit cannot be negative.")
      return
    }

    // Call the appropriate function based on mode
    if (editMode) {
      // If editing, pass the original ID along with the updated data
      onAddManualSale({
        ...manualSaleData,
        _id: saleData._id,
      })
    } else {
      // If adding new, just pass the form data
      onAddManualSale(manualSaleData)
    }

    // Call the onSuccess function
    onSuccess()

    // Reset the form if not in edit mode
    if (!editMode) {
      setManualSaleData({
        amount: 0,
        profit: 0,
        paymentMethod: "Cash",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="amount" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Amount (PKR)
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            type="number"
            id="amount"
            name="amount"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={manualSaleData.amount}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="profit" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Profit (PKR)
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            type="number"
            id="profit"
            name="profit"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={manualSaleData.profit}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="paymentMethod" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Payment Method
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <AutocompleteSelect
            value={manualSaleData.paymentMethod}
            onChange={handlePaymentMethodChange}
            options={[
              { value: "Cash", label: "Cash" },
              { value: "Card", label: "Card" },
              { value: "Bank Transfer", label: "Bank Transfer" },
            ]}
            placeholder="Select payment method"
            className="w-full"
            searchable={false}
          />
        </div>
      </div>

      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="description" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Description
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            type="text"
            id="description"
            name="description"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={manualSaleData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="date" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Date
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            type="date"
            id="date"
            name="date"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={manualSaleData.date}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleSubmit}
      >
        {editMode ? "Update Manual Sale" : "Record Manual Sale"}
      </button>
    </div>
  )
}


// "\"use client"

// import { useState } from "react"

// export default function ManualSaleForm({ onAddManualSale, onSuccess, isMobile }) {
//   const [manualSaleData, setManualSaleData] = useState({
//     amount: 0,
//     profit: 0,
//     paymentMethod: "Cash",
//     description: "",
//     date: new Date().toISOString().split("T")[0], // Default to today's date
//   })

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setManualSaleData({
//       ...manualSaleData,
//       [name]: value,
//     })
//   }

//   const handleSubmit = () => {
//     // Validate the form
//     if (manualSaleData.amount <= 0 || manualSaleData.profit < 0) {
//       alert("Amount must be greater than 0 and profit cannot be negative.")
//       return
//     }

//     // Call the onAddManualSale function
//     onAddManualSale(manualSaleData)

//     // Call the onSuccess function
//     onSuccess()

//     // Reset the form
//     setManualSaleData({
//       amount: 0,
//       profit: 0,
//       paymentMethod: "Cash",
//       description: "",
//       date: new Date().toISOString().split("T")[0],
//     })
//   }

//   return (
//     <div className="grid gap-4 py-4">
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="amount" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Amount (PKR)
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <input
//             type="number"
//             id="amount"
//             name="amount"
//             className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             value={manualSaleData.amount}
//             onChange={handleChange}
//             min="0"
//           />
//         </div>
//       </div>

//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="profit" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Profit (PKR)
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <input
//             type="number"
//             id="profit"
//             name="profit"
//             className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             value={manualSaleData.profit}
//             onChange={handleChange}
//             min="0"
//           />
//         </div>
//       </div>

//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="paymentMethod" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Payment Method
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <select
//             id="paymentMethod"
//             name="paymentMethod"
//             className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             value={manualSaleData.paymentMethod}
//             onChange={handleChange}
//           >
//             <option value="Cash">Cash</option>
//             <option value="Card">Card</option>
//             <option value="Bank Transfer">Bank Transfer</option>
//           </select>
//         </div>
//       </div>

//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="description" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Description
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <input
//             type="text"
//             id="description"
//             name="description"
//             className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             value={manualSaleData.description}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="date" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Date
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <input
//             type="date"
//             id="date"
//             name="date"
//             className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             value={manualSaleData.date}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       <button
//         type="button"
//         className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         onClick={handleSubmit}
//       >
//         Record Manual Sale
//       </button>
//     </div>
//   )
// }

