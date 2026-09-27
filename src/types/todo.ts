export type Priority = 'low' | 'medium' | 'high' | 'top_rated';

export type Category = 
  | 'Work'
  | 'Personal'
  | 'Health'
  | 'Finance'
  | 'Study'
  | 'Urgent'
  | 'Projects'
  | 'Life'
  | string;

export type RecurringFrequency = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Reminder {
  id: string;
  time: string; // ISO string or HH:mm
  label: string;
  triggered: boolean;
  type: 'scheduled' | 'top_rated_auto';
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  priority: Priority;
  category: Category;
  tags: string[];
  recurring: RecurringFrequency;
  subtasks: Subtask[];
  estimatedMinutes: number;
  timeSpentMinutes: number;
  reminders: Reminder[];
  // Settings specific to Top Rated task smart auto-reminders
  topRatedIntervalMinutes?: number; // e.g. every 120 mins
  status: 'todo' | 'in_progress' | 'completed';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  topRatedReminderInterval: number; // in minutes, default 120 (2 hrs)
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
  streakDays: number;
  lastActiveDate: string;
}

export type ViewMode = 'dashboard' | 'list' | 'kanban' | 'calendar' | 'focus' | 'analytics';

export interface TaskFilterState {
  search: string;
  category: string; // 'all' or specific category
  priority: string; // 'all' or Priority
  status: 'all' | 'active' | 'completed' | 'overdue' | 'today';
  tag: string;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface TopRatedReminderEvent {
  task: Task;
  reminder: Reminder;
  timestamp: string;
}
