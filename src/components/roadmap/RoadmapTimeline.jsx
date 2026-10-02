import React, { useState } from 'react';
import { RoadmapItem } from './RoadmapItem';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Sparkles, Filter, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const RoadmapTimeline = ({ missions = [], careerTitle = 'MLOps Engineer', overallProgress = 0, weeklyHours = 8 }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'current' | 'completed' | 'adapted'

  const filteredMissions = missions.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'current') return m.status === 'current';
    if (filter === 'completed') return m.status === 'completed';
    if (filter === 'adapted') return Boolean(m.isAdapted);
    return true;
  });

  const completedCount = missions.filter((m) => m.status === 'completed').length;
  const adaptedCount = missions.filter((m) => m.isAdapted).length;

  return (
    <div>
      {/* Header Summary Card */}
      <Card
        style={{
          padding: '1.75rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(26, 34, 56, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              <Sparkles className="w-4 h-4" />
              <span>AI-ADAPTIVE LEARNING ROADMAP</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {careerTitle} Path
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Continuous curriculum dynamically customized to your assessment mastery.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Milestones</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {completedCount} / {missions.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weekly Commitment</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>
                {weeklyHours} hrs/wk
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Adaptations</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: adaptedCount > 0 ? '#fbbf24' : '#94a3b8' }}>
                {adaptedCount} Dynamic
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Overall Path Completion</span>
            <span style={{ fontWeight: 700, color: '#818cf8' }}>{overallProgress}%</span>
          </div>
          <ProgressBar value={overallProgress} size="md" variant="primary" />
        </div>
      </Card>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.75rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 600,
            backgroundColor: filter === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
            color: filter === 'all' ? '#fff' : 'var(--text-secondary)',
            border: filter === 'all' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
        >
          All Weeks ({missions.length})
        </button>
        <button
          onClick={() => setFilter('current')}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 600,
            backgroundColor: filter === 'current' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
            color: filter === 'current' ? '#c084fc' : 'var(--text-secondary)',
            border: filter === 'current' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
        >
          Current Focus
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 600,
            backgroundColor: filter === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
            color: filter === 'completed' ? '#34d399' : 'var(--text-secondary)',
            border: filter === 'completed' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
        >
          Completed ({completedCount})
        </button>
        {adaptedCount > 0 && (
          <button
            onClick={() => setFilter('adapted')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: filter === 'adapted' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: filter === 'adapted' ? '#fbbf24' : 'var(--text-secondary)',
              border: filter === 'adapted' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            Adapted by AI ({adaptedCount})
          </button>
        )}
      </div>

      {/* Timeline List */}
      <div>
        {filteredMissions.map((mission, index) => (
          <RoadmapItem
            key={mission.id}
            mission={mission}
            isLast={index === filteredMissions.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
