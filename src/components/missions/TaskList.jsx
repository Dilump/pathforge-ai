import React from 'react';
import { Check, CheckCircle2, Square, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const TaskList = ({
  tasks = [],
  onToggleTask,
  challenge,
  onToggleChallenge,
  onTakeAssessment,
  canTakeAssessment = false,
  assessmentCompleted = false,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Weekly Learning Tasks Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Weekly Learning Tasks
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Check off concepts as you work through lectures, guides, and lab code.
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#818cf8' }}>
            {tasks.filter((t) => t.completed).length} of {tasks.length} Completed
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: task.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: task.completed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!task.completed) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (!task.completed) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                }
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: task.completed ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: task.completed ? '#10b981' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                {task.completed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </div>
              <span
                style={{
                  fontSize: '0.9rem',
                  color: task.completed ? '#e2e8f0' : 'var(--text-primary)',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.8 : 1,
                  lineHeight: 1.4,
                }}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Challenge Section */}
      {challenge && (
        <Card
          glow
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.75) 100%)',
            border: challenge.completed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(139, 92, 246, 0.35)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase' }}>
                Practical Milestone Challenge
              </span>
            </div>
            {challenge.completed ? (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                Challenge Completed
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fbbf24', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                Hands-On Required
              </span>
            )}
          </div>

          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            {challenge.title}
          </h4>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            {challenge.description}
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Requirements for Completion:
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {challenge.requirements?.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <Button
              variant={challenge.completed ? 'secondary' : 'primary'}
              size="sm"
              icon={challenge.completed ? CheckCircle2 : Sparkles}
              onClick={onToggleChallenge}
            >
              {challenge.completed ? 'Completed (Click to Reset)' : 'Mark Challenge Complete'}
            </Button>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Verifies practical application for your portfolio
            </span>
          </div>
        </Card>
      )}

      {/* Assessment Action Trigger */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: canTakeAssessment ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
          border: canTakeAssessment ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
            {assessmentCompleted ? 'Assessment Completed' : 'Mission Knowledge Assessment'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {assessmentCompleted
              ? 'You have already tested your mastery for this week. Retake anytime to improve your score!'
              : canTakeAssessment
              ? 'Great progress! You are ready to validate your understanding and update your adaptive roadmap.'
              : 'Complete at least 3 tasks to unlock the weekly mastery assessment.'}
          </p>
        </div>

        <Button
          variant={canTakeAssessment ? 'success' : 'secondary'}
          disabled={!canTakeAssessment}
          onClick={onTakeAssessment}
          icon={CheckCircle2}
        >
          {assessmentCompleted ? 'Retake Assessment' : 'Take Mission Assessment'}
        </Button>
      </div>
    </div>
  );
};
