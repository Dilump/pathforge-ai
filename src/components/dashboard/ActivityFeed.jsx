import React from 'react';
import {
  CheckCircle2,
  Award,
  Sparkles,
  Compass,
  AlertCircle,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { Card } from '../common/Card';

const iconMap = {
  CheckCircle2: CheckCircle2,
  Award: Award,
  Sparkles: Sparkles,
  Compass: Compass,
  AlertCircle: AlertCircle,
  RefreshCw: RefreshCw,
};

export const ActivityFeed = ({ activities = [] }) => {
  return (
    <Card style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Recent Activity
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Latest updates
        </span>
      </div>

      {activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
          <Clock className="w-8 h-8 text-gray-500" style={{ margin: '0 auto 0.5rem auto' }} />
          <p style={{ fontSize: '0.85rem' }}>No recent activities logged yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.slice(0, 5).map((act) => {
            const Icon = iconMap[act.icon] || Sparkles;
            const isAlert = act.type === 'roadmap_adapted';
            const isAward = act.type === 'assessment_complete';

            return (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isAlert
                    ? 'rgba(245, 158, 11, 0.08)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isAlert
                    ? '1px solid rgba(245, 158, 11, 0.2)'
                    : '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    padding: '0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isAlert
                      ? 'rgba(245, 158, 11, 0.2)'
                      : isAward
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(99, 102, 241, 0.15)',
                    color: isAlert
                      ? '#fbbf24'
                      : isAward
                      ? '#34d399'
                      : '#818cf8',
                    flexShrink: 0,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {act.text}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {act.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
