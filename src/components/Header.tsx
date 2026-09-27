import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Search, 
  Plus, 
  Bell, 
  BellOff, 
  Sun, 
  Moon, 
  Settings,
  Menu
} from 'lucide-react';
import type { UserProfile, Task } from '../types/todo';

interface HeaderProps {
  user: UserProfile;
  tasks: Task[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCreateModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAuthModal: () => void;
  onToggleTheme: () => void;
  onTriggerNotificationPermission: () => void;
  activeTopRatedCount: number;
  onFilterTopRated: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onOpenSettingsModal,
  onOpenAuthModal,
  onToggleTheme,
  onTriggerNotificationPermission,
  activeTopRatedCount,
  onFilterTopRated,
  onToggleMobileMenu
}) => {
  const isDark = user.theme === 'dark';
  const hasNotificationPermission = typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';

  return (
    <header className="header-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.85rem 1.75rem',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backdropFilter: 'blur(12px)',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Brand & Mobile Hamburger Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <button
          onClick={onToggleMobileMenu}
          className="mobile-menu-btn"
          title="Toggle Navigation Menu"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Menu size={20} />
        </button>

        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          flexShrink: 0
        }}>
          <Sparkles size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            TaskPulse <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', background: 'var(--accent-glow)', color: 'var(--accent-primary)', padding: '0.1rem 0.35rem', borderRadius: '6px', fontWeight: 700 }}>PRO</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Smart Adaptive TODO</p>
        </div>
      </div>

      {/* Instant Search Bar */}
      <div className="header-search" style={{
        flex: '1',
        maxWidth: '450px',
        minWidth: '200px',
        position: 'relative'
      }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text"
          placeholder="Search tasks, categories, tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '38px', height: '40px' }}
        />
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Top Rated Pending Badge Alert */}
        {activeTopRatedCount > 0 && (
          <button
            onClick={onFilterTopRated}
            title={`${activeTopRatedCount} Top Rated tasks active with auto-reminders!`}
            className="pulse-badge"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '0.4rem 0.85rem',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
            }}
          >
            <Flame size={16} />
            <span>{activeTopRatedCount} Top Rated</span>
          </button>
        )}

        {/* Browser Notification Permission Toggle */}
        <button
          onClick={onTriggerNotificationPermission}
          title={hasNotificationPermission ? "Browser notifications active" : "Enable browser notifications for reminders"}
          style={{
            background: hasNotificationPermission ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
            color: hasNotificationPermission ? '#10b981' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {hasNotificationPermission ? <Bell size={18} /> : <BellOff size={18} />}
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {isDark ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
        </button>

        {/* Settings Trigger */}
        <button
          onClick={onOpenSettingsModal}
          title="App Settings & Data Backup"
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Settings size={18} />
        </button>

        {/* Create Task Button */}
        <button 
          onClick={onOpenCreateModal}
          className="btn-primary"
          style={{ height: '40px', padding: '0 1rem' }}
        >
          <Plus size={18} />
          <span style={{ fontWeight: 600 }}>New Task</span>
        </button>

        {/* User Profile Button */}
        <button
          onClick={onOpenAuthModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '0.3rem 0.7rem 0.3rem 0.3rem',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.8rem'
          }}>
            {user.name.charAt(0)}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
        </button>
      </div>
    </header>
  );
};
