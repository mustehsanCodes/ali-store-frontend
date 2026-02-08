import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export default function LoanForm({ loan, onSave, onCancel, isMobile }) {
  const [formData, setFormData] = useState({
    customerName: "",
    loanAmount: "",
    loanDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    description: "",
    interestRate: 0,
  })

  useEffect(() => {
    if (loan) {
      setFormData({
        customerName: loan.customerName || "",
        loanAmount: loan.loanAmount || "",
        loanDate: loan.loanDate ? new Date(loan.loanDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        dueDate: loan.dueDate ? new Date(loan.dueDate).toISOString().split("T")[0] : "",
        description: loan.description || "",
        interestRate: loan.interestRate || 0,
      })
    }
  }, [loan])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.customerName.trim()) {
      toast.error("Customer name is required")
      return
    }

    if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) {
      toast.error("Loan amount must be greater than 0")
      return
    }

    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (PKR) *</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={formData.loanAmount}
          onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Date *</label>
        <input
          type="date"
          value={formData.loanDate}
          onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.interestRate}
          onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loan ? "Update Loan" : "Create Loan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

