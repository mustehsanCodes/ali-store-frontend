"use client"

import { useState, useEffect, useRef } from "react"
import { FaPlus, FaTrash, FaExclamationCircle } from "react-icons/fa"
import AutocompleteSelect from "./AutocompleteSelect"

export default function SaleEditForm({ sale, products, onUpdateSale, onSuccess, isMobile }) {
  const [editedSale, setEditedSale] = useState({
    items: [],
    paymentMethod: "Cash",
  })

  const [validationErrors, setValidationErrors] = useState([])
  const [hasStockError, setHasStockError] = useState(false)

  // Filter out invalid products
  const validProducts = Array.isArray(products)
    ? products.filter((product) => product && product._id && product.name && product.stock >= 0)
    : []

  // Get unique categories from products
  const categories = [...new Set(validProducts.map((product) => product.category))].filter(Boolean)

  // Initialize form with sale data - ONLY ONCE when the component mounts or sale changes
  useEffect(() => {
    if (sale && sale.items) {
      // Add availableStock and category to each item
      const itemsWithStock = sale.items.map((item) => {
        const product = validProducts.find((p) => p._id === item.productId)
        // If we find the product, add its current stock plus the quantity from this sale
        // (since this quantity was already deducted from the product's stock)
        const availableStock = product ? product.stock + item.quantity : item.quantity
        return {
          ...item,
          availableStock,
          category: product ? product.category : "",
        }
      })

      setEditedSale({
        items: itemsWithStock,
        paymentMethod: sale.paymentMethod || "Cash",
      })
    }
  }, [sale]) // Only depend on sale, not validProducts which could change frequently

  // Helper function to get products by category
  const getProductsByCategory = (category) => {
    return validProducts.filter((product) => product.category === category)
  }

  // Validate stock levels whenever items change
  useEffect(() => {
    const errors = []
    let stockError = false

    editedSale.items.forEach((item, index) => {
      if (item.productId && item.quantity > item.availableStock) {
        errors.push(
          `Item ${index + 1}: ${item.productName} - Requested quantity (${item.quantity}) exceeds available stock (${
            item.availableStock
          })`,
        )
        stockError = true
      }
    })

    setValidationErrors(errors)
    setHasStockError(stockError)
  }, [editedSale.items])

  const handleAddSaleItem = () => {
    setEditedSale({
      ...editedSale,
      items: [
        ...editedSale.items,
        {
          productId: "",
          productName: "",
          quantity: 1,
          purchasePrice: 0,
          salePrice: 0,
          unit: "count",
          availableStock: 0,
          category: "",
        },
      ],
    })
  }

  const handleRemoveSaleItem = (index) => {
    const items = [...editedSale.items]
    items.splice(index, 1)
    setEditedSale({ ...editedSale, items })
  }

  const handleUpdateSaleItemCategory = (index, category) => {
    const items = [...editedSale.items]
    items[index] = {
      ...items[index],
      category,
      // Reset product selection when category changes
      productId: "",
      productName: "",
      purchasePrice: 0,
      salePrice: 0,
      unit: "count",
      availableStock: 0,
    }
    setEditedSale({ ...editedSale, items })
  }

  const handleUpdateSaleItem = (index, field, value) => {
    const items = [...editedSale.items]

    if (field === "productId") {
      const product = validProducts.find((p) => p._id === value)
      if (product) {
        // If changing product, we need to consider the original quantity for this item
        const originalQuantity = items[index].productId === value ? items[index].quantity : 0

        items[index] = {
          ...items[index],
          productId: value,
          productName: product.name,
          purchasePrice: product.purchasePrice,
          salePrice: product.salePrice,
          unit: product.unit || "count",
          availableStock: product.stock + originalQuantity,
          category: product.category,
        }
      }
    } else if (field === "quantity") {
      // Get the current item
      const currentItem = items[index]

      // Ensure quantity is not negative
      let newQuantity = Math.max(0, value)

      // Ensure quantity doesn't exceed available stock
      if (currentItem.productId && currentItem.availableStock !== undefined) {
        newQuantity = Math.min(newQuantity, currentItem.availableStock)
      }

      items[index] = { ...items[index], quantity: newQuantity }
    } else {
      items[index] = { ...items[index], [field]: value }
    }

    setEditedSale({ ...editedSale, items })
  }

  const validateForm = () => {
    const errors = []

    // Check if any items are selected
    if (editedSale.items.length === 0) {
      errors.push("Please add at least one item to the sale")
    }

    // Check if all items have a product selected
    editedSale.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: Please select a product`)
      }

      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
      }

      if (item.productId && item.quantity > item.availableStock) {
        errors.push(
          `Item ${index + 1}: ${item.productName} - Requested quantity (${item.quantity}) exceeds available stock (${
            item.availableStock
          })`,
        )
      }
    })

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = () => {
    // Validate the form
    if (!validateForm()) {
      return
    }

    // Only proceed if there are no stock errors
    if (!hasStockError) {
      // Remove availableStock and category from items before submitting
      const submitItems = editedSale.items.map(({ availableStock, category, ...item }) => item)
      onUpdateSale({
        ...editedSale,
        items: submitItems,
      })

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <div className="grid gap-4 py-4">
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <div className="flex items-center">
            <FaExclamationCircle className="h-4 w-4 mr-2" />
            <span className="font-bold">Validation Errors</span>
          </div>
          <ul className="list-disc pl-5 mt-2">
            {validationErrors.map((error, index) => (
              <li key={`error-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Products</label>
        {editedSale.items.map((item, index) => (
          <div key={`item-${index}`} className={`flex ${isMobile ? "flex-col" : "items-start"} gap-2`}>
            {/* Category Selection */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <AutocompleteSelect
                value={item.category || ""}
                onChange={(category) => handleUpdateSaleItemCategory(index, category)}
                options={[
                  { value: "", label: "Select category" },
                  ...categories.map((cat) => ({ value: cat, label: cat })),
                ]}
                placeholder="Select category"
                className="w-full"
                searchable={true}
              />
            </div>

            {/* Product Selection - Only enabled if category is selected */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
              <AutocompleteSelect
                value={item.productId || ""}
                onChange={(productId) => handleUpdateSaleItem(index, "productId", productId)}
                options={[
                  { value: "", label: "Select product" },
                  ...getProductsByCategory(item.category).map((product) => ({
                    value: product._id,
                    label: `${product.name} - PKR ${product.salePrice} (${product.unit || "count"}) - Stock: ${product.stock}`,
                  })),
                ]}
                placeholder="Select product"
                className={`w-full ${!item.category ? "opacity-50 pointer-events-none" : ""} ${
                  item.productId && item.quantity > item.availableStock ? "border-red-500" : ""
                }`}
                searchable={true}
              />
            </div>

            <div className={`flex ${isMobile ? "w-full" : "w-auto"} items-center gap-2 mt-2 md:mt-0`}>
              <input
                type="number"
                placeholder="Qty"
                className={`${isMobile ? "flex-1" : "w-20"} rounded-md border ${
                  item.productId && item.quantity > item.availableStock ? "border-red-500" : "border-gray-300"
                } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                value={item.quantity}
                onChange={(e) => handleUpdateSaleItem(index, "quantity", Number(e.target.value))}
                min="0.01"
                max={item.availableStock || 9999}
                step={item.unit === "count" ? "1" : "0.01"}
                disabled={!item.productId}
              />
              {item.productId && (
                <span className="text-xs text-gray-500 whitespace-nowrap">Max: {item.availableStock}</span>
              )}
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                onClick={() => handleRemoveSaleItem(index)}
                disabled={editedSale.items.length === 1}
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="mt-2 flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          onClick={handleAddSaleItem}
        >
          <FaPlus className="mr-2 h-4 w-4" /> Add Item
        </button>
      </div>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>Payment Method</label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <AutocompleteSelect
            value={editedSale.paymentMethod}
            onChange={(method) => setEditedSale({ ...editedSale, paymentMethod: method })}
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
        <label className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>Total Amount</label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"} font-medium`}>
          PKR {editedSale.items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0).toLocaleString()}
        </div>
      </div>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>Estimated Profit</label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"} font-medium text-green-600`}>
          PKR{" "}
          {editedSale.items
            .reduce((sum, item) => sum + (item.salePrice - item.purchasePrice) * item.quantity, 0)
            .toLocaleString()}
        </div>
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={hasStockError || editedSale.items.some((item) => !item.productId)}
      >
        Update Sale
      </button>
    </div>
  )
}



// import { useState, useEffect, useRef } from "react"
// import { FaPlus, FaTrash, FaExclamationCircle, FaChevronDown } from "react-icons/fa"

// export default function SaleEditForm({ sale, products, onUpdateSale, onSuccess, isMobile }) {
//   const [editedSale, setEditedSale] = useState({
//     items: [],
//     paymentMethod: "Cash",
//   })

//   const [validationErrors, setValidationErrors] = useState([])
//   const [hasStockError, setHasStockError] = useState(false)
//   const [productDropdownOpen, setProductDropdownOpen] = useState(null)
//   const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false)

//   // Refs for handling outside clicks
//   const dropdownRefs = useRef([])
//   const paymentDropdownRef = useRef(null)

//   // Filter out invalid products
//   const validProducts = Array.isArray(products)
//     ? products.filter((product) => product && product._id && product.name && product.stock >= 0)
//     : []

//   // Initialize form with sale data - ONLY ONCE when the component mounts or sale changes
//   useEffect(() => {
//     if (sale && sale.items) {
//       // Add availableStock to each item
//       const itemsWithStock = sale.items.map((item) => {
//         const product = validProducts.find((p) => p._id === item.productId)
//         // If we find the product, add its current stock plus the quantity from this sale
//         // (since this quantity was already deducted from the product's stock)
//         const availableStock = product ? product.stock + item.quantity : item.quantity
//         return {
//           ...item,
//           availableStock,
//         }
//       })

//       setEditedSale({
//         items: itemsWithStock,
//         paymentMethod: sale.paymentMethod || "Cash",
//       })
//     }
//   }, [sale]) // Only depend on sale, not validProducts which could change frequently

//   // Handle outside clicks to close dropdowns
//   useEffect(() => {
//     function handleClickOutside(event) {
//       // Close product dropdowns
//       if (
//         productDropdownOpen !== null &&
//         dropdownRefs.current[productDropdownOpen] &&
//         !dropdownRefs.current[productDropdownOpen].contains(event.target)
//       ) {
//         setProductDropdownOpen(null)
//       }

//       // Close payment dropdown
//       if (paymentDropdownOpen && paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target)) {
//         setPaymentDropdownOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [productDropdownOpen, paymentDropdownOpen])

//   // Validate stock levels whenever items change
//   useEffect(() => {
//     const errors = []
//     let stockError = false

//     editedSale.items.forEach((item, index) => {
//       if (item.productId && item.quantity > item.availableStock) {
//         errors.push(
//           `Item ${index + 1}: ${item.productName} - Requested quantity (${item.quantity}) exceeds available stock (${
//             item.availableStock
//           })`,
//         )
//         stockError = true
//       }
//     })

//     setValidationErrors(errors)
//     setHasStockError(stockError)
//   }, [editedSale.items])

//   const handleAddSaleItem = () => {
//     setEditedSale({
//       ...editedSale,
//       items: [
//         ...editedSale.items,
//         {
//           productId: "",
//           productName: "",
//           quantity: 1,
//           purchasePrice: 0,
//           salePrice: 0,
//           unit: "count",
//           availableStock: 0,
//         },
//       ],
//     })
//   }

//   const handleRemoveSaleItem = (index) => {
//     const items = [...editedSale.items]
//     items.splice(index, 1)
//     setEditedSale({ ...editedSale, items })
//   }

//   const handleUpdateSaleItem = (index, field, value) => {
//     const items = [...editedSale.items]

//     if (field === "productId") {
//       const product = validProducts.find((p) => p._id === value)
//       if (product) {
//         // If changing product, we need to consider the original quantity for this item
//         const originalQuantity = items[index].productId === value ? items[index].quantity : 0

//         items[index] = {
//           ...items[index],
//           productId: value,
//           productName: product.name,
//           purchasePrice: product.purchasePrice,
//           salePrice: product.salePrice,
//           unit: product.unit || "count",
//           availableStock: product.stock + originalQuantity,
//         }
//       }
//     } else if (field === "quantity") {
//       // Get the current item
//       const currentItem = items[index]

//       // Ensure quantity is not negative
//       let newQuantity = Math.max(0, value)

//       // Ensure quantity doesn't exceed available stock
//       if (currentItem.productId && currentItem.availableStock !== undefined) {
//         newQuantity = Math.min(newQuantity, currentItem.availableStock)
//       }

//       items[index] = { ...items[index], quantity: newQuantity }
//     } else {
//       items[index] = { ...items[index], [field]: value }
//     }

//     setEditedSale({ ...editedSale, items })
//   }

//   const validateForm = () => {
//     const errors = []

//     // Check if any items are selected
//     if (editedSale.items.length === 0) {
//       errors.push("Please add at least one item to the sale")
//     }

//     // Check if all items have a product selected
//     editedSale.items.forEach((item, index) => {
//       if (!item.productId) {
//         errors.push(`Item ${index + 1}: Please select a product`)
//       }

//       if (item.quantity <= 0) {
//         errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
//       }

//       if (item.productId && item.quantity > item.availableStock) {
//         errors.push(
//           `Item ${index + 1}: ${item.productName} - Requested quantity (${item.quantity}) exceeds available stock (${
//             item.availableStock
//           })`,
//         )
//       }
//     })

//     setValidationErrors(errors)
//     return errors.length === 0
//   }

//   const handleSubmit = () => {
//     // Validate the form
//     if (!validateForm()) {
//       return
//     }

//     // Only proceed if there are no stock errors
//     if (!hasStockError) {
//       // Remove availableStock from items before submitting
//       const submitItems = editedSale.items.map(({ availableStock, ...item }) => item)
//       onUpdateSale({
//         ...editedSale,
//         items: submitItems,
//       })

//       // Call onSuccess callback if provided
//       if (onSuccess) {
//         onSuccess()
//       }
//     }
//   }

//   // Update refs array when items change
//   useEffect(() => {
//     dropdownRefs.current = dropdownRefs.current.slice(0, editedSale.items.length)
//   }, [editedSale.items.length])

//   return (
//     <div className="grid gap-4 py-4">
//       {validationErrors.length > 0 && (
//         <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//           <div className="flex items-center">
//             <FaExclamationCircle className="h-4 w-4 mr-2" />
//             <span className="font-bold">Validation Errors</span>
//           </div>
//           <ul className="list-disc pl-5 mt-2">
//             {validationErrors.map((error, index) => (
//               <li key={`error-${index}`}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">Products</label>
//         {editedSale.items.map((item, index) => (
//           <div key={`item-${index}`} className={`flex ${isMobile ? "flex-col" : "items-center"} gap-2`}>
//             <div className="relative flex-1" ref={(el) => (dropdownRefs.current[index] = el)}>
//               <button
//                 type="button"
//                 className={`w-full flex items-center justify-between rounded-md border ${
//                   item.productId && item.quantity > item.availableStock ? "border-red-500" : "border-gray-300"
//                 } bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
//                 onClick={() => setProductDropdownOpen(productDropdownOpen === index ? null : index)}
//               >
//                 {item.productId ? item.productName : "Select product"}
//                 <FaChevronDown className="ml-2 h-4 w-4" />
//               </button>
//               {productDropdownOpen === index && (
//                 <div className="absolute z-[110] mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
//                   <div className="py-1">
//                     {validProducts.length > 0 ? (
//                       validProducts.map((product) => (
//                         <button
//                           key={`product-${product._id}`}
//                           type="button"
//                           className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => {
//                             handleUpdateSaleItem(index, "productId", product._id)
//                             setProductDropdownOpen(null)
//                           }}
//                         >
//                           {product.name} - PKR {product.salePrice} ({product.unit || "count"}) - Stock: {product.stock}
//                         </button>
//                       ))
//                     ) : (
//                       <div className="px-4 py-2 text-sm text-gray-500">No products available</div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className={`flex ${isMobile ? "w-full" : "w-auto"} items-center gap-2 mt-2 md:mt-0`}>
//               <input
//                 type="number"
//                 placeholder="Qty"
//                 className={`${isMobile ? "flex-1" : "w-20"} rounded-md border ${
//                   item.productId && item.quantity > item.availableStock ? "border-red-500" : "border-gray-300"
//                 } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
//                 value={item.quantity}
//                 onChange={(e) => handleUpdateSaleItem(index, "quantity", Number(e.target.value))}
//                 min="0.01"
//                 max={item.availableStock || 9999}
//                 step={item.unit === "count" ? "1" : "0.01"}
//               />
//               {item.productId && (
//                 <span className="text-xs text-gray-500 whitespace-nowrap">Max: {item.availableStock}</span>
//               )}
//               <button
//                 type="button"
//                 className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
//                 onClick={() => handleRemoveSaleItem(index)}
//                 disabled={editedSale.items.length === 1}
//               >
//                 <FaTrash className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//         <button
//           type="button"
//           className="mt-2 flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
//           onClick={handleAddSaleItem}
//         >
//           <FaPlus className="mr-2 h-4 w-4" /> Add Item
//         </button>
//       </div>
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>Payment Method</label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"} relative`} ref={paymentDropdownRef}>
//           <button
//             type="button"
//             className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
//           >
//             {editedSale.paymentMethod}
//             <FaChevronDown className="ml-2 h-4 w-4" />
//           </button>
//           {paymentDropdownOpen && (
//             <div className="absolute z-[110] mt-1 w-full rounded-md bg-white shadow-lg">
//               <div className="py-1">
//                 {["Cash", "Card", "Bank Transfer"].map((method) => (
//                   <button
//                     key={`payment-${method}`}
//                     type="button"
//                     className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => {
//                       setEditedSale({ ...editedSale, paymentMethod: method })
//                       setPaymentDropdownOpen(false)
//                     }}
//                   >
//                     {method}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>Total Amount</label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"} font-medium`}>
//           PKR {editedSale.items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0).toLocaleString()}
//         </div>
//       </div>
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>Estimated Profit</label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"} font-medium text-green-600`}>
//           PKR{" "}
//           {editedSale.items
//             .reduce((sum, item) => sum + (item.salePrice - item.purchasePrice) * item.quantity, 0)
//             .toLocaleString()}
//         </div>
//       </div>
//       <button
//         type="button"
//         className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//         onClick={handleSubmit}
//         disabled={hasStockError || editedSale.items.some((item) => !item.productId)}
//       >
//         Update Sale
//       </button>
//     </div>
//   )
// }


