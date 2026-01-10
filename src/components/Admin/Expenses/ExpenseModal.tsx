/**
 * ExpenseModal Component
 * Modal form for creating and editing expenses
 */

import { useState, useEffect, type FormEvent } from 'react';
import type { Expense } from '../../../utils/types';
import type { CreateExpenseData } from '../../../services/expenseService';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseData) => void;
  expense?: Expense | null;
  isLoading?: boolean;
}

// Expense type options
const expenseTypes = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'rent', label: 'Rent' },
  { value: 'other', label: 'Other' }
];

// Status options
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' }
];

// Month options
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

const ExpenseModal = ({ isOpen, onClose, onSubmit, expense, isLoading = false }: ExpenseModalProps) => {
  const isEditMode = !!expense;

  const [formData, setFormData] = useState<CreateExpenseData>({
    title: '',
    expenseType: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    cost: '',
    status: 'pending',
    remarks: '',
  });

  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        expenseType: expense.expenseType || '',
        year: expense.year || new Date().getFullYear(),
        month: expense.month || new Date().getMonth() + 1,
        day: expense.day || new Date().getDate(),
        cost: expense.cost || '',
        status: expense.status || 'pending',
        remarks: expense.remarks || '',
      });
    } else {
      setFormData({
        title: '',
        expenseType: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        cost: '',
        status: 'pending',
        remarks: '',
      });
    }
    setError('');
  }, [expense, isOpen]);

  /**
   * Handles form input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.expenseType) return 'Expense type is required';
    if (!formData.year || formData.year < 2000 || formData.year > 2100) {
      return 'Please enter a valid year (2000-2100)';
    }
    if (!formData.month || formData.month < 1 || formData.month > 12) {
      return 'Please select a valid month';
    }
    if (!formData.day || formData.day < 1 || formData.day > 31) {
      return 'Please enter a valid day (1-31)';
    }
    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      return 'Cost must be greater than 0';
    }
    if (!formData.status) return 'Status is required';
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

    onSubmit(formData);
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setError('');
    onClose();
  };

  /**
   * Formats date for display
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
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
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? '✏️ Edit Expense' : '💰 Add New Expense'}
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Office electricity bill"
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          {/* Expense Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Expense Type *
              </label>
              <select
                name="expenseType"
                value={formData.expenseType}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              >
                <option value="">Select Type</option>
                {expenseTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Divider for Date */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              📅 Expense Date
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

          {/* Divider for Cost */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              💵 Cost Details
            </h3>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cost Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 pl-8"
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
              placeholder="Additional notes about this expense..."
              rows={3}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
            />
          </div>

          {/* Readonly timestamps for edit mode */}
          {isEditMode && expense && (
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-3">📅 Timestamps</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Created At</p>
                  <p className="text-white">{formatDate(expense.createdAt)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Updated At</p>
                  <p className="text-white">{formatDate(expense.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Expense' : 'Create Expense'
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

export default ExpenseModal;
