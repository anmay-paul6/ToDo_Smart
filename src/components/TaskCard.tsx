import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Folder, 
  Tag, 
  Edit, 
  Trash2, 
  Timer, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Bell
} from 'lucide-react';
import type { Task } from '../types/todo';
import { soundService } from '../utils/sound';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onStartFocus,
  onToggleSubtask
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const isTopRated = task.priority === 'top_rated';
  const isHigh = task.priority === 'high';

  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
  const isDueToday = !task.completed && task.dueDate === todayStr;

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      soundService.playCompleteSound();
      // Fire celebratory confetti for completing Top Rated or High priority tasks
      if (isTopRated || isHigh) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
    onToggleComplete(task.id);
  };

  const completedSubtasksCount = (task.subtasks || []).filter(s => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  return (
    <div 
      className={isTopRated && !task.completed ? "glass-card-top-rated" : "glass-panel"}
      style={{
        padding: '1.25rem',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        opacity: task.completed ? 0.65 : 1,
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        
        {/* Checkbox & Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
          <button
            onClick={handleCompleteClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: task.completed 
                ? '#10b981' 
                : isTopRated 
                ? '#f59e0b' 
                : 'var(--text-muted)',
              marginTop: '2px',
              padding: 0,
              transition: 'transform 0.15s ease'
            }}
          >
            {task.completed ? (
              <CheckCircle2 size={22} style={{ fill: 'rgba(16, 185, 129, 0.2)' }} />
            ) : (
              <Circle size={22} />
            )}
          </button>

          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: task.completed ? 'line-through' : 'none',
              lineHeight: 1.35
            }}>
              {task.title}
            </h3>

            {task.description && (
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginTop: '0.35rem',
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Priority Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {isTopRated ? (
            <span style={{
              background: 'var(--priority-top-rated-bg)',
              border: '1px solid var(--priority-top-rated-border)',
              color: 'var(--priority-top-rated-text)',
              padding: '0.25rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: 'var(--priority-top-rated-glow)'
            }}>
              <Flame size={14} />
              TOP RATED
            </span>
          ) : (
            <span style={{
              background: `var(--priority-${task.priority}-bg)`,
              border: `1px solid var(--priority-${task.priority}-border)`,
              color: `var(--priority-${task.priority}-text)`,
              padding: '0.2rem 0.55rem',
              borderRadius: '12px',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              {task.priority}
            </span>
          )}
        </div>
      </div>

      {/* Subtasks Progress Bar & Toggle */}
      {totalSubtasks > 0 && (
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.6rem 0.75rem', borderRadius: '10px' }}>
          <div 
            onClick={() => setShowSubtasks(!showSubtasks)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Checklist: {completedSubtasksCount}/{totalSubtasks} done
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '80px', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(completedSubtasksCount / totalSubtasks) * 100}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #6366f1, #10b981)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              {showSubtasks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {showSubtasks && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)' }}>
              {task.subtasks.map((st) => (
                <div 
                  key={st.id} 
                  onClick={() => onToggleSubtask && onToggleSubtask(task.id, st.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  {st.completed ? (
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                  ) : (
                    <Circle size={16} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <span style={{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Meta Footer Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.5rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Category */}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Folder size={14} />
            {task.category}
          </span>

          {/* Due Date & Overdue Indicator */}
          {task.dueDate && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: isOverdue ? '#ef4444' : isDueToday ? '#f59e0b' : 'inherit',
              fontWeight: (isOverdue || isDueToday) ? 700 : 500
            }}>
              {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
              {isOverdue ? `Overdue (${task.dueDate})` : isDueToday ? `Today (${task.dueTime || 'EOD'})` : task.dueDate}
            </span>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Tag size={13} />
              {task.tags.map(t => (
                <span key={t} style={{ background: 'var(--bg-tertiary)', padding: '0.1rem 0.4rem', borderRadius: '6px', fontSize: '0.72rem' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Top Rated Auto Reminders Badge */}
          {isTopRated && !task.completed && (
            <span title="Multiple reminders active throughout the day" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 700 }}>
              <Bell size={13} />
              Auto Reminders
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {!task.completed && (
            <button
              onClick={() => onStartFocus(task)}
              title="Start Focus Session (Pomodoro Timer)"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)',
                border: 'none',
                padding: '0.3rem 0.6rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Timer size={14} />
              Focus
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <Edit size={14} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            style={{
              background: 'var(--bg-tertiary)',
              color: '#ef4444',
              border: 'none',
              padding: '0.35rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
