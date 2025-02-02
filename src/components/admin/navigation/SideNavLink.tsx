import { LucideIcon } from 'lucide-react';

interface SideNavLinkProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function SideNavLink({ icon: Icon, label, isActive, onClick }: SideNavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-md' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}