import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import type { User } from '../types/auth';

interface UserActivityProps {
  users: User[];
}

export function UserActivity({ users }: UserActivityProps) {
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    // Sort users by last active timestamp, fallback to creation date
    const sorted = [...users].sort((a, b) => {
      const aTime = a.lastActive ? new Date(a.lastActive).getTime() : new Date(a.createdAt).getTime();
      const bTime = b.lastActive ? new Date(b.lastActive).getTime() : new Date(b.createdAt).getTime();
      return bTime - aTime; // Most recent first
    }).slice(0, 5); // Get 5 most recent users
    
    setRecentUsers(sorted);
  }, [users]);

  // Format relative time
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      
      {recentUsers.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No recent activity</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium text-sm sm:text-base">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {user.name}
                    </p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-11 sm:ml-0 mt-2 sm:mt-0">
                {getRelativeTime(user.lastActive || user.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
