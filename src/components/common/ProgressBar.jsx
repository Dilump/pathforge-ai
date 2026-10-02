import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'primary', // 'primary' | 'success' | 'cyan' | 'warning'
  size = 'md', // 'sm' | 'md' | 'lg'
  showLabel = false,
  label = '',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const fillClass = {
    primary: 'progress-fill',
    success: 'progress-fill progress-fill-success',
    cyan: 'progress-fill progress-fill-cyan',
    warning: 'progress-fill progress-fill-warning',
  }[variant] || 'progress-fill';

  const trackHeight = {
    sm: 'height: 4px;',
    md: 'height: 8px;',
    lg: 'height: 12px;',
  }[size];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>{label || 'Progress'}</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{percentage}%</span>
        </div>
      )}
      <div
        className="progress-track"
        style={{
          height: size === 'sm' ? '5px' : size === 'lg' ? '12px' : '8px',
        }}
      >
        <div
          className={fillClass}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
