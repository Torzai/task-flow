import { Component, computed, input, output } from '@angular/core';
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  Task,
} from '../../../core/models/task';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  host: {
    '[class.is-done]': 'task().status === "done"',
  },
})
export class TaskCard {

  readonly task = input.required<Task>();
  readonly advance = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();

  protected readonly statusLabel = computed(() => STATUS_LABEL[this.task().status]);
  protected readonly priorityLabel = computed(() => PRIORITY_LABEL[this.task().priority]);
}
