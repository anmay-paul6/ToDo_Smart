import type { Task, Reminder, TopRatedReminderEvent } from '../types/todo';
import { soundService } from './sound';

// Generates smart automatic multiple reminders throughout the day for Top Rated tasks
export function generateTopRatedReminders(
  task: Task, 
  intervalMinutes: number = 120, // default every 2 hours
  startHour: number = 8, 
  endHour: number = 21
): Reminder[] {
  if (task.priority !== 'top_rated' || task.completed) {
    return task.reminders || [];
  }

  const existing = [...(task.reminders || [])];
  const todayStr = new Date().toISOString().split('T')[0];
  const targetDate = task.dueDate || todayStr;

  // Generate hourly/interval checkpoints for the day
  const newReminders: Reminder[] = [];
  const start = new Date(`${targetDate}T0${startHour}:00:00`);
  const end = new Date(`${targetDate}T${endHour}:00:00`);

  let current = new Date(start);
  let slotIndex = 1;

  while (current <= end) {
    const hours = String(current.getHours()).padStart(2, '0');
    const mins = String(current.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${mins}`;

    // Check if reminder already exists at this exact time
    const alreadyExists = existing.some(r => r.time === timeStr);
    if (!alreadyExists) {
      newReminders.push({
        id: `top-rated-${task.id}-${timeStr}-${slotIndex}`,
        time: timeStr,
        label: `🔥 Top Rated Focus Alert #${slotIndex} (${timeStr})`,
        triggered: false,
        type: 'top_rated_auto'
      });
    }

    current = new Date(current.getTime() + intervalMinutes * 60 * 1000);
    slotIndex++;
  }

  return [...existing, ...newReminders];
}

// Check pending reminders for active tasks and trigger notification/sound/events
export class ReminderEngine {
  private activeIntervalId: number | null = null;
  private onTriggerCallback: ((event: TopRatedReminderEvent) => void) | null = null;

  startEngine(
    getTasks: () => Task[], 
    updateTask: (task: Task) => void,
    onTrigger: (event: TopRatedReminderEvent) => void,
    soundEnabled: boolean = true,
    browserNotificationsEnabled: boolean = true
  ) {
    this.onTriggerCallback = onTrigger;
    this.stopEngine();

    // Request notification permissions if enabled
    if (browserNotificationsEnabled && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    // Check immediately and every 20 seconds
    const checkFn = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;
      const todayDateStr = now.toISOString().split('T')[0];

      const tasks = getTasks();

      tasks.forEach(task => {
        if (task.completed) return;

        // Check if task is due today or overdue, or has active reminders
        const taskReminders = task.reminders || [];
        let updated = false;
        const modifiedReminders = taskReminders.map(rem => {
          if (rem.triggered) return rem;

          // Check if time matches current time (HH:mm)
          const isTimeMatch = rem.time === currentTimeStr;
          
          // Also check if task is Top Rated and reminder is due
          const isTaskDueToday = !task.dueDate || task.dueDate === todayDateStr || task.dueDate < todayDateStr;

          if (isTimeMatch && isTaskDueToday) {
            // Trigger alert!
            updated = true;
            
            // 1. Play sound if enabled
            if (soundEnabled) {
              soundService.playTopRatedAlarmSound();
            }

            // 2. Show native browser notification
            if (browserNotificationsEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(`🔥 Top Rated Task Reminder`, {
                  body: `Don't forget: ${task.title}\nCategory: ${task.category} • Priority: TOP RATED`,
                  icon: '/favicon.ico',
                  tag: `task-${task.id}`,
                  requireInteraction: true
                });
              } catch (err) {
                console.warn('Browser notification error', err);
              }
            }

            // 3. Callback for UI modal/toast
            if (this.onTriggerCallback) {
              this.onTriggerCallback({
                task,
                reminder: rem,
                timestamp: new Date().toISOString()
              });
            }

            return { ...rem, triggered: true };
          }
          return rem;
        });

        if (updated) {
          updateTask({
            ...task,
            reminders: modifiedReminders
          });
        }
      });
    };

    checkFn();
    this.activeIntervalId = window.setInterval(checkFn, 20000);
  }

  stopEngine() {
    if (this.activeIntervalId !== null) {
      clearInterval(this.activeIntervalId);
      this.activeIntervalId = null;
    }
  }

  // Snooze a reminder by N minutes
  snoozeReminder(task: Task, reminderId: string, minutes: number = 30): Task {
    const now = new Date();
    const future = new Date(now.getTime() + minutes * 60 * 1000);
    const hours = String(future.getHours()).padStart(2, '0');
    const mins = String(future.getMinutes()).padStart(2, '0');
    const snoozeTimeStr = `${hours}:${mins}`;

    const updatedReminders = (task.reminders || []).map(rem => {
      if (rem.id === reminderId) {
        return {
          ...rem,
          time: snoozeTimeStr,
          triggered: false,
          label: `⏰ Snoozed until ${snoozeTimeStr}`
        };
      }
      return rem;
    });

    return {
      ...task,
      reminders: updatedReminders
    };
  }
}

export const reminderEngine = new ReminderEngine();
