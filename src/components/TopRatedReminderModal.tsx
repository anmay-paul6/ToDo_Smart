import React from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  X, 
  CheckCircle2, 
  Clock, 
  Timer
} from 'lucide-react';
import type { Task, Reminder } from '../types/todo';
import { soundService } from '../utils/sound';

interface TopRatedReminderModalProps {
  event: { task: Task; reminder: Reminder; timestamp: string } | null;
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
  onSnooze: (task: Task, reminderId: string, minutes: number) => void;
  onStartFocus: (task: Task) => void;
}

export const TopRatedReminderModal: React.FC<TopRatedReminderModalProps> = ({
  event,
  onClose,
  onToggleComplete,
  onSnooze,
  onStartFocus
}) => {
  if (!event) return null;

  const { task, reminder } = event;

  const handleComplete = () => {
    soundService.playCompleteSound();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    onToggleComplete(task.id);
    onClose();
  };

  const handleSnoozeMinutes = (mins: number) => {
    soundService.playClickSound();
    onSnooze(task, reminder.id, mins);
    onClose();
  };

  const handleFocusClick = () => {
    soundService.playClickSound();
    onStartFocus(task);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 150,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div 
        className="glass-card-top-rated toast-alert"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2rem',
          borderRadius: '24px',
          boxShadow: '0 0 35px rgba(245, 158, 11, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          position: 'relative'
        }}
      >
        {/* Top Flame Badge & Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="pulse-badge" style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.5)'
            }}>
              <Flame size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '-0.01em' }}>
                🔥 Top Rated Smart Reminder!
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {reminder.label || `Scheduled alert at ${reminder.time}`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Task Details Content */}
        <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3 }}>
            {task.title}
          </h3>

          {task.description && (
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
              {task.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Category: <strong style={{ color: 'var(--text-primary)' }}>{task.category}</strong></span>
            {task.dueDate && (
              <span>Due: <strong style={{ color: '#f59e0b' }}>{task.dueDate} ({task.dueTime || 'EOD'})</strong></span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            onClick={handleComplete}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            <CheckCircle2 size={20} />
            <span>Complete Task Now</span>
          </button>

          <button
            onClick={handleFocusClick}
            className="btn-primary"
            style={{ padding: '0.8rem', justifyContent: 'center', borderRadius: '14px' }}
          >
            <Timer size={18} />
            <span>Start Pomodoro Focus Session</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              onClick={() => handleSnoozeMinutes(30)}
              className="btn-secondary"
              style={{ justifyContent: 'center', borderRadius: '12px', fontSize: '0.85rem' }}
            >
              <Clock size={16} />
              <span>Snooze 30 min</span>
            </button>
            <button
              onClick={() => handleSnoozeMinutes(60)}
              className="btn-secondary"
              style={{ justifyContent: 'center', borderRadius: '12px', fontSize: '0.85rem' }}
            >
              <Clock size={16} />
              <span>Snooze 1 Hour</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
