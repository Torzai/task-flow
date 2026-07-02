import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskStore } from '../../../core/services/task-store';
import {
  STATUS_LABEL,
  PRIORITY_LABEL,
  STATUS_ORDER,
  PRIORITY_ORDER,
  TaskStatus,
  TaskPriority,
} from '../../../core/models/task';
import { TaskCard } from '../task-card/task-card';

type StatusFilter = TaskStatus | 'all';
type StatusPriority = TaskPriority | 'all';


@Component({
  selector: 'app-task-list',
  imports: [RouterLink, TaskCard],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {

  protected readonly store = inject(TaskStore);
  private readonly router = inject(Router);

  protected readonly prioridadAlta = this.store.prioridadAlta;
  protected readonly stats = this.store.stats;
  protected readonly completion = this.store.completion;

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly priorityFilter = signal<StatusPriority>('all');

  protected readonly filterOptions: readonly StatusFilter[] = ['all', ...STATUS_ORDER];
  protected readonly filterPriority: readonly StatusPriority[] = ['all', ...PRIORITY_ORDER];
  protected readonly orderList = signal<'fecha' | 'prioridad' | 'titulo'>('fecha');
  

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    return this.store.tasks().filter((task) => {
      const matchesStatus = status === 'all' || task.status === status;
      const matchesTerm =
        term === '' ||
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term);
      const matchesPriority = priority === 'all' || task.priority === priority;  
      return matchesStatus && matchesTerm && matchesPriority;
    });
  });

  protected readonly order = computed(() => {
    const list = this.store.tasks();
    const order = this.orderList();

    return [...list].sort((a, b) => {
    if (order === 'fecha') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (order === 'prioridad') {
      return PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);
    }

    if (order === 'titulo') {
      return a.title.localeCompare(b.title);
    }
    return 0;
   });
  });
  
  protected labelFor(filter: StatusFilter | StatusPriority): string {
  if (filter === 'all') {
    return 'Todas';
  }

  if (filter in STATUS_LABEL) {
    return STATUS_LABEL[filter as Exclude<StatusFilter, 'all'>];
  }

  return PRIORITY_LABEL[filter as Exclude<StatusPriority, 'all'>];
}

  protected onAdvance(id: string): void {
    this.store.advanceStatus(id);
  }

  protected onEdit(id: string): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  protected onRemove(id: string): void {
    this.store.remove(id);
  }
}
