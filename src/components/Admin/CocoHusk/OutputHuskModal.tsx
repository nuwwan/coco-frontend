/**
 * OutputHuskModal Component
 * Modal form for creating new output husk lots
 */

import { useState, type FormEvent } from 'react';
import type { OutputHuskLot } from './OutputHuskTab';

interface OutputHuskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lot: Omit<OutputHuskLot, 'id'>) => void;
}

const OutputHuskModal = ({ isOpen, onClose, onSubmit }: OutputHuskModalProps) => {
  const [formData, setFormData] = useState({
    lotNumber: '',
    customerName: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    shippedDate: new Date().toISOString().split('T')[0],
    productType: 'fiber' as 'fiber' | 'chips' | 'peat' | 'mixed',
    status: 'pending' as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    notes: '',
  });

  const [error, setError] = useState('');

  /**
   * Handles form input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.lotNumber.trim()) {
      setError('Lot number is required');
      return;
    }
    if (!formData.customerName.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError('Valid quantity is required');
      return;
    }
    if (!formData.pricePerUnit || Number(formData.pricePerUnit) <= 0) {
      setError('Valid price per unit is required');
      return;
    }

    const quantity = Number(formData.quantity);
    const pricePerUnit = Number(formData.pricePerUnit);

    onSubmit({
      lotNumber: formData.lotNumber,
      customerName: formData.customerName,
      quantity,
      unit: formData.unit,
      pricePerUnit,
      totalPrice: quantity * pricePerUnit,
      shippedDate: formData.shippedDate,
      productType: formData.productType,
      status: formData.status,
      notes: formData.notes || undefined,
    });

    // Reset form
    setFormData({
      lotNumber: '',
      customerName: '',
      quantity: '',
      unit: 'kg',
      pricePerUnit: '',
      shippedDate: new Date().toISOString().split('T')[0],
      productType: 'fiber',
      status: 'pending',
      notes: '',
    });
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setError('');
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
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">📤 Create Output Husk Lot</h2>
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

          {/* Lot Number */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Lot Number *
            </label>
            <input
              type="text"
              name="lotNumber"
              value={formData.lotNumber}
              onChange={handleChange}
              placeholder="e.g., OUT-2024-005"
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Product Type
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="input-field bg-slate-700 border-slate-600 text-white"
            >
              <option value="fiber">Coco Fiber</option>
              <option value="chips">Coco Chips</option>
              <option value="peat">Coco Peat</option>
              <option value="mixed">Mixed Products</option>
            </select>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="input-field bg-slate-700 border-slate-600 text-white"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="tons">Tons</option>
                <option value="pieces">Pieces</option>
              </select>
            </div>
          </div>

          {/* Price Per Unit */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Price Per Unit ($) *
            </label>
            <input
              type="number"
              name="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          {/* Shipped Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Shipped Date
            </label>
            <input
              type="date"
              name="shippedDate"
              value={formData.shippedDate}
              onChange={handleChange}
              className="input-field bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field bg-slate-700 border-slate-600 text-white"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
              rows={3}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
            />
          </div>

          {/* Total Revenue Preview */}
          {formData.quantity && formData.pricePerUnit && (
            <div className="p-3 bg-emerald-900/30 border border-emerald-700 rounded-lg">
              <p className="text-sm text-slate-400">Calculated Total Revenue</p>
              <p className="text-xl font-bold text-emerald-400">
                ${(Number(formData.quantity) * Number(formData.pricePerUnit)).toLocaleString()}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Create Lot
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

export default OutputHuskModal;

