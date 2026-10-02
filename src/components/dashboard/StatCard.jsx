import React from 'react';
import { Card } from '../common/Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo', // 'indigo' | 'purple' | 'cyan' | 'emerald' | 'amber'
  trend = null,
}) => {
  const colorMap = {
    indigo: {
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.25)',
      text: '#818cf8',
    },
    purple: {
      bg: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.25)',
      text: '#c084fc',
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.25)',
      text: '#38bdf8',
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      text: '#34d399',
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#fbbf24',
    },
  }[color] || {
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.25)',
    text: '#818cf8',
  };

  return (
    <Card style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: colorMap.bg,
              border: `1px solid ${colorMap.border}`,
              color: colorMap.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {trend && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#34d399' }}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      )}
    </Card>
  );
};
