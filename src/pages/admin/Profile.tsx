/**
 * Profile Page Component
 * User profile management and settings
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  
  // Form state for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  /**
   * Handles form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission
   * TODO: Connect to API for profile update
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to update profile
    console.log('Profile update:', formData);
    setIsEditing(false);
  };

  /**
   * Cancels editing and resets form
   */
  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-slate-400">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // View Mode
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-white text-xl font-semibold">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-slate-400">@{user?.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-slate-400 text-sm">Username</p>
                    <p className="text-white font-medium">{user?.username}</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-medium">{user?.email || 'Not set'}</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-slate-400 text-sm">First Name</p>
                    <p className="text-white font-medium">{user?.firstName || 'Not set'}</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-slate-400 text-sm">Last Name</p>
                    <p className="text-white font-medium">{user?.lastName || 'Not set'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Security Card */}
          <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Security</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                🔑 Change Password
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                📱 Two-Factor Authentication
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                📋 Login History
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card bg-slate-800/50 backdrop-blur border border-red-900/50">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
            <button 
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Development Note */}
      <div className="mt-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
        <p className="text-emerald-400 text-sm">
          💡 <strong>Development Note:</strong> Connect form submission and security actions to your backend API.
        </p>
      </div>
    </div>
  );
};

export default Profile;

