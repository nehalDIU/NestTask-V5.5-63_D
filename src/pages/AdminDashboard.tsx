import { useState } from 'react';
import { UserList } from '../components/admin/UserList';
import { TaskManager } from '../components/admin/TaskManager';
import { SideNavigation } from '../components/admin/navigation/SideNavigation';
import { TaskList } from '../components/TaskList';
import { UserStats } from '../components/admin/UserStats';
import { UserActivity } from '../components/admin/UserActivity';
import { AnnouncementManager } from '../components/admin/announcement/AnnouncementManager';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../types/auth';
import type { Task } from '../types/index';
import type { AdminTab } from '../types/admin';

interface AdminDashboardProps {
  users: User[];
  tasks: Task[];
  onLogout: () => void;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function AdminDashboard({
  users = [],
  tasks,
  onLogout,
  onCreateTask,
  onDeleteTask,
  onUpdateTask,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const { 
    announcements,
    createAnnouncement,
    deleteAnnouncement
  } = useAnnouncements();
  
  const { deleteUser } = useUsers();
  const adminTasks = tasks.filter(task => task.isAdminTask);

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <SideNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />
      
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto pt-12 lg:pt-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'tasks' && 'Task Management'}
              {activeTab === 'admin-tasks' && 'Admin Tasks'}
              {activeTab === 'announcements' && 'Announcements'}
            </h1>
          </div>

          {activeTab === 'users' && (
            <>
              <UserStats users={users} tasks={tasks} />
              <UserActivity users={users} />
              <UserList users={users} onDeleteUser={handleDeleteUser} />
            </>
          )}
          
          {activeTab === 'tasks' && (
            <TaskManager
              tasks={tasks}
              onCreateTask={onCreateTask}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
            />
          )}

          {activeTab === 'admin-tasks' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Admin Tasks</h2>
              <TaskList 
                tasks={adminTasks} 
                onDeleteTask={onDeleteTask}
                showDeleteButton={true}
              />
            </div>
          )}

          {activeTab === 'announcements' && (
            <AnnouncementManager
              announcements={announcements}
              onCreateAnnouncement={createAnnouncement}
              onDeleteAnnouncement={deleteAnnouncement}
            />
          )}
        </div>
      </main>
    </div>
  );
}