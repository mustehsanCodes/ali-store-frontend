"use client"

import { useState, useEffect } from "react"
import AutocompleteSelect from "./AutocompleteSelect"

export default function ProductForm({ newProduct, setNewProduct, handleAddProduct, onSuccess, isMobile }) {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const unitOptions = [
    { value: "count", label: "Count/Number" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "grams", label: "Grams (g)" },
  ]

  // Validate form when product changes
  useEffect(() => {
    validateForm()
  }, [newProduct])

  const validateForm = () => {
    const newErrors = {}

    if (!newProduct.name || newProduct.name.trim() === "") {
      newErrors.name = "Product name is required"
    }

    if (!newProduct.category || newProduct.category.trim() === "") {
      newErrors.category = "Category is required"
    }

    if (newProduct.purchasePrice <= 0) {
      newErrors.purchasePrice = "Purchase price must be greater than 0"
    }

    if (newProduct.salePrice <= 0) {
      newErrors.salePrice = "Sale price must be greater than 0"
    }

    if (newProduct.salePrice < newProduct.purchasePrice) {
      newErrors.salePrice = "Sale price should be greater than or equal to purchase price"
    }

    if (newProduct.stock < 0) {
      newErrors.stock = "Stock cannot be negative"
    }

    if (newProduct.minimumStock < 0) {
      newErrors.minimumStock = "Minimum stock cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field, value) => {
    setNewProduct({ ...newProduct, [field]: value })
    setTouched({ ...touched, [field]: true })
  }

  const handleSubmit = () => {
    // Mark all fields as touched
    const allTouched = {}
    Object.keys(newProduct).forEach((key) => {
      allTouched[key] = true
    })
    setTouched(allTouched)

    // Validate form
    if (validateForm()) {
      handleAddProduct()
      if (onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="name" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Name
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            id="name"
            className={`w-full rounded-md border ${touched.name && errors.name ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            value={newProduct?.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            onBlur={() => setTouched({ ...touched, name: true })}
          />
          {touched.name && errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
      </div>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="category" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Category
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            id="category"
            className={`w-full rounded-md border ${touched.category && errors.category ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            value={newProduct?.category || ""}
            onChange={(e) => handleFieldChange("category", e.target.value)}
            onBlur={() => setTouched({ ...touched, category: true })}
          />
          {touched.category && errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
        </div>
      </div>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="purchasePrice" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Purchase Price (PKR)
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            id="purchasePrice"
            type="number"
            className={`w-full rounded-md border ${touched.purchasePrice && errors.purchasePrice ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            value={newProduct?.purchasePrice || 0}
            onChange={(e) => handleFieldChange("purchasePrice", Number(e.target.value))}
            onBlur={() => setTouched({ ...touched, purchasePrice: true })}
            min="0"
          />
          {touched.purchasePrice && errors.purchasePrice && (
            <p className="mt-1 text-xs text-red-500">{errors.purchasePrice}</p>
          )}
        </div>
      </div>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="salePrice" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Sale Price (PKR)
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            id="salePrice"
            type="number"
            className={`w-full rounded-md border ${touched.salePrice && errors.salePrice ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            value={newProduct?.salePrice || 0}
            onChange={(e) => handleFieldChange("salePrice", Number(e.target.value))}
            onBlur={() => setTouched({ ...touched, salePrice: true })}
            min="0"
          />
          {touched.salePrice && errors.salePrice && <p className="mt-1 text-xs text-red-500">{errors.salePrice}</p>}
        </div>
      </div>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="stock" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Stock Quantity
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            id="stock"
            type="number"
            className={`w-full rounded-md border ${touched.stock && errors.stock ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            value={newProduct?.stock || 0}
            onChange={(e) => handleFieldChange("stock", Number(e.target.value))}
            onBlur={() => setTouched({ ...touched, stock: true })}
            min="0"
            step={newProduct?.unit === "count" ? "1" : "0.01"}
          />
          {touched.stock && errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
        </div>
      </div>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="minimumStock" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Minimum Stock Level
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <input
            id="minimumStock"
            type="number"
            className={`w-full rounded-md border ${touched.minimumStock && errors.minimumStock ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            value={newProduct?.minimumStock || 2}
            onChange={(e) => handleFieldChange("minimumStock", Number(e.target.value))}
            onBlur={() => setTouched({ ...touched, minimumStock: true })}
            min="0"
            step={newProduct?.unit === "count" ? "1" : "0.01"}
          />
          {touched.minimumStock && errors.minimumStock && (
            <p className="mt-1 text-xs text-red-500">{errors.minimumStock}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Products with stock below this level will be marked as "Low" or "Critical"
          </p>
        </div>
      </div>
      <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
        <label htmlFor="unit" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
          Unit
        </label>
        <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
          <AutocompleteSelect
            value={newProduct?.unit || "count"}
            onChange={(unit) => handleFieldChange("unit", unit)}
            options={unitOptions}
            placeholder="Select unit"
            className="w-full"
            searchable={false}
          />
        </div>
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleSubmit}
      >
        Save Product
      </button>
    </div>
  )
}



// import { useState, useEffect, useRef } from "react"

// export default function ProductForm({ newProduct, setNewProduct, handleAddProduct, onSuccess, isMobile }) {
//   const [unitDropdownOpen, setUnitDropdownOpen] = useState(false)
//   const [errors, setErrors] = useState({})
//   const [touched, setTouched] = useState({})

//   // Ref for handling outside clicks
//   const unitDropdownRef = useRef(null)

//   // Handle outside clicks to close dropdown
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (unitDropdownOpen && unitDropdownRef.current && !unitDropdownRef.current.contains(event.target)) {
//         setUnitDropdownOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [unitDropdownOpen])

//   // Validate form when product changes
//   useEffect(() => {
//     validateForm()
//   }, [newProduct])

//   const validateForm = () => {
//     const newErrors = {}

//     if (!newProduct.name || newProduct.name.trim() === "") {
//       newErrors.name = "Product name is required"
//     }

//     if (!newProduct.category || newProduct.category.trim() === "") {
//       newErrors.category = "Category is required"
//     }

//     if (newProduct.purchasePrice <= 0) {
//       newErrors.purchasePrice = "Purchase price must be greater than 0"
//     }

//     if (newProduct.salePrice <= 0) {
//       newErrors.salePrice = "Sale price must be greater than 0"
//     }

//     if (newProduct.salePrice < newProduct.purchasePrice) {
//       newErrors.salePrice = "Sale price should be greater than or equal to purchase price"
//     }

//     if (newProduct.stock < 0) {
//       newErrors.stock = "Stock cannot be negative"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleFieldChange = (field, value) => {
//     setNewProduct({ ...newProduct, [field]: value })
//     setTouched({ ...touched, [field]: true })
//   }

//   const handleSubmit = () => {
//     // Mark all fields as touched
//     const allTouched = {}
//     Object.keys(newProduct).forEach((key) => {
//       allTouched[key] = true
//     })
//     setTouched(allTouched)

//     // Validate form
//     if (validateForm()) {
//       handleAddProduct()
//       if (onSuccess) {
//         onSuccess()
//       }
//     }
//   }

//   return (
//     <div className="grid gap-4 py-4">
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="name" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Name
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <input
//             id="name"
//             className={`w-full rounded-md border ${touched.name && errors.name ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
//             value={newProduct?.name || ""}
//             onChange={(e) => handleFieldChange("name", e.target.value)}
//             onBlur={() => setTouched({ ...touched, name: true })}
//           />
//           {touched.name && errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
//         </div>
//       </div>
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="category" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Category
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <input
//             id="category"
//             className={`w-full rounded-md border ${touched.category && errors.category ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
//             value={newProduct?.category || ""}
//             onChange={(e) => handleFieldChange("category", e.target.value)}
//             onBlur={() => setTouched({ ...touched, category: true })}
//           />
//           {touched.category && errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
//         </div>
//       </div>
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="purchasePrice" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Purchase Price (PKR)
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <input
//             id="purchasePrice"
//             type="number"
//             className={`w-full rounded-md border ${touched.purchasePrice && errors.purchasePrice ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
//             value={newProduct?.purchasePrice || 0}
//             onChange={(e) => handleFieldChange("purchasePrice", Number(e.target.value))}
//             onBlur={() => setTouched({ ...touched, purchasePrice: true })}
//             min="0"
//           />
//           {touched.purchasePrice && errors.purchasePrice && (
//             <p className="mt-1 text-xs text-red-500">{errors.purchasePrice}</p>
//           )}
//         </div>
//       </div>
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="salePrice" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Sale Price (PKR)
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <input
//             id="salePrice"
//             type="number"
//             className={`w-full rounded-md border ${touched.salePrice && errors.salePrice ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
//             value={newProduct?.salePrice || 0}
//             onChange={(e) => handleFieldChange("salePrice", Number(e.target.value))}
//             onBlur={() => setTouched({ ...touched, salePrice: true })}
//             min="0"
//           />
//           {touched.salePrice && errors.salePrice && <p className="mt-1 text-xs text-red-500">{errors.salePrice}</p>}
//         </div>
//       </div>
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="stock" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Stock Quantity
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"}`}>
//           <input
//             id="stock"
//             type="number"
//             className={`w-full rounded-md border ${touched.stock && errors.stock ? "border-red-500" : "border-gray-300"} px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
//             value={newProduct?.stock || 0}
//             onChange={(e) => handleFieldChange("stock", Number(e.target.value))}
//             onBlur={() => setTouched({ ...touched, stock: true })}
//             min="0"
//             step={newProduct?.unit === "count" ? "1" : "0.01"}
//           />
//           {touched.stock && errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
//         </div>
//       </div>
//       <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4 items-center gap-4"}`}>
//         <label htmlFor="unit" className={`${isMobile ? "" : "text-right"} text-sm font-medium text-gray-700`}>
//           Unit
//         </label>
//         <div className={`${isMobile ? "mt-1" : "col-span-3"} relative`} ref={unitDropdownRef}>
//           <button
//             type="button"
//             className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
//           >
//             {newProduct?.unit === "kg" ? "Kilogram (kg)" : newProduct?.unit === "grams" ? "Grams (g)" : "Count/Number"}
//           </button>
//           {unitDropdownOpen && (
//             <div className="absolute z-[110] mt-1 w-full rounded-md bg-white shadow-lg">
//               <div className="py-1">
//                 {["kg", "grams", "count"].map((unit) => (
//                   <button
//                     key={`unit-${unit}`}
//                     type="button"
//                     className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => {
//                       handleFieldChange("unit", unit)
//                       setUnitDropdownOpen(false)
//                     }}
//                   >
//                     {unit === "kg" ? "Kilogram (kg)" : unit === "grams" ? "Grams (g)" : "Count/Number"}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <button
//         type="button"
//         className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         onClick={handleSubmit}
//       >
//         Save Product
//       </button>
//     </div>
//   )
// }
