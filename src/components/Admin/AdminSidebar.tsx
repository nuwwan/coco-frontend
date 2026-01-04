/**
 * AdminSidebar Component
 * Left navigation sidebar for admin panel
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Navigation item interface
interface NavItem {
  path: string;
  label: string;
  icon: string;
}

// Navigation items configuration
const navItems: NavItem[] = [
  { path: '/admin', label: 'Home', icon: '🏠' },
  { path: '/admin/employees', label: 'Employees', icon: '👥' },
  { path: '/admin/suppliers', label: 'Suppliers', icon: '🏭' },
  { path: '/admin/buyers', label: 'Buyers', icon: '🛒' },
  { path: '/admin/coco-husk', label: 'Coco Husk', icon: '🥥' },
  { path: '/admin/profile', label: 'Profile', icon: '👤' },
];

const AdminSidebar = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * Toggles sidebar collapsed state
   */
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`
        bg-slate-800 border-r border-slate-700 
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-slate-400 text-xs truncate">
                @{user?.username}
              </p>
            </div>
          </div>
        )}
        
        {/* Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center px-3 py-3 rounded-lg
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : 'space-x-3'}
                `}
              >
                <span className="text-xl" role="img" aria-label={item.label}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-700">
        {!isCollapsed && (
          <p className="text-slate-500 text-xs text-center">
            Coco App Admin v1.0
          </p>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;

