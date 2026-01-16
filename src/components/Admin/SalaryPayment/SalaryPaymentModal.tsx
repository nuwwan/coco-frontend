/**
 * EmployeeRecordModal Component
 * Modal form for creating and editing employee records
 * Includes employee search with debouncing
 */

import { useState, useEffect, type FormEvent } from 'react';
import EmployeeSearchSection from './EmployeeSearchSection';
import type { EmployeebasicDetails, SalaryPayment } from '../../../utils/types';
import type { CreateSalaryPaymentData } from '../../../services/salaryPaymentService';

interface SalaryPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSalaryPaymentData) => void;
  salaryPayment?: SalaryPayment | null;
  isLoading?: boolean;
}

const SalaryPaymentModal = ({ isOpen, onClose, onSubmit, salaryPayment, isLoading = false }: SalaryPaymentModalProps) => {
  const isEditMode = !!salaryPayment;

  // Selected employee state
  const [selectedSalaryPayment, setSelectedSalaryPayment] = useState<SalaryPayment | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeebasicDetails | null>(null);

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    salary: '',
    remarks: '',
    status: 'pending',
  });

  const [error, setError] = useState('');

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (salaryPayment) {
      setFormData({
        startDate: salaryPayment.startDate || new Date().toISOString(),
        endDate: salaryPayment.endDate || new Date().toISOString(),
        salary: salaryPayment.salary || '',
        remarks: salaryPayment.remarks || '',
        status: salaryPayment.status || 'pending',
      });

      // Set salary payment placeholder for edit mode (ID only from salaryPayment)
      if (salaryPayment.id) {
        setSelectedEmployee({
          id: salaryPayment.user,
          userId: salaryPayment.user,
          firstName: 'Employee',
          lastName: `#${salaryPayment.user}`,
          username: '',
          position: '',
          contactNumber: '',
        });
      }
    } else {
      // Reset form for create mode
      setFormData({
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        salary: '',
        remarks: '',
        status: 'pending',
      });
      setSelectedEmployee(null);
    }
    setError('');
  }, [salaryPayment, isOpen]);

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
    if (!formData.startDate || !formData.endDate) {
      return 'Please enter a valid start and end date';
    }
    if (!formData.salary || parseFloat(formData.salary) < 0) {
      return 'Please enter valid amount';
    }
    if (!formData.status) {
      return 'Please select a status';
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

    const submitData: CreateSalaryPaymentData = {
      user: selectedEmployee?.userId || 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      salary: formData.salary,
      remarks: formData.remarks,
      status: formData.status,
    } 

    onSubmit(submitData);
  }

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
            {isEditMode ? '✏️ Edit Salary Payment' : '📝 Add New Salary Payment'}
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
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              ⏱️ Salary
            </h3>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Salary *
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="10000"
                min="0"
                step="0.5"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status *
              </label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field bg-slate-700 border-slate-600 text-white">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
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
              placeholder="Additional notes about this salary payment..."
              rows={3}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
            />
          </div>

          {/* Readonly timestamps for edit mode */}
          {isEditMode && salaryPayment && (
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-3">📅 Timestamps</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Created At</p>
                  <p className="text-white">{formatDate(salaryPayment.createdAt)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Updated At</p>
                  <p className="text-white">{formatDate(salaryPayment.updatedAt)}</p>
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
                isEditMode ? 'Update Salary Payment' : 'Create Salary Payment'
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

export default SalaryPaymentModal;
