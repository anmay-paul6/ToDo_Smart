import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  Sparkles, 
  Plus, 
  Trash2
} from 'lucide-react';
import type { Task, Priority, Category, RecurringFrequency } from '../types/todo';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  initialTask?: Task | null;
  categories: string[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  categories
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('Work');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('17:00');
  const [tagsInput, setTagsInput] = useState('');
  const [recurring, setRecurring] = useState<RecurringFrequency>('none');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [topRatedIntervalMinutes, setTopRatedIntervalMinutes] = useState(120);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'medium');
      setCategory(initialTask.category || 'Work');
      setDueDate(initialTask.dueDate || new Date().toISOString().split('T')[0]);
      setDueTime(initialTask.dueTime || '17:00');
      setTagsInput((initialTask.tags || []).join(', '));
      setRecurring(initialTask.recurring || 'none');
      setEstimatedMinutes(initialTask.estimatedMinutes || 30);
      setSubtasks(initialTask.subtasks || []);
      setTopRatedIntervalMinutes(initialTask.topRatedIntervalMinutes || 120);
    } else {
      // Reset form
      const todayStr = new Date().toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Work');
      setIsCustomCategory(false);
      setCustomCategory('');
      setDueDate(todayStr);
      setDueTime('17:00');
      setTagsInput('');
      setRecurring('none');
      setEstimatedMinutes(30);
      setSubtasks([]);
      setTopRatedIntervalMinutes(120);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = isCustomCategory && customCategory.trim() 
      ? customCategory.trim() 
      : category;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      ...(initialTask || {}),
      title: title.trim(),
      description: description.trim(),
      priority,
      category: finalCategory,
      dueDate,
      dueTime,
      tags,
      recurring,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      subtasks,
      topRatedIntervalMinutes,
      status: initialTask?.status || 'todo'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" style={{
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
        style={{
          width: '100%',
          maxWidth: '650px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {initialTask ? '✏️ Edit Task' : '⚡ Create New Task'}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Task Title *
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. Finalize quarterly financial report & submit to board"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              style={{ fontSize: '1.05rem', fontWeight: 600 }}
              autoFocus
            />
          </div>

          {/* Priority Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Priority Level
            </label>
            <div className="responsive-priority-grid">
              {(['low', 'medium', 'high', 'top_rated'] as Priority[]).map((p) => {
                const isSelected = priority === p;
                const isTopRated = p === 'top_rated';
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid' : '1px solid var(--border-color)',
                      borderColor: isSelected 
                        ? (isTopRated ? '#f59e0b' : p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#10b981')
                        : 'var(--border-color)',
                      background: isSelected 
                        ? (isTopRated ? 'var(--priority-top-rated-bg)' : 'var(--bg-tertiary)')
                        : 'var(--bg-tertiary)',
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: isSelected ? 800 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isTopRated ? <Flame size={18} style={{ color: '#f59e0b' }} /> : null}
                    <span style={{ textTransform: 'capitalize' }}>
                      {p === 'top_rated' ? '🔥 Top Rated' : p}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top Rated Smart Reminder Feature Highlight Banner */}
          {priority === 'top_rated' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '12px',
              padding: '0.9rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                <Sparkles size={18} />
                <span>Smart Auto-Reminder Activated</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Top Rated tasks automatically schedule multiple persistent reminders throughout the day until completed!
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Reminder Frequency:</label>
                <select
                  value={topRatedIntervalMinutes}
                  onChange={(e) => setTopRatedIntervalMinutes(Number(e.target.value))}
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value={60}>Every 1 Hour (Urgent)</option>
                  <option value={120}>Every 2 Hours (Recommended)</option>
                  <option value={180}>Every 3 Hours</option>
                  <option value={240}>Every 4 Hours</option>
                </select>
              </div>
            </div>
          )}

          {/* Category & Tags */}
          <div className="responsive-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Category
              </label>
              {!isCustomCategory ? (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === 'NEW') {
                        setIsCustomCategory(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="input-field"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="NEW">+ Add Custom Category</option>
                  </select>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="Category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="input-field"
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsCustomCategory(false)}
                    className="btn-secondary"
                    style={{ padding: '0 0.6rem' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Work, Urgent, Q3"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Due Date, Time, Recurring, Estimated Minutes */}
          <div className="responsive-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Due Date
              </label>
              <input 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Due Time
              </label>
              <input 
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="responsive-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Recurring Schedule
              </label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as RecurringFrequency)}
                className="input-field"
              >
                <option value="none">None (One-time)</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Est. Focus Duration (Mins)
              </label>
              <input 
                type="number"
                min={5}
                max={480}
                step={5}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="input-field"
              />
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Description & Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add extra context, links, or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Subtasks Builder */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Checklist / Subtasks ({subtasks.length})
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.6rem' }}>
              {subtasks.map((st) => (
                <div 
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-tertiary)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}
                >
                  <span>• {st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                className="input-field"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="btn-secondary"
                style={{ padding: '0 0.85rem', flexShrink: 0 }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              className={priority === 'top_rated' ? 'btn-top-rated' : 'btn-primary'}
            >
              {priority === 'top_rated' ? <Flame size={18} /> : <Sparkles size={18} />}
              <span>{initialTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
