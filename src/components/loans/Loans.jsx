import { useState, useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import toast from "react-hot-toast"
import { loanAPI } from "../../services/api"
import LoanTable from "./LoanTable"
import LoanForm from "./LoanForm"
import PaymentForm from "./PaymentForm"
import LoanDetailsDialog from "./LoanDetailsDialog"

export default function Loans({ isMobile }) {
  const [loans, setLoans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isLoanDetailsOpen, setIsLoanDetailsOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [editingLoan, setEditingLoan] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [customerFilter, setCustomerFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    fetchLoans()
  }, [customerFilter, statusFilter, dateFilter])

  const fetchLoans = async () => {
    setIsLoading(true)
    try {
      const params = {}
      if (customerFilter) params.customerName = customerFilter
      if (statusFilter) params.status = statusFilter
      if (dateFilter !== "all") {
        const now = new Date()
        if (dateFilter === "today") {
          params.startDate = now.toISOString().split("T")[0]
          params.endDate = now.toISOString().split("T")[0]
        } else if (dateFilter === "thisWeek") {
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          params.startDate = weekStart.toISOString().split("T")[0]
          params.endDate = now.toISOString().split("T")[0]
        } else if (dateFilter === "thisMonth") {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
          params.startDate = monthStart.toISOString().split("T")[0]
          params.endDate = now.toISOString().split("T")[0]
        }
      }
      const loansData = await loanAPI.getAll(params)
      setLoans(loansData || [])
    } catch (error) {
      console.error("Error fetching loans:", error)
      toast.error("Failed to fetch loans")
      setLoans([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLoan = async (loanData) => {
    try {
      const createdLoan = await loanAPI.create(loanData)
      setLoans([createdLoan, ...loans])
      toast.success("Loan created successfully")
      setIsLoanDialogOpen(false)
    } catch (error) {
      console.error("Error creating loan:", error)
      toast.error(error.response?.data?.message || "Failed to create loan")
    }
  }

  const handleUpdateLoan = async (loanData) => {
    try {
      const updatedLoan = await loanAPI.update(editingLoan._id, loanData)
      setLoans(loans.map((l) => (l._id === updatedLoan._id ? updatedLoan : l)))
      toast.success("Loan updated successfully")
      setIsLoanDialogOpen(false)
      setEditingLoan(null)
    } catch (error) {
      console.error("Error updating loan:", error)
      toast.error(error.response?.data?.message || "Failed to update loan")
    }
  }

  const handleDeleteLoan = async (id) => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      try {
        await loanAPI.delete(id)
        setLoans(loans.filter((l) => l._id !== id))
        toast.success("Loan deleted successfully")
        setIsLoanDetailsOpen(false)
      } catch (error) {
        console.error("Error deleting loan:", error)
        toast.error("Failed to delete loan")
      }
    }
  }

  const handleAddPayment = async (paymentData) => {
    try {
      const updatedLoan = await loanAPI.addPayment(selectedLoan._id, paymentData)
      setLoans(loans.map((l) => (l._id === updatedLoan._id ? updatedLoan : l)))
      if (selectedLoan) {
        setSelectedLoan(updatedLoan)
      }
      toast.success("Payment added successfully")
      setIsPaymentDialogOpen(false)
    } catch (error) {
      console.error("Error adding payment:", error)
      toast.error(error.response?.data?.message || "Failed to add payment")
    }
  }

  const handleDeletePayment = async (loanId, paymentId) => {
    try {
      const updatedLoan = await loanAPI.deletePayment(loanId, paymentId)
      setLoans(loans.map((l) => (l._id === updatedLoan._id ? updatedLoan : l)))
      if (selectedLoan && selectedLoan._id === loanId) {
        setSelectedLoan(updatedLoan)
      }
      return updatedLoan
    } catch (error) {
      console.error("Error deleting payment:", error)
      throw error
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setCustomerFilter("")
    setStatusFilter("")
    setDateFilter("all")
  }

  const handleGeneratePDF = async () => {
    try {
      const params = {}
      if (customerFilter) params.customerName = customerFilter
      if (statusFilter) params.status = statusFilter
      if (dateFilter === "today") {
        const today = new Date().toISOString().split("T")[0]
        params.filterType = "daily"
        params.startDate = today
      } else if (dateFilter === "thisMonth") {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        params.filterType = "monthly"
        params.startDate = monthStart.toISOString().split("T")[0]
      } else if (dateFilter === "thisWeek") {
        const now = new Date()
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        params.startDate = weekStart.toISOString().split("T")[0]
        params.endDate = now.toISOString().split("T")[0]
      }
      await loanAPI.generatePDF(params)
      toast.success("PDF generated successfully")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error(error.response?.data?.message || "Failed to generate PDF")
    }
  }

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan)
    setIsLoanDetailsOpen(true)
  }

  const handleEdit = (loan) => {
    setEditingLoan(loan)
    setIsLoanDialogOpen(true)
  }

  const handleAddPaymentClick = (loan) => {
    setSelectedLoan(loan)
    setIsPaymentDialogOpen(true)
  }

  // Filter loans based on search term
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = loan.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Loan Management</h1>
        <button
          className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full md:w-auto justify-center md:justify-start"
          onClick={() => {
            setEditingLoan(null)
            setIsLoanDialogOpen(true)
          }}
        >
          <FaPlus className="mr-2 h-4 w-4" /> New Loan
        </button>
      </div>

      <LoanTable
        loans={loans}
        filteredLoans={filteredLoans}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDeleteLoan}
        onAddPayment={handleAddPaymentClick}
        onGeneratePDF={handleGeneratePDF}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        customerFilter={customerFilter}
        onCustomerFilterChange={setCustomerFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onClearFilters={handleClearFilters}
        isMobile={isMobile}
      />

      {/* Loan Form Dialog */}
      {isLoanDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingLoan ? "Edit Loan" : "Create New Loan"}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setIsLoanDialogOpen(false)
                    setEditingLoan(null)
                  }}
                >
                  ✕
                </button>
              </div>
              <LoanForm
                loan={editingLoan}
                onSave={editingLoan ? handleUpdateLoan : handleCreateLoan}
                onCancel={() => {
                  setIsLoanDialogOpen(false)
                  setEditingLoan(null)
                }}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Form Dialog */}
      {isPaymentDialogOpen && selectedLoan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Payment</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setIsPaymentDialogOpen(false)
                    setSelectedLoan(null)
                  }}
                >
                  ✕
                </button>
              </div>
              <PaymentForm
                loan={selectedLoan}
                onSave={handleAddPayment}
                onCancel={() => {
                  setIsPaymentDialogOpen(false)
                  setSelectedLoan(null)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Loan Details Dialog */}
      {selectedLoan && (
        <LoanDetailsDialog
          loan={selectedLoan}
          isOpen={isLoanDetailsOpen}
          setIsOpen={setIsLoanDetailsOpen}
          onAddPayment={handleAddPaymentClick}
          onDeletePayment={handleDeletePayment}
          onDeleteLoan={handleDeleteLoan}
        />
      )}
    </div>
  )
}

