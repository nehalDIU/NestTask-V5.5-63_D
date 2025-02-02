import { useState } from 'react';
import { WeeklyCalendar } from '../components/calendar/WeeklyCalendar';
import { TaskList } from '../components/TaskList';
import { Calendar, ListTodo } from 'lucide-react';
import type { Task } from '../types';

interface UpcomingPageProps {
  tasks: Task[];
}

export function UpcomingPage({ tasks }: UpcomingPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  const totalTasks = filteredTasks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Calendar Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <WeeklyCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      {/* Tasks Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDate.toLocaleDateString('en-US', { 
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'} scheduled
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <ListTodo className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {totalTasks}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <TaskList tasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
}