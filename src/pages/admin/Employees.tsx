/**
 * Employees Page Component
 * Manages employee data with AG Grid and CRUD operations
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { DataGrid, BadgeRenderer, AvatarRenderer } from '../../components/common';
import { EmployeeModal, DeleteConfirmModal } from '../../components/Admin/Employees';
import employeeService, {  type CreateEmployeeData, type UpdateEmployeeData } from '../../services/employeeService';
import type { Employee } from '../../utils/types';
import { config } from '../../config/env';

interface TableEmployee {
  id: number;
  name: string;
  birth_date: string;
  contact_number: string;
  created_at: string;
  gender: string;
  hourly_rate: number;
  is_active: boolean;
  joined_date: string;
  position: string;
}

const Employees = () => {
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Fetches employees from API
   */
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.getAll();
      setEmployees(response.data.employees);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to fetch employees';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  /**
   * Handles creating a new employee
   */
  const handleCreate = async (data: Employee) => {
    setIsSubmitting(true);

    try {
      if(!data.user.id) return;
      const createData: CreateEmployeeData = {
        userId: data.user.id,
        gender: data.gender,
        birthDate: data.birthDate || '',
        address: data.address || '',
        contactNumber: data.contactNumber || '',
        position: data.position || '',
        hourlyRate: data.hourlyRate || 0,
        joinedDate: data.joinedDate || '',
        resignedDate: data.resignedDate || '',
        description: data.description || '',
        isActive: data.isActive || true,
      };
      const response = await employeeService.create(createData);
      setEmployees(prev => [...prev, response.data]);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to create employee';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles updating an employee
   */
  const handleUpdate = async (data: Employee) => {
    if (!selectedEmployee) return;
    setIsSubmitting(true);

    try {
      if(!selectedEmployee.id) return;
      const updateData: UpdateEmployeeData = {
        id: selectedEmployee.id,
        userId: data.user.id,
        gender: data.gender,
        birthDate: data.birthDate || undefined,
        address: data.address || '',
        contactNumber: data.contactNumber || '',
        position: data.position || '',
        hourlyRate: data.hourlyRate || 0,
        joinedDate: data.joinedDate || '',
        resignedDate: data.resignedDate || undefined,
        description: data.description || '',
        isActive: data.isActive || true,
      };
      const response = await employeeService.update(selectedEmployee.id, updateData);
      setEmployees(prev =>
        prev.map(emp => (emp.id === selectedEmployee.id ? { ...emp, ...response.data } : emp))
      );
      setIsModalOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to update employee';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles deleting an employee
   */
  const handleDelete = async () => {
    if (!selectedEmployee) return;
    setIsSubmitting(true);

    try {
      if(!selectedEmployee.id) return;
      await employeeService.delete(selectedEmployee.id);
      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to delete employee';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Opens the create modal
   */
  const openCreateModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  /**
   * Opens the edit modal
   */
  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  /**
   * Opens the delete confirmation modal
   */
  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  // Calculate summary stats
  const totalEmployees = employees.length;
  const activeCount = employees.filter(emp => emp.isActive).length;
  const departmentCount = employees.filter(emp => emp.isActive).length; // TODO: Add department count

  // Actions cell renderer
  const ActionsRenderer = (props: ICellRendererParams<Employee>) => {
    const employee = props.data;
    if (!employee) return null;

    return (
      <div className="flex items-center justify-end space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(employee);
          }}
          className="text-slate-400 hover:text-white p-2 transition-colors"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDeleteModal(employee);
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
  const columnDefs = useMemo<ColDef<Employee>[]>(() => [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 120
    },
    {
      field: 'user.firstName',
      headerName: 'First Name',
      minWidth: 200,
    },
    {
      field: 'user.lastName',
      headerName: 'Last Name',
      minWidth: 200,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      minWidth: 140,
    },
    {
      field: 'hourlyRate',
      headerName: 'Hourly Rate',
      minWidth: 120,
    },
    {
      field: 'isActive',
      headerName: 'Is Active',
      minWidth: 100,
    },
    {
      field: 'joinedDate',
      headerName: 'Joined Date',
      minWidth: 120,
    },
    {
      field: 'position',
      headerName: 'Position',
      minWidth: 120,
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
            Employees
          </h1>
          <p className="text-slate-400">
            Manage your team members and their roles
          </p>
        </div>

        {/* Add Employee Button */}
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center space-x-2 self-start"
        >
          <span>+</span>
          <span>Add Employee</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
          <button
            onClick={fetchEmployees}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Total Employees</p>
          <p className="text-2xl font-bold text-white">{totalEmployees}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Active Employees</p>
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
        </div>
        <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
          <p className="text-slate-400 text-sm">Departments</p>
          <p className="text-2xl font-bold text-blue-400">{departmentCount}</p>
        </div>
      </div>

      {/* AG Grid Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 p-0 overflow-hidden">
        <DataGrid<Employee>
          rowData={employees}
          columnDefs={columnDefs}
          height="500px"
          pagination={true}
          pageSize={10}
          loading={loading}
        />
      </div>

      {/* Create/Edit Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={selectedEmployee ? handleUpdate : handleCreate}
        employee={selectedEmployee}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleDelete}
        employeeName={selectedEmployee ? selectedEmployee.user.firstName : ''}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Employees;
