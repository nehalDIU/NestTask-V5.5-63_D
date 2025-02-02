import { Home, Calendar, Bell, Search } from 'lucide-react';
import { NavPage } from '../types';

interface BottomNavigationProps {
  activePage: NavPage;
  onPageChange: (page: NavPage) => void;
  hasUnreadNotifications: boolean;
}

export function BottomNavigation({ activePage, onPageChange, hasUnreadNotifications }: BottomNavigationProps) {
  const navItems = [
    { id: 'home' as NavPage, icon: Home, label: 'Home' },
    { id: 'upcoming' as NavPage, icon: Calendar, label: 'Upcoming' },
    { id: 'notifications' as NavPage, icon: Bell, label: 'Notifications', hasIndicator: hasUnreadNotifications },
    { id: 'search' as NavPage, icon: Search, label: 'Search' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ id, icon: Icon, label, hasIndicator }) => (
            <button
              key={id}
              onClick={() => onPageChange(id)}
              className={`relative flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                activePage === id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${activePage === id ? 'animate-bounce-slow' : ''}`} />
                {hasIndicator && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}