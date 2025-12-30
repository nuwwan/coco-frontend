/**
 * Admin Page Component
 * Protected page only accessible to authenticated users
 */

import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-400">
            Welcome to your dashboard, {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">1,234</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Sessions</p>
                <p className="text-2xl font-bold text-white">89</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-white">$12.5K</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Growth</p>
                <p className="text-2xl font-bold text-emerald-400">+23%</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">User ID</span>
                  <span className="text-white font-medium">{user?.username}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Name</span>
                  <span className="text-white font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400">Email</span>
                  <span className="text-white font-medium">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {/* Activity Item */}
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Successfully logged in</p>
                    <p className="text-slate-400 text-sm">Just now</p>
                  </div>
                </div>

                {/* Placeholder activities */}
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm">📋</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Profile updated</p>
                    <p className="text-slate-400 text-sm">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm">🔐</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Password changed</p>
                    <p className="text-slate-400 text-sm">Yesterday</p>
                  </div>
                </div>
              </div>

              {/* Note for development */}
              <div className="mt-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
                <p className="text-emerald-400 text-sm">
                  💡 <strong>Development Note:</strong> This is a placeholder admin panel. 
                  Replace the mock data with real API calls to your backend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

