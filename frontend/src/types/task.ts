export interface MicroTask {
  id: number;
  task_id: number;
  title: string;
  completed: boolean;
  xp_reward: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  completed: boolean;
  xp_reward: number;
  order: number;
  created_at: string;
  updated_at: string;
  microtasks: MicroTask[];
}

export type TaskFilter = 'all' | 'active' | 'completed';