/**
 * SupplierSearchSection Component
 * Search and select suppliers for input husk lot creation
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import supplierService from '../../../services/supplierService';
import type { Supplier } from '../../../utils/types';

interface SupplierSearchSectionProps {
  onSupplierSelect: (supplier: Supplier | null) => void;
  selectedSupplier: Supplier | null;
  isEditMode: boolean;
  disabled?: boolean;
}

const SupplierSearchSection = ({
  onSupplierSelect,
  selectedSupplier,
  isEditMode,
  disabled = false,
}: SupplierSearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Supplier[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query (300ms delay)
  const debouncedQuery = useDebounce(searchQuery, 300);

  /**
   * Search suppliers when debounced query changes
   */
  useEffect(() => {
    const searchSuppliers = async () => {
      // Don't search if query is too short
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const response = await supplierService.search(debouncedQuery);
        setSearchResults(response.data.results);
        setShowDropdown(response.data.results.length > 0);
      } catch (err) {
        const errorMessage = err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Failed to search suppliers';
        setError(errorMessage);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchSuppliers();
  }, [debouncedQuery]);

  /**
   * Handles supplier selection from dropdown
   */
  const handleSelectSupplier = (supplier: Supplier) => {
    onSupplierSelect(supplier);
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  /**
   * Clears the selected supplier
   */
  const handleClearSelection = () => {
    onSupplierSelect(null);
    setSearchQuery('');
  };

  // If in edit mode, show the selected supplier as read-only
  if (isEditMode && selectedSupplier) {
    return (
      <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
        <label className="block text-sm font-medium text-slate-400 mb-2">
          🏭 Supplier
        </label>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg">
            {selectedSupplier.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-lg">
              {selectedSupplier.name}
            </p>
            <p className="text-slate-400 text-sm">{selectedSupplier.contactNumber}</p>
            <p className="text-slate-500 text-xs">{selectedSupplier.email}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        🔍 Search & Select Supplier *
      </label>

      {/* Selected Supplier Display */}
      {selectedSupplier ? (
        <div className="p-4 bg-amber-900/30 border border-amber-700 rounded-lg mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
                {selectedSupplier.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">
                  {selectedSupplier.name}
                </p>
                <p className="text-amber-400 text-sm">{selectedSupplier.contactNumber}</p>
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
              placeholder="Type supplier name, email, or contact to search..."
              disabled={disabled}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
            />
            
            {/* Search Icon / Spinner */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
              ) : (
                <span className="text-slate-400">🔍</span>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {searchResults.map((supplier) => (
                  <button
                    key={supplier.id}
                    type="button"
                    onClick={() => handleSelectSupplier(supplier)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-700 transition-colors text-left border-b border-slate-700 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold">
                      {supplier.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {supplier.name}
                      </p>
                      <p className="text-slate-400 text-sm truncate">{supplier.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-slate-400 text-xs">{supplier.contactNumber}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Helper Text */}
          {!selectedSupplier && searchQuery.length === 0 && (
            <p className="mt-2 text-slate-500 text-xs">
              Search for an existing supplier to create an input husk lot
            </p>
          )}

          {/* No Results */}
          {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
            <p className="mt-2 text-amber-400 text-xs">
              No suppliers found matching "{searchQuery}"
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

export default SupplierSearchSection;

