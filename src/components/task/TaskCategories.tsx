import { useState } from 'react';
import { BookOpen, PenSquare, Presentation, Beaker, Microscope, ListTodo, FileText, Users, Building, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import type { TaskCategory } from '../../types';

interface TaskCategoriesProps {
  onCategorySelect: (category: TaskCategory | null) => void;
  selectedCategory: TaskCategory | null;
  categoryCounts: Record<TaskCategory, number>;
}

export function TaskCategories({ onCategorySelect, selectedCategory, categoryCounts }: TaskCategoriesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate total tasks from all categories
  const totalTasks = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

  const allCategories = [
    { id: null, label: 'Total Tasks', icon: ListTodo, count: totalTasks },
    { id: 'quiz' as TaskCategory, label: 'Quiz', icon: BookOpen, count: categoryCounts['quiz'] || 0 },
    { id: 'assignment' as TaskCategory, label: 'Assignment', icon: PenSquare, count: categoryCounts['assignment'] || 0 },
    { id: 'presentation' as TaskCategory, label: 'Presentation', icon: Presentation, count: categoryCounts['presentation'] || 0 },
    { id: 'lab-report' as TaskCategory, label: 'Lab Report', icon: Beaker, count: categoryCounts['lab-report'] || 0 },
    { id: 'lab-final' as TaskCategory, label: 'Lab Final', icon: Microscope, count: categoryCounts['lab-final'] || 0 },
    { id: 'lab-performance' as TaskCategory, label: 'Lab perform..', icon: Activity, count: categoryCounts['lab-performance'] || 0 },
    { id: 'documents' as TaskCategory, label: 'Documents', icon: FileText, count: categoryCounts['documents'] || 0 },
    { id: 'blc' as TaskCategory, label: 'BLC', icon: Building, count: categoryCounts['blc'] || 0 },
    { id: 'groups' as TaskCategory, label: 'Groups', icon: Users, count: categoryCounts['groups'] || 0 },
  ];

  // Show first 6 categories when collapsed
  const visibleCategories = isExpanded ? allCategories : allCategories.slice(0, 6);
  const hasMoreCategories = allCategories.length > 6;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
      <div className="space-y-3">
        {/* Grid for categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {visibleCategories.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id || 'total'}
              onClick={() => onCategorySelect(id)}
              className={`
                flex items-center gap-2 p-3 rounded-xl transition-all duration-200
                ${selectedCategory === id
                  ? 'bg-blue-600 text-white shadow-lg scale-[1.02]'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className={`
                p-2 rounded-lg
                ${selectedCategory === id
                  ? 'bg-blue-500/20'
                  : 'bg-blue-50 dark:bg-blue-900/20'
                }
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs opacity-80">{count} tasks</div>
              </div>
            </button>
          ))}
        </div>

        {/* Show more/less button */}
        {hasMoreCategories && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less Categories
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show More Categories
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}