import { Task } from '../types';
import { Crown, Calendar, Tag, Clock } from 'lucide-react';
import { isOverdue } from '../utils/dateUtils';
import { parseLinks } from '../utils/linkParser';
import { useState } from 'react';
import { TaskDetailsPopup } from './task/TaskDetailsPopup';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask?: (taskId: string) => void;
  showDeleteButton?: boolean;
}

export function TaskList({ tasks, onDeleteTask, showDeleteButton = false }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 animate-fade-in">
        <img
          src="https://images.unsplash.com/photo-1496115965489-21be7e6e59a0?auto=format&fit=crop&q=80&w=400"
          alt="Empty tasks"
          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-2xl mx-auto mb-4 opacity-50 shadow-lg"
        />
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-medium">No tasks found in this category</p>
        <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm sm:text-base">Time to add some new tasks!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:gap-6">
        {tasks.map((task, index) => {
          const overdue = isOverdue(task.dueDate);
          const descriptionParts = parseLinks(task.description);
          
          return (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 
                transition-all duration-300 group cursor-pointer
                hover:shadow-lg hover:-translate-y-1
                border border-gray-100 dark:border-gray-700
                hover:border-blue-200 dark:hover:border-blue-800
                animate-slide-up
                before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl
                before:border-2 before:border-dashed before:border-transparent
                hover:before:border-blue-200 dark:hover:before:border-blue-800
                before:transition-all before:duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Category Tag */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm 
                  rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 
                  font-medium group-hover:bg-blue-100 dark:group-hover:bg-blue-900/70 transition-colors">
                  <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {task.category}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Title Section */}
                <div className="flex items-start pr-20 sm:pr-24">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 
                    flex items-center gap-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 
                    transition-colors line-clamp-2">
                    {task.name}
                    {task.isAdminTask && (
                      <Crown className="w-4 h-4 text-yellow-500 animate-bounce-slow flex-shrink-0" />
                    )}
                  </h3>
                </div>

                {/* Description */}
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 
                  leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 
                  transition-colors line-clamp-3">
                  {descriptionParts.map((part, i) => 
                    part.type === 'link' ? (
                      <a
                        key={i}
                        href={part.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 
                          dark:hover:text-blue-300 hover:underline mx-1 break-all"
                      >
                        {part.content}
                      </a>
                    ) : (
                      <span key={i}>{part.content}</span>
                    )
                  )}
                </div>

                {/* Footer Section */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm 
                  text-gray-500 dark:text-gray-400 mt-2">
                  {/* Due Date */}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className={overdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                      {overdue && ' (Overdue)'}
                    </span>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details Popup */}
      {selectedTask && (
        <TaskDetailsPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}