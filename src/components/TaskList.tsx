import React, { useState, useMemo } from 'react';
import { 
  Grid, 
  List as ListIcon, 
  CheckSquare, 
  Trash2, 
  Plus, 
  Flame
} from 'lucide-react';
import type { Task, Priority, TaskFilterState } from '../types/todo';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onOpenCreateModal: () => void;
  filterState: TaskFilterState;
  onUpdateFilter: (filter: Partial<TaskFilterState>) => void;
  categories: string[];
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onStartFocus,
  onToggleSubtask,
  onOpenCreateModal,
  filterState,
  onUpdateFilter
}) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'table'>('grid');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering & Sorting Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search text
      if (filterState.search) {
        const query = filterState.search.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query);
        const matchTag = task.tags?.some(t => t.toLowerCase().includes(query));
        const matchCat = task.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchTag && !matchCat) return false;
      }

      // Priority filter
      if (filterState.priority !== 'all' && task.priority !== filterState.priority) {
        return false;
      }

      // Category filter
      if (filterState.category !== 'all' && task.category !== filterState.category) {
        return false;
      }

      // Status filter
      if (filterState.status === 'active' && task.completed) return false;
      if (filterState.status === 'completed' && !task.completed) return false;
      if (filterState.status === 'today' && task.dueDate !== todayStr) return false;
      if (filterState.status === 'overdue' && (task.completed || !task.dueDate || task.dueDate >= todayStr)) return false;

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'priority') {
        const pOrder: Record<Priority, number> = { top_rated: 4, high: 3, medium: 2, low: 1 };
        return pOrder[b.priority] - pOrder[a.priority];
      }
      if (filterState.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (filterState.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // default createdAt
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filterState, todayStr]);

  const handleBulkComplete = () => {
    selectedTaskIds.forEach(id => onToggleComplete(id));
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    selectedTaskIds.forEach(id => onDeleteTask(id));
    setSelectedTaskIds([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Filters Toolbar */}
      <div 
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'today', label: 'Today' },
            { id: 'active', label: 'Active' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'completed', label: 'Completed' },
          ].map(tab => {
            const isActive = filterState.status === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onUpdateFilter({ status: tab.id as any })}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Controls: Priority, Category, Sorting & Layout Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Priority Select */}
          <select
            value={filterState.priority}
            onChange={(e) => onUpdateFilter({ priority: e.target.value })}
            className="input-field"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="all">All Priorities</option>
            <option value="top_rated">🔥 Top Rated</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          {/* Sort By */}
          <select
            value={filterState.sortBy}
            onChange={(e) => onUpdateFilter({ sortBy: e.target.value as any })}
            className="input-field"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="createdAt">Sort: Created</option>
            <option value="title">Sort: Title</option>
          </select>

          {/* Layout Grid / Table Switch */}
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '0.15rem' }}>
            <button
              onClick={() => setLayoutMode('grid')}
              style={{
                background: layoutMode === 'grid' ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.6rem',
                color: layoutMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setLayoutMode('table')}
              style={{
                background: layoutMode === 'table' ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.6rem',
                color: layoutMode === 'table' ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <ListIcon size={16} />
            </button>
          </div>

        </div>

      </div>

      {/* Bulk Selection Bar */}
      {selectedTaskIds.length > 0 && (
        <div 
          className="glass-panel"
          style={{
            padding: '0.75rem 1.25rem',
            background: 'var(--accent-glow)',
            borderColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
            {selectedTaskIds.length} tasks selected
          </span>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleBulkComplete}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              <CheckSquare size={15} />
              <span>Mark Completed</span>
            </button>
            <button
              onClick={handleBulkDelete}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Trash2 size={15} />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Tasks List Content */}
      {filteredTasks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Flame size={48} style={{ color: '#f59e0b', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            No tasks match your filter
          </h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Try adjusting your search criteria or create a new priority task.
          </p>
          <button onClick={onOpenCreateModal} className="btn-primary">
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>
      ) : layoutMode === 'grid' ? (
        <div className="responsive-card-grid">
          {filteredTasks.map(task => (
            <div key={task.id} style={{ position: 'relative' }}>
              <TaskCard
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStartFocus={onStartFocus}
                onToggleSubtask={onToggleSubtask}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Table Layout View */
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '0.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Title</th>
                <th style={{ padding: '0.75rem' }}>Priority</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Due Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr 
                  key={task.id} 
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    opacity: task.completed ? 0.6 : 1,
                    background: task.priority === 'top_rated' && !task.completed ? 'var(--priority-top-rated-bg)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      onClick={() => onToggleComplete(task.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? '#10b981' : 'var(--text-muted)' }}
                    >
                      <CheckSquare size={18} />
                    </button>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 600, textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      background: `var(--priority-${task.priority}-bg)`,
                      color: `var(--priority-${task.priority}-text)`,
                      border: `1px solid var(--priority-${task.priority}-border)`,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {task.priority === 'top_rated' ? '🔥 TOP RATED' : task.priority.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{task.category}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{task.dueDate || '-'}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button onClick={() => onStartFocus(task)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', marginRight: '0.5rem' }}>
                      Focus
                    </button>
                    <button onClick={() => onEditTask(task)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '0.5rem' }}>
                      Edit
                    </button>
                    <button onClick={() => onDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
