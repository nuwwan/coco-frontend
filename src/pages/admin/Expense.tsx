/**
 * Expenses Page Component
 * Manages Expense data with AG Grid and CRUD operations
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ColDef } from 'ag-grid-community';
import { DataGrid, ActionsRenderer } from '../../components/common';
import { ExpenseModal, DeleteExpenseModal } from '../../components/Admin/Expenses';
import type { Expense } from '../../utils/types';
import expenseService, { type CreateExpenseData } from '../../services/expenseService';

const Expenses = () => {
  // State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Fetches expenses from API
   */
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await expenseService.getAll();
      setExpenses(response.data.results);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to fetch expenses';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  /**
   * Handles creating a new expense
   */
  const handleCreate = async (data: CreateExpenseData) => {
    setIsSubmitting(true);

    try {
      const response = await expenseService.create(data);
      setExpenses(prev => [response.data, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to create expense';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles updating a expense
   */
  const handleUpdate = async (data: CreateExpenseData) => {
    if (!selectedExpense?.id) return;
    setIsSubmitting(true);

    try {
      const response = await expenseService.update(selectedExpense.id, data);
      setExpenses(prev =>
        prev.map(expense => (expense.id === selectedExpense.id ? response.data : expense))
      );
      setIsModalOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to update expense';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles deleting a expense
   */
  const handleDelete = async () => {
    if (!selectedExpense?.id) return;
    setIsSubmitting(true);

    try {
      await expenseService.delete(selectedExpense.id);
      setExpenses(prev => prev.filter(expense => expense.id !== selectedExpense.id));
      setIsDeleteModalOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to delete expense';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Opens the create modal
   */
  const openCreateModal = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  /**
   * Opens the edit modal
   */
  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  /**
   * Opens the delete confirmation modal
   */
  const openDeleteModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  // Calculate summary stats
  const totalExpenses = expenses.length;

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<Expense>[]>(() => [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 80,
      maxWidth: 100,
    },
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 200,
      cellClass: 'font-medium text-white',
    },
    {
      field: 'expenseType',
      headerName: 'Expense Type',
      minWidth: 150,
    },
    {
      field: 'year',
      headerName: 'Year',
      minWidth: 150,
    },
    {
      field: 'month',
      headerName: 'Month',
      minWidth: 150,
    },
    {
      field: 'day',
      headerName: 'Day',
      minWidth: 150,
    },
    {
      field: 'cost',
      headerName: 'Cost',
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
        onEdit: (data: Expense) => openEditModal(data),
        onDelete: (data: Expense) => openDeleteModal(data),
      },
    },
  ], []);

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            � Expenses
          </h1>
          <p className="text-slate-400">
            Manage your expenses and their information
          </p>
        </div>

        {/* Add Buyer Button */}
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center space-x-2 self-start"
        >
          <span>+</span>
          <span>Add Expense</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
          <button
            onClick={fetchExpenses}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Total Expenses</p>
          <p className="text-2xl font-bold text-white">{totalExpenses}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Active Partners</p>
          <p className="text-2xl font-bold text-emerald-400">{totalExpenses}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">This Month</p>
          <p className="text-2xl font-bold text-blue-400">-</p>
        </div>
      </div>

      {/* AG Grid Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 p-0 overflow-hidden">
        <DataGrid<Expense>
          rowData={expenses}
          columnDefs={columnDefs}
          height="500px"
          pagination={true}
          pageSize={10}
          loading={loading}
        />
      </div>

      {/* Create/Edit Buyer Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={selectedExpense ? handleUpdate : handleCreate}
        expense={selectedExpense}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteExpenseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedExpense(null);
        }}
        onConfirm={handleDelete}
        expenseTitle={selectedExpense?.title || ''}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Expenses;

