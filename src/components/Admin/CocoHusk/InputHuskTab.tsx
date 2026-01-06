/**
 * InputHuskTab Component
 * Manages input husk lot orders with AG Grid and API integration
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { DataGrid, BadgeRenderer, CurrencyRenderer, QuantityRenderer } from '../../common';
// Import modals from InputCocoHusk folder
import { InputCocohuskModal, DeleteInputCocoHuskModal } from '../InputCocoHusk';
import inputHuskService from '../../../services/inputhuskService';
import type { InputHuskLot, CreateInputHuskLot } from '../../../utils/types';

const InputHuskTab = () => {
  // State
  const [lots, setLots] = useState<InputHuskLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<InputHuskLot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Fetches input husk lots from API
   */
  const fetchLots = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await inputHuskService.getAll();
      setLots(response.data.results);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to fetch input husk lots';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch lots on mount
  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  /**
   * Handles creating a new input husk lot
   */
  const handleCreate = async (data: CreateInputHuskLot) => {
    setIsSubmitting(true);

    try {
      const response = await inputHuskService.create(data);
      setLots(prev => [response.data, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to create input husk lot';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles updating an input husk lot
   */
  const handleUpdate = async (data: CreateInputHuskLot) => {
    if (!selectedLot?.id) return;
    setIsSubmitting(true);

    try {
      const response = await inputHuskService.update(selectedLot.id, data);
      setLots(prev =>
        prev.map(lot => (lot.id === selectedLot.id ? response.data : lot))
      );
      setIsModalOpen(false);
      setSelectedLot(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to update input husk lot';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles deleting an input husk lot
   */
  const handleDelete = async () => {
    if (!selectedLot?.id) return;
    setIsSubmitting(true);

    try {
      await inputHuskService.delete(selectedLot.id);
      setLots(prev => prev.filter(lot => lot.id !== selectedLot.id));
      setIsDeleteModalOpen(false);
      setSelectedLot(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to delete input husk lot';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Opens the create modal
   */
  const openCreateModal = () => {
    setSelectedLot(null);
    setIsModalOpen(true);
  };

  /**
   * Opens the edit modal
   */
  const openEditModal = (lot: InputHuskLot) => {
    setSelectedLot(lot);
    setIsModalOpen(true);
  };

  /**
   * Opens the delete confirmation modal
   */
  const openDeleteModal = (lot: InputHuskLot) => {
    setSelectedLot(lot);
    setIsDeleteModalOpen(true);
  };

  // Calculate summary stats
  const totalQuantity = lots.reduce((sum, lot) => sum + (lot.quantity || 0), 0);
  const totalValue = lots.reduce((sum, lot) => sum + parseFloat(lot.grossCost || '0'), 0);
  const totalLots = lots.length;

  // Actions cell renderer
  const ActionsRenderer = (props: ICellRendererParams<InputHuskLot>) => {
    const lot = props.data;
    if (!lot) return null;

    return (
      <div className="flex items-center justify-end space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(lot);
          }}
          className="text-slate-400 hover:text-white p-2 transition-colors"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDeleteModal(lot);
          }}
          className="text-slate-400 hover:text-red-400 p-2 transition-colors"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    );
  };

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<InputHuskLot>[]>(() => [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 80,
      maxWidth: 100,
    },
    {
      field: 'supplier',
      headerName: 'Supplier ID',
      minWidth: 120,
    },
    {
      field: 'dateReceived',
      headerName: 'Date Received',
      minWidth: 130,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return params.value.substring(0, 10);
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      minWidth: 120,
      cellRenderer: QuantityRenderer,
      cellRendererParams: { unit: 'kg' },
    },
    {
      field: 'quality',
      headerName: 'Quality',
      minWidth: 110,
      cellRenderer: BadgeRenderer,
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      minWidth: 120,
      cellRenderer: CurrencyRenderer,
    },
    {
      field: 'grossCost',
      headerName: 'Gross Cost',
      minWidth: 120,
      cellRenderer: CurrencyRenderer,
    },
    {
      field: 'netCost',
      headerName: 'Net Cost',
      minWidth: 120,
      cellRenderer: CurrencyRenderer,
    },
    {
      headerName: 'Actions',
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      filter: false,
      cellRenderer: ActionsRenderer,
    },
  ], []);

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
          <button
            onClick={fetchLots}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

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
          <p className="text-slate-400 text-sm">Total Lots</p>
          <p className="text-2xl font-bold text-amber-400">{totalLots}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreateModal}
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
          loading={loading}
        />
      </div>

      {/* Create/Edit Input Lot Modal */}
      <InputCocohuskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLot(null);
        }}
        onSubmit={selectedLot ? handleUpdate : handleCreate}
        inputHuskLot={selectedLot}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteInputCocoHuskModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLot(null);
        }}
        onConfirm={handleDelete}
        lotId={selectedLot?.id?.toString() || ''}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default InputHuskTab;
