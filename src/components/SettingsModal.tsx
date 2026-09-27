import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Volume2, 
  Bell, 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  Flame, 
  Check,
  Play,
  Trash2,
  RotateCcw
} from 'lucide-react';
import type { UserProfile } from '../types/todo';
import { soundService } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveSettings: (updated: Partial<UserProfile>) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onClearAllData: () => void;
  onResetSampleData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveSettings,
  onExportData,
  onImportData,
  onClearAllData,
  onResetSampleData
}) => {
  const [soundEnabled, setSoundEnabled] = useState(user.soundEnabled);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(user.browserNotificationsEnabled);
  const [reminderInterval, setReminderInterval] = useState(user.topRatedReminderInterval || 120);
  const [theme, setTheme] = useState(user.theme);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      soundEnabled,
      browserNotificationsEnabled,
      topRatedReminderInterval: reminderInterval,
      theme
    });
    onClose();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div 
        className="glass-panel modal-content"
        style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} style={{ color: 'var(--accent-primary)' }} />
            Application Settings
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Top Rated Smart Reminder Interval */}
          <div style={{ background: 'var(--priority-top-rated-bg)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '14px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
              <Flame size={18} />
              <span>Top Rated Smart Auto-Reminders</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Select how frequently Top Rated tasks auto-remind you throughout the day.
            </p>

            <select
              value={reminderInterval}
              onChange={(e) => setReminderInterval(Number(e.target.value))}
              className="input-field"
              style={{ fontWeight: 600 }}
            >
              <option value={60}>Every 1 Hour (Persistent)</option>
              <option value={120}>Every 2 Hours (Standard)</option>
              <option value={180}>Every 3 Hours</option>
              <option value={240}>Every 4 Hours</option>
            </select>
          </div>

          {/* Sound & Notifications Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            {/* Audio sound effects */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Volume2 size={18} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notification Sound FX</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Play Web Audio chimes for alerts</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => soundService.playTopRatedAlarmSound()}
                  title="Test Sound Alarm"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <Play size={12} /> Test
                </button>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Browser Notifications */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Bell size={18} style={{ color: '#10b981' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Browser Notifications</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Desktop popups for task reminders</div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={browserNotificationsEnabled}
                onChange={(e) => setBrowserNotificationsEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {/* Theme Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {theme === 'dark' ? <Moon size={18} style={{ color: '#818cf8' }} /> : <Sun size={18} style={{ color: '#fbbf24' }} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>App Theme</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Choose Dark or Light aesthetic</div>
                </div>
              </div>

              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
            </div>

          </div>

          {/* Data Backup & Management */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.65rem' }}>
              💾 Database Storage & Management
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                onClick={onExportData}
                className="btn-secondary"
                style={{ justifyContent: 'center' }}
              >
                <Download size={16} />
                <span>Export JSON</span>
              </button>

              <label
                className="btn-secondary"
                style={{ justifyContent: 'center', cursor: 'pointer' }}
              >
                <Upload size={16} />
                <span>Import JSON</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleFileImport}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  onClearAllData();
                  onClose();
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '0.6rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Trash2 size={16} />
                <span>Clear All Data</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onResetSampleData();
                  onClose();
                }}
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  padding: '0.6rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <RotateCcw size={16} />
                <span>Reset Demo Tasks</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="btn-primary">
              <Check size={18} />
              <span>Save Preferences</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
