import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import type { Task } from '../types/todo';

interface CalendarViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onEditTask
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month & total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Calendar Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{monthName}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.4rem',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.4rem',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ padding: '0.5rem 0' }}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
        {/* Empty leading padding slots */}
        {Array.from({ length: firstDay }).map((_, idx) => (
          <div key={`empty-${idx}`} style={{ minHeight: '95px', opacity: 0.3 }} />
        ))}

        {/* Days of Month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const monthStr = String(month + 1).padStart(2, '0');
          const dayStr = String(dayNum).padStart(2, '0');
          const fullDateStr = `${year}-${monthStr}-${dayStr}`;

          const dayTasks = tasks.filter(t => t.dueDate === fullDateStr);
          const isToday = fullDateStr === todayStr;

          return (
            <div
              key={fullDateStr}
              style={{
                minHeight: '100px',
                background: isToday ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                border: isToday ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontWeight: isToday ? 900 : 700,
                  fontSize: '0.85rem',
                  color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)'
                }}>
                  {dayNum}
                </span>

                {dayTasks.length > 0 && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Tasks List snippet */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto', maxHeight: '75px' }}>
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onEditTask(task)}
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      background: task.priority === 'top_rated' 
                        ? '#f59e0b' 
                        : task.completed 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : 'var(--bg-secondary)',
                      color: task.priority === 'top_rated' ? '#000' : 'var(--text-primary)',
                      fontWeight: task.priority === 'top_rated' ? 800 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    {task.priority === 'top_rated' && <Flame size={10} />}
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
