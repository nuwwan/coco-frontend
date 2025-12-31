/**
 * Employees Page Component
 * Manages employee data and operations
 */

import { useState } from 'react';

// Mock employee data - replace with API data
interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const mockEmployees: Employee[] = [
  { id: 1, name: 'John Doe', role: 'Manager', email: 'john@coco.com', status: 'active', joinDate: '2024-01-15' },
  { id: 2, name: 'Jane Smith', role: 'Supervisor', email: 'jane@coco.com', status: 'active', joinDate: '2024-02-20' },
  { id: 3, name: 'Bob Johnson', role: 'Worker', email: 'bob@coco.com', status: 'active', joinDate: '2024-03-10' },
  { id: 4, name: 'Alice Brown', role: 'Worker', email: 'alice@coco.com', status: 'inactive', joinDate: '2024-04-05' },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees] = useState<Employee[]>(mockEmployees);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 max-w-md"
        />
      </div>

      {/* Employees Table */}
      <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Name</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Role</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium hidden md:table-cell">Join Date</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-right py-4 px-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                        {employee.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{employee.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{employee.role}</td>
                  <td className="py-4 px-4 text-slate-300 hidden sm:table-cell">{employee.email}</td>
                  <td className="py-4 px-4 text-slate-300 hidden md:table-cell">{employee.joinDate}</td>
                  <td className="py-4 px-4">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-slate-400 hover:text-white p-2 transition-colors">
                      ✏️
                    </button>
                    <button className="text-slate-400 hover:text-red-400 p-2 transition-colors">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No employees found matching your search.</p>
          </div>
        )}
      </div>

      {/* Development Note */}
      <div className="mt-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
        <p className="text-emerald-400 text-sm">
          💡 <strong>Development Note:</strong> This is a placeholder page. 
          Connect to your backend API for real employee data management.
        </p>
      </div>
    </div>
  );
};

export default Employees;

