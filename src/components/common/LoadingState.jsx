import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';

export const MultiStageLoader = ({
  stages = [
    'Analyzing your current skills...',
    'Comparing skills with your target career...',
    'Identifying skill gaps...',
    'Designing learning sequence...',
    'Creating weekly missions...',
  ],
  intervalMs = 800,
  onComplete,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (currentStageIndex < stages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStageIndex((prev) => prev + 1);
      }, intervalMs);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStageIndex, stages.length, intervalMs, onComplete]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        maxWidth: '520px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.3))',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.75rem',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.3)',
        }}
      >
        <Sparkles className="w-8 h-8 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        Forging Your Personalized Path
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        PathForge AI is architecting your custom curriculum based on your demonstrated background and goals.
      </p>

      {/* Sequential Stages List */}
      <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {stages.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: isCurrent
                  ? 'rgba(139, 92, 246, 0.12)'
                  : isDone
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: isCurrent
                  ? '1px solid rgba(139, 92, 246, 0.3)'
                  : isDone
                  ? '1px solid rgba(16, 185, 129, 0.2)'
                  : '1px solid var(--border-subtle)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  background: isDone
                    ? 'rgba(16, 185, 129, 0.2)'
                    : isCurrent
                    ? 'rgba(139, 92, 246, 0.3)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isDone ? '#34d399' : isCurrent ? '#c084fc' : '#64748b',
                  fontWeight: 600,
                }}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isDone
                    ? '#e2e8f0'
                    : isCurrent
                    ? '#ffffff'
                    : '#64748b',
                }}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const LoadingSpinner = ({ text = 'Loading PathForge AI...', size = 'md' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        color: 'var(--text-secondary)',
        gap: '1rem',
      }}
    >
      <Loader2
        className={`animate-spin text-purple-400 ${size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'}`}
      />
      {text && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{text}</p>}
    </div>
  );
};
