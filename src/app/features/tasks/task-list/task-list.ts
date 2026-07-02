import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskStore } from '../../../core/services/task-store';
import {
  STATUS_LABEL,
  STATUS_ORDER,
  TaskStatus,
} from '../../../core/models/task';
import { TaskCard } from '../task-card/task-card';

type StatusFilter = TaskStatus | 'all';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, TaskCard],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  protected readonly store = inject(TaskStore);
  private readonly router = inject(Router);

  protected readonly stats = this.store.stats;
  protected readonly completion = this.store.completion;

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');

  protected readonly filterOptions: readonly StatusFilter[] = ['all', ...STATUS_ORDER];

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();

    return this.store.tasks().filter((task) => {
      const matchesStatus = status === 'all' || task.status === status;
      const matchesTerm =
        term === '' ||
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  });

  protected labelFor(filter: StatusFilter): string {
    return filter === 'all' ? 'Todas' : STATUS_LABEL[filter];
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
