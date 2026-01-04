/**
 * UserSearchSection Component
 * Search and select auth users for employee creation
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import userService from '../../../services/userService';
import type { User } from '../../../utils/types';

interface UserSearchSectionProps {
  onUserSelect: (user: User) => void;
  selectedUser: User | null;
  isEditMode: boolean;
  disabled?: boolean;
}

const UserSearchSection = ({
  onUserSelect,
  selectedUser,
  isEditMode,
  disabled = false,
}: UserSearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query (300ms delay)
  const debouncedQuery = useDebounce(searchQuery, 300);

  /**
   * Search users when debounced query changes
   */
  useEffect(() => {
    const searchUsers = async () => {
      // Don't search if query is too short or in edit mode
      if (debouncedQuery.length < 2 || isEditMode) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const response = await userService.search(debouncedQuery);
        setSearchResults(response.data.users);
        setShowDropdown(response.data.users.length > 0);
      } catch (err) {
        const errorMessage = err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Failed to search users';
        setError(errorMessage);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchUsers();
  }, [debouncedQuery, isEditMode]);

  /**
   * Handles user selection from dropdown
   */
  const handleSelectUser = (user: User) => {
    onUserSelect(user);
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  /**
   * Clears the selected user
   */
  const handleClearSelection = () => {
    onUserSelect(null as unknown as User);
    setSearchQuery('');
  };

  // If in edit mode, show the selected user as read-only
  if (isEditMode && selectedUser) {
    return (
      <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
        <label className="block text-sm font-medium text-slate-400 mb-2">
          👤 Assigned User
        </label>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium text-lg">
              {selectedUser.firstName} {selectedUser.lastName}
            </p>
            <p className="text-slate-400 text-sm">@{selectedUser.username}</p>
            <p className="text-slate-500 text-xs">{selectedUser.email}</p>
          </div>
          <div className="ml-auto">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedUser.isActive 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {selectedUser.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        🔍 Search & Select Auth User *
      </label>

      {/* Selected User Display */}
      {selectedUser ? (
        <div className="p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-emerald-400 text-sm">@{selectedUser.username}</p>
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
              placeholder="Type username, name, or email to search..."
              disabled={disabled}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
            />
            
            {/* Search Icon / Spinner */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
              ) : (
                <span className="text-slate-400">🔍</span>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-700 transition-colors text-left border-b border-slate-700 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-slate-400 text-sm truncate">@{user.username}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      user.isActive 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Helper Text */}
          {!selectedUser && searchQuery.length === 0 && (
            <p className="mt-2 text-slate-500 text-xs">
              Search for an existing user to create an employee profile
            </p>
          )}

          {/* No Results */}
          {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
            <p className="mt-2 text-amber-400 text-xs">
              No users found matching "{searchQuery}"
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

export default UserSearchSection;

