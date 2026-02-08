import { useState } from "react"
import toast from "react-hot-toast"
import AutocompleteSelect from "../AutocompleteSelect"

export default function PaymentForm({ loan, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    paymentMethod: "Cash",
  })

  const remainingAmount = loan ? loan.loanAmount - (loan.payments?.reduce((sum, p) => sum + p.amount, 0) || 0) : 0

  const handleSubmit = (e) => {
    e.preventDefault()

    const amount = parseFloat(formData.amount)
    if (!amount || amount <= 0) {
      toast.error("Payment amount must be greater than 0")
      return
    }

    if (amount > remainingAmount) {
      toast.error(`Payment amount cannot exceed remaining amount (PKR ${remainingAmount.toLocaleString()})`)
      return
    }

    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loan && (
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Remaining Amount:</span> PKR {remainingAmount.toLocaleString()}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (PKR) *</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          max={remainingAmount}
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
        <AutocompleteSelect
          value={formData.paymentMethod}
          onChange={(method) => setFormData({ ...formData, paymentMethod: method })}
          options={[
            { value: "Cash", label: "Cash" },
            { value: "Card", label: "Card" },
            { value: "Bank Transfer", label: "Bank Transfer" },
          ]}
          placeholder="Select payment method"
          className="w-full"
          searchable={false}
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
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Payment
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

