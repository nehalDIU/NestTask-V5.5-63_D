import { useState, useEffect, useCallback } from 'react';
import { supabase, testConnection } from '../lib/supabase';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/task.service';
import type { Task, NewTask } from '../types/task';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadTasks = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Ensure connection is established
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to database');
      }

      const data = await fetchTasks(userId);
      setTasks(data);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load tasks');
      
      // Retry with exponential backoff if it's a connection error
      if (retryCount < 3) {
        const timeout = Math.min(1000 * Math.pow(2, retryCount), 10000);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, timeout);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, retryCount]);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    loadTasks();

    // Subscribe to real-time changes
    const channel = supabase.channel('tasks-changes');
    
    const subscription = channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`
        },
        () => loadTasks()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: 'is_admin_task=eq.true'
        },
        () => loadTasks()
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to tasks changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to tasks changes');
          setError('Real-time updates unavailable');
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, loadTasks]);

  const handleCreateTask = async (newTask: NewTask) => {
    if (!userId) return;

    try {
      setError(null);
      await createTask(userId, newTask);
      await loadTasks();
    } catch (err: any) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
      throw err;
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setError(null);
      await updateTask(taskId, updates);
      await loadTasks();
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError(err.message || 'Failed to update task');
      throw err;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setError(null);
      await deleteTask(taskId);
      await loadTasks();
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
  };
}