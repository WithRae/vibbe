export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  microtasks?: MicroTask[];
  xpReward: number;
}

export interface MicroTask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskFilter = 'all' | 'active' | 'completed';