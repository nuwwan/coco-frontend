/**
 * BuyerSearchSection Component
 * Search and select buyers for output husk order creation
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import buyerService from '../../../services/buyerService';
import type { Buyer } from '../../../utils/types';

interface BuyerSearchSectionProps {
  onBuyerSelect: (buyer: Buyer | null) => void;
  selectedBuyer: Buyer | null;
  isEditMode: boolean;
  disabled?: boolean;
}

const BuyerSearchSection = ({
  onBuyerSelect,
  selectedBuyer,
  isEditMode,
  disabled = false,
}: BuyerSearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Buyer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query (300ms delay)
  const debouncedQuery = useDebounce(searchQuery, 300);

  /**
   * Search buyers when debounced query changes
   */
  useEffect(() => {
    const searchBuyers = async () => {
      // Don't search if query is too short
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const response = await buyerService.search(debouncedQuery);
        setSearchResults(response.data.results);
        setShowDropdown(response.data.results.length > 0);
      } catch (err) {
        const errorMessage = err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Failed to search buyers';
        setError(errorMessage);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchBuyers();
  }, [debouncedQuery]);

  /**
   * Handles buyer selection from dropdown
   */
  const handleSelectBuyer = (buyer: Buyer) => {
    onBuyerSelect(buyer);
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  /**
   * Clears the selected buyer
   */
  const handleClearSelection = () => {
    onBuyerSelect(null);
    setSearchQuery('');
  };

  // If in edit mode, show the selected buyer as read-only
  if (isEditMode && selectedBuyer) {
    return (
      <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
        <label className="block text-sm font-medium text-slate-400 mb-2">
          🏭 Buyer
        </label>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg">
            {selectedBuyer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-lg">
              {selectedBuyer.name}
            </p>
            <p className="text-slate-400 text-sm">{selectedBuyer.contactNumber}</p>
            <p className="text-slate-500 text-xs">{selectedBuyer.email}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        🔍 Search & Select Buyer *
      </label>

      {/* Selected Buyer Display */}
      {selectedBuyer ? (
        <div className="p-4 bg-amber-900/30 border border-amber-700 rounded-lg mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
                {selectedBuyer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">
                  {selectedBuyer.name}
                </p>
                <p className="text-amber-400 text-sm">{selectedBuyer.contactNumber}</p>
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
              placeholder="Type buyer name, email, or contact to search..."
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
                {searchResults.map((buyer) => (
                  <button
                    key={buyer.id}
                    type="button"
                    onClick={() => handleSelectBuyer(buyer)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-700 transition-colors text-left border-b border-slate-700 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold">
                      {buyer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {buyer.name}
                      </p>
                      <p className="text-slate-400 text-sm truncate">{buyer.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-slate-400 text-xs">{buyer.contactNumber}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Helper Text */}
          {!selectedBuyer && searchQuery.length === 0 && (
            <p className="mt-2 text-slate-500 text-xs">
              Search for an existing buyer to create an output husk order
            </p>
          )}

          {/* No Results */}
          {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
            <p className="mt-2 text-amber-400 text-xs">
              No buyers found matching "{searchQuery}"
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

export default BuyerSearchSection;

