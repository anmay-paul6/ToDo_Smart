import React from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Target
} from 'lucide-react';
import type { Task, UserProfile } from '../types/todo';
import { TaskCard } from './TaskCard';

// Register ChartJS modules
ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface DashboardProps {
  user: UserProfile;
  tasks: Task[];
  onOpenCreateModal: () => void;
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onNavigateToView: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  tasks,
  onOpenCreateModal,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onStartFocus,
  onToggleSubtask,
  onNavigateToView
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculated Metrics
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const todayCompleted = todayTasks.filter(t => t.completed).length;
  const todayProgressPercent = todayTasks.length > 0 ? Math.round((todayCompleted / todayTasks.length) * 100) : 0;

  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);
  const topRatedActiveTasks = tasks.filter(t => t.priority === 'top_rated' && !t.completed);
  const totalCompleted = tasks.filter(t => t.completed).length;

  // Chart 1: Priority Doughnut Data
  const priorityCounts = {
    top_rated: tasks.filter(t => t.priority === 'top_rated' && !t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
    medium: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
    low: tasks.filter(t => t.priority === 'low' && !t.completed).length,
  };

  const doughnutData = {
    labels: ['Top Rated', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [priorityCounts.top_rated, priorityCounts.high, priorityCounts.medium, priorityCounts.low],
        backgroundColor: ['#f59e0b', '#ef4444', '#fbbf24', '#10b981'],
        borderColor: user.theme === 'dark' ? '#131b2e' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Chart 2: 7-Day Completion Velocity
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const barData = {
    labels: days.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Completed Tasks',
        data: days.map(d => tasks.filter(t => t.completedAt && t.completedAt.split('T')[0] === d).length),
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderRadius: 6,
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      
      {/* Welcome Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.75rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900 }}>
              Welcome back, {user.name}! 👋
            </h2>
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              color: '#fff',
              padding: '0.2rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
            }}>
              <Flame size={14} /> {user.streakDays || 5} Day Streak
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            You have <strong style={{ color: 'var(--accent-primary)' }}>{todayTasks.length - todayCompleted} tasks</strong> remaining today, including <strong style={{ color: '#f59e0b' }}>{topRatedActiveTasks.length} Top Rated</strong> items.
          </p>

          {/* Today's Progress Bar */}
          <div style={{ marginTop: '1rem', maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span>Today's Completion Goal</span>
              <span style={{ color: 'var(--accent-primary)' }}>{todayProgressPercent}% ({todayCompleted}/{todayTasks.length})</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${todayProgressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            </div>
          </div>
        </div>

        <button 
          onClick={onOpenCreateModal}
          className="btn-top-rated"
          style={{ padding: '0.85rem 1.4rem', fontSize: '0.95rem' }}
        >
          <Plus size={20} />
          <span>Add Priority Task</span>
        </button>
      </div>

      {/* 4 Core Metrics Cards */}
      <div className="responsive-metrics-grid">
        
        {/* Metric 1 */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Today's Tasks</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{todayTasks.length}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {todayCompleted} completed today
          </p>
        </div>

        {/* Metric 2: Overdue Tasks */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderColor: overdueTasks.length > 0 ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: overdueTasks.length > 0 ? '#ef4444' : 'var(--text-secondary)' }}>Overdue Tasks</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: overdueTasks.length > 0 ? '#ef4444' : 'inherit' }}>
            {overdueTasks.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {overdueTasks.length > 0 ? 'Requires immediate action' : 'All caught up!'}
          </p>
        </div>

        {/* Metric 3: Top Rated Active */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--priority-top-rated-bg)', borderColor: 'rgba(245, 158, 11, 0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>Top Rated Active</span>
            <div className="pulse-badge" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.25)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f59e0b' }}>
            {topRatedActiveTasks.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Smart auto-reminders active
          </p>
        </div>

        {/* Metric 4: Total Completed */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Completed</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981' }}>
            {totalCompleted}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Tasks accomplished
          </p>
        </div>

      </div>

      {/* Top Rated Spotlight Box */}
      {topRatedActiveTasks.length > 0 && (
        <div 
          className="glass-card-top-rated"
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="pulse-badge" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b' }}>
                  🔥 Active Top Rated Focus Items
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  These tasks trigger auto-reminders throughout the day until resolved.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToView('list')}
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '0.4rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="responsive-card-grid">
            {topRatedActiveTasks.slice(0, 2).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStartFocus={onStartFocus}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Doughnut Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
            Priority Breakdown
          </h3>
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut 
              data={doughnutData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: user.theme === 'dark' ? '#cbd5e1' : '#475569',
                      font: { family: 'Inter', size: 12 }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} style={{ color: '#10b981' }} />
            7-Day Task Completion Velocity
          </h3>
          <div style={{ height: '220px' }}>
            <Bar 
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: user.theme === 'dark' ? '#94a3b8' : '#64748b' },
                    grid: { color: user.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
                  },
                  x: {
                    ticks: { color: user.theme === 'dark' ? '#94a3b8' : '#64748b' },
                    grid: { display: false }
                  }
                },
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        </div>

      </div>

      {/* Today's / Overdue Action Section */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
            📌 Active Priority Agenda
          </h3>
          <button
            onClick={() => onNavigateToView('list')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            Go to Task Manager <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.filter(t => !t.completed).slice(0, 4).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStartFocus={onStartFocus}
              onToggleSubtask={onToggleSubtask}
            />
          ))}

          {tasks.filter(t => !t.completed).length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={42} style={{ color: '#10b981', margin: '0 auto 0.75rem auto' }} />
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>All clear for today!</p>
              <p style={{ fontSize: '0.85rem' }}>No pending tasks remaining. Great job!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
