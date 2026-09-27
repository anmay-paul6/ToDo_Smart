import type { Task, UserProfile } from '../types/todo';
import { generateTopRatedReminders } from '../utils/reminderEngine';

const STORAGE_KEY_USERS = 'smart_todo_users_v2';
const STORAGE_KEY_ACTIVE_USER = 'smart_todo_active_user_v2';

export const DEFAULT_DEMO_USER: UserProfile = {
  id: 'user-alex-demo',
  name: 'Alex Morgan',
  email: 'alex@productivity.io',
  password: 'demo',
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
    userId: 'user-alex-demo',
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
    userId: 'user-alex-demo',
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
    userId: 'user-alex-demo',
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
  }
];

export class StorageService {
  private getTaskStorageKey(userId: string): string {
    return `smart_todo_tasks_v2_${userId}`;
  }

  // --- MULTI-USER MANAGEMENT ---
  getUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      this.saveUsers([DEFAULT_DEMO_USER]);
      return [DEFAULT_DEMO_USER];
    }
    try {
      const users: UserProfile[] = JSON.parse(raw);
      if (users.length === 0) {
        this.saveUsers([DEFAULT_DEMO_USER]);
        return [DEFAULT_DEMO_USER];
      }
      return users;
    } catch {
      return [DEFAULT_DEMO_USER];
    }
  }

  saveUsers(users: UserProfile[]): void {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  getActiveUserId(): string | null {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
  }

  setActiveUserId(userId: string | null): void {
    if (userId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, userId);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    }
  }

  getCurrentUser(): UserProfile | null {
    const activeId = this.getActiveUserId();
    if (!activeId) return null;
    const users = this.getUsers();
    return users.find(u => u.id === activeId) || null;
  }

  // Backwards compatibility fallback getter
  getUser(): UserProfile {
    const current = this.getCurrentUser();
    if (current) return current;
    const users = this.getUsers();
    const demo = users[0] || DEFAULT_DEMO_USER;
    this.setActiveUserId(demo.id);
    return demo;
  }

  saveUser(updatedUser: UserProfile): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx >= 0) {
      users[idx] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    this.saveUsers(users);
  }

  // --- AUTHENTICATION FLOWS ---
  login(email: string, password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (user.password && password && user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Set active session
    this.setActiveUserId(user.id);
    return { success: true, user };
  }

  register(name: string, email: string, password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'New Productivity User',
      email: cleanEmail,
      password: password || '',
      topRatedReminderInterval: 120,
      soundEnabled: true,
      browserNotificationsEnabled: true,
      theme: 'dark',
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setActiveUserId(newUser.id);

    // Initialize empty task list for new user
    this.saveTasksForUser(newUser.id, []);

    return { success: true, user: newUser };
  }

  logout(): void {
    this.setActiveUserId(null);
  }

  // --- ISOLATED PER-USER TASKS STORAGE ---
  private getTasksForUser(userId: string): Task[] {
    const key = this.getTaskStorageKey(userId);
    const raw = localStorage.getItem(key);

    if (!raw) {
      // If demo user, seed initial sample tasks
      if (userId === DEFAULT_DEMO_USER.id) {
        const seeded = INITIAL_SAMPLE_TASKS.map(t => {
          if (t.priority === 'top_rated') {
            return {
              ...t,
              reminders: generateTopRatedReminders(t, t.topRatedIntervalMinutes || 120)
            };
          }
          return t;
        });
        this.saveTasksForUser(userId, seeded);
        return seeded;
      }
      return [];
    }

    try {
      const parsed: Task[] = JSON.parse(raw);
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
      return [];
    }
  }

  private saveTasksForUser(userId: string, tasks: Task[]): void {
    const key = this.getTaskStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(tasks));
  }

  getTasks(): Task[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    return this.getTasksForUser(user.id);
  }

  saveTasks(tasks: Task[]): void {
    const user = this.getCurrentUser();
    if (!user) return;
    this.saveTasksForUser(user.id, tasks);
  }

  saveTask(task: Task): Task[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    const tasks = this.getTasksForUser(user.id);
    const index = tasks.findIndex(t => t.id === task.id);

    let updatedTask = { ...task, userId: user.id, updatedAt: new Date().toISOString() };
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

    this.saveTasksForUser(user.id, tasks);
    return tasks;
  }

  deleteTask(taskId: string): Task[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    const tasks = this.getTasksForUser(user.id).filter(t => t.id !== taskId);
    this.saveTasksForUser(user.id, tasks);
    return tasks;
  }

  toggleTaskComplete(taskId: string): Task[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    const tasks = this.getTasksForUser(user.id);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      task.status = task.completed ? 'completed' : 'todo';
      task.updatedAt = new Date().toISOString();
      this.saveTasksForUser(user.id, tasks);
    }
    return tasks;
  }

  updateTaskStatus(taskId: string, status: 'todo' | 'in_progress' | 'completed'): Task[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    const tasks = this.getTasksForUser(user.id);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.completed = status === 'completed';
      task.completedAt = status === 'completed' ? new Date().toISOString() : null;
      task.updatedAt = new Date().toISOString();
      this.saveTasksForUser(user.id, tasks);
    }
    return tasks;
  }

  resetToSampleData(): Task[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    const seeded = INITIAL_SAMPLE_TASKS.map(t => {
      const copy = { ...t, userId: user.id };
      if (copy.priority === 'top_rated') {
        return {
          ...copy,
          reminders: generateTopRatedReminders(copy, copy.topRatedIntervalMinutes || 120)
        };
      }
      return copy;
    });
    this.saveTasksForUser(user.id, seeded);
    return seeded;
  }

  clearAllData(): Task[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    this.saveTasksForUser(user.id, []);
    return [];
  }

  exportData(): string {
    const user = this.getCurrentUser();
    const data = {
      user: user,
      tasks: user ? this.getTasksForUser(user.id) : [],
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        const userTasks = parsed.tasks.map((t: Task) => ({ ...t, userId: user.id }));
        this.saveTasksForUser(user.id, userTasks);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
