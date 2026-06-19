export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
}

export type TaskDraft = Pick<Task, 'title' | 'description' | 'status' | 'priority'>;

export const STATUS_LABEL: Record<TaskStatus, string> = {
  'todo': 'Por hacer',
  'in-progress': 'En curso',
  'done': 'Hecha',
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const STATUS_ORDER: readonly TaskStatus[] = ['todo', 'in-progress', 'done'];
export const PRIORITY_ORDER: readonly TaskPriority[] = ['low', 'medium', 'high'];