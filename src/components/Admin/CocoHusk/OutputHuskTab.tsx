/**
 * OutputHuskTab Component
 * Manages output husk lot orders
 */

import { useState } from 'react';
import OutputHuskModal from './OutputHuskModal';

// Output husk lot interface
export interface OutputHuskLot {
  id: number;
  lotNumber: string;
  customerName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  shippedDate: string;
  productType: 'fiber' | 'chips' | 'peat' | 'mixed';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
}

// Mock data - replace with API data
const mockOutputLots: OutputHuskLot[] = [
  {
    id: 1,
    lotNumber: 'OUT-2024-001',
    customerName: 'Garden Center Ltd.',
    quantity: 200,
    unit: 'kg',
    pricePerUnit: 45,
    totalPrice: 9000,
    shippedDate: '2024-12-28',
    productType: 'fiber',
    status: 'delivered',
  },
  {
    id: 2,
    lotNumber: 'OUT-2024-002',
    customerName: 'Organic Farms Inc.',
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 35,
    totalPrice: 17500,
    shippedDate: '2024-12-27',
    productType: 'chips',
    status: 'shipped',
  },
  {
    id: 3,
    lotNumber: 'OUT-2024-003',
    customerName: 'Green Thumb Nursery',
    quantity: 150,
    unit: 'kg',
    pricePerUnit: 50,
    totalPrice: 7500,
    shippedDate: '2024-12-26',
    productType: 'peat',
    status: 'processing',
  },
  {
    id: 4,
    lotNumber: 'OUT-2024-004',
    customerName: 'Hydroponic Solutions',
    quantity: 300,
    unit: 'kg',
    pricePerUnit: 40,
    totalPrice: 12000,
    shippedDate: '2024-12-25',
    productType: 'mixed',
    status: 'pending',
  },
];

const OutputHuskTab = () => {
  const [lots, setLots] = useState<OutputHuskLot[]>(mockOutputLots);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter lots based on search term
  const filteredLots = lots.filter(lot =>
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary stats
  const totalQuantity = lots.reduce((sum, lot) => sum + lot.quantity, 0);
  const totalRevenue = lots.reduce((sum, lot) => sum + lot.totalPrice, 0);
  const pendingCount = lots.filter(lot => lot.status === 'pending' || lot.status === 'processing').length;

  /**
   * Returns status badge styling
   */
  const getStatusStyle = (status: OutputHuskLot['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400';
      case 'processing':
        return 'bg-amber-500/20 text-amber-400';
      case 'pending':
        return 'bg-slate-500/20 text-slate-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  /**
   * Returns product type badge styling
   */
  const getProductTypeStyle = (type: OutputHuskLot['productType']) => {
    switch (type) {
      case 'fiber':
        return 'bg-purple-500/20 text-purple-400';
      case 'chips':
        return 'bg-amber-500/20 text-amber-400';
      case 'peat':
        return 'bg-green-500/20 text-green-400';
      case 'mixed':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  /**
   * Handles adding a new output lot
   */
  const handleAddLot = (newLot: Omit<OutputHuskLot, 'id'>) => {
    const lot: OutputHuskLot = {
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
          <p className="text-slate-400 text-sm">Total Output Quantity</p>
          <p className="text-2xl font-bold text-white">{totalQuantity.toLocaleString()} kg</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-400">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Pending / Processing</p>
          <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by lot number or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 flex-1 max-w-md"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2 self-start"
        >
          <span>+</span>
          <span>Create Output Lot</span>
        </button>
      </div>

      {/* Output Lots Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 overflow-hidden">
        <h2 className="text-xl font-semibold text-white mb-4 px-4 pt-4">Output Husk Lots</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Lot Number</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Customer</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium hidden sm:table-cell">Quantity</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium hidden md:table-cell">Revenue</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Product</th>
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
                    <p className="text-slate-400 text-xs mt-1">{lot.shippedDate}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{lot.customerName}</td>
                  <td className="py-4 px-4 text-slate-300 hidden sm:table-cell">
                    {lot.quantity.toLocaleString()} {lot.unit}
                  </td>
                  <td className="py-4 px-4 text-emerald-400 font-medium hidden md:table-cell">
                    ${lot.totalPrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getProductTypeStyle(lot.productType)}`}>
                      {lot.productType}
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
            <p className="text-slate-400">No output lots found.</p>
          </div>
        )}
      </div>

      {/* Create Output Lot Modal */}
      <OutputHuskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLot}
      />
    </div>
  );
};

export default OutputHuskTab;

