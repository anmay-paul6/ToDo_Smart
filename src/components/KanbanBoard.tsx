import React from 'react';
import { 
  Flame, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  Timer
} from 'lucide-react';
import type { Task } from '../types/todo';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, status: 'todo' | 'in_progress' | 'completed') => void;
  onEditTask: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onOpenCreateModal: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateStatus,
  onEditTask,
  onStartFocus,
  onOpenCreateModal
}) => {
  const columns: { id: 'todo' | 'in_progress' | 'completed'; title: string; color: string; icon: string }[] = [
    { id: 'todo', title: 'To Do', color: '#6366f1', icon: '📋' },
    { id: 'in_progress', title: 'In Progress', color: '#f59e0b', icon: '⚡' },
    { id: 'completed', title: 'Completed', color: '#10b981', icon: '✅' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', minHeight: '600px' }}>
      {columns.map(col => {
        const colTasks = tasks.filter(t => (t.status || (t.completed ? 'completed' : 'todo')) === col.id);

        return (
          <div 
            key={col.id}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background: 'var(--bg-card)'
            }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{col.icon}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{col.title}</h3>
                <span style={{
                  background: 'var(--bg-tertiary)',
                  color: col.color,
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '12px'
                }}>
                  {colTasks.length}
                </span>
              </div>

              {col.id === 'todo' && (
                <button
                  onClick={onOpenCreateModal}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.35rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            {/* Column Task Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
              {colTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No tasks in {col.title}
                </div>
              ) : (
                colTasks.map(task => {
                  const isTopRated = task.priority === 'top_rated';
                  return (
                    <div
                      key={task.id}
                      className={isTopRated && !task.completed ? "glass-card-top-rated" : "glass-panel"}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <h4 
                          onClick={() => onEditTask(task)}
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                          }}
                        >
                          {task.title}
                        </h4>

                        {isTopRated && (
                          <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Flame size={13} />
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {task.description}
                        </p>
                      )}

                      {/* Card Footer & Column Move Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                          {task.category}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          {!task.completed && (
                            <button
                              onClick={() => onStartFocus(task)}
                              title="Start Focus"
                              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}
                            >
                              <Timer size={14} />
                            </button>
                          )}

                          {col.id !== 'todo' && (
                            <button
                              onClick={() => onUpdateStatus(task.id, col.id === 'completed' ? 'in_progress' : 'todo')}
                              title="Move Left"
                              style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '4px', padding: '0.2rem', cursor: 'pointer' }}
                            >
                              <ArrowLeft size={13} />
                            </button>
                          )}

                          {col.id !== 'completed' && (
                            <button
                              onClick={() => onUpdateStatus(task.id, col.id === 'todo' ? 'in_progress' : 'completed')}
                              title="Move Right"
                              style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '4px', padding: '0.2rem', cursor: 'pointer' }}
                            >
                              <ArrowRight size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};
