"use client"

import { useState, useEffect } from "react"
import { FaEdit, FaTrash, FaEye, FaEllipsisV } from "react-icons/fa"
import Pagination from "./Pagination"
import AutocompleteSelect from "./AutocompleteSelect"

export default function InventoryTable({
  products,
  filteredProducts,
  handleEditProduct,
  setEditingProduct,
  setIsEditDialogOpen,
  handleDeleteProduct,
  onViewDetails,
  isMobile,
}) {
  const [showActionsFor, setShowActionsFor] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedProducts, setPaginatedProducts] = useState([])

  // Mobile action menu toggle
  const toggleActions = (id) => {
    if (showActionsFor === id) {
      setShowActionsFor(null)
    } else {
      setShowActionsFor(id)
    }
  }

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  const itemsPerPageOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
  ]

  // Apply pagination to products
  useEffect(() => {
    // Calculate total pages
    setTotalPages(Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage)))

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    setPaginatedProducts(filteredProducts.slice(indexOfFirstItem, indexOfLastItem))
  }, [filteredProducts, currentPage, itemsPerPage])

  // Reset to first page when filtered products change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredProducts.length])

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-700">
          Show:
        </label>
        <AutocompleteSelect
          value={itemsPerPage.toString()}
          onChange={handleItemsPerPageChange}
          options={itemsPerPageOptions}
          placeholder="10"
          className="min-w-[80px]"
          searchable={false}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isMobile ? (
          // Mobile view - card layout
          <div className="divide-y divide-gray-200">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <div key={product._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="relative">
                      <button
                        className="p-2 text-gray-500 hover:text-gray-700"
                        onClick={() => toggleActions(product._id)}
                        aria-label="Product actions"
                      >
                        <FaEllipsisV />
                      </button>
                      {showActionsFor === product._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                onViewDetails(product)
                                setShowActionsFor(null)
                              }}
                            >
                              <FaEye className="mr-2 h-4 w-4" /> View Details
                            </button>
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setEditingProduct(product)
                                setIsEditDialogOpen(true)
                                setShowActionsFor(null)
                              }}
                            >
                              <FaEdit className="mr-2 h-4 w-4" /> Edit
                            </button>
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => {
                                handleDeleteProduct(product._id)
                                setShowActionsFor(null)
                              }}
                            >
                              <FaTrash className="mr-2 h-4 w-4" /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Purchase:</span> PKR {product.purchasePrice.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-gray-500">Sale:</span> PKR {product.salePrice.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-gray-500">Stock:</span> {product.stock} {product.unit}
                    </div>
                    <div>
                      <span className="text-gray-500">Min Stock:</span> {product.minimumStock || 2} {product.unit}
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === "Critical"
                            ? "bg-red-100 text-red-800"
                            : product.status === "Low"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="flex-1 text-center text-sm text-blue-600 hover:text-blue-900 py-1 border border-blue-200 rounded-md"
                      onClick={() => onViewDetails(product)}
                    >
                      <FaEye className="inline mr-1 h-4 w-4" /> View
                    </button>
                    <button
                      className="flex-1 text-center text-sm text-indigo-600 hover:text-indigo-900 py-1 border border-indigo-200 rounded-md"
                      onClick={() => {
                        setEditingProduct(product)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <FaEdit className="inline mr-1 h-4 w-4" /> Edit
                    </button>
                    <button
                      className="flex-1 text-center text-sm text-red-600 hover:text-red-900 py-1 border border-red-200 rounded-md"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <FaTrash className="inline mr-1 h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">No products added yet</div>
            )}
          </div>
        ) : (
          // Desktop view - table layout
          <div className="responsive-table-container">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Purchase Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sale Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Min Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        PKR {product.purchasePrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        PKR {product.salePrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock} {product.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.minimumStock || 2} {product.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === "Critical"
                              ? "bg-red-100 text-red-800"
                              : product.status === "Low"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            onClick={() => onViewDetails(product)}
                          >
                            <FaEye className="h-4 w-4 mr-1" /> View
                          </button>
                          <button
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            onClick={() => {
                              setEditingProduct(product)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <FaEdit className="h-4 w-4 mr-1" /> Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <FaTrash className="h-4 w-4 mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      No products added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginatedProducts.length > 0 && (
        <div className="mt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}



// import { useState } from "react"
// import { FaEdit, FaTrash, FaEye, FaEllipsisV } from "react-icons/fa"

// export default function InventoryTable({
//   products,
//   filteredProducts,
//   handleEditProduct,
//   setEditingProduct,
//   setIsEditDialogOpen,
//   handleDeleteProduct,
//   onViewDetails,
//   isMobile,
// }) {
//   const [showActionsFor, setShowActionsFor] = useState(null)

//   // Mobile action menu toggle
//   const toggleActions = (id) => {
//     if (showActionsFor === id) {
//       setShowActionsFor(null)
//     } else {
//       setShowActionsFor(id)
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       {isMobile ? (
//         // Mobile view - card layout
//         <div className="divide-y divide-gray-200">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => (
//               <div key={product._id} className="p-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-medium text-gray-900">{product.name}</h3>
//                     <p className="text-sm text-gray-500">{product.category}</p>
//                   </div>
//                   <div className="relative">
//                     <button
//                       className="p-2 text-gray-500 hover:text-gray-700"
//                       onClick={() => toggleActions(product._id)}
//                     >
//                       <FaEllipsisV />
//                     </button>
//                     {showActionsFor === product._id && (
//                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//                         <div className="py-1">
//                           <button
//                             className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             onClick={() => {
//                               onViewDetails(product)
//                               setShowActionsFor(null)
//                             }}
//                           >
//                             <FaEye className="mr-2 h-4 w-4" /> View Details
//                           </button>
//                           <button
//                             className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             onClick={() => {
//                               setEditingProduct(product)
//                               setIsEditDialogOpen(true)
//                               setShowActionsFor(null)
//                             }}
//                           >
//                             <FaEdit className="mr-2 h-4 w-4" /> Edit
//                           </button>
//                           <button
//                             className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             onClick={() => {
//                               handleDeleteProduct(product._id)
//                               setShowActionsFor(null)
//                             }}
//                           >
//                             <FaTrash className="mr-2 h-4 w-4" /> Delete
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//                   <div>
//                     <span className="text-gray-500">Purchase:</span> PKR {product.purchasePrice.toLocaleString()}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Sale:</span> PKR {product.salePrice.toLocaleString()}
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Stock:</span> {product.stock} {product.unit}
//                   </div>
//                   <div>
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         product.status === "Critical"
//                           ? "bg-red-100 text-red-800"
//                           : product.status === "Low"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {product.status}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="mt-3 flex gap-2">
//                   <button
//                     className="flex-1 text-center text-sm text-blue-600 hover:text-blue-900 py-1 border border-blue-200 rounded-md"
//                     onClick={() => onViewDetails(product)}
//                   >
//                     <FaEye className="inline mr-1 h-4 w-4" /> View
//                   </button>
//                   <button
//                     className="flex-1 text-center text-sm text-indigo-600 hover:text-indigo-900 py-1 border border-indigo-200 rounded-md"
//                     onClick={() => {
//                       setEditingProduct(product)
//                       setIsEditDialogOpen(true)
//                     }}
//                   >
//                     <FaEdit className="inline mr-1 h-4 w-4" /> Edit
//                   </button>
//                   <button
//                     className="flex-1 text-center text-sm text-red-600 hover:text-red-900 py-1 border border-red-200 rounded-md"
//                     onClick={() => handleDeleteProduct(product._id)}
//                   >
//                     <FaTrash className="inline mr-1 h-4 w-4" /> Delete
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-4 text-center text-sm text-gray-500">No products added yet</div>
//           )}
//         </div>
//       ) : (
//         // Desktop view - table layout
//         <div className="responsive-table-container">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Product Name
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Category
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Purchase Price
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Sale Price
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Stock
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Status
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredProducts.length > 0 ? (
//                 filteredProducts.map((product) => (
//                   <tr key={product._id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       PKR {product.purchasePrice.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       PKR {product.salePrice.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {product.stock} {product.unit}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           product.status === "Critical"
//                             ? "bg-red-100 text-red-800"
//                             : product.status === "Low"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {product.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex justify-end gap-2">
//                         <button
//                           className="text-blue-600 hover:text-blue-900 flex items-center"
//                           onClick={() => onViewDetails(product)}
//                         >
//                           <FaEye className="h-4 w-4 mr-1" /> View
//                         </button>
//                         <button
//                           className="text-indigo-600 hover:text-indigo-900 flex items-center"
//                           onClick={() => {
//                             setEditingProduct(product)
//                             setIsEditDialogOpen(true)
//                           }}
//                         >
//                           <FaEdit className="h-4 w-4 mr-1" /> Edit
//                         </button>
//                         <button
//                           className="text-red-600 hover:text-red-900 flex items-center"
//                           onClick={() => handleDeleteProduct(product._id)}
//                         >
//                           <FaTrash className="h-4 w-4 mr-1" /> Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
//                     No products added yet
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }
