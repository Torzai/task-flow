import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Task } from "../models/task";

@Injectable({ providedIn: 'root' })
export class TaskApiService {

    private readonly http = inject(HttpClient);
    private readonly url = 'http://localhost:3000/tasks';

    getTask() {
        return this.http.get<Task[]>(this.url);
    }

    createTask(task: Task) {
        return this.http.post<Task>(this.url, task);
    }

}

