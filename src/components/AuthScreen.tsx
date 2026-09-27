import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Flame, CheckCircle2 } from 'lucide-react';
import { storageService, DEFAULT_DEMO_USER } from '../services/storage';
import type { UserProfile } from '../types/todo';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const res = storageService.login(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Failed to log in.');
      }
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      const res = storageService.register(name, email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    }
  };

  const handleTryDemo = () => {
    const res = storageService.login(DEFAULT_DEMO_USER.email, DEFAULT_DEMO_USER.password);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow Accents */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '-150px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.18)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        right: '-150px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'rgba(245, 158, 11, 0.15)',
        filter: 'blur(120px)',
        pointerEvents: 'none'
      }} />

      <div 
        className="glass-panel modal-content"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.25rem 2rem',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 10
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.45)',
            marginBottom: '0.35rem'
          }}>
            <Sparkles size={28} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, lineHeight: 1.1 }}>
            TaskPulse <span style={{ fontSize: '0.8rem', background: 'var(--accent-glow)', color: 'var(--accent-primary)', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800 }}>PRO</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Smart Multi-User TODO & Isolated Task Workspaces
          </p>
        </div>

        {/* Log In / Sign Up Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-tertiary)',
          borderRadius: '12px',
          padding: '0.25rem'
        }}>
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'login' ? 'var(--bg-secondary)' : 'transparent',
              color: mode === 'login' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: mode === 'login' ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Log In
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              borderRadius: '9px',
              border: 'none',
              background: mode === 'register' ? 'var(--bg-secondary)' : 'transparent',
              color: mode === 'register' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: mode === 'register' ? 800 : 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '38px', height: '42px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px', height: '42px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px', height: '42px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              height: '44px',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
              marginTop: '0.5rem',
              borderRadius: '12px'
            }}
          >
            <span>{mode === 'login' ? 'Log In to Workspace' : 'Create Free Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Feature Highlights & Demo User Button */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} style={{ color: '#10b981' }} />
            <span>Private Isolated Workspace for Each User</span>
          </div>

          <button
            type="button"
            onClick={handleTryDemo}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '12px',
              padding: '0.65rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Flame size={16} />
            <span>Try Demo Account (Alex Morgan)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
