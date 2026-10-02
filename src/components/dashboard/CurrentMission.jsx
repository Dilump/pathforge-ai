import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const CurrentMission = ({ mission }) => {
  const navigate = useNavigate();

  if (!mission) {
    return (
      <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No active mission at the moment.</p>
        <Button
          variant="primary"
          size="sm"
          style={{ marginTop: '1rem' }}
          onClick={() => navigate('/roadmap')}
        >
          View Roadmap
        </Button>
      </Card>
    );
  }

  const completedTasks = mission.tasks ? mission.tasks.filter((t) => t.completed).length : 0;
  const totalTasks = mission.tasks ? mission.tasks.length : 0;

  return (
    <Card
      glow
      style={{
        padding: '1.75rem',
        background: 'linear-gradient(180deg, rgba(26, 34, 56, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Badge variant="purple" icon={Sparkles}>
            Current Focus
          </Badge>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Week {mission.week}
          </span>
        </div>
        {mission.remainingTime && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>{mission.remainingTime}</span>
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        {mission.title}
      </h3>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
        {mission.objective}
      </p>

      {/* Progress */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {completedTasks} of {totalTasks} tasks completed
          </span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {mission.progress}%
          </span>
        </div>
        <ProgressBar value={mission.progress} size="md" variant="primary" />
      </div>

      {/* Skills Pill List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {mission.skills?.map((skill, i) => (
          <span
            key={i}
            style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <Button
          variant="primary"
          icon={PlayCircle}
          iconRight={ArrowRight}
          onClick={() => navigate(`/missions/${mission.id}`)}
        >
          Continue Mission
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate('/roadmap')}
        >
          View Roadmap
        </Button>
      </div>
    </Card>
  );
};
