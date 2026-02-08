import Dashboard from "./components/Dashboard"
import Footer from "./components/Footer"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <div className="App min-h-screen bg-gray-50 flex flex-col">
      <Dashboard />
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 2000,
            style: {
              background: "#22c55e",
              color: "#fff",
            },
          },
          error: {
            duration: 2000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
    </div>
  )
}

export default App



// import Dashboard from "./components/Dashboard"
// import { Toaster } from "react-hot-toast"

// function App() {
//   return (
//     <div className="App min-h-screen bg-gray-50">
//       <Dashboard />
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: "#363636",
//             color: "#fff",
//           },
//           success: {
//             duration: 3000,
//             style: {
//               background: "#22c55e",
//               color: "#fff",
//             },
//           },
//           error: {
//             duration: 4000,
//             style: {
//               background: "#ef4444",
//               color: "#fff",
//             },
//           },
//         }}
//       />
//     </div>
//   )
// }

// export default App

