import React from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Kanban, 
  Calendar as CalendarIcon, 
  Timer, 
  BarChart3, 
  Flame, 
  AlertCircle, 
  RotateCcw,
  Download,
  FolderOpen
} from 'lucide-react';
import type { ViewMode, Task, Priority } from '../types/todo';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  tasks: Task[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedPriority: string;
  onSelectPriority: (priority: string) => void;
  onResetData: () => void;
  onExportData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  tasks,
  selectedCategory,
  onSelectCategory,
  selectedPriority,
  onSelectPriority,
  onResetData,
  onExportData
}) => {
  // Compute counts
  const totalActive = tasks.filter(t => !t.completed).length;
  const topRatedCount = tasks.filter(t => t.priority === 'top_rated' && !t.completed).length;
  const highCount = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  // Extract unique categories
  const categoriesMap = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + (!task.completed ? 1 : 0);
    return acc;
  }, {} as Record<string, number>);

  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list' as ViewMode, label: 'Task Manager', icon: ListTodo, badge: totalActive },
    { id: 'kanban' as ViewMode, label: 'Kanban Board', icon: Kanban },
    { id: 'calendar' as ViewMode, label: 'Calendar View', icon: CalendarIcon },
    { id: 'focus' as ViewMode, label: 'Focus Pomodoro', icon: Timer, highlight: true },
    { id: 'analytics' as ViewMode, label: 'Productivity Stats', icon: BarChart3 },
  ];

  const priorities: { id: Priority | 'all'; label: string; color: string; icon?: any; count: number }[] = [
    { id: 'top_rated', label: 'Top Rated (Smart Reminders)', color: '#f59e0b', icon: Flame, count: topRatedCount },
    { id: 'high', label: 'High Priority', color: '#ef4444', icon: AlertCircle, count: highCount },
    { id: 'medium', label: 'Medium Priority', color: '#f59e0b', count: tasks.filter(t => t.priority === 'medium' && !t.completed).length },
    { id: 'low', label: 'Low Priority', color: '#10b981', count: tasks.filter(t => t.priority === 'low' && !t.completed).length },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.25rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1.5rem',
      height: 'calc(100vh - 65px)',
      overflowY: 'auto',
      position: 'sticky',
      top: '65px',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Main Navigation */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Views
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive 
                      ? (item.highlight ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)' : 'var(--bg-tertiary)')
                      : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15rem ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
                    <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span style={{
                      fontSize: '0.75rem',
                      background: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '10px',
                      fontWeight: 600
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Filter Links */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Priorities
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {priorities.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPriority === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPriority(isSelected ? 'all' : p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {Icon ? <Icon size={16} style={{ color: p.color }} /> : (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.label}</span>
                  </div>
                  {p.count > 0 && (
                    <span style={{
                      fontSize: '0.7rem',
                      color: p.color,
                      fontWeight: 700
                    }}>
                      {p.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Categories
            </p>
            {selectedCategory !== 'all' && (
              <button 
                onClick={() => onSelectCategory('all')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {Object.entries(categoriesMap).map(([catName, count]) => {
              const isSelected = selectedCategory === catName;
              return (
                <button
                  key={catName}
                  onClick={() => onSelectCategory(isSelected ? 'all' : catName)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FolderOpen size={15} style={{ color: 'var(--text-muted)' }} />
                    <span>{catName}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Quick Utilities Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={onExportData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Download size={14} />
          <span>Export JSON Data</span>
        </button>

        <button
          onClick={onResetData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={14} />
          <span>Reset Sample Data</span>
        </button>
      </div>

    </aside>
  );
};
