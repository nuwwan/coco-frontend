/**
 * ActivityFeed Component
 * Displays recent activity in the admin panel
 */

// Activity item interface
interface ActivityItem {
  id: number;
  title: string;
  time: string;
  icon: string;
  iconBg: string;
}

// Mock activity data - replace with real API data
const activities: ActivityItem[] = [
  {
    id: 1,
    title: 'Successfully logged in',
    time: 'Just now',
    icon: '✓',
    iconBg: 'bg-emerald-600',
  },
  {
    id: 2,
    title: 'Profile updated',
    time: '2 hours ago',
    icon: '📋',
    iconBg: 'bg-blue-600',
  },
  {
    id: 3,
    title: 'Password changed',
    time: 'Yesterday',
    icon: '🔐',
    iconBg: 'bg-purple-600',
  },
  {
    id: 4,
    title: 'New employee added',
    time: '2 days ago',
    icon: '👤',
    iconBg: 'bg-amber-600',
  },
];

const ActivityFeed = () => {
  return (
    <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 h-full">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.iconBg} flex items-center justify-center`}
            >
              <span className="text-white text-sm">{activity.icon}</span>
            </div>
            <div>
              <p className="text-white font-medium">{activity.title}</p>
              <p className="text-slate-400 text-sm">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Development Note */}
      <div className="mt-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
        <p className="text-emerald-400 text-sm">
          💡 <strong>Development Note:</strong> Replace mock data with real API calls.
        </p>
      </div>
    </div>
  );
};

export default ActivityFeed;

