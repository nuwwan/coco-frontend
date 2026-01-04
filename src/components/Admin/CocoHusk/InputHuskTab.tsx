/**
 * InputHuskTab Component
 * Manages input husk lot orders with AG Grid
 */

import { useState, useMemo } from 'react';
import type { ColDef } from 'ag-grid-community';
import { DataGrid, BadgeRenderer, CurrencyRenderer, QuantityRenderer } from '../../common';
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
  {
    id: 4,
    lotNumber: 'INP-2024-004',
    supplierName: 'Pacific Coco Ltd.',
    quantity: 800,
    unit: 'kg',
    pricePerUnit: 24,
    totalPrice: 19200,
    receivedDate: '2024-12-25',
    quality: 'premium',
    status: 'received',
  },
  {
    id: 5,
    lotNumber: 'INP-2024-005',
    supplierName: 'Sunrise Farms',
    quantity: 450,
    unit: 'kg',
    pricePerUnit: 18,
    totalPrice: 8100,
    receivedDate: '2024-12-24',
    quality: 'economy',
    status: 'rejected',
  },
];

const InputHuskTab = () => {
  const [lots, setLots] = useState<InputHuskLot[]>(mockInputLots);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate summary stats
  const totalQuantity = lots.reduce((sum, lot) => sum + lot.quantity, 0);
  const totalValue = lots.reduce((sum, lot) => sum + lot.totalPrice, 0);
  const pendingCount = lots.filter(lot => lot.status === 'pending').length;

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<InputHuskLot>[]>(() => [
    {
      field: 'lotNumber',
      headerName: 'Lot Number',
      minWidth: 140,
      cellClass: 'font-mono text-white',
    },
    {
      field: 'supplierName',
      headerName: 'Supplier',
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
      headerName: 'Total Price',
      minWidth: 120,
      cellRenderer: CurrencyRenderer,
    },
    {
      field: 'receivedDate',
      headerName: 'Received Date',
      minWidth: 130,
    },
    {
      field: 'quality',
      headerName: 'Quality',
      minWidth: 110,
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
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <span>+</span>
          <span>Create Input Lot</span>
        </button>
      </div>

      {/* AG Grid Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 p-0 overflow-hidden">
        <DataGrid<InputHuskLot>
          rowData={lots}
          columnDefs={columnDefs}
          height="450px"
          pagination={true}
          pageSize={10}
        />
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
