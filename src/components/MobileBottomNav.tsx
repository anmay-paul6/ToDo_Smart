import React from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Plus, 
  Timer, 
  Calendar as CalendarIcon, 
  BarChart3 
} from 'lucide-react';
import type { ViewMode } from '../types/todo';

interface MobileBottomNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenCreateModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  onOpenCreateModal
}) => {
  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Home', icon: LayoutDashboard },
    { id: 'list' as ViewMode, label: 'Tasks', icon: ListTodo },
    { id: 'focus' as ViewMode, label: 'Focus', icon: Timer },
    { id: 'calendar' as ViewMode, label: 'Calendar', icon: CalendarIcon },
    { id: 'analytics' as ViewMode, label: 'Stats', icon: BarChart3 },
  ];

  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '0.4rem 0.5rem 0.6rem 0.5rem',
      justifyContent: 'space-around',
      alignItems: 'center',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
    }}>
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.7rem',
              cursor: 'pointer',
              flex: 1
            }}
          >
            <Icon size={20} style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Floating Center Create Task Action Button */}
      <button
        onClick={onOpenCreateModal}
        title="Create New Task"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
          border: 'none',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.5)',
          cursor: 'pointer',
          marginTop: '-18px',
          flexShrink: 0
        }}
      >
        <Plus size={24} />
      </button>

      {navItems.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.7rem',
              cursor: 'pointer',
              flex: 1
            }}
          >
            <Icon size={20} style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
