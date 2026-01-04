/**
 * OutputHuskTab Component
 * Manages output husk lot orders with AG Grid
 */

import { useState, useMemo } from 'react';
import type { ColDef } from 'ag-grid-community';
import { DataGrid, BadgeRenderer, CurrencyRenderer, QuantityRenderer } from '../../common';
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
  {
    id: 5,
    lotNumber: 'OUT-2024-005',
    customerName: 'EcoGrow Industries',
    quantity: 600,
    unit: 'kg',
    pricePerUnit: 38,
    totalPrice: 22800,
    shippedDate: '2024-12-24',
    productType: 'fiber',
    status: 'delivered',
  },
  {
    id: 6,
    lotNumber: 'OUT-2024-006',
    customerName: 'Urban Gardens Co.',
    quantity: 250,
    unit: 'kg',
    pricePerUnit: 42,
    totalPrice: 10500,
    shippedDate: '2024-12-23',
    productType: 'peat',
    status: 'cancelled',
  },
];

const OutputHuskTab = () => {
  const [lots, setLots] = useState<OutputHuskLot[]>(mockOutputLots);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate summary stats
  const totalQuantity = lots.reduce((sum, lot) => sum + lot.quantity, 0);
  const totalRevenue = lots.reduce((sum, lot) => sum + lot.totalPrice, 0);
  const pendingCount = lots.filter(lot => lot.status === 'pending' || lot.status === 'processing').length;

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<OutputHuskLot>[]>(() => [
    {
      field: 'lotNumber',
      headerName: 'Lot Number',
      minWidth: 140,
      cellClass: 'font-mono text-white',
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      minWidth: 180,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      minWidth: 120,
      cellRenderer: QuantityRenderer,
      cellRendererParams: { unitField: 'unit' },
    },
    {
      field: 'totalPrice',
      headerName: 'Revenue',
      minWidth: 120,
      cellRenderer: CurrencyRenderer,
    },
    {
      field: 'shippedDate',
      headerName: 'Ship Date',
      minWidth: 120,
    },
    {
      field: 'productType',
      headerName: 'Product',
      minWidth: 100,
      cellRenderer: BadgeRenderer,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 110,
      cellRenderer: BadgeRenderer,
    },
  ], []);

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
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <span>+</span>
          <span>Create Output Lot</span>
        </button>
      </div>

      {/* AG Grid Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 p-0 overflow-hidden">
        <DataGrid<OutputHuskLot>
          rowData={lots}
          columnDefs={columnDefs}
          height="450px"
          pagination={true}
          pageSize={10}
        />
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
