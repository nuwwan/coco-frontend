/**
 * UserProfileCard Component
 * Displays user profile information in a card format
 */

interface User {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface UserProfileCardProps {
  user: User | null;
}

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  return (
    <div className="card bg-slate-800/50 backdrop-blur border border-slate-700 h-full">
      <h2 className="text-xl font-semibold text-white mb-4">Your Profile</h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-slate-700">
          <span className="text-slate-400">Username</span>
          <span className="text-white font-medium">{user?.username || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-slate-700">
          <span className="text-slate-400">Name</span>
          <span className="text-white font-medium">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400">Email</span>
          <span className="text-white font-medium truncate ml-4">
            {user?.email || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;

