"use client"

import { useState, useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import toast from "react-hot-toast"
import Sidebar from "./Sidebar"
import Header from "./Header"
import DashboardCards from "./DashboardCards"
import SalesChart from "./SalesChart"
import StockChart from "./StockChart"
import InventoryTable from "./InventoryTable"
import SalesTable from "./SalesTable"
import ProductForm from "./ProductForm"
import SaleForm from "./SaleForm"
import ProductDetailsDialog from "./ProductDetailsDialog"
import SaleDetailsDialog from "./SaleDetailsDialog"
import { productAPI, saleAPI, dashboardAPI } from "../services/api"
import SaleEditForm from "./SaleEditForm"
import DashboardFilters from "./DashboardFilters"
import DailySalesTable from "./DailySalesTable"
import ManualSaleForm from "./ManualSaleForm"
import Loans from "./loans/Loans"
import AutocompleteSelect from "./AutocompleteSelect"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
  })
  const [salesChartData, setSalesChartData] = useState([])
  const [stockChartData, setStockChartData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [chartPeriod, setChartPeriod] = useState("week")
  const [showLowStockNotification, setShowLowStockNotification] = useState(false)
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)
  const [isSaleDetailsOpen, setIsSaleDetailsOpen] = useState(false)
  const [productsForSale, setProductsForSale] = useState([])
  const [dailySalesData, setDailySalesData] = useState([])
  const [isManualSaleDialogOpen, setIsManualSaleDialogOpen] = useState(false)

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    minimumStock: 2, // Default minimum stock level
    unit: "count",
  })

  // Edit product state
  const [editingProduct, setEditingProduct] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Add state for editing sales
  const [isEditSaleDialogOpen, setIsEditSaleDialogOpen] = useState(false)
  const [editingSale, setEditingSale] = useState(null)

  // Add these new state variables in the Dashboard component
  const [isEditManualSaleDialogOpen, setIsEditManualSaleDialogOpen] = useState(false)
  const [editingManualSale, setEditingManualSale] = useState(null)

  // Check for mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    // Initial check
    checkIsMobile()

    // Add event listener
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Pre-fetch products when the component mounts
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const productsData = await productAPI.getAll()
        setProducts(productsData)
        setProductsForSale(productsData)
      } catch (error) {
        console.error("Error fetching initial products:", error)
      }
    }

    fetchInitialProducts()
  }, [])

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (activeTab === "dashboard") {
          // Fetch dashboard data
          const stats = await dashboardAPI.getStats()
          setDashboardStats(
            stats || {
              totalProducts: 0,
              lowStockProducts: 0,
              totalSales: 0,
              totalRevenue: 0,
              totalProfit: 0,
            },
          )

          const chartData = await dashboardAPI.getSalesChartData(chartPeriod)
          setSalesChartData(chartData || [])

          const stockData = await dashboardAPI.getStockChartData()
          setStockChartData(stockData || [])

          const categoryDistribution = await dashboardAPI.getCategoryDistribution()
          setCategoryData(categoryDistribution || [])

          // Fetch sales for the sales table
          const salesData = await saleAPI.getAll()
          setSales(salesData || [])

          // Fetch products for stock chart
          const productsData = await productAPI.getAll()
          setProducts(productsData || [])
          setProductsForSale(productsData || [])

          // Check for products with stock below their minimum threshold
          // Only show notification if there are products with stock below their minimum threshold
          const productsWithLowStock = productsData.filter((product) => product.stock < product.minimumStock)

          setShowLowStockNotification(productsWithLowStock.length > 0)

          if (productsWithLowStock.length > 0) {
            toast.error(
              `${productsWithLowStock.length} products are below minimum stock threshold. Please check inventory.`,
            )
          }

          // Fetch daily sales data
          const dailySales = await dashboardAPI.getDailySalesData()
          setDailySalesData(dailySales || [])
        } else if (activeTab === "inventory") {
          // Fetch products
          const productsData = await productAPI.getAll()
          setProducts(productsData || [])
          setProductsForSale(productsData || [])
        } else if (activeTab === "sales") {
          // Fetch sales
          const salesData = await saleAPI.getAll()
          setSales(salesData || [])

          // We also need products for the sale form
          const productsData = await productAPI.getAll()
          setProducts(productsData || [])
          setProductsForSale(productsData || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to fetch data. Please try again.")

        // Set default values to prevent errors
        if (activeTab === "dashboard") {
          setDashboardStats({
            totalProducts: 0,
            lowStockProducts: 0,
            totalSales: 0,
            totalRevenue: 0,
            totalProfit: 0,
          })
          setSalesChartData([])
          setStockChartData([])
          setCategoryData([])
        }

        // Ensure we always have arrays even if API calls fail
        setSales([])
        setProducts([])
        setProductsForSale([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeTab, chartPeriod])

  // Fetch products when opening the sale dialog
  useEffect(() => {
    if (isSaleDialogOpen) {
      const fetchProductsForSale = async () => {
        try {
          const productsData = await productAPI.getAll()
          setProductsForSale(productsData)
        } catch (error) {
          console.error("Error fetching products for sale:", error)
          toast.error("Failed to fetch products. Please try again.")
        }
      }

      fetchProductsForSale()
    }
  }, [isSaleDialogOpen])

  // Add new product
  const handleAddProduct = async () => {
    try {
      const createdProduct = await productAPI.create(newProduct)

      setProducts([...products, createdProduct])
      setProductsForSale([...productsForSale, createdProduct])

      setNewProduct({
        name: "",
        category: "",
        purchasePrice: 0,
        salePrice: 0,
        stock: 0,
        minimumStock: 2, // Default minimum stock level
        unit: "count",
      })

      toast.success("New product has been added to inventory.")

      // Close the dialog after adding
      setIsProductDialogOpen(false)
    } catch (error) {
      console.error("Error adding product:", error)
      toast.error(error.response?.data?.message || "Failed to add product. Please try again.")
    }
  }

  // Edit product
  const handleEditProduct = async () => {
    if (!editingProduct) return

    try {
      const updatedProduct = await productAPI.update(editingProduct._id, editingProduct)

      const updatedProducts = products.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
      setProducts(updatedProducts)

      const updatedProductsForSale = productsForSale.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product,
      )
      setProductsForSale(updatedProductsForSale)

      setIsEditDialogOpen(false)
      setEditingProduct(null)

      toast.success("Product information has been updated.")
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error(error.response?.data?.message || "Failed to update product. Please try again.")
    }
  }

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await productAPI.delete(id)

      setProducts(products.filter((product) => product._id !== id))
      setProductsForSale(productsForSale.filter((product) => product._id !== id))

      toast.success("Product has been removed from inventory.")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error(error.response?.data?.message || "Failed to delete product. Please try again.")
    }
  }

  // Add new sale
  const handleAddSale = async (newSaleData) => {
    try {
      // Format the data for the API
      const saleData = {
        items: newSaleData.items,
        paymentMethod: newSaleData.paymentMethod,
      }

      // Create the sale
      const createdSale = await saleAPI.create(saleData)

      // Update the sales list
      setSales([createdSale, ...sales])

      // Refresh products to get updated stock levels
      const updatedProducts = await productAPI.getAll()
      setProducts(updatedProducts)
      setProductsForSale(updatedProducts)

      // Refresh dashboard stats
      if (activeTab === "dashboard") {
        const stats = await dashboardAPI.getStats()
        setDashboardStats(stats)

        // Refresh daily sales data
        const dailySales = await dashboardAPI.getDailySalesData()
        setDailySalesData(dailySales || [])
      }

      toast.success(
        `Sale of PKR ${createdSale.total.toLocaleString()} has been recorded with PKR ${createdSale.profit.toLocaleString()} profit.`,
      )

      // Close the dialog after adding
      setIsSaleDialogOpen(false)
    } catch (error) {
      console.error("Error adding sale:", error)
      toast.error(error.response?.data?.message || "Failed to add sale. Please try again.")
    }
  }

  // Add manual sale
  const handleAddManualSale = async (manualSaleData) => {
    try {
      // Format the data for the API
      const saleData = {
        total: manualSaleData.amount,
        profit: manualSaleData.profit,
        paymentMethod: manualSaleData.paymentMethod,
        description: manualSaleData.description,
        date: manualSaleData.date || new Date(),
        isManual: true,
      }

      // Create the manual sale
      const createdSale = await saleAPI.createManual(saleData)

      // Update the sales list
      setSales([createdSale, ...sales])

      // Refresh dashboard stats
      if (activeTab === "dashboard") {
        const stats = await dashboardAPI.getStats()
        setDashboardStats(stats)

        // Refresh daily sales data
        const dailySales = await dashboardAPI.getDailySalesData()
        setDailySalesData(dailySales || [])
      }

      toast.success(
        `Manual sale of PKR ${createdSale.total.toLocaleString()} has been recorded with PKR ${createdSale.profit.toLocaleString()} profit.`,
      )

      // Close the dialog after adding
      setIsManualSaleDialogOpen(false)
    } catch (error) {
      console.error("Error adding manual sale:", error)
      toast.error(error.response?.data?.message || "Failed to add manual sale. Please try again.")
    }
  }

  // Delete sale
  const handleDeleteSale = async (id) => {
    try {
      await saleAPI.delete(id)

      // Remove the sale from the list
      setSales(sales.filter((sale) => sale._id !== id))

      // Refresh products to get updated stock levels
      const updatedProducts = await productAPI.getAll()
      setProducts(updatedProducts)
      setProductsForSale(updatedProducts)

      // Refresh dashboard stats if on dashboard
      if (activeTab === "dashboard") {
        const stats = await dashboardAPI.getStats()
        setDashboardStats(stats)

        // Refresh daily sales data
        const dailySales = await dashboardAPI.getDailySalesData()
        setDailySalesData(dailySales || [])
      }

      toast.success("Sale has been deleted successfully.")
    } catch (error) {
      console.error("Error deleting sale:", error)
      toast.error(error.response?.data?.message || "Failed to delete sale. Please try again.")
    }
  }

  // Add this function to handle editing manual sales
  const handleEditSale = (sale) => {
    if (sale.isManual) {
      setEditingManualSale(sale)
      setIsEditManualSaleDialogOpen(true)
    } else {
      setEditingSale(sale)
      setIsEditSaleDialogOpen(true)
    }
  }

  // Add the handleUpdateSale function
  const handleUpdateSale = async (updatedSaleData) => {
    try {
      // Format the data for the API
      const saleData = {
        items: updatedSaleData.items,
        paymentMethod: updatedSaleData.paymentMethod,
      }

      // Update the sale
      const updatedSale = await saleAPI.update(editingSale._id, saleData)

      // Update the sales list
      setSales(sales.map((sale) => (sale._id === updatedSale._id ? updatedSale : sale)))

      // Refresh products to get updated stock levels
      const updatedProducts = await productAPI.getAll()
      setProducts(updatedProducts)
      setProductsForSale(updatedProducts)

      // Refresh dashboard stats
      if (activeTab === "dashboard") {
        const stats = await dashboardAPI.getStats()
        setDashboardStats(stats)

        // Refresh daily sales data
        const dailySales = await dashboardAPI.getDailySalesData()
        setDailySalesData(dailySales || [])
      }

      toast.success(`Sale has been updated successfully.`)

      // Close the dialog after updating
      setIsEditSaleDialogOpen(false)
      setEditingSale(null)
    } catch (error) {
      console.error("Error updating sale:", error)
      toast.error(error.response?.data?.message || "Failed to update sale. Please try again.")
    }
  }

  // Add this function to update manual sales
  const handleUpdateManualSale = async (updatedSaleData) => {
    try {
      // Format the data for the API
      const saleData = {
        total: updatedSaleData.amount,
        profit: updatedSaleData.profit,
        paymentMethod: updatedSaleData.paymentMethod,
        description: updatedSaleData.description,
        date: updatedSaleData.date || new Date(),
        isManual: true,
      }

      // Update the manual sale
      const updatedSale = await saleAPI.update(updatedSaleData._id, saleData)

      // Update the sales list
      setSales(sales.map((sale) => (sale._id === updatedSale._id ? updatedSale : sale)))

      // Refresh dashboard stats
      if (activeTab === "dashboard") {
        const stats = await dashboardAPI.getStats()
        setDashboardStats(stats)

        // Refresh daily sales data
        const dailySales = await dashboardAPI.getDailySalesData()
        setDailySalesData(dailySales || [])
      }

      toast.success(`Manual sale has been updated successfully.`)

      // Close the dialog after updating
      setIsEditManualSaleDialogOpen(false)
      setEditingManualSale(null)
    } catch (error) {
      console.error("Error updating manual sale:", error)
      toast.error(error.response?.data?.message || "Failed to update manual sale. Please try again.")
    }
  }

  // View product details
  const handleViewProductDetails = (product) => {
    setSelectedProduct(product)
    setIsProductDetailsOpen(true)
  }

  // View sale details
  const handleViewSaleDetails = (sale) => {
    setSelectedSale(sale)
    setIsSaleDetailsOpen(true)
  }

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    if (!product) return false

    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "inStock" && product.stock > 0) ||
      (stockFilter === "lowStock" && product.status === "Low") ||
      (stockFilter === "critical" && product.status === "Critical")

    return matchesSearch && matchesCategory && matchesStock
  })

  // Filter sales based on search and filters
  const filteredSales = sales.filter((sale) => {
    if (!sale) return false

    const matchesSearch =
      sale._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.description && sale.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" &&
        new Date(sale.date).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]) ||
      (dateFilter === "yesterday" &&
        new Date(sale.date).toISOString().split("T")[0] ===
          new Date(Date.now() - 86400000).toISOString().split("T")[0]) ||
      (dateFilter === "thisWeek" && new Date(sale.date) >= new Date(Date.now() - 7 * 86400000))

    const matchesPayment = paymentFilter === "all" || sale.paymentMethod === paymentFilter

    return matchesSearch && matchesDate && matchesPayment
  })

  // Get unique categories for filter
  const categories = [...new Set(products.filter((p) => p && p.category).map((product) => product.category))]

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isMobile && sidebarOpen ? "ml-64" : !isMobile && !sidebarOpen ? "ml-20" : "ml-0"
        }`}
      >
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showLowStockNotification={showLowStockNotification}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-3 md:p-6 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
                    <div className="flex flex-col md:flex-row gap-2">
                      <button
                        className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        onClick={() => setIsSaleDialogOpen(true)}
                      >
                        <FaPlus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden xs:inline">New Sale</span>
                        <span className="xs:hidden">Sale</span>
                      </button>
                      <button
                        className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        onClick={() => setIsManualSaleDialogOpen(true)}
                      >
                        <FaPlus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden xs:inline">Manual Sale</span>
                        <span className="xs:hidden">Manual</span>
                      </button>
                    </div>
                  </div>

                  <DashboardFilters
                    chartPeriod={chartPeriod}
                    setChartPeriod={setChartPeriod}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    categories={categories}
                  />

                  <DashboardCards
                    totalRevenue={dashboardStats.totalRevenue || 0}
                    totalSales={dashboardStats.totalSales || 0}
                    totalProducts={dashboardStats.totalProducts || 0}
                    lowStockProducts={dashboardStats.lowStockProducts || 0}
                    sales={sales || []}
                    products={products || []}
                  />

                  {sales.length > 0 ? (
                    <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                      <div className="col-span-1 lg:col-span-4 bg-white p-3 md:p-4 rounded-lg shadow">
                        <div className="mb-3 md:mb-4">
                          <h2 className="text-base md:text-lg font-medium">Sales Overview</h2>
                        </div>
                        <div className="pl-0 md:pl-2 h-[250px] xs:h-[300px] md:h-[350px]">
                          <SalesChart salesData={salesChartData} period={chartPeriod} />
                        </div>
                      </div>
                      <div className="col-span-1 lg:col-span-3 bg-white p-3 md:p-4 rounded-lg shadow">
                        <div className="mb-3 md:mb-4">
                          <h2 className="text-base md:text-lg font-medium">Stock Levels</h2>
                          <p className="text-xs md:text-sm text-gray-500">Products with low stock</p>
                        </div>
                        <div className="h-[200px] xs:h-[250px] md:h-[300px]">
                          <StockChart products={stockChartData.length > 0 ? stockChartData : products.slice(0, 5)} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                      <div className="mb-4">
                        <h2 className="text-lg font-medium">Getting Started</h2>
                        <p className="text-sm text-gray-500">
                          Start by adding products to your inventory and recording sales
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-base md:text-lg font-medium">1. Add Products</h3>
                          <p className="text-sm text-gray-500">
                            Go to the Inventory tab and add your products with their details.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-base md:text-lg font-medium">2. Record Sales</h3>
                          <p className="text-sm text-gray-500">
                            Use the "New Sale" button to record transactions when you sell products.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-base md:text-lg font-medium">3. Monitor Dashboard</h3>
                          <p className="text-sm text-gray-500">
                            Track your sales and inventory levels from this dashboard.
                          </p>
                        </div>
                        <div className="flex justify-center mt-4">
                          <button
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            onClick={() => setActiveTab("inventory")}
                          >
                            <FaPlus className="mr-2 h-4 w-4" /> Add Your First Product
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {sales.length > 0 && (
                    <div className="bg-white p-3 md:p-4 rounded-lg shadow mt-4">
                      <div className="mb-3 md:mb-4">
                        <h2 className="text-base md:text-lg font-medium">Daily Sales</h2>
                        <p className="text-xs md:text-sm text-gray-500">Sales data for each day</p>
                      </div>
                      <DailySalesTable dailySales={dailySalesData} />
                    </div>
                  )}

                  {sales.length > 0 && (
                    <SalesTable
                      sales={sales}
                      filteredSales={filteredSales}
                      dateFilter={dateFilter}
                      paymentFilter={paymentFilter}
                      setDateFilter={setDateFilter}
                      setPaymentFilter={setPaymentFilter}
                      searchTerm={searchTerm}
                      isMobile={isMobile}
                      onViewDetails={handleViewSaleDetails}
                      onDeleteSale={handleDeleteSale}
                      onEditSale={handleEditSale}
                      onSearchChange={setSearchTerm}
                    />
                  )}
                </div>
              )}

              {activeTab === "inventory" && (
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inventory Management</h1>
                    <button
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full md:w-auto justify-center md:justify-start"
                      onClick={() => setIsProductDialogOpen(true)}
                    >
                      <FaPlus className="mr-2 h-4 w-4" /> Add Product
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full md:w-[250px] px-3 py-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <AutocompleteSelect
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                        options={[
                          { value: "all", label: "All Categories" },
                          ...categories.map((category) => ({ value: category, label: category })),
                        ]}
                        placeholder="All Categories"
                        className="w-full md:w-auto min-w-[180px]"
                        searchable={true}
                      />
                      <AutocompleteSelect
                        value={stockFilter}
                        onChange={setStockFilter}
                        options={[
                          { value: "all", label: "All Stock" },
                          { value: "inStock", label: "In Stock" },
                          { value: "lowStock", label: "Low Stock" },
                          { value: "critical", label: "Critical Stock" },
                        ]}
                        placeholder="All Stock"
                        className="w-full md:w-auto min-w-[140px]"
                        searchable={false}
                      />
                    </div>
                  </div>

                  <InventoryTable
                    products={products}
                    filteredProducts={filteredProducts}
                    handleEditProduct={handleEditProduct}
                    setEditingProduct={setEditingProduct}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    handleDeleteProduct={handleDeleteProduct}
                    onViewDetails={handleViewProductDetails}
                    isMobile={isMobile}
                  />
                </div>
              )}

              {activeTab === "sales" && (
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales Management</h1>
                    <div className="flex flex-col md:flex-row gap-2">
                      <button
                        className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full md:w-auto justify-center md:justify-start"
                        onClick={() => setIsSaleDialogOpen(true)}
                      >
                        <FaPlus className="mr-2 h-4 w-4" /> New Sale
                      </button>
                      <button
                        className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 w-full md:w-auto justify-center md:justify-start"
                        onClick={() => setIsManualSaleDialogOpen(true)}
                      >
                        <FaPlus className="mr-2 h-4 w-4" /> Manual Sale
                      </button>
                    </div>
                  </div>

                  <SalesTable
                    sales={sales}
                    filteredSales={filteredSales}
                    dateFilter={dateFilter}
                    paymentFilter={paymentFilter}
                    setDateFilter={setDateFilter}
                    setPaymentFilter={setPaymentFilter}
                    searchTerm={searchTerm}
                    isMobile={isMobile}
                    onViewDetails={handleViewSaleDetails}
                    onDeleteSale={handleDeleteSale}
                    onEditSale={handleEditSale}
                    onSearchChange={setSearchTerm}
                  />
                </div>
              )}

              {activeTab === "loans" && <Loans isMobile={isMobile} />}
            </>
          )}
        </main>
      </div>

      {/* Product Dialog */}
      {isProductDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Product</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsProductDialogOpen(false)}>
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Enter the details of the new product to add to inventory.</p>
              <ProductForm
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                handleAddProduct={handleAddProduct}
                onSuccess={() => setIsProductDialogOpen(false)}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sale Dialog */}
      {isSaleDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Record New Sale</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsSaleDialogOpen(false)}>
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Enter the details of the new sale transaction.</p>
              <SaleForm
                products={productsForSale}
                onAddSale={handleAddSale}
                onSuccess={() => setIsSaleDialogOpen(false)}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      )}

      {/* Manual Sale Dialog */}
      {isManualSaleDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Record Manual Sale</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsManualSaleDialogOpen(false)}>
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Enter the details of the manual sale transaction.</p>
              <ManualSaleForm
                onAddManualSale={handleAddManualSale}
                onSuccess={() => setIsManualSaleDialogOpen(false)}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Dialog */}
      {isEditDialogOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Product</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsEditDialogOpen(false)}>
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Update the details of the product.</p>
              <ProductForm
                newProduct={editingProduct}
                setNewProduct={(updatedProduct) => setEditingProduct(updatedProduct)}
                handleAddProduct={handleEditProduct}
                onSuccess={() => setIsEditDialogOpen(false)}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Details Dialog */}
      {selectedProduct && (
        <ProductDetailsDialog
          product={selectedProduct}
          isOpen={isProductDetailsOpen}
          setIsOpen={setIsProductDetailsOpen}
        />
      )}

      {/* Sale Details Dialog */}
      {selectedSale && (
        <SaleDetailsDialog
          sale={selectedSale}
          isOpen={isSaleDetailsOpen}
          setIsOpen={setIsSaleDetailsOpen}
          isMobile={isMobile}
          onDeleteSale={handleDeleteSale}
          onEditSale={handleEditSale}
        />
      )}

      {/* Edit Sale Dialog */}
      {isEditSaleDialogOpen && editingSale && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Sale</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsEditSaleDialogOpen(false)}>
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Update the details of this sale.</p>
              <SaleEditForm
                sale={editingSale}
                products={productsForSale}
                onUpdateSale={handleUpdateSale}
                onSuccess={() => setIsEditSaleDialogOpen(false)}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Manual Sale Dialog */}
      {isEditManualSaleDialogOpen && editingManualSale && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Manual Sale</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsEditManualSaleDialogOpen(false)}
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Update the details of this manual sale.</p>
              <ManualSaleForm
                sale={editingManualSale}
                onAddManualSale={handleUpdateManualSale}
                onSuccess={() => setIsEditManualSaleDialogOpen(false)}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating sidebar toggle button for mobile */}
      {isMobile && !sidebarOpen && (
        <button
          className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <FaPlus className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}


// "use client"

// import { useState, useEffect } from "react"
// import { FaPlus } from "react-icons/fa"
// import toast from "react-hot-toast"
// import Sidebar from "./Sidebar"
// import Header from "./Header"
// import DashboardCards from "./DashboardCards"
// import SalesChart from "./SalesChart"
// import StockChart from "./StockChart"
// import InventoryTable from "./InventoryTable"
// import SalesTable from "./SalesTable"
// import ProductForm from "./ProductForm"
// import SaleForm from "./SaleForm"
// import ProductDetailsDialog from "./ProductDetailsDialog"
// import SaleDetailsDialog from "./SaleDetailsDialog"
// import { productAPI, saleAPI, dashboardAPI } from "../services/api"
// import SaleEditForm from "./SaleEditForm"
// import DashboardFilters from "./DashboardFilters"
// import DailySalesTable from "./DailySalesTable"
// import ManualSaleForm from "./ManualSaleForm"

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard")
//   const [products, setProducts] = useState([])
//   const [sales, setSales] = useState([])
//   const [dashboardStats, setDashboardStats] = useState({
//     totalProducts: 0,
//     lowStockProducts: 0,
//     totalSales: 0,
//     totalRevenue: 0,
//     totalProfit: 0,
//   })
//   const [salesChartData, setSalesChartData] = useState([])
//   const [stockChartData, setStockChartData] = useState([])
//   const [categoryData, setCategoryData] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [categoryFilter, setCategoryFilter] = useState("all")
//   const [stockFilter, setStockFilter] = useState("all")
//   const [dateFilter, setDateFilter] = useState("all")
//   const [paymentFilter, setPaymentFilter] = useState("all")
//   const [chartPeriod, setChartPeriod] = useState("week")
//   const [showLowStockNotification, setShowLowStockNotification] = useState(false)
//   const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false)
//   const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false)
//   const [selectedSale, setSelectedSale] = useState(null)
//   const [isSaleDetailsOpen, setIsSaleDetailsOpen] = useState(false)
//   const [productsForSale, setProductsForSale] = useState([])
//   const [dailySalesData, setDailySalesData] = useState([])
//   const [isManualSaleDialogOpen, setIsManualSaleDialogOpen] = useState(false)

//   // New product form state
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     category: "",
//     purchasePrice: 0,
//     salePrice: 0,
//     stock: 0,
//     minimumStock: 2, // Default minimum stock level
//     unit: "count",
//   })

//   // Edit product state
//   const [editingProduct, setEditingProduct] = useState(null)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

//   // Add state for editing sales
//   const [isEditSaleDialogOpen, setIsEditSaleDialogOpen] = useState(false)
//   const [editingSale, setEditingSale] = useState(null)

//   // Add these new state variables in the Dashboard component
//   const [isEditManualSaleDialogOpen, setIsEditManualSaleDialogOpen] = useState(false)
//   const [editingManualSale, setEditingManualSale] = useState(null)

//   // Check for mobile screen size
//   useEffect(() => {
//     const checkIsMobile = () => {
//       const mobile = window.innerWidth < 768
//       setIsMobile(mobile)
//       setSidebarOpen(!mobile)
//     }

//     // Initial check
//     checkIsMobile()

//     // Add event listener
//     window.addEventListener("resize", checkIsMobile)

//     // Cleanup
//     return () => window.removeEventListener("resize", checkIsMobile)
//   }, [])

//   // Pre-fetch products when the component mounts
//   useEffect(() => {
//     const fetchInitialProducts = async () => {
//       try {
//         const productsData = await productAPI.getAll()
//         setProducts(productsData)
//         setProductsForSale(productsData)
//       } catch (error) {
//         console.error("Error fetching initial products:", error)
//       }
//     }

//     fetchInitialProducts()
//   }, [])

//   // Fetch data based on active tab
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true)
//       try {
//         if (activeTab === "dashboard") {
//           // Fetch dashboard data
//           const stats = await dashboardAPI.getStats()
//           setDashboardStats(
//             stats || {
//               totalProducts: 0,
//               lowStockProducts: 0,
//               totalSales: 0,
//               totalRevenue: 0,
//               totalProfit: 0,
//             },
//           )

//           const chartData = await dashboardAPI.getSalesChartData(chartPeriod)
//           setSalesChartData(chartData || [])

//           const stockData = await dashboardAPI.getStockChartData()
//           setStockChartData(stockData || [])

//           const categoryDistribution = await dashboardAPI.getCategoryDistribution()
//           setCategoryData(categoryDistribution || [])

//           // Fetch sales for the sales table
//           const salesData = await saleAPI.getAll()
//           setSales(salesData || [])

//           // Fetch products for stock chart
//           const productsData = await productAPI.getAll()
//           setProducts(productsData || [])
//           setProductsForSale(productsData || [])

//           // Check for low stock
//           const lowStockCount = stats?.lowStockProducts || 0
//           setShowLowStockNotification(lowStockCount > 0)
//           if (lowStockCount > 0) {
//             toast.error(`${lowStockCount} products are running low on stock. Please check inventory.`)
//           }

//           // Fetch daily sales data
//           const dailySales = await dashboardAPI.getDailySalesData()
//           setDailySalesData(dailySales || [])
//         } else if (activeTab === "inventory") {
//           // Fetch products
//           const productsData = await productAPI.getAll()
//           setProducts(productsData || [])
//           setProductsForSale(productsData || [])
//         } else if (activeTab === "sales") {
//           // Fetch sales
//           const salesData = await saleAPI.getAll()
//           setSales(salesData || [])

//           // We also need products for the sale form
//           const productsData = await productAPI.getAll()
//           setProducts(productsData || [])
//           setProductsForSale(productsData || [])
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         toast.error("Failed to fetch data. Please try again.")

//         // Set default values to prevent errors
//         if (activeTab === "dashboard") {
//           setDashboardStats({
//             totalProducts: 0,
//             lowStockProducts: 0,
//             totalSales: 0,
//             totalRevenue: 0,
//             totalProfit: 0,
//           })
//           setSalesChartData([])
//           setStockChartData([])
//           setCategoryData([])
//         }

//         // Ensure we always have arrays even if API calls fail
//         setSales([])
//         setProducts([])
//         setProductsForSale([])
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [activeTab, chartPeriod])

//   // Fetch products when opening the sale dialog
//   useEffect(() => {
//     if (isSaleDialogOpen) {
//       const fetchProductsForSale = async () => {
//         try {
//           const productsData = await productAPI.getAll()
//           setProductsForSale(productsData)
//         } catch (error) {
//           console.error("Error fetching products for sale:", error)
//           toast.error("Failed to fetch products. Please try again.")
//         }
//       }

//       fetchProductsForSale()
//     }
//   }, [isSaleDialogOpen])

//   // Add new product
//   const handleAddProduct = async () => {
//     try {
//       const createdProduct = await productAPI.create(newProduct)

//       setProducts([...products, createdProduct])
//       setProductsForSale([...productsForSale, createdProduct])

//       setNewProduct({
//         name: "",
//         category: "",
//         purchasePrice: 0,
//         salePrice: 0,
//         stock: 0,
//         minimumStock: 2, // Default minimum stock level
//         unit: "count",
//       })

//       toast.success("New product has been added to inventory.")

//       // Close the dialog after adding
//       setIsProductDialogOpen(false)
//     } catch (error) {
//       console.error("Error adding product:", error)
//       toast.error(error.response?.data?.message || "Failed to add product. Please try again.")
//     }
//   }

//   // Edit product
//   const handleEditProduct = async () => {
//     if (!editingProduct) return

//     try {
//       const updatedProduct = await productAPI.update(editingProduct._id, editingProduct)

//       const updatedProducts = products.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
//       setProducts(updatedProducts)

//       const updatedProductsForSale = productsForSale.map((product) =>
//         product._id === updatedProduct._id ? updatedProduct : product,
//       )
//       setProductsForSale(updatedProductsForSale)

//       setIsEditDialogOpen(false)
//       setEditingProduct(null)

//       toast.success("Product information has been updated.")
//     } catch (error) {
//       console.error("Error updating product:", error)
//       toast.error(error.response?.data?.message || "Failed to update product. Please try again.")
//     }
//   }

//   // Delete product
//   const handleDeleteProduct = async (id) => {
//     try {
//       await productAPI.delete(id)

//       setProducts(products.filter((product) => product._id !== id))
//       setProductsForSale(productsForSale.filter((product) => product._id !== id))

//       toast.success("Product has been removed from inventory.")
//     } catch (error) {
//       console.error("Error deleting product:", error)
//       toast.error(error.response?.data?.message || "Failed to delete product. Please try again.")
//     }
//   }

//   // Add new sale
//   const handleAddSale = async (newSaleData) => {
//     try {
//       // Format the data for the API
//       const saleData = {
//         items: newSaleData.items,
//         paymentMethod: newSaleData.paymentMethod,
//       }

//       // Create the sale
//       const createdSale = await saleAPI.create(saleData)

//       // Update the sales list
//       setSales([createdSale, ...sales])

//       // Refresh products to get updated stock levels
//       const updatedProducts = await productAPI.getAll()
//       setProducts(updatedProducts)
//       setProductsForSale(updatedProducts)

//       // Refresh dashboard stats
//       if (activeTab === "dashboard") {
//         const stats = await dashboardAPI.getStats()
//         setDashboardStats(stats)

//         // Refresh daily sales data
//         const dailySales = await dashboardAPI.getDailySalesData()
//         setDailySalesData(dailySales || [])
//       }

//       toast.success(
//         `Sale of PKR ${createdSale.total.toLocaleString()} has been recorded with PKR ${createdSale.profit.toLocaleString()} profit.`,
//       )

//       // Close the dialog after adding
//       setIsSaleDialogOpen(false)
//     } catch (error) {
//       console.error("Error adding sale:", error)
//       toast.error(error.response?.data?.message || "Failed to add sale. Please try again.")
//     }
//   }

//   // Add manual sale
//   const handleAddManualSale = async (manualSaleData) => {
//     try {
//       // Format the data for the API
//       const saleData = {
//         total: manualSaleData.amount,
//         profit: manualSaleData.profit,
//         paymentMethod: manualSaleData.paymentMethod,
//         description: manualSaleData.description,
//         date: manualSaleData.date || new Date(),
//         isManual: true,
//       }

//       // Create the manual sale
//       const createdSale = await saleAPI.createManual(saleData)

//       // Update the sales list
//       setSales([createdSale, ...sales])

//       // Refresh dashboard stats
//       if (activeTab === "dashboard") {
//         const stats = await dashboardAPI.getStats()
//         setDashboardStats(stats)

//         // Refresh daily sales data
//         const dailySales = await dashboardAPI.getDailySalesData()
//         setDailySalesData(dailySales || [])
//       }

//       toast.success(
//         `Manual sale of PKR ${createdSale.total.toLocaleString()} has been recorded with PKR ${createdSale.profit.toLocaleString()} profit.`,
//       )

//       // Close the dialog after adding
//       setIsManualSaleDialogOpen(false)
//     } catch (error) {
//       console.error("Error adding manual sale:", error)
//       toast.error(error.response?.data?.message || "Failed to add manual sale. Please try again.")
//     }
//   }

//   // Delete sale
//   const handleDeleteSale = async (id) => {
//     try {
//       await saleAPI.delete(id)

//       // Remove the sale from the list
//       setSales(sales.filter((sale) => sale._id !== id))

//       // Refresh products to get updated stock levels
//       const updatedProducts = await productAPI.getAll()
//       setProducts(updatedProducts)
//       setProductsForSale(updatedProducts)

//       // Refresh dashboard stats if on dashboard
//       if (activeTab === "dashboard") {
//         const stats = await dashboardAPI.getStats()
//         setDashboardStats(stats)

//         // Refresh daily sales data
//         const dailySales = await dashboardAPI.getDailySalesData()
//         setDailySalesData(dailySales || [])
//       }

//       toast.success("Sale has been deleted successfully.")
//     } catch (error) {
//       console.error("Error deleting sale:", error)
//       toast.error(error.response?.data?.message || "Failed to delete sale. Please try again.")
//     }
//   }

//   // Add this function to handle editing manual sales
//   const handleEditSale = (sale) => {
//     if (sale.isManual) {
//       setEditingManualSale(sale)
//       setIsEditManualSaleDialogOpen(true)
//     } else {
//       setEditingSale(sale)
//       setIsEditSaleDialogOpen(true)
//     }
//   }

//   // Add the handleUpdateSale function
//   const handleUpdateSale = async (updatedSaleData) => {
//     try {
//       // Format the data for the API
//       const saleData = {
//         items: updatedSaleData.items,
//         paymentMethod: updatedSaleData.paymentMethod,
//       }

//       // Update the sale
//       const updatedSale = await saleAPI.update(editingSale._id, saleData)

//       // Update the sales list
//       setSales(sales.map((sale) => (sale._id === updatedSale._id ? updatedSale : sale)))

//       // Refresh products to get updated stock levels
//       const updatedProducts = await productAPI.getAll()
//       setProducts(updatedProducts)
//       setProductsForSale(updatedProducts)

//       // Refresh dashboard stats
//       if (activeTab === "dashboard") {
//         const stats = await dashboardAPI.getStats()
//         setDashboardStats(stats)

//         // Refresh daily sales data
//         const dailySales = await dashboardAPI.getDailySalesData()
//         setDailySalesData(dailySales || [])
//       }

//       toast.success(`Sale has been updated successfully.`)

//       // Close the dialog after updating
//       setIsEditSaleDialogOpen(false)
//       setEditingSale(null)
//     } catch (error) {
//       console.error("Error updating sale:", error)
//       toast.error(error.response?.data?.message || "Failed to update sale. Please try again.")
//     }
//   }

//   // Add this function to update manual sales
//   const handleUpdateManualSale = async (updatedSaleData) => {
//     try {
//       // Format the data for the API
//       const saleData = {
//         total: updatedSaleData.amount,
//         profit: updatedSaleData.profit,
//         paymentMethod: updatedSaleData.paymentMethod,
//         description: updatedSaleData.description,
//         date: updatedSaleData.date || new Date(),
//         isManual: true,
//       }

//       // Update the manual sale
//       const updatedSale = await saleAPI.update(updatedSaleData._id, saleData)

//       // Update the sales list
//       setSales(sales.map((sale) => (sale._id === updatedSale._id ? updatedSale : sale)))

//       // Refresh dashboard stats
//       if (activeTab === "dashboard") {
//         const stats = await dashboardAPI.getStats()
//         setDashboardStats(stats)

//         // Refresh daily sales data
//         const dailySales = await dashboardAPI.getDailySalesData()
//         setDailySalesData(dailySales || [])
//       }

//       toast.success(`Manual sale has been updated successfully.`)

//       // Close the dialog after updating
//       setIsEditManualSaleDialogOpen(false)
//       setEditingManualSale(null)
//     } catch (error) {
//       console.error("Error updating manual sale:", error)
//       toast.error(error.response?.data?.message || "Failed to update manual sale. Please try again.")
//     }
//   }

//   // View product details
//   const handleViewProductDetails = (product) => {
//     setSelectedProduct(product)
//     setIsProductDetailsOpen(true)
//   }

//   // View sale details
//   const handleViewSaleDetails = (sale) => {
//     setSelectedSale(sale)
//     setIsSaleDetailsOpen(true)
//   }

//   // Filter products based on search and filters
//   const filteredProducts = products.filter((product) => {
//     if (!product) return false

//     const matchesSearch =
//       product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.category?.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

//     const matchesStock =
//       stockFilter === "all" ||
//       (stockFilter === "inStock" && product.stock > 0) ||
//       (stockFilter === "lowStock" && product.status === "Low") ||
//       (stockFilter === "critical" && product.status === "Critical")

//     return matchesSearch && matchesCategory && matchesStock
//   })

//   // Filter sales based on search and filters
//   const filteredSales = sales.filter((sale) => {
//     if (!sale) return false

//     const matchesSearch =
//       sale._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (sale.description && sale.description.toLowerCase().includes(searchTerm.toLowerCase()))

//     const matchesDate =
//       dateFilter === "all" ||
//       (dateFilter === "today" &&
//         new Date(sale.date).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]) ||
//       (dateFilter === "yesterday" &&
//         new Date(sale.date).toISOString().split("T")[0] ===
//           new Date(Date.now() - 86400000).toISOString().split("T")[0]) ||
//       (dateFilter === "thisWeek" && new Date(sale.date) >= new Date(Date.now() - 7 * 86400000))

//     const matchesPayment = paymentFilter === "all" || sale.paymentMethod === paymentFilter

//     return matchesSearch && matchesDate && matchesPayment
//   })

//   // Get unique categories for filter
//   const categories = [...new Set(products.filter((p) => p && p.category).map((product) => product.category))]

//   // Toggle sidebar function
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen)
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         isMobile={isMobile}
//       />

//       <div
//         className={`flex-1 flex flex-col transition-all duration-300 ${
//           !isMobile && sidebarOpen ? "ml-64" : !isMobile && !sidebarOpen ? "ml-20" : "ml-0"
//         }`}
//       >
//         <Header
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           showLowStockNotification={showLowStockNotification}
//           setActiveTab={setActiveTab}
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         <main className="p-3 md:p-6 overflow-auto">
//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : (
//             <>
//               {activeTab === "dashboard" && (
//                 <div className="space-y-4 md:space-y-6">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//                     <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
//                     <div className="flex flex-col md:flex-row gap-2">
//                       <button
//                         className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                         onClick={() => setIsSaleDialogOpen(true)}
//                       >
//                         <FaPlus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
//                         <span className="hidden xs:inline">New Sale</span>
//                         <span className="xs:hidden">Sale</span>
//                       </button>
//                       <button
//                         className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
//                         onClick={() => setIsManualSaleDialogOpen(true)}
//                       >
//                         <FaPlus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
//                         <span className="hidden xs:inline">Manual Sale</span>
//                         <span className="xs:hidden">Manual</span>
//                       </button>
//                     </div>
//                   </div>

//                   <DashboardFilters
//                     chartPeriod={chartPeriod}
//                     setChartPeriod={setChartPeriod}
//                     categoryFilter={categoryFilter}
//                     setCategoryFilter={setCategoryFilter}
//                     categories={categories}
//                   />

//                   <DashboardCards
//                     totalRevenue={dashboardStats.totalRevenue || 0}
//                     totalSales={dashboardStats.totalSales || 0}
//                     totalProducts={dashboardStats.totalProducts || 0}
//                     lowStockProducts={dashboardStats.lowStockProducts || 0}
//                     sales={sales || []}
//                     products={products || []}
//                   />

//                   {sales.length > 0 ? (
//                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//                       <div className="col-span-full md:col-span-4 bg-white p-3 md:p-4 rounded-lg shadow">
//                         <div className="mb-3 md:mb-4">
//                           <h2 className="text-base md:text-lg font-medium">Sales Overview</h2>
//                         </div>
//                         <div className="pl-0 md:pl-2 h-[300px] md:h-[350px]">
//                           <SalesChart salesData={salesChartData} period={chartPeriod} />
//                         </div>
//                       </div>
//                       <div className="col-span-full md:col-span-3 bg-white p-3 md:p-4 rounded-lg shadow">
//                         <div className="mb-3 md:mb-4">
//                           <h2 className="text-base md:text-lg font-medium">Stock Levels</h2>
//                           <p className="text-xs md:text-sm text-gray-500">Products with low stock</p>
//                         </div>
//                         <div className="h-[250px] md:h-[300px]">
//                           <StockChart products={stockChartData.length > 0 ? stockChartData : products.slice(0, 5)} />
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-white p-4 md:p-6 rounded-lg shadow">
//                       <div className="mb-4">
//                         <h2 className="text-lg font-medium">Getting Started</h2>
//                         <p className="text-sm text-gray-500">
//                           Start by adding products to your inventory and recording sales
//                         </p>
//                       </div>
//                       <div className="flex flex-col gap-4">
//                         <div className="flex flex-col gap-2">
//                           <h3 className="text-base md:text-lg font-medium">1. Add Products</h3>
//                           <p className="text-sm text-gray-500">
//                             Go to the Inventory tab and add your products with their details.
//                           </p>
//                         </div>
//                         <div className="flex flex-col gap-2">
//                           <h3 className="text-base md:text-lg font-medium">2. Record Sales</h3>
//                           <p className="text-sm text-gray-500">
//                             Use the "New Sale" button to record transactions when you sell products.
//                           </p>
//                         </div>
//                         <div className="flex flex-col gap-2">
//                           <h3 className="text-base md:text-lg font-medium">3. Monitor Dashboard</h3>
//                           <p className="text-sm text-gray-500">
//                             Track your sales and inventory levels from this dashboard.
//                           </p>
//                         </div>
//                         <div className="flex justify-center mt-4">
//                           <button
//                             className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                             onClick={() => setActiveTab("inventory")}
//                           >
//                             <FaPlus className="mr-2 h-4 w-4" /> Add Your First Product
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {sales.length > 0 && (
//                     <div className="bg-white p-3 md:p-4 rounded-lg shadow mt-4">
//                       <div className="mb-3 md:mb-4">
//                         <h2 className="text-base md:text-lg font-medium">Daily Sales</h2>
//                         <p className="text-xs md:text-sm text-gray-500">Sales data for each day</p>
//                       </div>
//                       <DailySalesTable dailySales={dailySalesData} />
//                     </div>
//                   )}

//                   {sales.length > 0 && (
//                     <SalesTable
//                       sales={sales}
//                       filteredSales={filteredSales}
//                       dateFilter={dateFilter}
//                       paymentFilter={paymentFilter}
//                       setDateFilter={setDateFilter}
//                       setPaymentFilter={setPaymentFilter}
//                       searchTerm={searchTerm}
//                       isMobile={isMobile}
//                       onViewDetails={handleViewSaleDetails}
//                       onDeleteSale={handleDeleteSale}
//                       onEditSale={handleEditSale}
//                       onSearchChange={setSearchTerm}
//                     />
//                   )}
//                 </div>
//               )}

//               {activeTab === "inventory" && (
//                 <div className="space-y-4 md:space-y-6">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//                     <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inventory Management</h1>
//                     <button
//                       className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full md:w-auto justify-center md:justify-start"
//                       onClick={() => setIsProductDialogOpen(true)}
//                     >
//                       <FaPlus className="mr-2 h-4 w-4" /> Add Product
//                     </button>
//                   </div>

//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
//                     <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
//                       <input
//                         type="text"
//                         placeholder="Search products..."
//                         className="w-full md:w-[250px] px-3 py-2 border border-gray-300 rounded-md"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                       <div className="relative w-full md:w-auto">
//                         <select
//                           className="w-full md:w-auto appearance-none flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
//                           value={categoryFilter}
//                           onChange={(e) => setCategoryFilter(e.target.value)}
//                         >
//                           <option value="all">All Categories</option>
//                           {categories.map((category) => (
//                             <option key={category} value={category}>
//                               {category}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="relative w-full md:w-auto">
//                         <select
//                           className="w-full md:w-auto appearance-none flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
//                           value={stockFilter}
//                           onChange={(e) => setStockFilter(e.target.value)}
//                         >
//                           <option value="all">All Stock</option>
//                           <option value="inStock">In Stock</option>
//                           <option value="lowStock">Low Stock</option>
//                           <option value="critical">Critical Stock</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   <InventoryTable
//                     products={products}
//                     filteredProducts={filteredProducts}
//                     handleEditProduct={handleEditProduct}
//                     setEditingProduct={setEditingProduct}
//                     setIsEditDialogOpen={setIsEditDialogOpen}
//                     handleDeleteProduct={handleDeleteProduct}
//                     onViewDetails={handleViewProductDetails}
//                     isMobile={isMobile}
//                   />
//                 </div>
//               )}

//               {activeTab === "sales" && (
//                 <div className="space-y-4 md:space-y-6">
//                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//                     <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales Management</h1>
//                     <div className="flex flex-col md:flex-row gap-2">
//                       <button
//                         className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full md:w-auto justify-center md:justify-start"
//                         onClick={() => setIsSaleDialogOpen(true)}
//                       >
//                         <FaPlus className="mr-2 h-4 w-4" /> New Sale
//                       </button>
//                       <button
//                         className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 w-full md:w-auto justify-center md:justify-start"
//                         onClick={() => setIsManualSaleDialogOpen(true)}
//                       >
//                         <FaPlus className="mr-2 h-4 w-4" /> Manual Sale
//                       </button>
//                     </div>
//                   </div>

//                   <SalesTable
//                     sales={sales}
//                     filteredSales={filteredSales}
//                     dateFilter={dateFilter}
//                     paymentFilter={paymentFilter}
//                     setDateFilter={setDateFilter}
//                     setPaymentFilter={setPaymentFilter}
//                     searchTerm={searchTerm}
//                     isMobile={isMobile}
//                     onViewDetails={handleViewSaleDetails}
//                     onDeleteSale={handleDeleteSale}
//                     onEditSale={handleEditSale}
//                     onSearchChange={setSearchTerm}
//                   />
//                 </div>
//               )}
//             </>
//           )}
//         </main>
//       </div>

//       {/* Product Dialog */}
//       {isProductDialogOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-4 md:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Add New Product</h2>
//                 <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsProductDialogOpen(false)}>
//                   ✕
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mb-4">Enter the details of the new product to add to inventory.</p>
//               <ProductForm
//                 newProduct={newProduct}
//                 setNewProduct={setNewProduct}
//                 handleAddProduct={handleAddProduct}
//                 onSuccess={() => setIsProductDialogOpen(false)}
//                 isMobile={isMobile}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Sale Dialog */}
//       {isSaleDialogOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-4 md:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Record New Sale</h2>
//                 <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsSaleDialogOpen(false)}>
//                   ✕
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mb-4">Enter the details of the new sale transaction.</p>
//               <SaleForm
//                 products={productsForSale}
//                 onAddSale={handleAddSale}
//                 onSuccess={() => setIsSaleDialogOpen(false)}
//                 isMobile={isMobile}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Manual Sale Dialog */}
//       {isManualSaleDialogOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-4 md:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Record Manual Sale</h2>
//                 <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsManualSaleDialogOpen(false)}>
//                   ✕
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mb-4">Enter the details of the manual sale transaction.</p>
//               <ManualSaleForm
//                 onAddManualSale={handleAddManualSale}
//                 onSuccess={() => setIsManualSaleDialogOpen(false)}
//                 isMobile={isMobile}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Product Dialog */}
//       {isEditDialogOpen && editingProduct && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-4 md:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Edit Product</h2>
//                 <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsEditDialogOpen(false)}>
//                   ✕
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mb-4">Update the details of the product.</p>
//               <ProductForm
//                 newProduct={editingProduct}
//                 setNewProduct={(updatedProduct) => setEditingProduct(updatedProduct)}
//                 handleAddProduct={handleEditProduct}
//                 onSuccess={() => setIsEditDialogOpen(false)}
//                 isMobile={isMobile}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Details Dialog */}
//       {selectedProduct && (
//         <ProductDetailsDialog
//           product={selectedProduct}
//           isOpen={isProductDetailsOpen}
//           setIsOpen={setIsProductDetailsOpen}
//         />
//       )}

//       {/* Sale Details Dialog */}
//       {selectedSale && (
//         <SaleDetailsDialog
//           sale={selectedSale}
//           isOpen={isSaleDetailsOpen}
//           setIsOpen={setIsSaleDetailsOpen}
//           isMobile={isMobile}
//           onDeleteSale={handleDeleteSale}
//           onEditSale={handleEditSale}
//         />
//       )}

//       {/* Edit Sale Dialog */}
//       {isEditSaleDialogOpen && editingSale && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-4 md:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Edit Sale</h2>
//                 <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsEditSaleDialogOpen(false)}>
//                   ✕
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mb-4">Update the details of this sale.</p>
//               <SaleEditForm
//                 sale={editingSale}
//                 products={productsForSale}
//                 onUpdateSale={handleUpdateSale}
//                 onSuccess={() => setIsEditSaleDialogOpen(false)}
//                 isMobile={isMobile}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Manual Sale Dialog */}
//       {isEditManualSaleDialogOpen && editingManualSale && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-4 md:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Edit Manual Sale</h2>
//                 <button
//                   className="text-gray-500 hover:text-gray-700"
//                   onClick={() => setIsEditManualSaleDialogOpen(false)}
//                 >
//                   ✕
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mb-4">Update the details of this manual sale.</p>
//               <ManualSaleForm
//                 sale={editingManualSale}
//                 onAddManualSale={handleUpdateManualSale}
//                 onSuccess={() => setIsEditManualSaleDialogOpen(false)}
//                 isMobile={isMobile}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Floating sidebar toggle button for mobile */}
//       {isMobile && !sidebarOpen && (
//         <button
//           className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg"
//           onClick={toggleSidebar}
//           aria-label="Open sidebar"
//         >
//           <FaPlus className="h-5 w-5" />
//         </button>
//       )}
//     </div>
//   )
// }
