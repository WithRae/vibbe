import { apiClient } from '@/lib/api';
import type { Task, MicroTask } from '@/types/task';

export const taskService = {

  // GET /tasks
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data ?? [];
  },

  // POST /tasks
  async createTask(title: string): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', { title });
    return response.data!;
  },

  // PATCH /tasks/{task}/complete
  async toggleTask(taskId: number): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${taskId}/complete`);
    return response.data!;
  },

  // DELETE /tasks/{task}
  async deleteTask(taskId: number): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}`);
  },

  // POST /tasks/{task}/microtasks
  async createMicroTask(taskId: number, title: string): Promise<MicroTask> {
    const response = await apiClient.post<MicroTask>(
      `/tasks/${taskId}/microtasks`,
      { title }
    );
    return response.data!;
  },

  // PATCH /tasks/{task}/microtasks/{microtask}/complete
  async toggleMicroTask(
    taskId: number,
    microTaskId: number
  ): Promise<{ microtask: MicroTask; task_completed: boolean }> {
    const response = await apiClient.patch<{
      data: MicroTask;
      task_completed: boolean;
    }>(`/tasks/${taskId}/microtasks/${microTaskId}/complete`);
    return {
      microtask: (response as any).data,
      task_completed: (response as any).task_completed ?? false,
    };
  },

  // DELETE /tasks/{task}/microtasks/{microtask}
  async deleteMicroTask(taskId: number, microTaskId: number): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}/microtasks/${microTaskId}`);
  },
};