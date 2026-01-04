/**
 * EmployeeModal Component
 * Modal form for creating and editing employees
 * Includes auth user search with debouncing
 */

import { useState, useEffect, type FormEvent } from 'react';
import UserSearchSection from './UserSearchSection';
import type { Employee, User, Gender } from '../../../utils/types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Employee) => void;
  employee?: Employee | null; // If provided, modal is in edit mode
  isLoading?: boolean;
}

const EmployeeModal = ({ isOpen, onClose, onSubmit, employee, isLoading = false }: EmployeeModalProps) => {
  const isEditMode = !!employee;

  // Selected auth user state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /**
   * Converts ISO datetime string to date-only format (YYYY-MM-DD)
   * HTML date inputs require YYYY-MM-DD format
   * @param isoString - ISO datetime string (e.g., "2026-01-04T02:25:02.556138Z")
   * @returns Date string in YYYY-MM-DD format or empty string
   */
  const formatDateForInput = (isoString: string | null | undefined): string => {
    if (!isoString) return '';
    // Extract just the date portion (first 10 characters: YYYY-MM-DD)
    return isoString.substring(0, 10);
  };

  // Employee form data state
  const [formData, setFormData] = useState({
    gender: '', // Set to empty string, as Gender is only a type
    birthDate: '',
    address: '',
    contactNumber: '',
    position: '',
    hourlyRate: 0,
    joinedDate: '',
    resignedDate: '',
    description: '',
    isActive: true,
  });

  const [error, setError] = useState('');

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (employee) {
      // Edit mode: populate form with employee data
      // Convert ISO datetime strings to date-only format for date inputs
      setFormData({
        gender: employee.gender || '',
        birthDate: formatDateForInput(employee.birthDate),
        address: employee.address || '',
        contactNumber: employee.contactNumber || '',
        position: employee.position || '',
        hourlyRate: employee.hourlyRate || 0,
        joinedDate: formatDateForInput(employee.joinedDate),
        resignedDate: formatDateForInput(employee.resignedDate),
        description: employee.description || '',
        isActive: employee.isActive ?? true,
      });

      // Set the user from employee data for display
      if (employee.user) {
        setSelectedUser({
          id: employee.user.id,
          firstName: employee.user.firstName,
          lastName: employee.user.lastName,
          email: employee.user.email,
          username: '', // May not be available from employee.user
          isActive: true,
        });
      }
    } else {
      // Create mode: reset form
      setFormData({
        gender: '',
        birthDate: '',
        address: '',
        contactNumber: '',
        position: '',
        hourlyRate: 0,
        joinedDate: '',
        resignedDate: '',
        description: '',
        isActive: true,
      });
      setSelectedUser(null);
    }
    setError('');
  }, [employee, isOpen]);

  /**
   * Handles auth user selection
   */
  const handleUserSelect = (user: User | null) => {
    setSelectedUser(user);
    if (error) setError('');
  };

  /**
   * Handles form input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle number inputs
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (error) setError('');
  };

  /**
   * Validates form data
   */
  const validateForm = (): string | null => {
    // Validate user selection for create mode
    if (!isEditMode && !selectedUser) {
      return 'Please search and select an auth user first';
    }

    if (!formData.gender) return 'Gender is required';
    if (!formData.birthDate) return 'Birth date is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.contactNumber.trim()) return 'Contact number is required';
    if (!formData.position.trim()) return 'Position is required';
    if (formData.hourlyRate <= 0) return 'Hourly rate must be greater than 0';
    if (!formData.joinedDate) return 'Joined date is required';

    return null;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Build the complete data with user_id
    const submitData: Employee = {
      user: {
        id: selectedUser?.id || employee?.user?.id || 0,
        firstName: selectedUser?.firstName || employee?.user?.firstName || '',
        lastName: selectedUser?.lastName || employee?.user?.lastName || '',
        email: selectedUser?.email || employee?.user?.email || '',
        username: selectedUser?.username || employee?.user?.username || '',
        isActive: selectedUser?.isActive || employee?.user?.isActive || true,
      },
      gender: formData.gender as Gender,
      birthDate: formData.birthDate,
      address: formData.address,
      contactNumber: formData.contactNumber,
      position: formData.position,
      hourlyRate: formData.hourlyRate,
      joinedDate: formData.joinedDate,
      resignedDate: formData.resignedDate || null,
      description: formData.description || '',
      isActive: formData.isActive,
      id: employee?.id || 0,
    };

    onSubmit(submitData);
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setError('');
    setSelectedUser(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? '✏️ Edit Employee' : '👤 Add New Employee'}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Auth User Search Section */}
          <UserSearchSection
            onUserSelect={handleUserSelect}
            selectedUser={selectedUser}
            isEditMode={isEditMode}
            disabled={isLoading}
          />

          {/* Divider */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              📋 Employee Details
            </h3>
          </div>

          {/* Gender and Birth Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Birth Date *
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, Anytown, Country"
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          {/* Contact Number and Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contact Number *
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Manager, Worker"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Hourly Rate and Joined Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Hourly Rate ($) *
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="25.00"
                min="0"
                step="0.01"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Joined Date *
              </label>
              <input
                type="date"
                name="joinedDate"
                value={formData.joinedDate}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Resigned Date and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Resigned Date
              </label>
              <input
                type="date"
                name="resignedDate"
                value={formData.resignedDate}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status *
              </label>
              <select
                name="isActive"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isActive: e.target.value === 'true'
                }))}
                className="input-field bg-slate-700 border-slate-600 text-white"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes about the employee..."
              rows={3}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isLoading || (!isEditMode && !selectedUser)}
              className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Employee' : 'Create Employee'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
