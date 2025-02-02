import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { useUsers } from './hooks/useUsers';
import { useNotifications } from './hooks/useNotifications';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navigation } from './components/Navigation';
import { TaskList } from './components/TaskList';
import { BottomNavigation } from './components/BottomNavigation';
import { UpcomingPage } from './pages/UpcomingPage';
import { SearchPage } from './pages/SearchPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NotificationPanel } from './components/notifications/NotificationPanel';
import { LoadingScreen } from './components/LoadingScreen';
import { InstallPWA } from './components/InstallPWA';
import { ListTodo, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TaskCategories } from './components/task/TaskCategories';
import { isOverdue } from './utils/dateUtils';
import type { NavPage } from './types';
import type { TaskCategory } from './types';

type StatFilter = 'all' | 'overdue' | 'in-progress' | 'completed';

export default function App() {
  const { user, loading: authLoading, error: authError, login, signup, logout } = useAuth();
  const { users, loading: usersLoading } = useUsers();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks(user?.id);
  const { 
    notifications, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    clearNotification 
  } = useNotifications(user?.id);
  
  const [activePage, setActivePage] = useState<NavPage>('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
  const [statFilter, setStatFilter] = useState<StatFilter>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const hasUnreadNotifications = unreadCount > 0;

  if (isLoading || authLoading || (user?.role === 'admin' && usersLoading)) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <AuthPage
        onLogin={login}
        onSignup={signup}
        error={authError}
      />
    );
  }

  if (user.role === 'admin') {
    return (
      <AdminDashboard
        users={users}
        tasks={tasks}
        onLogout={logout}
        onDeleteUser={() => {}}
        onCreateTask={createTask}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
      />
    );
  }

  // Filter tasks based on selected stat
  const getFilteredTasks = () => {
    let filtered = tasks;

    // First apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Then apply stat filter
    switch (statFilter) {
      case 'overdue':
        return filtered.filter(task => isOverdue(task.dueDate) && task.status !== 'completed');
      case 'in-progress':
        return filtered.filter(task => task.status === 'in-progress');
      case 'completed':
        return filtered.filter(task => task.status === 'completed');
      default:
        return filtered;
    }
  };

  const taskStats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed').length
  };

  const categoryCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<TaskCategory, number>);

  const getStatTitle = () => {
    switch (statFilter) {
      case 'overdue':
        return 'Due Tasks';
      case 'in-progress':
        return 'In Progress Tasks';
      case 'completed':
        return 'Completed Tasks';
      default:
        return selectedCategory 
          ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')} Tasks`
          : 'All Tasks';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation 
        onLogout={logout}
        hasUnreadNotifications={hasUnreadNotifications}
        onNotificationsClick={() => setShowNotifications(true)}
      />
      
      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClear={clearNotification}
        />
      )}
      
      <main className="max-w-7xl mx-auto px-4 py-20 pb-24">
        {tasksLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {activePage === 'upcoming' ? (
              <UpcomingPage tasks={tasks} />
            ) : activePage === 'search' ? (
              <SearchPage tasks={tasks} />
            ) : activePage === 'notifications' ? (
              <NotificationsPage
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onClear={clearNotification}
              />
            ) : (
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-blue-100">
                    You have {taskStats.total} total tasks
                  </p>
                </div>

                {/* Task Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => setStatFilter('all')}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                      statFilter === 'all' ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <ListTodo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {taskStats.total}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
                  </button>

                  <button
                    onClick={() => setStatFilter('overdue')}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                      statFilter === 'overdue' ? 'ring-2 ring-red-500 dark:ring-red-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {taskStats.overdue}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Due Tasks</p>
                  </button>

                  <button
                    onClick={() => setStatFilter('in-progress')}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                      statFilter === 'in-progress' ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {taskStats.inProgress}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                  </button>

                  <button
                    onClick={() => setStatFilter('completed')}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                      statFilter === 'completed' ? 'ring-2 ring-green-500 dark:ring-green-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {taskStats.completed}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                  </button>
                </div>

                {/* Task Categories */}
                <TaskCategories
                  onCategorySelect={(category) => {
                    setSelectedCategory(category);
                    setStatFilter('all');
                  }}
                  selectedCategory={selectedCategory}
                  categoryCounts={categoryCounts}
                />

                {/* Task List */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {getStatTitle()}
                    </h2>
                    {statFilter !== 'all' && (
                      <button
                        onClick={() => setStatFilter('all')}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        View All Tasks
                      </button>
                    )}
                  </div>
                  <TaskList
                    tasks={getFilteredTasks()}
                    showDeleteButton={false}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNavigation 
        activePage={activePage}
        onPageChange={setActivePage}
        hasUnreadNotifications={hasUnreadNotifications}
      />

      <InstallPWA />
    </div>
  );
}
