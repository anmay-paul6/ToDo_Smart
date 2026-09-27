import React, { useState } from 'react';
import { X, User, Flame, Award, Check } from 'lucide-react';
import type { UserProfile } from '../types/todo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (updated: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email
    });
    onClose();
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
        style={{ width: '100%', maxWidth: '440px', padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} style={{ color: 'var(--accent-primary)' }} />
            User Account & Profile
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Badge Overview */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
          padding: '1.25rem',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
            color: '#fff',
            fontSize: '1.8rem',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            {user.name.charAt(0)}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user.name}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Flame size={16} /> {user.streakDays || 5} Day Streak
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Award size={16} /> Pro Account
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Display Name
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={18} />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
