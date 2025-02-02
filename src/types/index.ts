export type TaskCategory = 'presentation' | 'assignment' | 'quiz' | 'lab-report' | 'lab-final' | 'task' | 'others';

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  dueDate: string;
  description: string;
  status: 'my-tasks' | 'in-progress' | 'completed';
  createdAt: string;
  isAdminTask: boolean;
}