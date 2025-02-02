import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  hasUnread: boolean;
  onClick: () => void;
}

export function NotificationBadge({ hasUnread, onClick }: NotificationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-xl hover:bg-white/80 transition-all duration-200 group"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
      {hasUnread && (
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
      )}
    </button>
  );
}