import type { Task, UserProfile } from '../types/todo';
import { generateTopRatedReminders } from '../utils/reminderEngine';

const STORAGE_KEY_TASKS = 'smart_todo_tasks_v1';
const STORAGE_KEY_USER = 'smart_todo_user_v1';

export const DEFAULT_USER: UserProfile = {
  id: 'user-default-1',
  name: 'Alex Morgan',
  email: 'alex@productivity.io',
  topRatedReminderInterval: 120, // 2 hours
  soundEnabled: true,
  browserNotificationsEnabled: true,
  theme: 'dark',
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'task-sample-1',
    userId: 'user-default-1',
    title: '🚀 Launch Q3 Product Sprint & Architecture Review',
    description: 'Review system design documents, assign backend tickets, verify security compliance, and finalize release candidate.',
    completed: false,
    completedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date().toISOString().split('T')[0], // Today
    dueTime: '16:00',
    priority: 'top_rated',
    category: 'Work',
    tags: ['Urgent', 'Sprint', 'Architecture'],
    recurring: 'none',
    status: 'in_progress',
    estimatedMinutes: 60,
    timeSpentMinutes: 25,
    subtasks: [
      { id: 'sub-1', title: 'Verify database indexing & performance metrics', completed: true },
      { id: 'sub-2', title: 'Conduct peer code review for authentication module', completed: true },
      { id: 'sub-3', title: 'Run automated end-to-end test suite', completed: false },
      { id: 'sub-4', title: 'Prepare summary slides for leadership team', completed: false }
    ],
    reminders: [],
    topRatedIntervalMinutes: 120
  },
  {
    id: 'task-sample-2',
    userId: 'user-default-1',
    title: '🔥 Finalize Client Proposal & Financial Breakdown',
    description: 'Calculate resource costs, compile deliverable timeline, and send finalized PDF to prospective enterprise partner.',
    completed: false,
    completedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date().toISOString().split('T')[0], // Today
    dueTime: '18:30',
    priority: 'top_rated',
    category: 'Finance',
    tags: ['High Priority', 'Client', 'Revenue'],
    recurring: 'none',
    status: 'todo',
    estimatedMinutes: 45,
    timeSpentMinutes: 0,
    subtasks: [
      { id: 'sub-2-1', title: 'Draft executive summary', completed: true },
      { id: 'sub-2-2', title: 'Attach itemized pricing table', completed: false },
      { id: 'sub-2-3', title: 'Export PDF & send via encrypted mail', completed: false }
    ],
    reminders: [],
    topRatedIntervalMinutes: 90
  },
  {
    id: 'task-sample-3',
    userId: 'user-default-1',
    title: '🏋️‍♂️ Morning High-Intensity Cardio & Core Workout',
    description: '45-minute circuit training at local gym followed by stretching and hydration tracking.',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '07:30',
    priority: 'high',
    category: 'Health',
    tags: ['Fitness', 'Wellness'],
    recurring: 'daily',
    status: 'completed',
    estimatedMinutes: 45,
    timeSpentMinutes: 45,
    subtasks: [
      { id: 'sub-3-1', title: '15 min treadmill warm-up', completed: true },
      { id: 'sub-3-2', title: 'Core stability routine', completed: true }
    ],
    reminders: []
  },
  {
    id: 'task-sample-4',
    userId: 'user-default-1',
    title: '⚠️ Review Monthly Cloud Infrastructure Bill & Server Log Audit',
    description: 'Check AWS/GCP resource utilization, delete unattached EBS volumes, and resolve pending security patches.',
    completed: false,
    completedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() - 3600000 * 24 * 1).toISOString().split('T')[0], // Overdue (Yesterday)
    dueTime: '12:00',
    priority: 'high',
    category: 'Work',
    tags: ['DevOps', 'Overdue', 'Budget'],
    recurring: 'monthly',
    status: 'todo',
    estimatedMinutes: 30,
    timeSpentMinutes: 10,
    subtasks: [
      { id: 'sub-4-1', title: 'Inspect node cluster memory footprint', completed: true },
      { id: 'sub-4-2', title: 'Clean up stale docker container images', completed: false }
    ],
    reminders: []
  },
  {
    id: 'task-sample-5',
    userId: 'user-default-1',
    title: '📚 Read 2 Chapters of "Designing Data-Intensive Applications"',
    description: 'Focus on consensus algorithms, Raft protocol, and distributed transactions.',
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 3600000 * 24 * 2).toISOString().split('T')[0], // Upcoming
    dueTime: '21:00',
    priority: 'medium',
    category: 'Study',
    tags: ['Learning', 'Systems'],
    recurring: 'none',
    status: 'todo',
    estimatedMinutes: 50,
    timeSpentMinutes: 0,
    subtasks: [],
    reminders: []
  },
  {
    id: 'task-sample-6',
    userId: 'user-default-1',
    title: '🛒 Weekly Meal Prep & Organic Groceries',
    description: 'Buy fresh produce, chicken breast, quinoa, avocados, and Greek yogurt.',
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 3600000 * 24 * 1).toISOString().split('T')[0], // Tomorrow
    dueTime: '17:00',
    priority: 'low',
    category: 'Personal',
    tags: ['Life', 'Health'],
    recurring: 'weekly',
    status: 'todo',
    estimatedMinutes: 40,
    timeSpentMinutes: 0,
    subtasks: [
      { id: 'sub-6-1', title: 'Check pantry supplies', completed: true },
      { id: 'sub-6-2', title: 'Order via grocery app or visit market', completed: false }
    ],
    reminders: []
  }
];

export class StorageService {
  // --- USER PROFILE ---
  getUser(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) {
      this.saveUser(DEFAULT_USER);
      return DEFAULT_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USER;
    }
  }

  saveUser(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }

  // --- TASKS ---
  getTasks(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!raw) {
      // Seed sample tasks
      const seeded = INITIAL_SAMPLE_TASKS.map(t => {
        if (t.priority === 'top_rated') {
          return {
            ...t,
            reminders: generateTopRatedReminders(t, t.topRatedIntervalMinutes || 120)
          };
        }
        return t;
      });
      this.saveTasks(seeded);
      return seeded;
    }
    try {
      const parsed: Task[] = JSON.parse(raw);
      // Ensure top_rated tasks have reminders populated
      return parsed.map(t => {
        if (t.priority === 'top_rated' && (!t.reminders || t.reminders.length === 0)) {
          return {
            ...t,
            reminders: generateTopRatedReminders(t, t.topRatedIntervalMinutes || 120)
          };
        }
        return t;
      });
    } catch {
      return INITIAL_SAMPLE_TASKS;
    }
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }

  saveTask(task: Task): Task[] {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);

    // Auto generate Top Rated reminders if priority is top_rated
    let updatedTask = { ...task, updatedAt: new Date().toISOString() };
    if (updatedTask.priority === 'top_rated' && !updatedTask.completed) {
      updatedTask.reminders = generateTopRatedReminders(
        updatedTask, 
        updatedTask.topRatedIntervalMinutes || 120
      );
    }

    if (index >= 0) {
      tasks[index] = updatedTask;
    } else {
      tasks.unshift(updatedTask);
    }

    this.saveTasks(tasks);
    return tasks;
  }

  deleteTask(taskId: string): Task[] {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.saveTasks(tasks);
    return tasks;
  }

  toggleTaskComplete(taskId: string): Task[] {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      task.status = task.completed ? 'completed' : 'todo';
      task.updatedAt = new Date().toISOString();
      this.saveTasks(tasks);
    }
    return tasks;
  }

  updateTaskStatus(taskId: string, status: 'todo' | 'in_progress' | 'completed'): Task[] {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.completed = status === 'completed';
      task.completedAt = status === 'completed' ? new Date().toISOString() : null;
      task.updatedAt = new Date().toISOString();
      this.saveTasks(tasks);
    }
    return tasks;
  }

  resetToSampleData(): Task[] {
    const seeded = INITIAL_SAMPLE_TASKS.map(t => {
      if (t.priority === 'top_rated') {
        return {
          ...t,
          reminders: generateTopRatedReminders(t, t.topRatedIntervalMinutes || 120)
        };
      }
      return t;
    });
    this.saveTasks(seeded);
    return seeded;
  }

  clearAllData(): Task[] {
    this.saveTasks([]);
    return [];
  }

  exportData(): string {
    const data = {
      user: this.getUser(),
      tasks: this.getTasks(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        this.saveTasks(parsed.tasks);
        if (parsed.user) {
          this.saveUser(parsed.user);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
