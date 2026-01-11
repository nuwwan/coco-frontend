/**
 * OutputOrderModal Component
 * Modal form for creating and editing output husk orders
 * Includes buyer search with debouncing
 */

import { useState, useEffect, type FormEvent } from 'react';
import BuyerSearchSection from './BuyerSearchSection';
import type { OutputOrder, CreateOutputOrder, Buyer } from '../../../utils/types';

interface OutputOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOutputOrder) => void;
  outputOrder: OutputOrder | null;
  isLoading?: boolean;
}

const OutputOrderModal = ({ isOpen, onClose, onSubmit, outputOrder, isLoading = false }: OutputOrderModalProps) => {
  const isEditMode = !!outputOrder;

  // Selected buyer state
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);

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
    date: formatDateForInput(new Date().toISOString()),
    pricePerKg: 0,
    quantityKg: 0,
    loadUnloadCost: 0,
    transportCost: 0,
    otherCosts: 0,
    remarks: '',
  });

  const [error, setError] = useState('');

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (outputOrder) {
      // Edit mode: populate form with input husk lot data
      setFormData({
        date: formatDateForInput(outputOrder.date),
        pricePerKg: parseFloat(outputOrder.pricePerKg) || 0,
        quantityKg: outputOrder.quantityKg || 0,
        loadUnloadCost: parseFloat(outputOrder.loadUnloadCost) || 0,
        transportCost: parseFloat(outputOrder.transportCost) || 0,
        otherCosts: parseFloat(outputOrder.otherCosts) || 0,
        remarks: outputOrder.remarks || '',
      });

      // Set buyer placeholder for edit mode (ID only from outputHuskLot)
      if (outputOrder.buyer) {
        setSelectedBuyer({
          id: outputOrder.buyer,
          name: `Buyer #${outputOrder.buyer}`,
          contactNumber: '',
          email: '',
          description: '',
          address: '',
        });
      }
    } else {
      // Create mode: reset form
      setFormData({
        date: formatDateForInput(new Date().toISOString()),
        pricePerKg: 0,
        quantityKg: 0,
        loadUnloadCost: 0,
        transportCost: 0,
        otherCosts: 0,
        remarks: '',
      });
      setSelectedBuyer(null);
    }
    setError('');
  }, [outputOrder, isOpen]);

  /**
   * Handles buyer selection
   */
  const handleBuyerSelect = (buyer: Buyer | null) => {
    setSelectedBuyer(buyer);
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
    if (!isEditMode && !selectedBuyer) {
      return 'Please search and select a buyer first';
    }
    if (!formData.date) return 'Date is required';
    if (formData.pricePerKg <= 0) return 'Price per kg must be greater than 0';
    if (formData.quantityKg <= 0) return 'Quantity must be greater than 0';
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

    const submitData: CreateOutputOrder = {
      buyer: selectedBuyer?.id || outputOrder?.buyer || 0,
      date: formData.date,
      pricePerKg: formData.pricePerKg.toString(),
      quantityKg: formData.quantityKg,
      loadUnloadCost: formData.loadUnloadCost.toString(),
      transportCost: formData.transportCost.toString(),
      otherCosts: formData.otherCosts.toString(),
      remarks: formData.remarks,
    };

    onSubmit(submitData);
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setError('');
    setSelectedBuyer(null);
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
            {isEditMode ? '✏️ Edit Output Husk Order' : '🥥 Add New Output Husk Order'}
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

          {/* Buyer Search Section */}
          <BuyerSearchSection
            onBuyerSelect={handleBuyerSelect}
            selectedBuyer={selectedBuyer}
            isEditMode={isEditMode}
            disabled={isLoading}
          />

          {/* Divider */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-400 mb-4">
              📋 Order Details
            </h3>
          </div>

          {/* Date and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
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
                name="quantityKg"
                value={formData.quantityKg}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                step="1"
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

          {/* Price Per Kg */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Price Per Kg *
              </label>
              <input
                type="number"
                name="pricePerKg"
                value={formData.pricePerKg}
                onChange={handleChange}
                placeholder="Enter price per kg"
                min="0"
                step="0.01"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>


          {/* Load/Unload Cost and Transport Cost */}
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
                step="1"
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
                placeholder="Enter transport cost"
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
                Other Costs
              </label>
              <input
                type="number"
                name="otherCosts"
                value={formData.otherCosts}
                onChange={handleChange}
                placeholder="Enter other costs"
                min="0"
                step="1"
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
          {isEditMode && outputOrder && (
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-3">📅 Timestamps</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Created At</p>
                  <p className="text-white">{formatDate(outputOrder.createdAt)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Total Revenue</p>
                  <p className="text-white">{outputOrder.totalRevenue || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Total Revenue</p>
                  <p className="text-white">{outputOrder.totalRevenue || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Created By</p>
                  <p className="text-white">{outputOrder.createdBy || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isLoading || (!isEditMode && !selectedBuyer)}
              className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Output Husk Order' : 'Create Output Husk Order'
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
export default OutputOrderModal;