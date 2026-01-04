/**
 * Suppliers Page Component
 * Manages supplier data with AG Grid and CRUD operations
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { DataGrid } from '../../components/common';
import { SupplierModal, DeleteSupplierModal } from '../../components/Admin/Suppliers';
import supplierService, { type CreateSupplierData } from '../../services/supplierService';
import type { Supplier } from '../../utils/types';

const Suppliers = () => {
  // State
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Fetches suppliers from API
   */
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await supplierService.getAll();
      setSuppliers(response.data.results);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to fetch suppliers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch suppliers on mount
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  /**
   * Handles creating a new supplier
   */
  const handleCreate = async (data: CreateSupplierData) => {
    setIsSubmitting(true);

    try {
      const response = await supplierService.create(data);
      setSuppliers(prev => [response.data, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to create supplier';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles updating a supplier
   */
  const handleUpdate = async (data: CreateSupplierData) => {
    if (!selectedSupplier?.id) return;
    setIsSubmitting(true);

    try {
      const response = await supplierService.update(selectedSupplier.id, data);
      setSuppliers(prev =>
        prev.map(sup => (sup.id === selectedSupplier.id ? response.data : sup))
      );
      setIsModalOpen(false);
      setSelectedSupplier(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to update supplier';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles deleting a supplier
   */
  const handleDelete = async () => {
    if (!selectedSupplier?.id) return;
    setIsSubmitting(true);

    try {
      await supplierService.delete(selectedSupplier.id);
      setSuppliers(prev => prev.filter(sup => sup.id !== selectedSupplier.id));
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to delete supplier';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Opens the create modal
   */
  const openCreateModal = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  /**
   * Opens the edit modal
   */
  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  /**
   * Opens the delete confirmation modal
   */
  const openDeleteModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  // Calculate summary stats
  const totalSuppliers = suppliers.length;

  // Actions cell renderer
  const ActionsRenderer = (props: ICellRendererParams<Supplier>) => {
    const supplier = props.data;
    if (!supplier) return null;

    return (
      <div className="flex items-center justify-end space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(supplier);
          }}
          className="text-slate-400 hover:text-white p-2 transition-colors"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDeleteModal(supplier);
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
  const columnDefs = useMemo<ColDef<Supplier>[]>(() => [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 80,
      maxWidth: 100,
    },
    {
      field: 'name',
      headerName: 'Supplier Name',
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
    },
  ], []);

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            🏭 Suppliers
          </h1>
          <p className="text-slate-400">
            Manage your suppliers and their information
          </p>
        </div>

        {/* Add Supplier Button */}
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center space-x-2 self-start"
        >
          <span>+</span>
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
          <button
            onClick={fetchSuppliers}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Total Suppliers</p>
          <p className="text-2xl font-bold text-white">{totalSuppliers}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Active Partners</p>
          <p className="text-2xl font-bold text-emerald-400">{totalSuppliers}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">This Month</p>
          <p className="text-2xl font-bold text-blue-400">-</p>
        </div>
      </div>

      {/* AG Grid Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 p-0 overflow-hidden">
        <DataGrid<Supplier>
          rowData={suppliers}
          columnDefs={columnDefs}
          height="500px"
          pagination={true}
          pageSize={10}
          loading={loading}
        />
      </div>

      {/* Create/Edit Supplier Modal */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplier(null);
        }}
        onSubmit={selectedSupplier ? handleUpdate : handleCreate}
        supplier={selectedSupplier}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteSupplierModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSupplier(null);
        }}
        onConfirm={handleDelete}
        supplierName={selectedSupplier?.name || ''}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Suppliers;

