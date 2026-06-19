import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  form,
  FormField,
  maxLength,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import { TaskStore } from '../../../core/services/task-store';
import { CanLeave } from '../../../core/guards/unsaved-changes-guard';
import {
  PRIORITY_LABEL,
  PRIORITY_ORDER,
  STATUS_LABEL,
  STATUS_ORDER,
  TaskDraft,
} from '../../../core/models/task';

@Component({
  selector: 'app-task-form',
  imports: [FormField],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements CanLeave {
  private readonly store = inject(TaskStore);
  private readonly router = inject(Router);

  readonly id = input<string>();

  protected readonly statuses = STATUS_ORDER;
  protected readonly priorities = PRIORITY_ORDER;
  protected readonly statusLabel = STATUS_LABEL;
  protected readonly priorityLabel = PRIORITY_LABEL;

  protected readonly isEdit = computed(() => !!this.id());

  private readonly editing = computed(() => {
    const id = this.id();
    return id ? this.store.byId(id) : undefined;
  });

  private readonly saved = signal(false);

  protected readonly model = signal<TaskDraft>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
  });

  
  protected readonly f = form(this.model, (p) => {
    required(p.title, { message: 'El título es obligatorio' });
    minLength(p.title, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(p.title, 80, { message: 'Máximo 80 caracteres' });
    maxLength(p.description, 500, { message: 'Máximo 500 caracteres' });
  });

  constructor() {
    effect(() => {
      const task = this.editing();
      if (task) {
        this.model.set({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
        });
      }
    });
  }

  canLeave(): boolean {
    return this.saved() || !this.f().dirty();
  }

  protected async onSubmit(): Promise<void> {
    const ok = await submit(this.f, async () => undefined);
    if (!ok) {
      return;
    }

    const draft = this.model();
    const id = this.id();
    if (id) {
      this.store.update(id, draft);
    } else {
      this.store.add(draft);
    }

    this.saved.set(true);
    this.router.navigate(['/tasks']);
  }

  protected onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
