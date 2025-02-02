import { useState } from 'react';
import { Users, ListTodo, Settings, LogOut, Megaphone, Moon, Sun } from 'lucide-react';
import { SideNavLink } from './SideNavLink';
import { MobileMenuButton } from './MobileMenuButton';
import { useTheme } from '../../../hooks/useTheme';
import type { AdminTab } from '../../../types/admin';

interface SideNavigationProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
}

export function SideNavigation({ activeTab, onTabChange, onLogout }: SideNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  const navItems = [
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'tasks' as const, label: 'Tasks', icon: ListTodo },
    { id: 'admin-tasks' as const, label: 'Admin Tasks', icon: Settings },
    { id: 'announcements' as const, label: 'Announcements', icon: Megaphone },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (tab: AdminTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden dark:bg-opacity-70"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-6
        transform transition-transform duration-300 ease-in-out z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex items-center gap-3 mb-8 mt-4 lg:mt-0">
          <Settings className="w-8 h-8 text-blue-600 dark:text-blue-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <SideNavLink
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => handleNavigation(item.id)}
            />
          ))}
        </nav>

        <div className="absolute bottom-20 left-6 right-6">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {isDark ? (
              <>
                <Sun className="w-5 h-5" />
                <span className="font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span className="font-medium">Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={onLogout}
          className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );
}