import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, PlayCircle, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const MissionCard = ({ mission }) => {
  const navigate = useNavigate();

  const isCompleted = mission.status === 'completed';
  const isCurrent = mission.status === 'current';
  const isLocked = mission.status === 'locked';
  const isAdapted = mission.isAdapted;

  return (
    <Card
      interactive={!isLocked}
      glow={isCurrent}
      onClick={!isLocked ? () => navigate(`/missions/${mission.id}`) : undefined}
      style={{
        padding: '1.5rem',
        opacity: isLocked ? 0.7 : 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        border: isCurrent
          ? '1px solid rgba(139, 92, 246, 0.4)'
          : isAdapted
          ? '1px solid rgba(245, 158, 11, 0.35)'
          : '1px solid var(--border-subtle)',
      }}
    >
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCurrent ? '#c084fc' : 'var(--text-muted)' }}>
            WEEK {mission.week}
          </span>
          {isAdapted ? (
            <Badge variant="warning">Adapted</Badge>
          ) : isCompleted ? (
            <Badge variant="success">Completed</Badge>
          ) : isCurrent ? (
            <Badge variant="purple">In Progress</Badge>
          ) : (
            <Badge variant="muted">Locked</Badge>
          )}
        </div>

        {/* Title */}
        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {mission.title}
        </h4>

        {/* Objective */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {mission.objective}
        </p>

        {/* Skills list */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
          {mission.skills?.map((s, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-secondary)',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div>
        {/* Progress & Duration */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          <span>{mission.progress}% Completed</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock className="w-3 h-3 text-purple-400" />
            <span>{mission.estimatedHours}h</span>
          </div>
        </div>
        <ProgressBar
          value={mission.progress}
          size="sm"
          variant={isCompleted ? 'success' : isCurrent ? 'primary' : 'cyan'}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.35rem',
            marginTop: '1rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: isLocked ? 'var(--text-muted)' : '#818cf8',
          }}
        >
          <span>{isLocked ? 'Locked' : 'Open Mission'}</span>
          {!isLocked && <ArrowRight className="w-3.5 h-3.5" />}
        </div>
      </div>
    </Card>
  );
};
