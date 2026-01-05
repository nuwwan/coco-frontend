/**
 * InputHuskModal Component
 * Modal form for creating and editing input husk lots
 * Includes supplier search with debouncing
 */

import { useState, useEffect, type FormEvent } from 'react';
import SupplierSearchSection from './SupplierSearchSection';
import type { InputHuskLot, CreateInputHuskLot, Supplier } from '../../../utils/types';

interface InputCocohuskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInputHuskLot) => void;
  inputHuskLot?: InputHuskLot | null;
  isLoading?: boolean;
}

const InputCocohuskModal = ({ isOpen, onClose, onSubmit, inputHuskLot, isLoading = false }: InputCocohuskModalProps) => {
  const isEditMode = !!inputHuskLot;

  // Selected supplier state
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  /**
   * Converts ISO datetime string to date-only format (YYYY-MM-DD)
   * HTML date inputs require YYYY-MM-DD format
   */
  const formatDateForInput = (isoString: string | null | undefined): string => {
    if (!isoString) return '';
    return isoString.substring(0, 10);
  };

  // Form data state
  const [formData, setFormData] = useState({
    dateReceived: formatDateForInput(new Date().toISOString()),
    quantity: 0,
    quality: '',
    unitPrice: '',
    discount: '0',
    transportCost: '0',
    loadUnloadCost: '0',
    otherCosts: '0',
    remarks: '',
  });

  const [error, setError] = useState('');

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (inputHuskLot) {
      // Edit mode: populate form with input husk lot data
      setFormData({
        dateReceived: formatDateForInput(inputHuskLot.dateReceived),
        quantity: inputHuskLot.quantity || 0,
        quality: inputHuskLot.quality || '',
        unitPrice: inputHuskLot.unitPrice || '',
        discount: inputHuskLot.discount || '0',
        transportCost: inputHuskLot.transportCost || '0',
        loadUnloadCost: inputHuskLot.loadUnloadCost || '0',
        otherCosts: inputHuskLot.otherCosts || '0',
        remarks: inputHuskLot.remarks || '',
      });

      // Set supplier placeholder for edit mode (ID only from inputHuskLot)
      if (inputHuskLot.supplier) {
        setSelectedSupplier({
          id: inputHuskLot.supplier,
          name: `Supplier #${inputHuskLot.supplier}`,
          address: '',
          contactNumber: '',
          email: '',
          description: '',
        });
      }
    } else {
      // Create mode: reset form
      setFormData({
        dateReceived: formatDateForInput(new Date().toISOString()),
        quantity: 0,
        quality: '',
        unitPrice: '',
        discount: '0',
        transportCost: '0',
        loadUnloadCost: '0',
        otherCosts: '0',
        remarks: '',
      });
      setSelectedSupplier(null);
    }
    setError('');
  }, [inputHuskLot, isOpen]);

  /**
   * Handles supplier selection
   */
  const handleSupplierSelect = (supplier: Supplier | null) => {
    setSelectedSupplier(supplier);
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
    if (!isEditMode && !selectedSupplier) {
      return 'Please search and select a supplier first';
    }
    if (!formData.dateReceived) return 'Date received is required';
    if (formData.quantity <= 0) return 'Quantity must be greater than 0';
    if (!formData.quality.trim()) return 'Quality is required';
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      return 'Unit price must be greater than 0';
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

    const submitData: CreateInputHuskLot = {
      supplier: selectedSupplier?.id || inputHuskLot?.supplier || 0,
      dateReceived: formData.dateReceived,
      quantity: formData.quantity,
      quality: formData.quality,
      unitPrice: formData.unitPrice,
      discount: formData.discount,
      transportCost: formData.transportCost,
      loadUnloadCost: formData.loadUnloadCost,
      otherCosts: formData.otherCosts,
      remarks: formData.remarks,
    };

    onSubmit(submitData);
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setError('');
    setSelectedSupplier(null);
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
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? '✏️ Edit Input Husk Lot' : '🥥 Add New Input Husk Lot'}
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

          {/* Supplier Search Section */}
          <SupplierSearchSection
            onSupplierSelect={handleSupplierSelect}
            selectedSupplier={selectedSupplier}
            isEditMode={isEditMode}
            disabled={isLoading}
          />

          {/* Divider */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              📋 Lot Details
            </h3>
          </div>

          {/* Date Received and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date Received *
              </label>
              <input
                type="date"
                name="dateReceived"
                value={formData.dateReceived}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quantity (kg) *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                step="0.01"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Quality and Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quality *
              </label>
              <select
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              >
                <option value="">Select Quality</option>
                <option value="fresh">Fresh</option>
                <option value="medium">Medium</option>
                <option value="dry">Dry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Unit Price *
              </label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="Price per kg"
                min="0"
                step="0.01"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Divider for Costs */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              💰 Cost Breakdown
            </h3>
          </div>

          {/* Discount and Transport Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Discount
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Transport Cost
              </label>
              <input
                type="number"
                name="transportCost"
                value={formData.transportCost}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Load/Unload Cost and Other Costs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Load/Unload Cost
              </label>
              <input
                type="number"
                name="loadUnloadCost"
                value={formData.loadUnloadCost}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Other Costs
              </label>
              <input
                type="number"
                name="otherCosts"
                value={formData.otherCosts}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
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
              placeholder="Additional notes about this lot..."
              rows={3}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
            />
          </div>

          {/* Readonly timestamps for edit mode */}
          {isEditMode && inputHuskLot && (
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-3">📅 Timestamps</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Created At</p>
                  <p className="text-white">{formatDate(inputHuskLot.createdAt)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Gross Cost</p>
                  <p className="text-white">{inputHuskLot.grossCost || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Net Cost</p>
                  <p className="text-white">{inputHuskLot.netCost || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Created By</p>
                  <p className="text-white">{inputHuskLot.createdBy || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isLoading || (!isEditMode && !selectedSupplier)}
              className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Input Husk Lot' : 'Create Input Husk Lot'
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
export default InputCocohuskModal;