import type { Task } from '../types/task';

export function mapTaskFromDB(data: any): Task {
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    dueDate: data.due_date,
    description: data.description,
    status: data.status,
    createdAt: data.created_at,
    isAdminTask: data.is_admin_task
  };
}