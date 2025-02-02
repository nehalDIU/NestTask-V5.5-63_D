import { useState } from 'react';
import { User, LogOut, Code, Settings, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { DeveloperModal } from './DeveloperModal';
import { SettingsModal } from '../settings/SettingsModal';

interface ProfileMenuProps {
  onLogout: () => void;
}

export function ProfileMenu({ onLogout }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'developer',
      label: 'Developer',
      icon: Code,
      description: 'API Access & Documentation',
      onClick: () => {
        setIsOpen(false);
        setShowDeveloperModal(true);
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Preferences & Security',
      onClick: () => {
        setIsOpen(false);
        setShowSettingsModal(true);
      }
    },
    ...(user?.role === 'admin' ? [{
      id: 'admin',
      label: 'Admin Panel',
      icon: Shield,
      description: 'System Management',
      onClick: () => console.log('Admin clicked')
    }] : [])
  ];

  const userInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 p-2 rounded-xl hover:bg-white/80 transition-all duration-200"
        aria-label="Open profile menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300">
          {userInitial}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 z-20 animate-scale-in origin-top-right divide-y divide-gray-100">
            {/* Profile Section */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg text-xl font-semibold">
                  {userInitial}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-grow text-left">
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>

            {/* Logout Section */}
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
              >
                <div className="p-2 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                <div className="flex-grow text-left">
                  <div className="font-medium">Logout</div>
                  <div className="text-xs text-red-500">End your session</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {showDeveloperModal && (
        <DeveloperModal onClose={() => setShowDeveloperModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}