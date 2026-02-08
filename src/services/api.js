

// import axios from "axios"

// // const API_URL = "https://musthesan-backend-ncfl.vercel.app/api"
// const API_URL = "http://localhost:5000/api"

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Product API calls
// export const productAPI = {
//   getAll: async () => {
//     const response = await api.get("/products")
//     return response.data.data
//   },

//   getById: async (id) => {
//     const response = await api.get(`/products/${id}`)
//     return response.data.data
//   },

//   create: async (productData) => {
//     const response = await api.post("/products", productData)
//     return response.data.data
//   },

//   update: async (id, productData) => {
//     const response = await api.put(`/products/${id}`, productData)
//     return response.data.data
//   },

//   delete: async (id) => {
//     const response = await api.delete(`/products/${id}`)
//     return response.data
//   },

//   getLowStock: async () => {
//     const response = await api.get("/products/low-stock")
//     return response.data.data
//   },
// }

// // Sale API calls
// export const saleAPI = {
//   getAll: async () => {
//     const response = await api.get("/sales")
//     return response.data.data
//   },

//   getById: async (id) => {
//     const response = await api.get(`/sales/${id}`)
//     return response.data.data
//   },

//   create: async (saleData) => {
//     const response = await api.post("/sales", saleData)
//     return response.data.data
//   },

//   update: async (id, saleData) => {
//     const response = await api.put(`/sales/${id}`, saleData)
//     return response.data.data
//   },

//   delete: async (id) => {
//     const response = await api.delete(`/sales/${id}`)
//     return response.data
//   },

//   getByDateRange: async (startDate, endDate) => {
//     const response = await api.get(`/sales/date-range?startDate=${startDate}&endDate=${endDate}`)
//     return response.data.data
//   },

//   getToday: async () => {
//     const response = await api.get("/sales/today")
//     return response.data.data
//   },
// }

// // Dashboard API calls
// export const dashboardAPI = {
//   getStats: async () => {
//     const response = await api.get("/dashboard/stats")
//     return response.data.data
//   },

//   getSalesChartData: async (period = "week") => {
//     const response = await api.get(`/dashboard/sales-chart?period=${period}`)
//     return response.data.data
//   },

//   getStockChartData: async () => {
//     const response = await api.get("/dashboard/stock-chart")
//     return response.data.data
//   },

//   getCategoryDistribution: async () => {
//     const response = await api.get("/dashboard/category-distribution")
//     return response.data.data
//   },
// }

// export default api

import axios from "axios"

//  const API_URL = "https://musthesan-backend-ncfl.vercel.app/api"
// const API_URL = "http://localhost:5000/api"
const API_URL = "https://ali-store-karyana.vercel.app/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Product API calls
export const productAPI = {
  getAll: async () => {
    const response = await api.get("/products")
    return response.data.data
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data.data
  },

  create: async (productData) => {
    const response = await api.post("/products", productData)
    return response.data.data
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data.data
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  getLowStock: async () => {
    const response = await api.get("/products/low-stock")
    return response.data.data
  },
}

// Sale API calls
export const saleAPI = {
  getAll: async () => {
    const response = await api.get("/sales")
    return response.data.data
  },

  getById: async (id) => {
    const response = await api.get(`/sales/${id}`)
    return response.data.data
  },

  create: async (saleData) => {
    const response = await api.post("/sales", saleData)
    return response.data.data
  },

  update: async (id, saleData) => {
    const response = await api.put(`/sales/${id}`, saleData)
    return response.data.data
  },

  delete: async (id) => {
    const response = await api.delete(`/sales/${id}`)
    return response.data
  },

  getByDateRange: async (startDate, endDate) => {
    const response = await api.get(`/sales/date-range?startDate=${startDate}&endDate=${endDate}`)
    return response.data.data
  },

  getToday: async () => {
    const response = await api.get("/sales/today")
    return response.data.data
  },
   createManual: async (saleData) => {
    const response = await api.post("/sales/manual", saleData)
    return response.data.data
  },
  getManualSales: async () => {
    const response = await api.get("/sales/manual")
    return response.data.data
  },
}

// Dashboard API calls
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get("/dashboard/stats")
    return response.data.data
  },

  getSalesChartData: async (period = "week") => {
    const response = await api.get(`/dashboard/sales-chart?period=${period}`)
    return response.data.data
  },

  getStockChartData: async () => {
    const response = await api.get("/dashboard/stock-chart")
    return response.data.data
  },

  getCategoryDistribution: async () => {
    const response = await api.get("/dashboard/category-distribution")
    return response.data.data
  },

  getDailySalesData: async () => {
    const response = await api.get("/dashboard/daily-sales")
    return response.data.data
  },
}

// Loan API calls
export const loanAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/loans${queryParams ? `?${queryParams}` : ""}`)
    return response.data.data
  },

  getById: async (id) => {
    const response = await api.get(`/loans/${id}`)
    return response.data.data
  },

  create: async (loanData) => {
    const response = await api.post("/loans", loanData)
    return response.data.data
  },

  update: async (id, loanData) => {
    const response = await api.put(`/loans/${id}`, loanData)
    return response.data.data
  },

  delete: async (id) => {
    const response = await api.delete(`/loans/${id}`)
    return response.data
  },

  addPayment: async (id, paymentData) => {
    const response = await api.post(`/loans/${id}/payments`, paymentData)
    return response.data.data
  },

  deletePayment: async (loanId, paymentId) => {
    const response = await api.delete(`/loans/${loanId}/payments/${paymentId}`)
    return response.data.data
  },

  getByDateRange: async (startDate, endDate, customerName) => {
    const params = new URLSearchParams({ startDate, endDate })
    if (customerName) params.append("customerName", customerName)
    const response = await api.get(`/loans/date-range?${params.toString()}`)
    return response.data.data
  },

  generatePDF: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await api.get(`/loans/generate-pdf?${queryParams}`, {
        responseType: "blob",
      })
      
      // Check if response is actually a PDF
      if (response.data.type && response.data.type !== "application/pdf") {
        // If it's JSON (error), parse it
        const text = await response.data.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || "Failed to generate PDF")
        } catch (e) {
          throw new Error("Failed to generate PDF")
        }
      }
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      
      // Generate filename based on params
      let filename = "loan-report"
      if (params.loanId) {
        filename = "loan-receipt"
      } else if (params.customerName) {
        filename = `loan-report-${params.customerName}`
      }
      link.download = `${filename}-${Date.now()}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error("PDF generation error:", error)
      // If it's a blob error, try to parse it
      if (error.response && error.response.data) {
        const blob = error.response.data
        if (blob instanceof Blob) {
          blob.text().then((text) => {
            try {
              const errorData = JSON.parse(text)
              throw new Error(errorData.message || "Failed to generate PDF")
            } catch (e) {
              throw error
            }
          })
        }
      }
      throw error
    }
  },
}

export default api
