/**
 * OutputHuskTab Component
 * Manages output husk lot orders with AG Grid
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ColDef } from 'ag-grid-community';
import { DataGrid, CurrencyRenderer, QuantityRenderer, ActionsRenderer } from '../../common';
import OutputOrderModal from './OutputOrderModal';
import outputOrderService from '../../../services/outputOrderService';
import type { CreateOutputOrder, InputHuskLot, OutputOrder } from '../../../utils/types';
import DeleteOutputOrderModal from './DeleteOutputOrderModal';


const OutputHuskTab = () => {
  const [lots, setLots] = useState<OutputOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OutputOrder | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Calculate summary stats
  const totalQuantity = lots.reduce((sum, lot) => sum + lot.quantityKg, 0);
  const totalRevenue = lots.reduce((sum, lot) => sum + parseFloat(lot.totalRevenue), 0);
  const ordersCount = lots.length;

  const fetchOrders = useCallback(async () => {
    const response = await outputOrderService.getAll();
    setLots(response.data.results);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<OutputOrder>[]>(() => [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 100,
      cellClass: 'font-mono text-white',
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      minWidth: 140,
      cellClass: 'font-mono text-white',
    },
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 180,
    },
    {
      field: 'pricePerKg',
      headerName: 'Price Per Kg',
      minWidth: 120,
      cellRenderer: QuantityRenderer,
    },
    {
      field: 'quantityKg',
      headerName: 'Quantity (Kg)',
      minWidth: 120,
      cellRenderer: CurrencyRenderer,
    },
    {
      field: 'loadUnloadCost',
      headerName: 'Load Unload Cost',
      minWidth: 120,
      cellRenderer: CurrencyRenderer,
    },
    {
      field: 'transportCost',
      headerName: 'Transport Cost',
      minWidth: 100,
      cellRenderer: CurrencyRenderer,
    },
    {
      field: 'otherCosts',
      headerName: 'Other Costs',
      minWidth: 110,
      cellRenderer: CurrencyRenderer,
    },
    {
      field: 'totalRevenue',
      headerName: 'Total Revenue',
      minWidth: 110,
      cellRenderer: CurrencyRenderer,
    },
    {
      headerName: 'Actions',
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      filter: false,
      cellRenderer: ActionsRenderer,
      cellRendererParams: {
        onEdit: (data: OutputOrder) => openEditModal(data),
        onDelete: (data: OutputOrder) => openDeleteModal(data),
      },
    }
  ], []);

  /**
   * Handles adding a new output lot
   */
  const handleCreateOrder = async (data: CreateOutputOrder) => {
    setIsSubmitting(true);

    try {
      const response = await outputOrderService.create(data);
      setLots(prev => [response.data, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to create output husk lot';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Opens the edit modal
   */
  const openEditModal = (order: OutputOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  /**
   * Opens the delete confirmation modal
   */
  const openDeleteModal = (order: OutputOrder) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  /**
   * Handles deleting an output order
   */
  const handleDeleteOrderConfirm = async () => {
    try {
      if (!selectedOrder?.id) return;
      await outputOrderService.delete(selectedOrder.id);
      setLots(prev => prev.filter(lot => lot.id !== selectedOrder.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
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
          <p className="text-slate-400 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-amber-400">{ordersCount}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center space-x-2"
        >
          <span>+</span>
          <span>Create Output Order</span>
        </button>
      </div>

      {/* AG Grid Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 p-0 overflow-hidden">
        <DataGrid<OutputOrder>
          rowData={lots}
          columnDefs={columnDefs}
          height="450px"
          pagination={true}
          pageSize={10}
        />
      </div>

      {/* Create Output Order Modal */}
      <OutputOrderModal
        outputOrder={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrder}
        isLoading={isSubmitting}
      />

      {/* Delete Output Order Confirmation Modal */}
      <DeleteOutputOrderModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOrderConfirm}
        isLoading={isSubmitting}
        orderId={selectedOrder?.id}
      />
    </div>
  );
};

export default OutputHuskTab;
