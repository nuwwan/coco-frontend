import { useCallback, useEffect, useMemo, useState } from "react";
import type {  SalaryPayment } from "../../utils/types";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { ActionsRenderer, DataGrid } from '../../components/common';
import { salaryPaymentService, type CreateSalaryPaymentData } from "../../services/salaryPaymentService";
import SalaryPaymentModal from "../../components/Admin/SalaryPayment/SalaryPaymentModal";
import DeleteSalaryPaymentModal from "../../components/Admin/SalaryPayment/DeleteSalaryPaymentModal";

const SalaryPayments = () => {
    // State
    const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSalaryPayment, setSelectedSalaryPayment] = useState<SalaryPayment | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Fetches employee records from API
     */
    const fetchSalaryPayments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await salaryPaymentService.getAll();
            setSalaryPayments(response.data.results);
        } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Failed to fetch salary payments';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSalaryPayments();
    }, [fetchSalaryPayments]);

    /**
     * Opens the create modal
     */
    const openCreateModal = () => {
        setSelectedSalaryPayment(null);
        setIsModalOpen(true);
    };

    /**
     * Opens the edit modal
     */
    const openEditModal = (record: SalaryPayment) => {
        setSelectedSalaryPayment(record);
        setIsModalOpen(true);
    };

    /**
     * Opens the delete confirmation modal
     */
    const openDeleteModal = (record: SalaryPayment) => {
        setSelectedSalaryPayment(record);
        setIsDeleteModalOpen(true);
    };

    /**
     * Handles creating a new employee record
     */
    const handleCreate = async (data: CreateSalaryPaymentData) => {
        setIsSubmitting(true);
        try {
            const response = await salaryPaymentService.create(data);
            setSalaryPayments(prev => [response.data, ...prev]);
            setIsModalOpen(false);
            setSelectedSalaryPayment(null);
        } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Failed to create salary payment';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles updating an employee record
     */
    const handleUpdate = async (data: CreateSalaryPaymentData) => {
        if (!selectedSalaryPayment?.id) return;
        setIsSubmitting(true);
        try {
            const response = await salaryPaymentService.update(selectedSalaryPayment.id, data);
            setSalaryPayments(prev =>
                prev.map(record => record.id === selectedSalaryPayment.id ? response.data : record)
            );
            setIsModalOpen(false);
            setSelectedSalaryPayment(null);
        } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Failed to update salary payment';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles deleting an employee record
     */
    const handleDelete = async () => {
        if (!selectedSalaryPayment?.id) return;
        setIsSubmitting(true);
        try {
            await salaryPaymentService.delete(selectedSalaryPayment.id);
            setSalaryPayments(prev =>
                prev.filter(record => record.id !== selectedSalaryPayment.id)
            );
            setIsDeleteModalOpen(false);
            setSelectedSalaryPayment(null);
        } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Failed to delete salary payment';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Gets formatted record info for delete modal
     */
    const getSalaryPaymentInfo = (record: SalaryPayment | null): string => {
        if (!record) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `User #${record.user} - ${months[record.month - 1]} ${record.day}, ${record.year} (${record.salary})`;
    };

    // AG Grid column definitions
    const columnDefs = useMemo<ColDef<SalaryPayment>[]>(() => [
        { field: 'id', headerName: 'ID', minWidth: 80, maxWidth: 100 },
        { field: 'user', headerName: 'User ID', minWidth: 100 },
        { field: 'year', headerName: 'Year', minWidth: 100 },
        { 
            field: 'month', 
            headerName: 'Month', 
            minWidth: 100,
            valueFormatter: (params) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months[params.value - 1] || params.value;
            }
        },
        { field: 'day', headerName: 'Day', minWidth: 80 },
        { field: 'salary', headerName: 'Salary', minWidth: 100 },
        { field: 'remarks', headerName: 'Remarks', minWidth: 150, flex: 1 },
        { 
            headerName: 'Actions', 
            minWidth: 100, 
            maxWidth: 100, 
            sortable: false, 
            filter: false, 
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
                onEdit: (data: SalaryPayment) => openEditModal(data),
                onDelete: (data: SalaryPayment) => openDeleteModal(data)
            },
        },
    ], []);

    // Calculate summary stats
    const totalRecords = salaryPayments.length;
    const totalSalary = salaryPayments.reduce((sum, r) => sum + parseFloat(r.salary || '0'), 0);

    return (
        <div className="p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        📋 Salary Payments
                    </h1>
                    <p className="text-slate-400">
                        Manage salary payments
                    </p>
                </div>

                {/* Add Employee Record Button */}
                <button
                    onClick={openCreateModal}
                    className="btn-primary flex items-center space-x-2 self-start"
                >
                    <span>+</span>
                    <span>Add Salary Payment</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
                    {error}
                    <button
                        onClick={fetchSalaryPayments}
                        className="ml-4 underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Salary Payments</p>
                    <p className="text-2xl font-bold text-white">{totalRecords}</p>
                </div>
                <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Salary</p>
                    <p className="text-2xl font-bold text-emerald-400">{totalSalary.toFixed(2)}</p>
                </div>
            </div>

            {/* AG Grid Table */}
            <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 p-0 overflow-hidden">
                <DataGrid<SalaryPayment>
                    rowData={salaryPayments}
                    columnDefs={columnDefs}
                    height="500px"
                    pagination={true}
                    pageSize={10}
                    loading={loading}
                />
            </div>

            {/* Create/Edit Employee Record Modal */}
            <SalaryPaymentModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSalaryPayment(null);
                }}
                onSubmit={selectedSalaryPayment ? handleUpdate : handleCreate}
                salaryPayment={selectedSalaryPayment}
                isLoading={isSubmitting}
            />

            {/* Delete Confirmation Modal */}
            <DeleteSalaryPaymentModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedSalaryPayment(null);
                }}
                onConfirm={handleDelete}
                salaryPaymentInfo={getSalaryPaymentInfo(selectedSalaryPayment)}
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default SalaryPayments;
