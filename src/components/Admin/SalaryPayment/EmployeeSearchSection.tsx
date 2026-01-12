/**
 * EmployeeSearchSection Component
 * Search and select employees for employee record creation
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import employeeService from '../../../services/employeeService';
import type { EmployeebasicDetails } from '../../../utils/types';

interface EmployeeSearchSectionProps {
  onEmployeeSelect: (employee: EmployeebasicDetails | null) => void;
  selectedEmployee: EmployeebasicDetails | null;
  isEditMode: boolean;
  disabled?: boolean;
}

const EmployeeSearchSection = ({
  onEmployeeSelect,
  selectedEmployee,
  isEditMode,
  disabled = false,
}: EmployeeSearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EmployeebasicDetails[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query (300ms delay)
  const debouncedQuery = useDebounce(searchQuery, 300);

  /**
   * Search employees when debounced query changes
   */
  useEffect(() => {
    const searchEmployees = async () => {
      // Don't search if query is too short
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const response = await employeeService.search(debouncedQuery);
        setSearchResults(response.data || []);
        setShowDropdown((response.data || []).length > 0);
      } catch (err) {
        const errorMessage = err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Failed to search employees';
        setError(errorMessage);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchEmployees();
  }, [debouncedQuery]);

  /**
   * Handles employee selection from dropdown
   */
  const handleSelectEmployee = (employee: EmployeebasicDetails) => {
    onEmployeeSelect(employee);
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  /**
   * Clears the selected employee
   */
  const handleClearSelection = () => {
    onEmployeeSelect(null);
    setSearchQuery('');
  };

  /**
   * Gets employee display name
   */
  const getEmployeeName = (employee: EmployeebasicDetails): string => {
    return `${employee.firstName} ${employee.lastName}`;
  };

  /**
   * Gets employee initials
   */
  const getEmployeeInitials = (employee: EmployeebasicDetails): string => {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
  };

  // If in edit mode, show the selected employee as read-only
  if (isEditMode && selectedEmployee) {
    return (
      <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
        <label className="block text-sm font-medium text-slate-400 mb-2">
          👤 Employee
        </label>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {getEmployeeInitials(selectedEmployee)}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-lg">
              {getEmployeeName(selectedEmployee)}
            </p>
            <p className="text-slate-400 text-sm">{selectedEmployee.position}</p>
          </div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              'bg-emerald-500/20 text-emerald-400'
            }`}>
              Active
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        🔍 Search & Select Employee *
      </label>

      {/* Selected Employee Display */}
      {selectedEmployee ? (
        <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {getEmployeeInitials(selectedEmployee)}
              </div>
              <div>
                <p className="text-white font-medium">
                  {getEmployeeName(selectedEmployee)}
                </p>
                <p className="text-blue-400 text-sm">{selectedEmployee.position}</p>
              </div>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-slate-400 hover:text-red-400 transition-colors p-1"
                title="Remove selection"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type employee name or position to search..."
              disabled={disabled}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
            />
            
            {/* Search Icon / Spinner */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              ) : (
                <span className="text-slate-400">🔍</span>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {searchResults.map((employee) => (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() => handleSelectEmployee(employee)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-700 transition-colors text-left border-b border-slate-700 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {getEmployeeInitials(employee)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {getEmployeeName(employee)}
                      </p>
                      <p className="text-slate-400 text-sm truncate">{employee.position}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      Active
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Helper Text */}
          {!selectedEmployee && searchQuery.length === 0 && (
            <p className="mt-2 text-slate-500 text-xs">
              Search for an employee to create a work record
            </p>
          )}

          {/* No Results */}
          {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
            <p className="mt-2 text-amber-400 text-xs">
              No employees found matching "{searchQuery}"
            </p>
          )}
        </>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
};

export default EmployeeSearchSection;

