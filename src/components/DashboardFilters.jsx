"use client"

import AutocompleteSelect from "./AutocompleteSelect"

export default function DashboardFilters({
  chartPeriod,
  setChartPeriod,
  categoryFilter,
  setCategoryFilter,
  categories,
}) {
  const periodOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ]

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...(categories || []).map((category) => ({
      value: category,
      label: category,
    })),
  ]

  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4">
      <AutocompleteSelect
        value={chartPeriod}
        onChange={setChartPeriod}
        options={periodOptions}
        placeholder="Select Period"
        className="w-full md:w-auto min-w-[140px]"
        searchable={false}
      />

      {categories && categories.length > 0 && (
        <AutocompleteSelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
          placeholder="All Categories"
          className="w-full md:w-auto min-w-[180px]"
          searchable={true}
        />
      )}
    </div>
  )
}





// import { useState, useRef, useEffect } from "react"
// import { FaChevronDown } from "react-icons/fa"

// export default function DashboardFilters({
//   chartPeriod,
//   setChartPeriod,
//   categoryFilter,
//   setCategoryFilter,
//   categories,
// }) {
//   const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false)
//   const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

//   const periodDropdownRef = useRef(null)
//   const categoryDropdownRef = useRef(null)

//   // Handle outside clicks to close dropdowns
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (isPeriodDropdownOpen && periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) {
//         setIsPeriodDropdownOpen(false)
//       }

//       if (
//         isCategoryDropdownOpen &&
//         categoryDropdownRef.current &&
//         !categoryDropdownRef.current.contains(event.target)
//       ) {
//         setIsCategoryDropdownOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isPeriodDropdownOpen, isCategoryDropdownOpen])

//   return (
//     <div className="flex flex-col md:flex-row gap-2 mb-4">
//       <div className="relative" ref={periodDropdownRef}>
//         <button
//           className="flex items-center justify-between w-full md:w-auto px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
//           onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
//         >
//           {chartPeriod === "week" ? "This Week" : chartPeriod === "month" ? "This Month" : "This Year"}{" "}
//           <FaChevronDown className="ml-2 h-4 w-4" />
//         </button>
//         {isPeriodDropdownOpen && (
//           <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
//             <button
//               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//               onClick={() => {
//                 setChartPeriod("week")
//                 setIsPeriodDropdownOpen(false)
//               }}
//             >
//               This Week
//             </button>
//             <button
//               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//               onClick={() => {
//                 setChartPeriod("month")
//                 setIsPeriodDropdownOpen(false)
//               }}
//             >
//               This Month
//             </button>
//             <button
//               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//               onClick={() => {
//                 setChartPeriod("year")
//                 setIsPeriodDropdownOpen(false)
//               }}
//             >
//               This Year
//             </button>
//           </div>
//         )}
//       </div>

//       {categories && categories.length > 0 && (
//         <div className="relative" ref={categoryDropdownRef}>
//           <button
//             className="flex items-center justify-between w-full md:w-auto px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
//             onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
//           >
//             {categoryFilter === "all" ? "All Categories" : categoryFilter}
//             <FaChevronDown className="ml-2 h-4 w-4" />
//           </button>
//           {isCategoryDropdownOpen && (
//             <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
//               <button
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                 onClick={() => {
//                   setCategoryFilter("all")
//                   setIsCategoryDropdownOpen(false)
//                 }}
//               >
//                 All Categories
//               </button>
//               {categories.map((category) => (
//                 <button
//                   key={category}
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   onClick={() => {
//                     setCategoryFilter(category)
//                     setIsCategoryDropdownOpen(false)
//                   }}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }