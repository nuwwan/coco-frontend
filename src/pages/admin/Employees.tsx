/**
 * Employees Page Component
 * Manages employee data with AG Grid
 */

import { useState, useMemo } from 'react';
import type { ColDef } from 'ag-grid-community';
import { DataGrid, BadgeRenderer, AvatarRenderer } from '../../components/common';

// Employee interface
interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: string;
  department: string;
  phone: string;
}

// Mock employee data - replace with API data
const mockEmployees: Employee[] = [
  { id: 1, name: 'John Doe', role: 'Manager', email: 'john@coco.com', status: 'active', joinDate: '2024-01-15', department: 'Operations', phone: '+1 234 567 890' },
  { id: 2, name: 'Jane Smith', role: 'Supervisor', email: 'jane@coco.com', status: 'active', joinDate: '2024-02-20', department: 'Production', phone: '+1 234 567 891' },
  { id: 3, name: 'Bob Johnson', role: 'Worker', email: 'bob@coco.com', status: 'active', joinDate: '2024-03-10', department: 'Warehouse', phone: '+1 234 567 892' },
  { id: 4, name: 'Alice Brown', role: 'Worker', email: 'alice@coco.com', status: 'inactive', joinDate: '2024-04-05', department: 'Production', phone: '+1 234 567 893' },
  { id: 5, name: 'Charlie Wilson', role: 'Supervisor', email: 'charlie@coco.com', status: 'active', joinDate: '2024-05-12', department: 'Quality', phone: '+1 234 567 894' },
  { id: 6, name: 'Diana Ross', role: 'Worker', email: 'diana@coco.com', status: 'active', joinDate: '2024-06-18', department: 'Packaging', phone: '+1 234 567 895' },
  { id: 7, name: 'Edward Miller', role: 'Manager', email: 'edward@coco.com', status: 'active', joinDate: '2024-07-22', department: 'Sales', phone: '+1 234 567 896' },
  { id: 8, name: 'Fiona Garcia', role: 'Worker', email: 'fiona@coco.com', status: 'inactive', joinDate: '2024-08-30', department: 'Production', phone: '+1 234 567 897' },
];

const Employees = () => {
  const [employees] = useState<Employee[]>(mockEmployees);

  // Calculate summary stats
  const totalEmployees = employees.length;
  const activeCount = employees.filter(emp => emp.status === 'active').length;
  const departmentCount = new Set(employees.map(emp => emp.department)).size;

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef<Employee>[]>(() => [
    {
      field: 'name',
      headerName: 'Employee',
      minWidth: 200,
      cellRenderer: AvatarRenderer,
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 120,
      cellRenderer: BadgeRenderer,
    },
    {
      field: 'department',
      headerName: 'Department',
      minWidth: 130,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 180,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 140,
    },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      minWidth: 120,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      cellRenderer: BadgeRenderer,
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
        <button className="btn-primary flex items-center space-x-2 self-start">
          <span>+</span>
          <span>Add Employee</span>
        </button>
      </div>

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
        />
      </div>

      {/* Development Note */}
      <div className="mt-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
        <p className="text-emerald-400 text-sm">
          💡 <strong>Development Note:</strong> Connect to your backend API for real employee data management.
        </p>
      </div>
    </div>
  );
};

export default Employees;
