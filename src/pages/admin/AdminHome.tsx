/**
 * AdminHome Component
 * Dashboard home page for admin panel
 */

import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/Admin/StatsCard';
import ActivityFeed from '../../components/Admin/ActivityFeed';
import UserProfileCard from '../../components/Admin/UserProfileCard';
import LineChartCard from '../../components/Admin/LineChartCard';
import { useEffect, useState } from 'react';
import dashboardService from '../../services/dashboardService';
import type { DashboardStats } from '../../utils/types';

const AdminHome = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | undefined>(undefined);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const fetchDashboardStats = async () => {
      const response = await dashboardService.getDashboardStats(currentYear, currentMonth);
      if (response.data) {
        setDashboardStats(response.data);
      }
    };
    fetchDashboardStats();
  }, []);
  
  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-400">
          Welcome back, {user?.firstName} {user?.lastName}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Employees"
          value={dashboardStats?.total_employees?.toString() || '0'}
          icon="👥"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Suppliers"
          value={dashboardStats?.total_suppliers?.toString() || '0'}
          icon="📊"
        />
        <StatsCard
          title="Total Buyers"
          value={dashboardStats?.total_buyers?.toString() || '0'}
          icon="💰"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Growth"
          value="+23%"
          icon="📈"
          trend={{ value: 5, isPositive: true }}
          valueColor="text-emerald-400"
        />
      </div>

      {/* Monthly Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Last 12 Months Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LineChartCard
            title="Input Husk Quantity"
            data={dashboardStats?.last_12_months_summary?.total_input_husk_quantity}
            color="#10b981"
            icon="🥥"
            valueSuffix=" kg"
          />
          <LineChartCard
            title="Input Husk Costs"
            data={dashboardStats?.last_12_months_summary?.total_input_husk_costs}
            color="#f59e0b"
            icon="💵"
            valuePrefix="Rs. "
          />
          <LineChartCard
            title="Total Expenses"
            data={dashboardStats?.last_12_months_summary?.total_expenses}
            color="#ef4444"
            icon="💸"
            valuePrefix="Rs. "
          />
          <LineChartCard
            title="Employee Hours"
            data={dashboardStats?.last_12_months_summary?.total_employee_hours}
            color="#8b5cf6"
            icon="⏱️"
            valueSuffix=" hrs"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <UserProfileCard user={user} />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

