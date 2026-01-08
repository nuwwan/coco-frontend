/**
 * Buyers Page Component
 * Manages Buyer data with AG Grid and CRUD operations
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ColDef } from 'ag-grid-community';
import { DataGrid, ActionsRenderer } from '../../components/common';
import { BuyerModal, DeleteBuyerModal } from '../../components/Admin/Buyers';
import buyerService, { type CreateBuyerData } from '../../services/buyerService';
import type { Buyer } from '../../utils/types';

const Buyers = () => {
  // State
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Fetches buyers from API
   */
  const fetchBuyers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await buyerService.getAll();
      setBuyers(response.data.results);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to fetch buyers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch buyers on mount
  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  /**
   * Handles creating a new buyer
   */
  const handleCreate = async (data: CreateBuyerData) => {
    setIsSubmitting(true);

    try {
      const response = await buyerService.create(data);
      setBuyers(prev => [response.data, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to create buyer';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles updating a buyer
   */
  const handleUpdate = async (data: CreateBuyerData) => {
    if (!selectedBuyer?.id) return;
    setIsSubmitting(true);

    try {
      const response = await buyerService.update(selectedBuyer.id, data);
      setBuyers(prev =>
        prev.map(buyer => (buyer.id === selectedBuyer.id ? response.data : buyer))
      );
      setIsModalOpen(false);
      setSelectedBuyer(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to update buyer';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles deleting a buyer
   */
  const handleDelete = async () => {
    if (!selectedBuyer?.id) return;
    setIsSubmitting(true);

    try {
      await buyerService.delete(selectedBuyer.id);
      setBuyers(prev => prev.filter(buyer => buyer.id !== selectedBuyer.id));
      setIsDeleteModalOpen(false);
      setSelectedBuyer(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to delete buyer';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Opens the create modal
   */
  const openCreateModal = () => {
    setSelectedBuyer(null);
    setIsModalOpen(true);
  };

  /**
   * Opens the edit modal
   */
  const openEditModal = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
  };

  /**
   * Opens the delete confirmation modal
   */
  const openDeleteModal = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setIsDeleteModalOpen(true);
  };

  // Calculate summary stats
  const totalBuyers = buyers.length;

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<Buyer>[]>(() => [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 80,
      maxWidth: 100,
    },
    {
      field: 'name',
      headerName: 'Buyer Name',
      minWidth: 200,
      cellClass: 'font-medium text-white',
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
    },
    {
      field: 'contactNumber',
      headerName: 'Contact',
      minWidth: 150,
    },
    {
      field: 'address',
      headerName: 'Address',
      minWidth: 250,
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 200,
    },
    {
      headerName: 'Actions',
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      filter: false,
      cellRenderer: ActionsRenderer,
      cellRendererParams: {
        onEdit: (data: Buyer) => openEditModal(data),
        onDelete: (data: Buyer) => openDeleteModal(data),
      },
    },
  ], []);

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            🛒 Buyers
          </h1>
          <p className="text-slate-400">
            Manage your buyers and their information
          </p>
        </div>

        {/* Add Buyer Button */}
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center space-x-2 self-start"
        >
          <span>+</span>
          <span>Add Buyer</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
          <button
            onClick={fetchBuyers}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Total Buyers</p>
          <p className="text-2xl font-bold text-white">{totalBuyers}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Active Partners</p>
          <p className="text-2xl font-bold text-emerald-400">{totalBuyers}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">This Month</p>
          <p className="text-2xl font-bold text-blue-400">-</p>
        </div>
      </div>

      {/* AG Grid Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 p-0 overflow-hidden">
        <DataGrid<Buyer>
          rowData={buyers}
          columnDefs={columnDefs}
          height="500px"
          pagination={true}
          pageSize={10}
          loading={loading}
        />
      </div>

      {/* Create/Edit Buyer Modal */}
      <BuyerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBuyer(null);
        }}
        onSubmit={selectedBuyer ? handleUpdate : handleCreate}
        buyer={selectedBuyer}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteBuyerModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBuyer(null);
        }}
        onConfirm={handleDelete}
        buyerName={selectedBuyer?.name || ''}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Buyers;

