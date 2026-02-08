// "use client"

// import { FaBox, FaShoppingCart, FaHome, FaTimes } from "react-icons/fa"

// export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isMobile }) {
//   // Handle closing sidebar when clicking a menu item on mobile
//   const handleMenuClick = (tab) => {
//     setActiveTab(tab)
//     if (isMobile) {
//       setSidebarOpen(false)
//     }
//   }

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && sidebarOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setSidebarOpen(false)}></div>
//       )}

//       <div
//         className={`${
//           sidebarOpen ? "w-64" : "w-0 md:w-20"
//         } bg-gray-800 text-white transition-all duration-300 ease-in-out fixed h-screen z-30 md:relative ${
//           isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
//         }`}
//         style={{ minHeight: "100vh" }}
//       >
//         <div className="flex h-14 items-center justify-between border-b border-gray-700 px-4">
//           {sidebarOpen && (
//             <>
//               <span className="font-semibold text-xl truncate">Muhammad Ali Karyana Store</span>
//               {isMobile && (
//                 <button className="text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
//                   <FaTimes className="h-5 w-5" />
//                 </button>
//               )}
//             </>
//           )}
//           {!sidebarOpen && !isMobile && <span className="font-semibold text-xl mx-auto">MK</span>}
//         </div>
//         <div className="mt-4 flex flex-col h-[calc(100%-3.5rem)]">
//           <ul className="flex-grow">
//             <li>
//               <button
//                 className={`flex items-center w-full px-4 py-3 ${
//                   activeTab === "dashboard" ? "bg-gray-700" : "hover:bg-gray-700"
//                 }`}
//                 onClick={() => handleMenuClick("dashboard")}
//               >
//                 <FaHome className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
//                 {sidebarOpen && <span>Dashboard</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`flex items-center w-full px-4 py-3 ${
//                   activeTab === "inventory" ? "bg-gray-700" : "hover:bg-gray-700"
//                 }`}
//                 onClick={() => handleMenuClick("inventory")}
//               >
//                 <FaBox className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
//                 {sidebarOpen && <span>Inventory</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`flex items-center w-full px-4 py-3 ${
//                   activeTab === "sales" ? "bg-gray-700" : "hover:bg-gray-700"
//                 }`}
//                 onClick={() => handleMenuClick("sales")}
//               >
//                 <FaShoppingCart className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
//                 {sidebarOpen && <span>Sales</span>}
//               </button>
//             </li>
//           </ul>
//           <div className="border-t border-gray-700 p-4">
//             {sidebarOpen && (
//               <div className="flex items-center">
//                 <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
//                   <span>MA</span>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Store Admin</p>
//                 </div>
//               </div>
//             )}
//             {!sidebarOpen && !isMobile && (
//               <div className="flex justify-center">
//                 <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
//                   <span>MA</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }


"use client"

import { FaBox, FaShoppingCart, FaHome, FaTimes, FaBars, FaHandHoldingUsd } from "react-icons/fa"

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isMobile }) {
  // Handle closing sidebar when clicking a menu item on mobile
  const handleMenuClick = (tab) => {
    setActiveTab(tab)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      {/* Mobile toggle button - visible only on small screens */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars className="h-5 w-5" />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-0 md:w-20"} 
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
          flex flex-col
        `}
        style={{ height: "100vh", overflowY: "auto" }}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-700 px-4">
          {sidebarOpen && (
            <>
              <span className="font-semibold text-xl truncate">Muhammad Ali Karyana Store</span>
              {isMobile && (
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              )}
            </>
          )}
          {!sidebarOpen && !isMobile && <span className="font-semibold text-xl mx-auto">MK</span>}
        </div>

        <nav className="flex-grow overflow-y-auto py-4">
          <ul>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 ${
                  activeTab === "dashboard" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => handleMenuClick("dashboard")}
                aria-label="Dashboard"
              >
                <FaHome className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
                {sidebarOpen && <span>Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 ${
                  activeTab === "inventory" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => handleMenuClick("inventory")}
                aria-label="Inventory"
              >
                <FaBox className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
                {sidebarOpen && <span>Inventory</span>}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 ${
                  activeTab === "sales" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => handleMenuClick("sales")}
                aria-label="Sales"
              >
                <FaShoppingCart className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
                {sidebarOpen && <span>Sales</span>}
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full px-4 py-3 ${
                  activeTab === "loans" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => handleMenuClick("loans")}
                aria-label="Loans"
              >
                <FaHandHoldingUsd className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
                {sidebarOpen && <span>Loans</span>}
              </button>
            </li>
          </ul>
        </nav>

        <div className="border-t border-gray-700 p-4 mt-auto">
          {sidebarOpen && (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                <span>MA</span>
              </div>
              <div>
                <p className="text-sm font-medium">Store Admin</p>
              </div>
            </div>
          )}
          {!sidebarOpen && !isMobile && (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span>MA</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}



// "use client"

// import { FaBox, FaShoppingCart, FaHome, FaTimes } from "react-icons/fa"

// export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, isMobile }) {
//   // Handle closing sidebar when clicking a menu item on mobile
//   const handleMenuClick = (tab) => {
//     setActiveTab(tab)
//     if (isMobile) {
//       setSidebarOpen(false)
//     }
//   }

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && sidebarOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
//       )}

//       <aside
//         className={`
//           fixed top-0 left-0 z-50 h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out
//           ${sidebarOpen ? "w-64" : "w-0 md:w-20"} 
//           ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
//           flex flex-col
//         `}
//       >
//         <div className="flex h-14 items-center justify-between border-b border-gray-700 px-4">
//           {sidebarOpen && (
//             <>
//               <span className="font-semibold text-xl truncate">Muhammad Ali Karyana Store</span>
//               {isMobile && (
//                 <button
//                   className="text-gray-400 hover:text-white"
//                   onClick={() => setSidebarOpen(false)}
//                   aria-label="Close sidebar"
//                 >
//                   <FaTimes className="h-5 w-5" />
//                 </button>
//               )}
//             </>
//           )}
//           {!sidebarOpen && !isMobile && <span className="font-semibold text-xl mx-auto">MK</span>}
//         </div>

//         <nav className="flex-grow overflow-y-auto py-4">
//           <ul>
//             <li>
//               <button
//                 className={`flex items-center w-full px-4 py-3 ${
//                   activeTab === "dashboard" ? "bg-gray-700" : "hover:bg-gray-700"
//                 }`}
//                 onClick={() => handleMenuClick("dashboard")}
//                 aria-label="Dashboard"
//               >
//                 <FaHome className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
//                 {sidebarOpen && <span>Dashboard</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`flex items-center w-full px-4 py-3 ${
//                   activeTab === "inventory" ? "bg-gray-700" : "hover:bg-gray-700"
//                 }`}
//                 onClick={() => handleMenuClick("inventory")}
//                 aria-label="Inventory"
//               >
//                 <FaBox className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
//                 {sidebarOpen && <span>Inventory</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 className={`flex items-center w-full px-4 py-3 ${
//                   activeTab === "sales" ? "bg-gray-700" : "hover:bg-gray-700"
//                 }`}
//                 onClick={() => handleMenuClick("sales")}
//                 aria-label="Sales"
//               >
//                 <FaShoppingCart className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`} />
//                 {sidebarOpen && <span>Sales</span>}
//               </button>
//             </li>
//           </ul>
//         </nav>

//         <div className="border-t border-gray-700 p-4 mt-auto">
//           {sidebarOpen && (
//             <div className="flex items-center">
//               <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
//                 <span>MA</span>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Store Admin</p>
//               </div>
//             </div>
//           )}
//           {!sidebarOpen && !isMobile && (
//             <div className="flex justify-center">
//               <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
//                 <span>MA</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* Main content wrapper with padding for sidebar */}
//       <div
//         className={`transition-all duration-300 ease-in-out ${
//           !isMobile && sidebarOpen ? "ml-64" : !isMobile && !sidebarOpen ? "ml-20" : "ml-0"
//         }`}
//       ></div>
//     </>
//   )
// }



