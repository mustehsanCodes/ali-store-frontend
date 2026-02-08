import { useState, useRef, useEffect } from "react"
import { FaChevronDown, FaTimes } from "react-icons/fa"

export default function AutocompleteSelect({
  value,
  onChange,
  options, // Array of { label, value }
  placeholder = "Select...",
  className = "",
  searchable = true,
  clearable = true,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(
        (option) =>
          option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : ""

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm("")
    if (inputRef.current) {
      inputRef.current.blur() // Remove focus from input after selection
    }
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange("")
    setSearchTerm("")
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    setIsOpen(true) // Open dropdown when typing
    onChange("") // Clear selected value when typing
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`flex items-center justify-between w-full rounded-md border ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:bg-gray-50"
        } border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
      >
        {searchable ? (
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm || displayValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="flex-grow bg-transparent focus:outline-none"
            disabled={disabled}
          />
        ) : (
          <span
            className={`flex-grow ${!value ? "text-gray-500" : ""}`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            {displayValue || placeholder}
          </span>
        )}

        {clearable && value && !disabled && (
          <span
            onClick={handleClear}
            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
            aria-label="Clear selection"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleClear(e)
              }
            }}
          >
            <FaTimes className="h-3 w-3" />
          </span>
        )}
        <FaChevronDown
          className={`ml-2 h-4 w-4 text-gray-400 ${disabled ? "" : "cursor-pointer"}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
