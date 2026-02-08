import { FaEdit, FaTrash, FaEye, FaMoneyBillWave, FaFilePdf, FaTimes } from "react-icons/fa"
import AutocompleteSelect from "../AutocompleteSelect"

export default function LoanTable({
  loans,
  filteredLoans,
  onViewDetails,
  onEdit,
  onDelete,
  onAddPayment,
  onGeneratePDF,
  searchTerm,
  onSearchChange,
  customerFilter,
  onCustomerFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters,
  isMobile,
}) {
  // Prepare options for autocomplete selects
  const customerOptions = [
    { value: "", label: "All Customers" },
    ...[...new Set(loans.map((l) => l.customerName))].map((name) => ({
      value: name,
      label: name,
    })),
  ]

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Paid", label: "Paid" },
    { value: "Overdue", label: "Overdue" },
  ]

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "thisWeek", label: "This Week" },
    { value: "thisMonth", label: "This Month" },
  ]

  const hasActiveFilters =
    searchTerm || customerFilter || statusFilter || dateFilter !== "all"
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">Loans</h2>
          <div className="flex flex-col md:flex-row gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[200px]"
            />
            <AutocompleteSelect
              value={customerFilter}
              onChange={onCustomerFilterChange}
              options={customerOptions}
              placeholder="All Customers"
              className="min-w-[180px]"
              searchable={true}
            />
            <AutocompleteSelect
              value={statusFilter}
              onChange={onStatusFilterChange}
              options={statusOptions}
              placeholder="All Status"
              className="min-w-[140px]"
              searchable={false}
            />
            <AutocompleteSelect
              value={dateFilter}
              onChange={onDateFilterChange}
              options={dateOptions}
              placeholder="All Time"
              className="min-w-[140px]"
              searchable={false}
            />
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm flex items-center gap-2"
                title="Clear all filters"
              >
                <FaTimes className="h-4 w-4" />
                <span className="hidden md:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onGeneratePDF}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center gap-2"
            >
              <FaFilePdf className="h-4 w-4" />
              <span className="hidden md:inline">Generate PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isMobile ? (
          <div className="divide-y divide-gray-200">
            {filteredLoans.map((loan) => {
              const totalPaid = loan.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
              const remaining = loan.loanAmount - totalPaid
              return (
                <div key={loan._id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{loan.customerName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(loan.loanDate).toLocaleDateString()}
                      </p>
                    </div>
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
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Loan:</span>
                      <span className="ml-1 font-medium">PKR {loan.loanAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Paid:</span>
                      <span className="ml-1 font-medium text-green-600">
                        PKR {totalPaid.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Remaining:</span>
                      <span className="ml-1 font-medium text-red-600">
                        PKR {remaining.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Progress:</span>
                      <span className="ml-1 font-medium">
                        {((totalPaid / loan.loanAmount) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewDetails(loan)}
                      className="flex-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm flex items-center justify-center gap-1"
                    >
                      <FaEye className="h-3 w-3" />
                      View
                    </button>
                    <button
                      onClick={() => onGeneratePDF({ loanId: loan._id })}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      title="Generate Receipt"
                    >
                      <FaFilePdf className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onAddPayment(loan)}
                      className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm flex items-center justify-center gap-1"
                    >
                      <FaMoneyBillWave className="h-3 w-3" />
                      Payment
                    </button>
                    <button
                      onClick={() => onEdit(loan)}
                      className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                    >
                      <FaEdit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onDelete(loan._id)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => {
                const totalPaid = loan.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
                const remaining = loan.loanAmount - totalPaid
                return (
                  <tr key={loan._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{loan.customerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(loan.loanDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        PKR {loan.loanAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600 font-medium">
                        PKR {totalPaid.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600 font-medium">
                        PKR {remaining.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          loan.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : loan.status === "Overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewDetails(loan)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onGeneratePDF({ loanId: loan._id })}
                          className="text-red-600 hover:text-red-900"
                          title="Generate Receipt"
                        >
                          <FaFilePdf className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onAddPayment(loan)}
                          className="text-green-600 hover:text-green-900"
                          title="Add Payment"
                        >
                          <FaMoneyBillWave className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(loan)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(loan._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {filteredLoans.length === 0 && (
        <div className="p-8 text-center text-gray-500">No loans found</div>
      )}
    </div>
  )
}

