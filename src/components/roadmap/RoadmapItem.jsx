import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  PlayCircle,
  Lock,
  Sparkles,
  Clock,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const RoadmapItem = ({ mission, isLast = false }) => {
  const navigate = useNavigate();

  const isCompleted = mission.status === 'completed';
  const isCurrent = mission.status === 'current';
  const isLocked = mission.status === 'locked';
  const isAdapted = mission.isAdapted;

  const handleClick = () => {
    navigate(`/missions/${mission.id}`);
  };

  const getStatusBadge = () => {
    if (isAdapted) {
      return (
        <Badge variant="warning" icon={AlertTriangle}>
          Adapted by AI
        </Badge>
      );
    }
    if (isCompleted) {
      return (
        <Badge variant="success" icon={CheckCircle2}>
          Completed
        </Badge>
      );
    }
    if (isCurrent) {
      return (
        <Badge variant="purple" icon={PlayCircle}>
          Current Focus
        </Badge>
      );
    }
    return (
      <Badge variant="muted" icon={Lock}>
        Locked
      </Badge>
    );
  };

  const getNodeIcon = () => {
    if (isCompleted) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    }
    if (isCurrent) {
      return <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />;
    }
    if (isAdapted) {
      return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
    return <Lock className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
      {/* Left Timeline Indicator & Connector Line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isCurrent
              ? 'rgba(139, 92, 246, 0.25)'
              : isCompleted
              ? 'rgba(16, 185, 129, 0.15)'
              : isAdapted
              ? 'rgba(245, 158, 11, 0.2)'
              : 'rgba(255, 255, 255, 0.04)',
            border: isCurrent
              ? '2px solid #8b5cf6'
              : isCompleted
              ? '2px solid #10b981'
              : isAdapted
              ? '2px solid #f59e0b'
              : '1px solid var(--border-subtle)',
            boxShadow: isCurrent ? '0 0 20px rgba(139, 92, 246, 0.5)' : 'none',
            zIndex: 2,
            transition: 'all 0.3s ease',
          }}
        >
          {getNodeIcon()}
        </div>

        {/* Connecting Vertical Line */}
        {!isLast && (
          <div
            style={{
              width: '2px',
              flex: 1,
              backgroundColor: isCompleted
                ? 'rgba(16, 185, 129, 0.3)'
                : isCurrent
                ? 'rgba(139, 92, 246, 0.3)'
                : 'rgba(255, 255, 255, 0.08)',
              margin: '0.5rem 0',
            }}
          />
        )}
      </div>

      {/* Right Content Card */}
      <div style={{ flex: 1, paddingBottom: isLast ? '0' : '2rem' }}>
        <Card
          interactive={!isLocked}
          onClick={!isLocked ? handleClick : undefined}
          glow={isCurrent}
          style={{
            padding: '1.5rem',
            opacity: isLocked ? 0.75 : 1,
            border: isCurrent
              ? '1px solid rgba(139, 92, 246, 0.45)'
              : isAdapted
              ? '1px solid rgba(245, 158, 11, 0.35)'
              : '1px solid var(--border-subtle)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: isCurrent ? '#c084fc' : isAdapted ? '#fbbf24' : 'var(--text-muted)',
                }}
              >
                Week {mission.week}
              </span>
              {getStatusBadge()}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{mission.estimatedHours} hrs</span>
              </div>
              <span style={{ color: 'var(--border-medium)' }}>•</span>
              <span style={{ color: 'var(--text-muted)' }}>{mission.difficulty}</span>
            </div>
          </div>

          {/* Title & Objective */}
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            {mission.title}
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
            {mission.objective}
          </p>

          {/* Adaptation notice if applicable */}
          {isAdapted && mission.adaptationReason && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                marginBottom: '1rem',
                fontSize: '0.8rem',
                color: '#fbbf24',
              }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{mission.adaptationReason}</span>
            </div>
          )}

          {/* Skills Covered */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {mission.skills?.map((sk, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                {sk}
              </span>
            ))}
          </div>

          {/* Bottom Progress & Action Link */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: '45%' }}>
              <ProgressBar
                value={mission.progress || 0}
                size="sm"
                variant={isCompleted ? 'success' : isCurrent ? 'primary' : 'cyan'}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: isLocked ? 'var(--text-muted)' : '#818cf8' }}>
              <span>{isCompleted ? 'Review Mission' : isCurrent ? 'Continue Mission' : isLocked ? 'Locked' : 'View Details'}</span>
              {!isLocked && <ArrowRight className="w-4 h-4" />}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
