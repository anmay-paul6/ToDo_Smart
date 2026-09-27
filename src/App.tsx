import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import { FocusTimer } from './components/FocusTimer';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { TopRatedReminderModal } from './components/TopRatedReminderModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';

import type { 
  Task, 
  UserProfile, 
  ViewMode, 
  TaskFilterState, 
  TopRatedReminderEvent 
} from './types/todo';
import { storageService } from './services/storage';
import { reminderEngine } from './utils/reminderEngine';

export function App() {
  // User & Task State
  const [user, setUser] = useState<UserProfile>(() => storageService.getUser());
  const [tasks, setTasks] = useState<Task[]>(() => storageService.getTasks());
  
  // Navigation & Filtering
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<TaskFilterState>({
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    tag: '',
    sortBy: 'priority',
    sortOrder: 'desc'
  });

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [focusingTask, setFocusingTask] = useState<Task | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Active Smart Reminder Event
  const [activeReminderEvent, setActiveReminderEvent] = useState<TopRatedReminderEvent | null>(null);

  // Sync dark/light theme to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (user.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [user.theme]);

  // Handle tasks updates
  const updateTasksState = useCallback((newTasks: Task[]) => {
    setTasks([...newTasks]);
  }, []);

  // Initialize Smart Reminder Engine for Top Rated tasks
  useEffect(() => {
    reminderEngine.startEngine(
      () => storageService.getTasks(),
      (updatedTask: Task) => {
        const nextTasks = storageService.saveTask(updatedTask);
        updateTasksState(nextTasks);
      },
      (event: TopRatedReminderEvent) => {
        setActiveReminderEvent(event);
      },
      user.soundEnabled,
      user.browserNotificationsEnabled
    );

    return () => {
      reminderEngine.stopEngine();
    };
  }, [user.soundEnabled, user.browserNotificationsEnabled, updateTasksState]);

  // Extract list of categories
  const categories = Array.from(new Set(tasks.map(t => t.category))).filter(Boolean);
  if (!categories.includes('Work')) categories.push('Work');
  if (!categories.includes('Personal')) categories.push('Personal');
  if (!categories.includes('Health')) categories.push('Health');

  // Active Top Rated Count for Header Notification Pill
  const activeTopRatedCount = tasks.filter(t => t.priority === 'top_rated' && !t.completed).length;

  // Task Operations
  const handleSaveTask = (taskData: Partial<Task>) => {
    const taskToSave: Task = {
      id: editingTask?.id || `task-${Date.now()}`,
      userId: user.id,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      completed: editingTask?.completed || false,
      completedAt: editingTask?.completedAt || null,
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      dueTime: taskData.dueTime || '17:00',
      priority: taskData.priority || 'medium',
      category: taskData.category || 'Work',
      tags: taskData.tags || [],
      recurring: taskData.recurring || 'none',
      status: taskData.status || 'todo',
      subtasks: taskData.subtasks || [],
      estimatedMinutes: taskData.estimatedMinutes || 30,
      timeSpentMinutes: editingTask?.timeSpentMinutes || 0,
      reminders: editingTask?.reminders || [],
      topRatedIntervalMinutes: taskData.topRatedIntervalMinutes || user.topRatedReminderInterval || 120
    };

    const nextTasks = storageService.saveTask(taskToSave);
    updateTasksState(nextTasks);
    setEditingTask(null);
  };

  const handleToggleComplete = (taskId: string) => {
    const nextTasks = storageService.toggleTaskComplete(taskId);
    updateTasksState(nextTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const nextTasks = storageService.deleteTask(taskId);
    updateTasksState(nextTasks);
  };

  const handleUpdateStatus = (taskId: string, status: 'todo' | 'in_progress' | 'completed') => {
    const nextTasks = storageService.updateTaskStatus(taskId, status);
    updateTasksState(nextTasks);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const currentTasks = storageService.getTasks();
    const task = currentTasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      task.subtasks = task.subtasks.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      const nextTasks = storageService.saveTask(task);
      updateTasksState(nextTasks);
    }
  };

  const handleStartFocus = (task: Task) => {
    setFocusingTask(task);
    setCurrentView('focus');
  };

  const handleSnoozeReminder = (task: Task, reminderId: string, minutes: number) => {
    const snoozedTask = reminderEngine.snoozeReminder(task, reminderId, minutes);
    const nextTasks = storageService.saveTask(snoozedTask);
    updateTasksState(nextTasks);
  };

  const handleToggleTheme = () => {
    const newTheme = user.theme === 'dark' ? 'light' : 'dark';
    const updatedUser = { ...user, theme: newTheme as 'dark' | 'light' };
    storageService.saveUser(updatedUser);
    setUser(updatedUser);
  };

  const handleSaveUser = (updatedUser: UserProfile) => {
    storageService.saveUser(updatedUser);
    setUser(updatedUser);
  };

  const handleResetSampleData = () => {
    if (window.confirm("Reset tasks database to sample productivity tasks?")) {
      const seeded = storageService.resetToSampleData();
      updateTasksState(seeded);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to clear ALL tasks? Your database will be completely emptied.")) {
      const cleared = storageService.clearAllData();
      updateTasksState(cleared);
    }
  };

  const handleExportData = () => {
    const jsonStr = storageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    const ok = storageService.importData(jsonStr);
    if (ok) {
      setTasks(storageService.getTasks());
      setUser(storageService.getUser());
      alert("Data successfully imported!");
    } else {
      alert("Invalid JSON data format.");
    }
  };

  const handleTriggerNotificationPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification("⚡ TaskPulse Pro Notifications Enabled!", {
            body: "You will now receive automatic reminders for Top Rated & urgent tasks."
          });
        }
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Sticky Navigation Header */}
      <Header
        user={user}
        tasks={tasks}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setFilterState(prev => ({ ...prev, search: q }));
          if (currentView !== 'list') setCurrentView('list');
        }}
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onToggleTheme={handleToggleTheme}
        onTriggerNotificationPermission={handleTriggerNotificationPermission}
        activeTopRatedCount={activeTopRatedCount}
        onFilterTopRated={() => {
          setFilterState(prev => ({ ...prev, priority: 'top_rated', status: 'all' }));
          setCurrentView('list');
        }}
      />

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          tasks={tasks}
          selectedCategory={filterState.category}
          onSelectCategory={(cat) => {
            setFilterState(prev => ({ ...prev, category: cat }));
            if (currentView !== 'list') setCurrentView('list');
          }}
          selectedPriority={filterState.priority}
          onSelectPriority={(p) => {
            setFilterState(prev => ({ ...prev, priority: p }));
            if (currentView !== 'list') setCurrentView('list');
          }}
          onResetData={handleResetSampleData}
          onExportData={handleExportData}
        />

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto' }}>
          {currentView === 'dashboard' && (
            <Dashboard
              user={user}
              tasks={tasks}
              onOpenCreateModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onToggleComplete={handleToggleComplete}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onStartFocus={handleStartFocus}
              onToggleSubtask={handleToggleSubtask}
              onNavigateToView={setCurrentView}
            />
          )}

          {currentView === 'list' && (
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onStartFocus={handleStartFocus}
              onToggleSubtask={handleToggleSubtask}
              onOpenCreateModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              filterState={filterState}
              onUpdateFilter={(newFilter) => setFilterState(prev => ({ ...prev, ...newFilter }))}
              categories={categories}
            />
          )}

          {currentView === 'kanban' && (
            <KanbanBoard
              tasks={tasks}
              onUpdateStatus={handleUpdateStatus}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onStartFocus={handleStartFocus}
              onOpenCreateModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              tasks={tasks}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {currentView === 'focus' && (
            <FocusTimer
              tasks={tasks}
              initialTask={focusingTask}
              onToggleComplete={handleToggleComplete}
              onToggleSubtask={handleToggleSubtask}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView
              tasks={tasks}
              user={user}
            />
          )}
        </main>
      </div>

      {/* Modals & Overlay Drawers */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        categories={categories}
      />

      <TopRatedReminderModal
        event={activeReminderEvent}
        onClose={() => setActiveReminderEvent(null)}
        onToggleComplete={handleToggleComplete}
        onSnooze={handleSnoozeReminder}
        onStartFocus={handleStartFocus}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onSaveUser={handleSaveUser}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={user}
        onSaveSettings={(updated) => {
          const next = { ...user, ...updated };
          storageService.saveUser(next);
          setUser(next);
        }}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onClearAllData={handleClearAllData}
        onResetSampleData={handleResetSampleData}
      />

    </div>
  );
}
