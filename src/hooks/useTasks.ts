'use client';

import { useState } from 'react';

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

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design landing page',
      description: 'Create the main VIBBE landing page',
      completed: false,
      priority: 'high',
      createdAt: new Date(),
      xpReward: 50,
      microtasks: [],
    },
    {
      id: '2',
      title: 'Write backend API',
      description: 'Set up Node/Express REST API',
      completed: false,
      priority: 'medium',
      createdAt: new Date(),
      xpReward: 40,
      microtasks: [],
    },
    {
      id: '3',
      title: 'Fix focus timer',
      description: 'Fix the circular timer animation',
      completed: false,
      priority: 'low',
      createdAt: new Date(),
      xpReward: 30,
      microtasks: [],
    },
  ]);

  const [filter, setFilter] = useState<TaskFilter>('all');

  const addTask = (title: string, priority: Task['priority'] = 'medium') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
      createdAt: new Date(),
      xpReward: priority === 'high' ? 50 : priority === 'medium' ? 30 : 20,
      microtasks: [],
    };
    setTasks((prev: Task[]) => [newTask, ...prev]);
  };

  const completeTask = (id: string) => {
    setTasks((prev: Task[]) =>
      prev.map((task: Task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== id));
  };

  const addMicroTask = (taskId: string, title: string) => {
    const microTask: MicroTask = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    setTasks((prev: Task[]) =>
      prev.map((task: Task) =>
        task.id === taskId
          ? { ...task, microtasks: [...(task.microtasks || []), microTask] }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    addTask,
    completeTask,
    deleteTask,
    addMicroTask,
  };
}