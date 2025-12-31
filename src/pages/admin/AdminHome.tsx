/**
 * AdminHome Component
 * Dashboard home page for admin panel
 */

import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/Admin/StatsCard';
import ActivityFeed from '../../components/Admin/ActivityFeed';
import UserProfileCard from '../../components/Admin/UserProfileCard';

const AdminHome = () => {
  const { user } = useAuth();

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
          title="Total Users"
          value="1,234"
          icon="👥"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Sessions"
          value="89"
          icon="📊"
        />
        <StatsCard
          title="Revenue"
          value="$12.5K"
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

