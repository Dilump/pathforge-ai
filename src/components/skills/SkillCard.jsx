import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { CheckCircle2, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

export const SkillCard = ({ skill }) => {
  const getStatusBadge = () => {
    if (skill.status === 'strong' || skill.mastery >= 70) {
      return <Badge variant="success" icon={CheckCircle2}>Strong</Badge>;
    }
    if (skill.status === 'developing' || skill.mastery >= 40) {
      return <Badge variant="primary" icon={Sparkles}>Developing</Badge>;
    }
    return <Badge variant="warning" icon={AlertTriangle}>Needs Attention</Badge>;
  };

  const getVariant = () => {
    if (skill.mastery >= 70) return 'success';
    if (skill.mastery >= 40) return 'primary';
    return 'warning';
  };

  return (
    <Card style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {skill.category || 'Competency'}
          </span>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
            {skill.name}
          </h4>
        </div>
        {getStatusBadge()}
      </div>

      {skill.description && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1rem' }}>
          {skill.description}
        </p>
      )}

      {/* Mastery Progress */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Demonstrated Mastery</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{skill.mastery}%</span>
        </div>
        <ProgressBar value={skill.mastery} size="sm" variant={getVariant()} />
      </div>

      {/* Meta Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <span>Self-Reported: {skill.selfAssessment ? skill.selfAssessment.charAt(0).toUpperCase() + skill.selfAssessment.slice(1) : 'None'}</span>
        {skill.quizScore !== null && skill.quizScore !== undefined && (
          <span style={{ color: '#818cf8', fontWeight: 600 }}>
            Quiz: {skill.quizScore}%
          </span>
        )}
      </div>
    </Card>
  );
};
