/**
 * InputHuskTab Component
 * Manages input husk lot orders
 */

import { useState } from 'react';
import InputHuskModal from './InputHuskModal';

// Input husk lot interface
export interface InputHuskLot {
  id: number;
  lotNumber: string;
  supplierName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  receivedDate: string;
  quality: 'premium' | 'standard' | 'economy';
  status: 'pending' | 'received' | 'inspected' | 'rejected';
  notes?: string;
}

// Mock data - replace with API data
const mockInputLots: InputHuskLot[] = [
  {
    id: 1,
    lotNumber: 'INP-2024-001',
    supplierName: 'Green Coconut Farms',
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 25,
    totalPrice: 12500,
    receivedDate: '2024-12-28',
    quality: 'premium',
    status: 'received',
  },
  {
    id: 2,
    lotNumber: 'INP-2024-002',
    supplierName: 'Island Coco Suppliers',
    quantity: 1200,
    unit: 'kg',
    pricePerUnit: 20,
    totalPrice: 24000,
    receivedDate: '2024-12-27',
    quality: 'standard',
    status: 'inspected',
  },
  {
    id: 3,
    lotNumber: 'INP-2024-003',
    supplierName: 'Tropical Harvest Co.',
    quantity: 300,
    unit: 'kg',
    pricePerUnit: 22,
    totalPrice: 6600,
    receivedDate: '2024-12-26',
    quality: 'economy',
    status: 'pending',
  },
];

const InputHuskTab = () => {
  const [lots, setLots] = useState<InputHuskLot[]>(mockInputLots);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter lots based on search term
  const filteredLots = lots.filter(lot =>
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary stats
  const totalQuantity = lots.reduce((sum, lot) => sum + lot.quantity, 0);
  const totalValue = lots.reduce((sum, lot) => sum + lot.totalPrice, 0);
  const pendingCount = lots.filter(lot => lot.status === 'pending').length;

  /**
   * Returns status badge styling
   */
  const getStatusStyle = (status: InputHuskLot['status']) => {
    switch (status) {
      case 'received':
        return 'bg-blue-500/20 text-blue-400';
      case 'inspected':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  /**
   * Returns quality badge styling
   */
  const getQualityStyle = (quality: InputHuskLot['quality']) => {
    switch (quality) {
      case 'premium':
        return 'bg-purple-500/20 text-purple-400';
      case 'standard':
        return 'bg-blue-500/20 text-blue-400';
      case 'economy':
        return 'bg-slate-500/20 text-slate-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  /**
   * Handles adding a new input lot
   */
  const handleAddLot = (newLot: Omit<InputHuskLot, 'id'>) => {
    const lot: InputHuskLot = {
      ...newLot,
      id: lots.length + 1,
    };
    setLots([lot, ...lots]);
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Total Input Quantity</p>
          <p className="text-2xl font-bold text-white">{totalQuantity.toLocaleString()} kg</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Total Value</p>
          <p className="text-2xl font-bold text-emerald-400">${totalValue.toLocaleString()}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Pending Lots</p>
          <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by lot number or supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 flex-1 max-w-md"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 self-start"
        >
          <span>+</span>
          <span>Create Input Lot</span>
        </button>
      </div>

      {/* Input Lots Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 overflow-hidden">
        <h2 className="text-xl font-semibold text-white mb-4 px-4 pt-4">Input Husk Lots</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Lot Number</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Supplier</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium hidden sm:table-cell">Quantity</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium hidden md:table-cell">Total Price</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Quality</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-right py-4 px-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.map((lot) => (
                <tr 
                  key={lot.id} 
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="text-white font-mono">{lot.lotNumber}</span>
                    <p className="text-slate-400 text-xs mt-1">{lot.receivedDate}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{lot.supplierName}</td>
                  <td className="py-4 px-4 text-slate-300 hidden sm:table-cell">
                    {lot.quantity.toLocaleString()} {lot.unit}
                  </td>
                  <td className="py-4 px-4 text-emerald-400 font-medium hidden md:table-cell">
                    ${lot.totalPrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getQualityStyle(lot.quality)}`}>
                      {lot.quality}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(lot.status)}`}>
                      {lot.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-slate-400 hover:text-white p-2 transition-colors" title="View">
                      👁️
                    </button>
                    <button className="text-slate-400 hover:text-white p-2 transition-colors" title="Edit">
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No input lots found.</p>
          </div>
        )}
      </div>

      {/* Create Input Lot Modal */}
      <InputHuskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLot}
      />
    </div>
  );
};

export default InputHuskTab;

