/**
 * EmployeeRecordModal Component
 * Modal form for creating and editing employee records
 * Includes employee search with debouncing
 */

import { useState, useEffect, type FormEvent } from 'react';
import EmployeeSearchSection from './EmployeeSearchSection';
import type { EmployeeRecord, EmployeebasicDetails } from '../../../utils/types';
import type { CreateEmployeeRecordData } from '../../../services/employeeRecordsService';

interface EmployeeRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmployeeRecordData) => void;
  employeeRecord?: EmployeeRecord | null;
  isLoading?: boolean;
}

const EmployeeRecordModal = ({ isOpen, onClose, onSubmit, employeeRecord, isLoading = false }: EmployeeRecordModalProps) => {
  const isEditMode = !!employeeRecord;

  // Selected employee state
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeebasicDetails | null>(null);

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hours: '',
    otHours: '0',
    remarks: '',
  });

  const [error, setError] = useState('');

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (employeeRecord) {
      setFormData({
        year: employeeRecord.year || new Date().getFullYear(),
        month: employeeRecord.month || new Date().getMonth() + 1,
        day: employeeRecord.day || new Date().getDate(),
        hours: employeeRecord.hours || '',
        otHours: employeeRecord.otHours || '0',
        remarks: employeeRecord.remarks || '',
      });

      // Set employee placeholder for edit mode (ID only from employeeRecord)
      if (employeeRecord.user) {
        setSelectedEmployee({
          id: employeeRecord.user,
          userId: employeeRecord.user,
          firstName: 'Employee',
          lastName: `#${employeeRecord.user}`,
          username: '',
          position: '',
          contactNumber: '',
        });
      }
    } else {
      // Reset form for create mode
      setFormData({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hours: '',
        otHours: '0',
        remarks: '',
      });
      setSelectedEmployee(null);
    }
    setError('');
  }, [employeeRecord, isOpen]);

  /**
   * Handles employee selection
   */
  const handleEmployeeSelect = (employee: EmployeebasicDetails | null) => {
    setSelectedEmployee(employee);
    if (error) setError('');
  };

  /**
   * Handles form input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (error) setError('');
  };

  /**
   * Validates form data
   */
  const validateForm = (): string | null => {
    if (!isEditMode && !selectedEmployee) {
      return 'Please search and select an employee first';
    }
    if (!formData.year || formData.year < 2000 || formData.year > 2100) {
      return 'Please enter a valid year (2000-2100)';
    }
    if (!formData.month || formData.month < 1 || formData.month > 12) {
      return 'Please enter a valid month (1-12)';
    }
    if (!formData.day || formData.day < 1 || formData.day > 31) {
      return 'Please enter a valid day (1-31)';
    }
    if (!formData.hours || parseFloat(formData.hours) < 0) {
      return 'Please enter valid hours';
    }
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

    const submitData: CreateEmployeeRecordData = {
      user: selectedEmployee?.userId || employeeRecord?.user || 0,
      year: formData.year,
      month: formData.month,
      day: formData.day,
      hours: formData.hours,
      otHours: formData.otHours,
      remarks: formData.remarks,
    };

    onSubmit(submitData);
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setError('');
    setSelectedEmployee(null);
    onClose();
  };

  /**
   * Formats date for display
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Generate month options
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? '✏️ Edit Employee Record' : '📝 Add New Employee Record'}
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

          {/* Employee Search Section */}
          <EmployeeSearchSection
            onEmployeeSelect={handleEmployeeSelect}
            selectedEmployee={selectedEmployee}
            isEditMode={isEditMode}
            disabled={isLoading}
          />

          {/* Divider */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              📅 Work Date
            </h3>
          </div>

          {/* Year, Month, Day */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2100"
                className="input-field bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Month *
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Day *
              </label>
              <input
                type="number"
                name="day"
                value={formData.day}
                onChange={handleChange}
                min="1"
                max="31"
                className="input-field bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              ⏱️ Work Hours
            </h3>
          </div>

          {/* Hours and OT Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Regular Hours *
              </label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                placeholder="8.0"
                min="0"
                step="0.5"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                OT Hours
              </label>
              <input
                type="number"
                name="otHours"
                value={formData.otHours}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.5"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Additional notes about this work record..."
              rows={3}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
            />
          </div>

          {/* Readonly timestamps for edit mode */}
          {isEditMode && employeeRecord && (
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-3">📅 Timestamps</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Created At</p>
                  <p className="text-white">{formatDate(employeeRecord.createdAt)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Updated At</p>
                  <p className="text-white">{formatDate(employeeRecord.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isLoading || (!isEditMode && !selectedEmployee)}
              className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Employee Record' : 'Create Employee Record'
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

export default EmployeeRecordModal;
