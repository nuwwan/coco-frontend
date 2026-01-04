/**
 * BuyerModal Component
 * Modal form for creating and editing buyers
 */

import { useState, useEffect, type FormEvent } from 'react';
import type { Buyer } from '../../../utils/types';
import type { CreateBuyerData } from '../../../services/buyerService';

interface BuyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBuyerData) => void;
  buyer?: Buyer | null;
  isLoading?: boolean;
}

const BuyerModal = ({ isOpen, onClose, onSubmit, buyer, isLoading = false }: BuyerModalProps) => {
  const isEditMode = !!buyer;

  const [formData, setFormData] = useState<CreateBuyerData>({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    description: '',
  });

  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (buyer) {
      setFormData({
        name: buyer.name || '',
        address: buyer.address || '',
        contactNumber: buyer.contactNumber || '',
        email: buyer.email || '',
        description: buyer.description || '',
      });
    } else {
      setFormData({
        name: '',
        address: '',
        contactNumber: '',
        email: '',
        description: '',
      });
    }
    setError('');
  }, [buyer, isOpen]);

  /**
   * Handles form input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  /**
   * Validates form data
   */
  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.contactNumber.trim()) return 'Contact number is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
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
            {isEditMode ? '✏️ Edit Buyer' : '🛒 Add New Buyer'}
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

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Buyer Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter buyer name"
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="buyer@example.com"
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          {/* Contact Number */}
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
              placeholder="123 Main St, City, Country"
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
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
              placeholder="Additional information about the buyer..."
              rows={3}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
            />
          </div>

          {/* Readonly timestamps for edit mode */}
          {isEditMode && buyer && (
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-3">📅 Timestamps</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Created At</p>
                  <p className="text-white">{formatDate(buyer.createdAt)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Updated At</p>
                  <p className="text-white">{formatDate(buyer.updatedAt)}</p>
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
                isEditMode ? 'Update Buyer' : 'Create Buyer'
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

export default BuyerModal;

