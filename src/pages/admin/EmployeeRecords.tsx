import { useCallback, useEffect, useMemo, useState } from "react";
import employeeRecordsService, { type CreateEmployeeRecordData } from "../../services/employeeRecordsService";
import type { EmployeeRecord } from "../../utils/types";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { ActionsRenderer, DataGrid } from '../../components/common';
import { EmployeeRecordModal, DeleteEmployeeRecordModal } from "../../components/Admin/EmployeeRecord";

const EmployeeRecords = () => {
    // State
    const [employeeRecords, setEmployeeRecords] = useState<EmployeeRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEmployeeRecord, setSelectedEmployeeRecord] = useState<EmployeeRecord | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Fetches employee records from API
     */
    const fetchEmployeeRecords = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await employeeRecordsService.getAll();
            setEmployeeRecords(response.data.results);
        } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Failed to fetch employee records';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployeeRecords();
    }, [fetchEmployeeRecords]);

    /**
     * Opens the create modal
     */
    const openCreateModal = () => {
        setSelectedEmployeeRecord(null);
        setIsModalOpen(true);
    };

    /**
     * Opens the edit modal
     */
    const openEditModal = (record: EmployeeRecord) => {
        setSelectedEmployeeRecord(record);
        setIsModalOpen(true);
    };

    /**
     * Opens the delete confirmation modal
     */
    const openDeleteModal = (record: EmployeeRecord) => {
        setSelectedEmployeeRecord(record);
        setIsDeleteModalOpen(true);
    };

    /**
     * Handles creating a new employee record
     */
    const handleCreate = async (data: CreateEmployeeRecordData) => {
        setIsSubmitting(true);
        try {
            const response = await employeeRecordsService.create(data);
            setEmployeeRecords(prev => [response.data, ...prev]);
            setIsModalOpen(false);
            setSelectedEmployeeRecord(null);
        } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Failed to create employee record';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles updating an employee record
     */
    const handleUpdate = async (data: CreateEmployeeRecordData) => {
        if (!selectedEmployeeRecord?.id) return;
        setIsSubmitting(true);
        try {
            const response = await employeeRecordsService.update(selectedEmployeeRecord.id, data);
            setEmployeeRecords(prev =>
                prev.map(record => record.id === selectedEmployeeRecord.id ? response.data : record)
            );
            setIsModalOpen(false);
            setSelectedEmployeeRecord(null);
        } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Failed to update employee record';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles deleting an employee record
     */
    const handleDelete = async () => {
        if (!selectedEmployeeRecord?.id) return;
        setIsSubmitting(true);
        try {
            await employeeRecordsService.delete(selectedEmployeeRecord.id);
            setEmployeeRecords(prev =>
                prev.filter(record => record.id !== selectedEmployeeRecord.id)
            );
            setIsDeleteModalOpen(false);
            setSelectedEmployeeRecord(null);
        } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : 'Failed to delete employee record';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Gets formatted record info for delete modal
     */
    const getRecordInfo = (record: EmployeeRecord | null): string => {
        if (!record) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `User #${record.user} - ${months[record.month - 1]} ${record.day}, ${record.year} (${record.hours}h)`;
    };

    // AG Grid column definitions
    const columnDefs = useMemo<ColDef<EmployeeRecord>[]>(() => [
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
        { field: 'hours', headerName: 'Hours', minWidth: 100 },
        { field: 'otHours', headerName: 'OT Hours', minWidth: 100 },
        { field: 'remarks', headerName: 'Remarks', minWidth: 150, flex: 1 },
        { 
            headerName: 'Actions', 
            minWidth: 100, 
            maxWidth: 100, 
            sortable: false, 
            filter: false, 
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
                onEdit: (data: EmployeeRecord) => openEditModal(data),
                onDelete: (data: EmployeeRecord) => openDeleteModal(data)
            },
        },
    ], []);

    // Calculate summary stats
    const totalRecords = employeeRecords.length;
    const totalHours = employeeRecords.reduce((sum, r) => sum + parseFloat(r.hours || '0'), 0);
    const totalOtHours = employeeRecords.reduce((sum, r) => sum + parseFloat(r.otHours || '0'), 0);

    return (
        <div className="p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        📋 Employee Records
                    </h1>
                    <p className="text-slate-400">
                        Manage employee attendance and work hours
                    </p>
                </div>

                {/* Add Employee Record Button */}
                <button
                    onClick={openCreateModal}
                    className="btn-primary flex items-center space-x-2 self-start"
                >
                    <span>+</span>
                    <span>Add Record</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
                    {error}
                    <button
                        onClick={fetchEmployeeRecords}
                        className="ml-4 underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Records</p>
                    <p className="text-2xl font-bold text-white">{totalRecords}</p>
                </div>
                <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
                    <p className="text-slate-400 text-sm">Total Hours</p>
                    <p className="text-2xl font-bold text-emerald-400">{totalHours.toFixed(1)}h</p>
                </div>
                <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
                    <p className="text-slate-400 text-sm">Total OT Hours</p>
                    <p className="text-2xl font-bold text-amber-400">{totalOtHours.toFixed(1)}h</p>
                </div>
            </div>

            {/* AG Grid Table */}
            <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 p-0 overflow-hidden">
                <DataGrid<EmployeeRecord>
                    rowData={employeeRecords}
                    columnDefs={columnDefs}
                    height="500px"
                    pagination={true}
                    pageSize={10}
                    loading={loading}
                />
            </div>

            {/* Create/Edit Employee Record Modal */}
            <EmployeeRecordModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedEmployeeRecord(null);
                }}
                onSubmit={selectedEmployeeRecord ? handleUpdate : handleCreate}
                employeeRecord={selectedEmployeeRecord}
                isLoading={isSubmitting}
            />

            {/* Delete Confirmation Modal */}
            <DeleteEmployeeRecordModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedEmployeeRecord(null);
                }}
                onConfirm={handleDelete}
                recordInfo={getRecordInfo(selectedEmployeeRecord)}
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default EmployeeRecords;
