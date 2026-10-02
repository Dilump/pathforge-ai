import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { MissionCard } from '../components/missions/MissionCard';
import { Card } from '../components/common/Card';
import { CheckSquare, Filter } from 'lucide-react';

export const MissionsPage = () => {
  const { missions } = useRoadmap();
  const [filter, setFilter] = useState('all'); // 'all' | 'current' | 'completed'

  const filtered = missions.filter((m) => {
    if (filter === 'current') return m.status === 'current';
    if (filter === 'completed') return m.status === 'completed';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Weekly Learning Missions
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Hands-on weekly milestones combining theory, lab tasks, challenges, and mastery assessments.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'current', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                backgroundColor: filter === tab ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: filter === tab ? '#fff' : 'var(--text-secondary)',
                border: filter === tab ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              {tab === 'all' ? 'All Missions' : tab === 'current' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Missions */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filtered.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
};
