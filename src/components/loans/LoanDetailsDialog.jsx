import { FaTimes, FaMoneyBillWave, FaTrash, FaFilePdf } from "react-icons/fa"
import toast from "react-hot-toast"
import { loanAPI } from "../../services/api"

export default function LoanDetailsDialog({
  loan,
  isOpen,
  setIsOpen,
  onAddPayment,
  onDeletePayment,
  onDeleteLoan,
}) {
  if (!isOpen || !loan) return null

  const totalPaid = loan.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
  const remaining = loan.loanAmount - totalPaid
  const paymentPercentage = (totalPaid / loan.loanAmount) * 100

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await onDeletePayment(loan._id, paymentId)
        toast.success("Payment deleted successfully")
      } catch (error) {
        toast.error("Failed to delete payment")
      }
    }
  }

  const handleGenerateReceipt = async () => {
    try {
      await loanAPI.generatePDF({ loanId: loan._id })
      toast.success("Receipt generated successfully")
    } catch (error) {
      console.error("Error generating receipt:", error)
      toast.error("Failed to generate receipt")
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Loan Details</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer Name</label>
                <p className="text-lg font-semibold">{loan.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      loan.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : loan.status === "Overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {loan.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Loan Date</label>
                <p>{new Date(loan.loanDate).toLocaleDateString()}</p>
              </div>
              {loan.dueDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <p>{new Date(loan.dueDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Loan Amount</label>
                <p className="text-lg font-semibold">PKR {loan.loanAmount.toLocaleString()}</p>
              </div>
              {loan.interestRate > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Interest Rate</label>
                  <p>{loan.interestRate}%</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <label className="text-sm font-medium text-gray-500 block">Total Paid</label>
                  <p className="text-lg font-semibold text-green-600">
                    PKR {totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <label className="text-sm font-medium text-gray-500 block">Remaining</label>
                  <p className="text-lg font-semibold text-red-600">
                    PKR {remaining.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <label className="text-sm font-medium text-gray-500 block">Progress</label>
                  <p className="text-lg font-semibold text-blue-600">
                    {paymentPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${paymentPercentage}%` }}
                ></div>
              </div>
            </div>

            {loan.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-700">{loan.description}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Payment History</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateReceipt}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  >
                    <FaFilePdf className="h-4 w-4" />
                    Generate Receipt
                  </button>
                  <button
                    onClick={() => onAddPayment(loan)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <FaMoneyBillWave className="h-4 w-4" />
                    Add Payment
                  </button>
                </div>
              </div>

              {loan.payments && loan.payments.length > 0 ? (
                <div className="space-y-2">
                  {loan.payments.map((payment, index) => (
                    <div
                      key={payment._id || index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">PKR {payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()} - {payment.paymentMethod}
                        </p>
                        {payment.description && (
                          <p className="text-sm text-gray-600 mt-1">{payment.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeletePayment(payment._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Payment"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No payments recorded yet</p>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => onDeleteLoan(loan._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Loan
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

