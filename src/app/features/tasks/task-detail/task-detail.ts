import { Component, computed, inject, input } from "@angular/core";
import { TaskStore } from "../../../core/services/task-store";

@Component({
  selector: 'app-task-detail',
  imports: [],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})

export class TaskDetail {
    
    private readonly store = inject(TaskStore);

    readonly id = input.required<string>();

    protected readonly task = computed(() => this.store.byId(this.id()));

}