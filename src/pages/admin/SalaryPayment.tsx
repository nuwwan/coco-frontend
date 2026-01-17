import { useCallback, useEffect, useMemo, useState } from "react";
import type {  SalaryPayment } from "../../utils/types";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { ActionsRenderer, DataGrid } from '../../components/common';
import { salaryRecordsService, type CreateSalaryRecordData } from "../../services/salaryRecordsService";
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
            const response = await salaryRecordsService.getAll();
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
     * Opens the delete modal
     */
    const openDeleteModal = (record: SalaryPayment) => {
        setSelectedSalaryPayment(record);
        setIsDeleteModalOpen(true);
    };


    /**
     * Handles creating a new employee record
     */
    const handleCreate = async (data: CreateSalaryRecordData) => {
        setIsSubmitting(true);
        try {
            const response = await salaryRecordsService.create(data);
            setSalaryPayments(prev => [response.data.results, ...prev]);
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
     * Handles deleting an employee record
     */
    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            if (!selectedSalaryPayment?.id) return;
            await salaryRecordsService.delete(selectedSalaryPayment.id);
            setSalaryPayments(prev => prev.filter(record => record.id !== selectedSalaryPayment.id));
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
        return `User #${record.user} - Salary Term #${record.salaryTerm} - Rs. ${parseFloat(record.salary || '0').toLocaleString()}`;
    };

    // AG Grid column definitions
    const columnDefs = useMemo<ColDef<SalaryPayment>[]>(() => [
        { field: 'id', headerName: 'ID', minWidth: 80, maxWidth: 100 },
        { field: 'user', headerName: 'User ID', minWidth: 100 },
        { field: 'salaryTerm.title', headerName: 'Salary Term', minWidth: 120},
        { 
            field: 'salary', 
            headerName: 'Salary', 
            minWidth: 130,
            valueFormatter: (params) => {
                return `Rs. ${parseFloat(params.value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            }
        },
        { field: 'remarks', headerName: 'Remarks', minWidth: 150, flex: 1 },
        { 
            field: 'status', 
            headerName: 'Status', 
            minWidth: 100, 
            cellRenderer: (params: ICellRendererParams) => {
                const status = params.value;
                const statusStyles: Record<string, string> = {
                    pending: 'bg-amber-500/20 text-amber-400',
                    paid: 'bg-emerald-500/20 text-emerald-400',
                    cancelled: 'bg-red-500/20 text-red-400',
                };
                const statusLabels: Record<string, string> = {
                    pending: 'Pending',
                    paid: 'Paid',
                    cancelled: 'Cancelled',
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-slate-500/20 text-slate-400'}`}>
                        {statusLabels[status] || status}
                    </span>
                );
            }
        },
        { 
            field: 'createdAt', 
            headerName: 'Created', 
            minWidth: 120,
            valueFormatter: (params) => {
                if (!params.value) return 'N/A';
                return new Date(params.value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            }
        },
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
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Salary Paid</p>
                    <p className="text-2xl font-bold text-emerald-400">{salaryPaymentsStats?.totalPaid}</p>
                </div>
                <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Salary Pending</p>
                    <p className="text-2xl font-bold text-white">{salaryPaymentsStats?.totalPending}</p>
                </div>
            </div> */}

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
                onSubmit={handleCreate}
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
