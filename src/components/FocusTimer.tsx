import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  CheckCircle2, 
  Flame, 
  ListTodo
} from 'lucide-react';
import type { Task } from '../types/todo';
import { soundService } from '../utils/sound';

interface FocusTimerProps {
  tasks: Task[];
  initialTask?: Task | null;
  onToggleComplete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  tasks,
  initialTask,
  onToggleComplete,
  onToggleSubtask
}) => {
  const activeTasks = tasks.filter(t => !t.completed);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    initialTask?.id || activeTasks[0]?.id || ''
  );

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  const [durationMinutes, setDurationMinutes] = useState<number>(
    selectedTask?.estimatedMinutes || 25
  );
  const [secondsLeft, setSecondsLeft] = useState<number>(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Ambient sound generator type
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'white' | 'synth'>('off');
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  useEffect(() => {
    if (selectedTask) {
      const mins = selectedTask.estimatedMinutes || 25;
      setDurationMinutes(mins);
      if (!isRunning) {
        setSecondsLeft(mins * 60);
      }
    }
  }, [selectedTaskId]);

  // Countdown timer effect
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && secondsLeft > 0) {
      interval = window.setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      soundService.playTimerBell();
      if (selectedTask) {
        onToggleComplete(selectedTask.id);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft, selectedTask]);

  // Ambient Noise generator using Web Audio API
  useEffect(() => {
    if (ambientSound === 'off') {
      if (noiseNodeRef.current) {
        try { (noiseNodeRef.current as any).stop?.(); } catch {}
        noiseNodeRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Stop previous noise node if any
      if (noiseNodeRef.current) {
        try { (noiseNodeRef.current as any).stop?.(); } catch {}
      }

      if (ambientSound === 'white' || ambientSound === 'rain') {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const gain = ctx.createGain();
        gain.gain.value = ambientSound === 'rain' ? 0.05 : 0.02;

        if (ambientSound === 'rain') {
          // Lowpass filter for rain sound effect
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 800;
          whiteNoise.connect(filter);
          filter.connect(gain);
        } else {
          whiteNoise.connect(gain);
        }

        gain.connect(ctx.destination);
        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
      } else if (ambientSound === 'synth') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A hum
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        noiseNodeRef.current = osc;
      }
    } catch (e) {
      console.warn('Ambient audio generator error', e);
    }

    return () => {
      if (noiseNodeRef.current) {
        try { (noiseNodeRef.current as any).stop?.(); } catch {}
      }
    };
  }, [ambientSound]);

  const toggleTimer = () => {
    soundService.playClickSound();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    soundService.playClickSound();
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
  };

  const handleDurationChange = (mins: number) => {
    setDurationMinutes(mins);
    setIsRunning(false);
    setSecondsLeft(mins * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Header Task Selector */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          🎯 Select Focus Task
        </label>
        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          className="input-field"
          style={{ fontSize: '1rem', fontWeight: 600 }}
        >
          {activeTasks.length === 0 && <option value="">No active tasks available</option>}
          {activeTasks.map(t => (
            <option key={t.id} value={t.id}>
              {t.priority === 'top_rated' ? '🔥 ' : ''}{t.title} ({t.category})
            </option>
          ))}
        </select>
      </div>

      {/* Main Focus Dial Timer Panel */}
      <div 
        className={selectedTask?.priority === 'top_rated' ? 'glass-card-top-rated' : 'glass-panel'}
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.75rem',
          borderRadius: '24px'
        }}
      >
        {/* Active Task Title Display */}
        <div>
          {selectedTask?.priority === 'top_rated' && (
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '0.5rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
            }}>
              <Flame size={14} /> TOP RATED FOCUS TASK
            </span>
          )}
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1.2 }}>
            {selectedTask ? selectedTask.title : 'Focus Mode'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            {selectedTask?.description || 'Eliminate distractions & focus on achieving your priority target.'}
          </p>
        </div>

        {/* Circular Dial / Big Digital Counter */}
        <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="240" height="240" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="120" cy="120" r="100" stroke="var(--border-color)" strokeWidth="12" fill="transparent" />
            <circle 
              cx="120" 
              cy="120" 
              r="100" 
              stroke={selectedTask?.priority === 'top_rated' ? '#f59e0b' : 'var(--accent-primary)'} 
              strokeWidth="12" 
              fill="transparent"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'Outfit, monospace', letterSpacing: '-0.03em' }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {isRunning ? 'Session Active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Preset Duration Selector */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[15, 25, 45, 60].map(mins => (
            <button
              key={mins}
              onClick={() => handleDurationChange(mins)}
              style={{
                background: durationMinutes === mins ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: durationMinutes === mins ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Ambient Sound Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.4rem 0.85rem', borderRadius: '12px' }}>
          <Volume2 size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Ambient Sound:</span>
          {(['off', 'rain', 'white', 'synth'] as const).map(snd => (
            <button
              key={snd}
              onClick={() => setAmbientSound(snd)}
              style={{
                background: ambientSound === snd ? 'var(--border-hover)' : 'transparent',
                border: 'none',
                color: ambientSound === snd ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: ambientSound === snd ? 700 : 500,
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {snd}
            </button>
          ))}
        </div>

        {/* Play/Pause & Complete Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={resetTimer}
            title="Reset Timer"
            className="btn-secondary"
            style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, justifyContent: 'center' }}
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={toggleTimer}
            className={selectedTask?.priority === 'top_rated' ? 'btn-top-rated' : 'btn-primary'}
            style={{ padding: '0.85rem 2rem', fontSize: '1.1rem', borderRadius: '16px' }}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
            <span>{isRunning ? 'Pause Session' : 'Start Focus'}</span>
          </button>

          {selectedTask && (
            <button
              onClick={() => {
                soundService.playCompleteSound();
                onToggleComplete(selectedTask.id);
              }}
              title="Mark Task Complete"
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                border: '1px solid #10b981',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Task Checklist inside Focus View */}
      {selectedTask && selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ListTodo size={18} style={{ color: 'var(--accent-primary)' }} />
            Task Checklist Steps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {selectedTask.subtasks.map(st => (
              <div 
                key={st.id}
                onClick={() => onToggleSubtask(selectedTask.id, st.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.85rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                <CheckCircle2 size={18} style={{ color: st.completed ? '#10b981' : 'var(--text-muted)' }} />
                <span style={{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {st.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
