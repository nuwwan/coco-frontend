/**
 * AdminSidebar Component
 * Left navigation sidebar for admin panel with expandable menu groups
 */

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Single navigation item interface
interface NavItem {
  path: string;
  label: string;
  icon: string;
}

// Navigation group with sub-items
interface NavGroup {
  label: string;
  icon: string;
  children: NavItem[];
}

// Union type for navigation entries
type NavEntry = NavItem | NavGroup;

// Type guard to check if entry is a group
const isNavGroup = (entry: NavEntry): entry is NavGroup => {
  return 'children' in entry;
};

// Navigation configuration
const navConfig: NavEntry[] = [
  { path: '/admin', label: 'Home', icon: '🏠' },
  {
    label: 'Master Data',
    icon: '📁',
    children: [
      { path: '/admin/employees', label: 'Employees', icon: '👥' },
      { path: '/admin/suppliers', label: 'Suppliers', icon: '🏭' },
      { path: '/admin/buyers', label: 'Buyers', icon: '🛒' },
    ],
  },
  { path: '/admin/coco-husk', label: 'Coco Husk', icon: '🥥' },
  { path: '/admin/employee-records', label: 'Employee Records', icon: '📝' },
  { path: '/admin/expenses', label: 'Expenses', icon: '💰' },
  { path: '/admin/profile', label: 'Profile', icon: '👤' }
];

const AdminSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Master Data']); // Default expanded

  /**
   * Toggles sidebar collapsed state
   */
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  /**
   * Toggles a group's expanded state
   */
  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label)
        ? prev.filter(g => g !== label)
        : [...prev, label]
    );
  };

  /**
   * Checks if any child route in a group is active
   */
  const isGroupActive = (group: NavGroup): boolean => {
    return group.children.some(child => location.pathname === child.path);
  };

  /**
   * Renders a single navigation item
   */
  const renderNavItem = (item: NavItem, isChild = false) => (
    <NavLink
      to={item.path}
      end={item.path === '/admin'}
      className={({ isActive }) => `
        flex items-center px-3 py-2.5 rounded-lg
        transition-colors duration-200
        ${isActive
          ? 'bg-emerald-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }
        ${isCollapsed ? 'justify-center' : 'space-x-3'}
        ${isChild && !isCollapsed ? 'ml-4' : ''}
      `}
    >
      <span className={`${isChild ? 'text-base' : 'text-xl'}`} role="img" aria-label={item.label}>
        {item.icon}
      </span>
      {!isCollapsed && (
        <span className={`font-medium ${isChild ? 'text-sm' : ''}`}>{item.label}</span>
      )}
    </NavLink>
  );

  /**
   * Renders a navigation group with expandable children
   */
  const renderNavGroup = (group: NavGroup) => {
    const isExpanded = expandedGroups.includes(group.label);
    const hasActiveChild = isGroupActive(group);

    return (
      <div>
        {/* Group Header */}
        <button
          onClick={() => !isCollapsed && toggleGroup(group.label)}
          className={`
            w-full flex items-center px-3 py-2.5 rounded-lg
            transition-colors duration-200
            ${hasActiveChild
              ? 'bg-emerald-600/20 text-emerald-400'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }
            ${isCollapsed ? 'justify-center' : 'justify-between'}
          `}
        >
          <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
            <span className="text-xl" role="img" aria-label={group.label}>
              {group.icon}
            </span>
            {!isCollapsed && (
              <span className="font-medium">{group.label}</span>
            )}
          </div>
          {!isCollapsed && (
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {/* Group Children */}
        {!isCollapsed && isExpanded && (
          <div className="mt-1 space-y-1">
            {group.children.map((child) => (
              <div key={child.path}>
                {renderNavItem(child, true)}
              </div>
            ))}
          </div>
        )}

        {/* Collapsed state - show children in tooltip or on hover */}
        {isCollapsed && (
          <div className="relative group">
            <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
              <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 px-1 min-w-[160px]">
                <p className="px-3 py-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {group.label}
                </p>
                {group.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 rounded-md mx-1
                      transition-colors duration-200
                      ${isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-base mr-2">{child.icon}</span>
                    <span className="text-sm">{child.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navConfig.map((entry, index) => (
            <li key={isNavGroup(entry) ? entry.label : entry.path}>
              {isNavGroup(entry) 
                ? renderNavGroup(entry) 
                : renderNavItem(entry)
              }
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
