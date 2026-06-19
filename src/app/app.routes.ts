import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './core/guards/unsaved-changes-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  {
    path: 'tasks',
    title: 'Tareas · TaskFlow',
    loadComponent: () =>
      import('./features/tasks/task-list/task-list').then((m) => m.TaskList),
  },
  {
    path: 'tasks/new',
    title: 'Nueva tarea · TaskFlow',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/tasks/task-form/task-form').then((m) => m.TaskForm),
  },
  {
    path: 'tasks/:id/edit',
    title: 'Editar tarea · TaskFlow',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./features/tasks/task-form/task-form').then((m) => m.TaskForm),
  },
  { path: '**', redirectTo: 'tasks' },
];
