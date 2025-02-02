import { ProfileMenu } from './profile/ProfileMenu';
import { NotificationBadge } from './notifications/NotificationBadge';
import { Layout, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface NavigationProps {
  onLogout: () => void;
  hasUnreadNotifications: boolean;
  onNotificationsClick: () => void;
}

export function Navigation({ onLogout, hasUnreadNotifications, onNotificationsClick }: NavigationProps) {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2">
              <div className="flex items-center group">
                <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300">
                  <Layout className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h1 className="ml-2 text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NestTask
                </h1>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Notification Icon - Show only on desktop */}
              <div className="hidden sm:block">
                <NotificationBadge
                  hasUnread={hasUnreadNotifications}
                  onClick={onNotificationsClick}
                />
              </div>

              {/* Divider - Show only on desktop */}
              <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700" />

              {/* Profile Menu */}
              <ProfileMenu onLogout={onLogout} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}