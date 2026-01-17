/**
 * SalaryPaymentModal Component
 * Modal form for creating salary records
 * - Select salary term from dropdown
 * - Search and select employee
 * - Auto-calculate salary based on employee records for the period
 */

import { useState, useEffect, type FormEvent } from 'react';
import EmployeeSearchSection from './EmployeeSearchSection';
import type { EmployeebasicDetails, EmployeeRecord, SalaryPayment, SalaryTerm } from '../../../utils/types';
import type { CreateSalaryRecordData } from '../../../services/salaryRecordsService';
import { salaryRecordsService } from '../../../services/salaryRecordsService';

interface SalaryPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSalaryRecordData) => void;
  salaryPayment?: SalaryPayment | null;
  isLoading?: boolean;
}

const SalaryPaymentModal = ({ isOpen, onClose, onSubmit, salaryPayment, isLoading = false }: SalaryPaymentModalProps) => {
  const isEditMode = !!salaryPayment;

  // Salary terms state
  const [salaryTerms, setSalaryTerms] = useState<SalaryTerm[]>([]);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [selectedSalaryTerm, setSelectedSalaryTerm] = useState<SalaryTerm | null>(null);

  // Employee state
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeebasicDetails | null>(null);

  // Employee records for period
  const [employeeRecords, setEmployeeRecords] = useState<EmployeeRecord[]>([]);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [overtimeRate, setOvertimeRate] = useState<number>(0);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Calculated salary
  const [calculatedSalary, setCalculatedSalary] = useState<number>(0);

  // Form data
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  /**
   * Fetch salary terms on mount
   */
  useEffect(() => {
    if (isOpen) {
      fetchSalaryTerms();
    }
  }, [isOpen]);

  /**
   * Fetch salary terms from API
   */
  const fetchSalaryTerms = async () => {
    setLoadingTerms(true);
    try {
      const response = await salaryRecordsService.getSalaryTerms();
      setSalaryTerms(response.data?.results || []);
    } catch (err) {
      console.error('Failed to fetch salary terms:', err);
      setError('Failed to load salary terms');
    } finally {
      setLoadingTerms(false);
    }
  };

  /**
   * Fetch employee records when both salary term and employee are selected
   */
  useEffect(() => {
    if (selectedSalaryTerm && selectedEmployee) {
      fetchEmployeeRecordsForPeriod();
    } else {
      // Reset if either is not selected
      setEmployeeRecords([]);
      setHourlyRate(0);
      setOvertimeRate(0);
      setCalculatedSalary(0);
    }
  }, [selectedSalaryTerm, selectedEmployee]);

  /**
   * Fetch employee records for the selected period
   */
  const fetchEmployeeRecordsForPeriod = async () => {
    if (!selectedEmployee || !selectedSalaryTerm) return;

    setLoadingRecords(true);
    setError('');

    try {
      const response = await salaryRecordsService.getEmployeeRecordsForPeriod(
        selectedEmployee.userId,
        selectedSalaryTerm.id
      );

      const data = response.data?.results;
      if (data) {
        setEmployeeRecords(data.employee_records || []);
        setHourlyRate(data.hourly_rate || 0);
        setOvertimeRate(data.overtime_rate || 0);

        // Calculate salary based on records
        calculateSalary(data.employee_records, data.hourly_rate, data.overtime_rate);
      }
    } catch (err) {
      console.error('Failed to fetch employee records:', err);
      setError('Failed to fetch employee records for this period');
      setEmployeeRecords([]);
      setCalculatedSalary(0);
    } finally {
      setLoadingRecords(false);
    }
  };

  /**
   * Calculate salary based on employee records, hourly rate, and overtime rate
   */
  const calculateSalary = (records: EmployeeRecord[], hRate: number, otRate: number) => {
    let totalHours = 0;
    let totalOtHours = 0;

    records.forEach(record => {
      totalHours += parseFloat(record.hours) || 0;
      totalOtHours += parseFloat(record.otHours) || 0;
    });

    const regularPay = totalHours * hRate;
    const overtimePay = totalOtHours * otRate;
    const total = regularPay + overtimePay;

    setCalculatedSalary(total);
  };

  /**
   * Reset form when modal opens/closes
   */
  useEffect(() => {
    if (!isOpen) {
      setSelectedSalaryTerm(null);
      setSelectedEmployee(null);
      setEmployeeRecords([]);
      setHourlyRate(0);
      setOvertimeRate(0);
      setCalculatedSalary(0);
      setRemarks('');
      setError('');
    }
  }, [isOpen]);

  /**
   * Populate form when editing
   */
  useEffect(() => {
    if (salaryPayment && isOpen) {
      setRemarks(salaryPayment.remarks || '');
      // In edit mode, find and set the salary term
      const term = salaryTerms.find(t => t.id === salaryPayment.salaryTerm.id);
      if (term) setSelectedSalaryTerm(term);
      
      // Set employee placeholder for edit mode
      if (salaryPayment.user) {
        setSelectedEmployee({
          id: salaryPayment.user,
          userId: salaryPayment.user,
          firstName: 'Employee',
          lastName: `#${salaryPayment.user}`,
          username: '',
          position: '',
          contactNumber: '',
        });
      }
      setCalculatedSalary(parseFloat(salaryPayment.salary) || 0);
    }
  }, [salaryPayment, isOpen, salaryTerms]);

  /**
   * Handles salary term selection
   */
  const handleSalaryTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const termId = parseInt(e.target.value);
    const term = salaryTerms.find(t => t.id === termId) || null;
    setSelectedSalaryTerm(term);
    if (error) setError('');
  };

  /**
   * Handles employee selection
   */
  const handleEmployeeSelect = (employee: EmployeebasicDetails | null) => {
    setSelectedEmployee(employee);
    if (error) setError('');
  };

  /**
   * Validates form data
   */
  const validateForm = (): string | null => {
    if (!selectedSalaryTerm) {
      return 'Please select a salary term';
    }
    if (!selectedEmployee) {
      return 'Please search and select an employee';
    }
    if (calculatedSalary <= 0) {
      return 'No salary calculated. Employee may not have records for this period.';
    }
    return null;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const submitData: CreateSalaryRecordData = {
      user: selectedEmployee!.userId,
      salaryTerm: selectedSalaryTerm!.id,
      salary: calculatedSalary.toFixed(2),
      remarks: remarks,
    };

    onSubmit(submitData);
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setError('');
    setSelectedSalaryTerm(null);
    setSelectedEmployee(null);
    onClose();
  };

  /**
   * Formats date for display
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Calculate totals for display
   */
  const getTotals = () => {
    let totalHours = 0;
    let totalOtHours = 0;

    employeeRecords.forEach(record => {
      totalHours += parseFloat(record.hours) || 0;
      totalOtHours += parseFloat(record.otHours) || 0;
    });

    return { totalHours, totalOtHours };
  };

  const { totalHours, totalOtHours } = getTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? '✏️ Edit Salary Record' : '💰 Create Salary Record'}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Salary Term Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              📅 Select Salary Term *
            </label>
            <select
              value={selectedSalaryTerm?.id || ''}
              onChange={handleSalaryTermChange}
              disabled={isLoading || loadingTerms || isEditMode}
              className="input-field bg-slate-700 border-slate-600 text-white w-full"
            >
              <option value="">
                {loadingTerms ? 'Loading salary terms...' : 'Select a salary term'}
              </option>
              {salaryTerms.map(term => (
                <option key={term.id} value={term.id}>
                  {term.title} ({formatDate(term.startDate)} - {formatDate(term.endDate)})
                </option>
              ))}
            </select>
            {selectedSalaryTerm && (
              <p className="mt-2 text-slate-400 text-xs">
                Period: {formatDate(selectedSalaryTerm.startDate)} to {formatDate(selectedSalaryTerm.endDate)}
              </p>
            )}
          </div>

          {/* Step 2: Employee Search Section */}
          <div className="border-t border-slate-700 pt-4">
            <EmployeeSearchSection
              onEmployeeSelect={handleEmployeeSelect}
              selectedEmployee={selectedEmployee}
              isEditMode={isEditMode}
              disabled={isLoading || !selectedSalaryTerm}
            />
            {!selectedSalaryTerm && !isEditMode && (
              <p className="text-amber-400 text-xs -mt-4">
                Please select a salary term first
              </p>
            )}
          </div>

          {/* Step 3: Salary Calculation Results */}
          {(loadingRecords || (selectedSalaryTerm && selectedEmployee)) && (
            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-sm font-medium text-slate-300 mb-4">
                💵 Salary Calculation
              </h3>

              {loadingRecords ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-slate-400">Calculating salary...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Work Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 text-xs">Records Found</p>
                      <p className="text-white font-semibold">{employeeRecords.length}</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 text-xs">Total Hours</p>
                      <p className="text-white font-semibold">{totalHours.toFixed(1)}</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 text-xs">OT Hours</p>
                      <p className="text-white font-semibold">{totalOtHours.toFixed(1)}</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 text-xs">Days Worked</p>
                      <p className="text-white font-semibold">{employeeRecords.length}</p>
                    </div>
                  </div>

                  {/* Rates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                      <p className="text-blue-400 text-xs">Hourly Rate</p>
                      <p className="text-white font-semibold">Rs. {hourlyRate.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-purple-900/30 border border-purple-700 rounded-lg">
                      <p className="text-purple-400 text-xs">Overtime Rate</p>
                      <p className="text-white font-semibold">Rs. {overtimeRate.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Calculation Breakdown */}
                  <div className="p-4 bg-slate-700/30 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Regular Pay ({totalHours.toFixed(1)} hrs × Rs. {hourlyRate.toFixed(2)})</span>
                      <span>Rs. {(totalHours * hourlyRate).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Overtime Pay ({totalOtHours.toFixed(1)} hrs × Rs. {overtimeRate.toFixed(2)})</span>
                      <span>Rs. {(totalOtHours * overtimeRate).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-600 pt-2 mt-2">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total Salary</span>
                        <span className="text-emerald-400">Rs. {calculatedSalary.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Salary (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      💰 Calculated Salary (Auto-calculated, read-only)
                    </label>
                    <input
                      type="text"
                      value={`Rs. ${calculatedSalary.toFixed(2)}`}
                      readOnly
                      disabled
                      className="input-field bg-slate-600 border-slate-500 text-emerald-400 font-bold text-lg cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Remarks */}
          <div className="border-t border-slate-700 pt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              📝 Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Additional notes about this salary payment..."
              rows={3}
              className="input-field bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none w-full"
            />
          </div>

          {/* Readonly timestamps for edit mode */}
          {isEditMode && salaryPayment && (
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-3">📅 Timestamps</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Created At</p>
                  <p className="text-white">{formatDate(salaryPayment.createdAt)}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-400">Updated At</p>
                  <p className="text-white">{formatDate(salaryPayment.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isLoading || loadingRecords || !selectedSalaryTerm || !selectedEmployee || calculatedSalary <= 0}
              className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Salary Record' : 'Create Salary Record'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryPaymentModal;
