"use client"

import { useState, useEffect, useRef } from "react"
import { FaEye, FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa"
import Pagination from "./Pagination"
import DateRangePicker from "./DateRangePicker"
import AutocompleteSelect from "./AutocompleteSelect"

export default function SalesTable({
  sales,
  filteredSales,
  dateFilter,
  paymentFilter,
  setDateFilter,
  setPaymentFilter,
  searchTerm,
  isMobile,
  onViewDetails,
  onDeleteSale,
  onEditSale,
  onSearchChange,
}) {
  const [showActionsFor, setShowActionsFor] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedSales, setPaginatedSales] = useState([])

  // Date range filter
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Options for autocomplete selects
  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "thisWeek", label: "This Week" },
  ]

  const paymentOptions = [
    { value: "all", label: "All Payments" },
    { value: "Cash", label: "Cash" },
    { value: "Card", label: "Card" },
    { value: "Bank Transfer", label: "Bank Transfer" },
  ]

  const itemsPerPageOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
  ]

  // Mobile action menu toggle
  const toggleActions = (id) => {
    if (showActionsFor === id) {
      setShowActionsFor(null)
    } else {
      setShowActionsFor(id)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle date range change
  const handleDateRangeChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const value = e.target ? e.target.value : e
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  // Apply date range filter to sales
  useEffect(() => {
    let filtered = [...filteredSales]

    // Apply date range filter if both dates are set
    if (startDate && endDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)

      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.date)
        return saleDate >= start && saleDate <= end
      })
    }

    // Calculate total pages
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)))

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    setPaginatedSales(filtered.slice(indexOfFirstItem, indexOfLastItem))
  }, [filteredSales, currentPage, itemsPerPage, startDate, endDate])

  // Reset to first page when filtered sales change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredSales.length])

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <input
            type="text"
            placeholder="Search by invoice..."
            className="w-full md:w-[250px] px-3 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => {
              if (typeof onSearchChange === "function") {
                onSearchChange(e.target.value)
              }
            }}
          />
          <DateRangePicker startDate={startDate} endDate={endDate} onDateChange={handleDateRangeChange} />
          <AutocompleteSelect
            value={dateFilter}
            onChange={setDateFilter}
            options={dateOptions}
            placeholder="All Time"
            className="w-full md:w-auto min-w-[140px]"
            searchable={false}
          />
          <AutocompleteSelect
            value={paymentFilter}
            onChange={setPaymentFilter}
            options={paymentOptions}
            placeholder="All Payments"
            className="w-full md:w-auto min-w-[140px]"
            searchable={false}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-700">
            Show:
          </label>
          <AutocompleteSelect
            value={itemsPerPage.toString()}
            onChange={(value) => {
              handleItemsPerPageChange({ target: { value } })
            }}
            options={itemsPerPageOptions}
            placeholder="10"
            className="min-w-[80px]"
            searchable={false}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isMobile ? (
          // Mobile view - card layout
          <div className="divide-y divide-gray-200">
            {paginatedSales.length > 0 ? (
              paginatedSales.map((sale) => (
                <div key={sale._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {sale._id.substring(0, 8)}...
                        {sale.isManual && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            Manual
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">{formatDate(sale.date)}</p>
                      {sale.description && <p className="text-sm text-gray-500 italic">{sale.description}</p>}
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700"
                        onClick={() => toggleActions(sale._id)}
                        aria-label="Sale actions"
                      >
                        <FaEllipsisV />
                      </button>
                      {showActionsFor === sale._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              type="button"
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                onViewDetails(sale)
                                setShowActionsFor(null)
                              }}
                            >
                              <FaEye className="mr-2 h-4 w-4" /> View Details
                            </button>
                            <button
                              type="button"
                              className="flex w-full items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                              onClick={() => {
                                onEditSale && onEditSale(sale)
                                setShowActionsFor(null)
                              }}
                            >
                              <FaEdit className="mr-2 h-4 w-4" /> Edit Sale
                            </button>
                            <button
                              type="button"
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => {
                                onDeleteSale(sale._id)
                                setShowActionsFor(null)
                              }}
                            >
                              <FaTrash className="mr-2 h-4 w-4" /> Delete Sale
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Items:</span> {sale.items?.length || 0}
                    </div>
                    <div>
                      <span className="text-gray-500">Payment:</span> {sale.paymentMethod}
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span> PKR {sale.total.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-gray-500">Profit:</span>{" "}
                      <span className="text-green-600">PKR {sale.profit.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 w-full text-center text-sm text-blue-600 hover:text-blue-900 py-1 border border-blue-200 rounded-md"
                    onClick={() => onViewDetails(sale)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">No sales recorded yet</div>
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
                    Invoice
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Profit
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
                {paginatedSales.length > 0 ? (
                  paginatedSales.map((sale) => (
                    <tr key={sale._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sale._id.substring(0, 8)}...
                        {sale.isManual && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            Manual
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(sale.date)}
                        {sale.description && <div className="text-xs italic text-gray-400">{sale.description}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.items?.length || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        PKR {sale.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        PKR {sale.profit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            onClick={() => onViewDetails(sale)}
                          >
                            <FaEye className="h-4 w-4 mr-1" /> View
                          </button>
                          <button
                            type="button"
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            onClick={() => onEditSale && onEditSale(sale)}
                          >
                            <FaEdit className="h-4 w-4 mr-1" /> Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => onDeleteSale(sale._id)}
                          >
                            <FaTrash className="h-4 w-4 mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No sales recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginatedSales.length > 0 && (
        <div className="mt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </>
  )
}







// import { useState } from "react"
// import { FaChevronDown, FaEye, FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa"

// export default function SalesTable({
//   sales,
//   filteredSales,
//   dateFilter,
//   paymentFilter,
//   setDateFilter,
//   setPaymentFilter,
//   searchTerm,
//   isMobile,
//   onViewDetails,
//   onDeleteSale,
//   onEditSale,
//   onSearchChange,
// }) {
//   const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
//   const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false)
//   const [showActionsFor, setShowActionsFor] = useState(null)

//   // Mobile action menu toggle
//   const toggleActions = (id) => {
//     if (showActionsFor === id) {
//       setShowActionsFor(null)
//     } else {
//       setShowActionsFor(id)
//     }
//   }

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   return (
//     <>
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
//         <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
//           <input
//             type="text"
//             placeholder="Search by invoice..."
//             className="w-full md:w-[250px] px-3 py-2 border border-gray-300 rounded-md"
//             value={searchTerm}
//             onChange={(e) => {
//               // Add a prop for this function in the component parameters
//               if (typeof onSearchChange === "function") {
//                 onSearchChange(e.target.value)
//               }
//             }}
//           />
//           <div className="relative w-full md:w-auto">
//             <button
//               className="w-full md:w-auto flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
//               onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
//             >
//               {dateFilter === "all"
//                 ? "All Time"
//                 : dateFilter === "today"
//                   ? "Today"
//                   : dateFilter === "yesterday"
//                     ? "Yesterday"
//                     : "This Week"}{" "}
//               <FaChevronDown className="ml-2 h-4 w-4" />
//             </button>
//             {isDateDropdownOpen && (
//               <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   onClick={() => {
//                     setDateFilter("all")
//                     setIsDateDropdownOpen(false)
//                   }}
//                 >
//                   All Time
//                 </button>
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   onClick={() => {
//                     setDateFilter("today")
//                     setIsDateDropdownOpen(false)
//                   }}
//                 >
//                   Today
//                 </button>
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   onClick={() => {
//                     setDateFilter("yesterday")
//                     setIsDateDropdownOpen(false)
//                   }}
//                 >
//                   Yesterday
//                 </button>
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   onClick={() => {
//                     setDateFilter("thisWeek")
//                     setIsDateDropdownOpen(false)
//                   }}
//                 >
//                   This Week
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="relative w-full md:w-auto">
//             <button
//               className="w-full md:w-auto flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
//               onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
//             >
//               {paymentFilter === "all" ? "All Payments" : paymentFilter} <FaChevronDown className="ml-2 h-4 w-4" />
//             </button>
//             {isPaymentDropdownOpen && (
//               <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   onClick={() => {
//                     setPaymentFilter("all")
//                     setIsPaymentDropdownOpen(false)
//                   }}
//                 >
//                   All
//                 </button>
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   onClick={() => {
//                     setPaymentFilter("Cash")
//                     setIsPaymentDropdownOpen(false)
//                   }}
//                 >
//                   Cash
//                 </button>
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   onClick={() => {
//                     setPaymentFilter("Card")
//                     setIsPaymentDropdownOpen(false)
//                   }}
//                 >
//                   Card
//                 </button>
//                 <button
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   onClick={() => {
//                     setPaymentFilter("Bank Transfer")
//                     setIsPaymentDropdownOpen(false)
//                   }}
//                 >
//                   Bank Transfer
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {isMobile ? (
//           // Mobile view - card layout
//           <div className="divide-y divide-gray-200">
//             {filteredSales.length > 0 ? (
//               filteredSales.map((sale) => (
//                 <div key={sale._id} className="p-4">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-medium text-gray-900">{sale._id.substring(0, 8)}...</h3>
//                       <p className="text-sm text-gray-500">{formatDate(sale.date)}</p>
//                     </div>
//                     <div className="relative">
//                       <button className="p-2 text-gray-500 hover:text-gray-700" onClick={() => toggleActions(sale._id)}>
//                         <FaEllipsisV />
//                       </button>
//                       {showActionsFor === sale._id && (
//                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//                           <div className="py-1">
//                             <button
//                               className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                               onClick={() => {
//                                 onViewDetails(sale)
//                                 setShowActionsFor(null)
//                               }}
//                             >
//                               <FaEye className="mr-2 h-4 w-4" /> View Details
//                             </button>
//                             <button
//                               className="flex w-full items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
//                               onClick={() => {
//                                 onEditSale && onEditSale(sale)
//                                 setShowActionsFor(null)
//                               }}
//                             >
//                               <FaEdit className="mr-2 h-4 w-4" /> Edit Sale
//                             </button>
//                             <button
//                               className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                               onClick={() => {
//                                 onDeleteSale(sale._id)
//                                 setShowActionsFor(null)
//                               }}
//                             >
//                               <FaTrash className="mr-2 h-4 w-4" /> Delete Sale
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//                     <div>
//                       <span className="text-gray-500">Items:</span> {sale.items.length}
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Payment:</span> {sale.paymentMethod}
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Amount:</span> PKR {sale.total.toLocaleString()}
//                     </div>
//                     <div>
//                       <span className="text-gray-500">Profit:</span>{" "}
//                       <span className="text-green-600">PKR {sale.profit.toLocaleString()}</span>
//                     </div>
//                   </div>
//                   <button
//                     className="mt-3 w-full text-center text-sm text-blue-600 hover:text-blue-900 py-1 border border-blue-200 rounded-md"
//                     onClick={() => onViewDetails(sale)}
//                   >
//                     View Details
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <div className="p-4 text-center text-sm text-gray-500">No sales recorded yet</div>
//             )}
//           </div>
//         ) : (
//           // Desktop view - table layout
//           <div className="responsive-table-container">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Invoice
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Date
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Items
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Payment
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Amount
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Profit
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredSales.length > 0 ? (
//                   filteredSales.map((sale) => (
//                     <tr key={sale._id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {sale._id.substring(0, 8)}...
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(sale.date)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.items.length}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.paymentMethod}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         PKR {sale.total.toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         PKR {sale.profit.toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end gap-2">
//                           <button
//                             className="text-blue-600 hover:text-blue-900 flex items-center"
//                             onClick={() => onViewDetails(sale)}
//                           >
//                             <FaEye className="h-4 w-4 mr-1" /> View
//                           </button>
//                           <button
//                             className="text-indigo-600 hover:text-indigo-900 flex items-center"
//                             onClick={() => onEditSale && onEditSale(sale)}
//                           >
//                             <FaEdit className="h-4 w-4 mr-1" /> Edit
//                           </button>
//                           <button
//                             className="text-red-600 hover:text-red-900 flex items-center"
//                             onClick={() => onDeleteSale(sale._id)}
//                           >
//                             <FaTrash className="h-4 w-4 mr-1" /> Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
//                       No sales recorded yet
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }
