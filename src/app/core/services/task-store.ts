import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { STATUS_ORDER, Task, TaskDraft, TaskStatus } from '../models/task';
import { TaskApiService } from './task-api';

const STORAGE_KEY = 'taskflow.tasks.v1';

@Injectable({ providedIn: 'root' })
export class TaskStore {

  private readonly taskApiService = inject(TaskApiService);
  readonly loading = signal(false);

  //private readonly _tasks = signal<Task[]>(loadFromStorage());
  private readonly _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();
  readonly stats = computed(() => {
    const list = this._tasks();
    return {
      total: list.length,
      todo: list.filter((t) => t.status === 'todo').length,
      inProgress: list.filter((t) => t.status === 'in-progress').length,
      done: list.filter((t) => t.status === 'done').length,
    };
  });

  readonly completion = computed(() => {
    const { total, done } = this.stats();
    return total === 0 ? 0 : Math.round((done / total) * 100);
  });

  constructor() {
    this.loadTask()
  }
  loadTask(): void {
    this.loading.set(true)
    this.taskApiService.getTask().subscribe({
      next: (tasks) => {
        this.loading.set(false);
        this._tasks.set(tasks);
      },
      error: (error) => {
        this.loading.set(false);
        console.log(error);
      },
      complete: () => {
        console.log('Trabajo de carga finalizado');
      }
    })
  }

  byId(id: string): Task | undefined {
    return this._tasks().find((t) => t.id === id);
  }

  add(draft: TaskDraft): Task {
    const task: Task = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this._tasks.update((list) => [task, ...list]);
    return task;
  }

  /** Actualiza los campos editables de una tarea existente. */
  update(id: string, draft: TaskDraft): void {
    this._tasks.update((list) =>
      list.map((t) => (t.id === id ? { ...t, ...draft } : t)),
    );
  }

  setStatus(id: string, status: TaskStatus): void {
    this._tasks.update((list) =>
      list.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  }

  advanceStatus(id: string): void {
    const current = this.byId(id);
    if (!current) return;
    const i = STATUS_ORDER.indexOf(current.status);
    const next = STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
    this.setStatus(id, next);
  }

  remove(id: string): void {
    this._tasks.update((list) => list.filter((t) => t.id !== id));
  }
}

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Task[];
    }
  } catch {

  }
  return seed();
}

function seed(): Task[] {
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(),
      title: 'Configurar el proyecto',
      description: 'Clonar el repo y arrancar con ng serve.',
      status: 'done',
      priority: 'medium',
      createdAt: new Date(now - 86_400_000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Leer el README',
      description: 'Entender la arquitectura por features y el roadmap.',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date(now - 3_600_000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Crear mi primera tarea',
      description: 'Probar el formulario con Signal Forms.',
      status: 'todo',
      priority: 'low',
      createdAt: new Date(now).toISOString(),
    },
  ];
}
