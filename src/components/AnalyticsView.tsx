import React from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip as ChartTooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  BarChart3, 
  Flame
} from 'lucide-react';
import type { Task, UserProfile } from '../types/todo';

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement);

interface AnalyticsViewProps {
  tasks: Task[];
  user: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, user }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalFocusMinutes = tasks.reduce((sum, t) => sum + (t.timeSpentMinutes || 0), 0);

  // Priority chart
  const priorityData = {
    labels: ['Top Rated 🔥', 'High 🔴', 'Medium 🟡', 'Low 🟢'],
    datasets: [{
      data: [
        tasks.filter(t => t.priority === 'top_rated').length,
        tasks.filter(t => t.priority === 'high').length,
        tasks.filter(t => t.priority === 'medium').length,
        tasks.filter(t => t.priority === 'low').length,
      ],
      backgroundColor: ['#f59e0b', '#ef4444', '#fbbf24', '#10b981'],
      borderWidth: 2,
      borderColor: user.theme === 'dark' ? '#131b2e' : '#fff'
    }]
  };

  // Category distribution
  const categoriesMap = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = {
    labels: Object.keys(categoriesMap),
    datasets: [{
      label: 'Tasks by Category',
      data: Object.values(categoriesMap),
      backgroundColor: 'rgba(129, 140, 248, 0.85)',
      borderRadius: 8
    }]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={24} style={{ color: 'var(--accent-primary)' }} />
            Productivity Analytics & Velocity Insights
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track your task completion rates, focus duration, and priority distribution.
          </p>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', marginBottom: '0.2rem' }}>
            {completionRate}%
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Overall Completion Rate</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {completedTasks} out of {totalTasks} tasks done
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Flame size={28} /> {user.streakDays || 5} Days
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Current Productivity Streak</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Consistent daily progress
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>
            {Math.round(totalFocusMinutes / 60)} hrs {totalFocusMinutes % 60}m
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Total Focus Time Spent</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Logged via Pomodoro sessions
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Priority Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
            Priority Volume Distribution
          </h3>
          <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut 
              data={priorityData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: user.theme === 'dark' ? '#cbd5e1' : '#475569' }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
            Task Distribution by Category
          </h3>
          <div style={{ height: '250px' }}>
            <Bar 
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    ticks: { color: user.theme === 'dark' ? '#94a3b8' : '#64748b' },
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

    </div>
  );
};
