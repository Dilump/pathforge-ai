import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmap } from '../context/RoadmapContext';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, BarChart2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const AssessmentsPage = () => {
  const { assessments, missions } = useRoadmap();
  const navigate = useNavigate();

  // Calculate stats
  const totalAssessments = assessments.length;
  const avgScore = totalAssessments > 0
    ? Math.round(assessments.reduce((acc, a) => acc + a.score, 0) / totalAssessments)
    : 0;

  // Find strongest and needs attention
  let strongest = null;
  let weakest = null;
  if (totalAssessments > 0) {
    const sorted = [...assessments].sort((a, b) => b.score - a.score);
    strongest = sorted[0];
    weakest = sorted[sorted.length - 1];
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Assessments & Performance History
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Track your demonstrated conceptual mastery across weekly milestones.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          iconRight={ArrowRight}
          onClick={() => {
            const current = missions.find((m) => m.status === 'current') || missions[0];
            navigate(`/assessments/${current?.id}`);
          }}
        >
          Take Active Assessment
        </Button>
      </div>

      {/* KPI Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Average Score
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c084fc' }}>
            {avgScore}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Across {totalAssessments} completed assessments
          </span>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Evaluations Completed
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>
            {totalAssessments}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Weekly milestone quizzes verified
          </span>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Strongest Competency
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {strongest?.topic || 'Python'} ({strongest?.score ?? 90}%)
          </div>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>
            Highest verified test score
          </span>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Topic Needing Attention
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {weakest?.topic || 'Docker / Containers'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Adaptive engine target for review
          </span>
        </Card>
      </div>

      {/* History List */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Assessment Log
        </h3>

        {assessments.length === 0 ? (
          <Card style={{ padding: '2.5rem', textAlign: 'center' }}>
            <Award className="w-10 h-10 text-gray-500" style={{ margin: '0 auto 0.75rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              No Assessments Taken Yet
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Complete tasks in your weekly missions to unlock and take your first assessment.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/missions')}>
              Go to Missions
            </Button>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assessments.map((a) => {
              const isMastered = a.score >= 80;
              const isPassed = a.score >= 60;

              return (
                <Card
                  key={a.id}
                  style={{
                    padding: '1.5rem',
                    border: isMastered
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : isPassed
                      ? '1px solid rgba(99, 102, 241, 0.3)'
                      : '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          backgroundColor: isMastered
                            ? 'rgba(16, 185, 129, 0.15)'
                            : isPassed
                            ? 'rgba(99, 102, 241, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                          color: isMastered ? '#34d399' : isPassed ? '#818cf8' : '#fbbf24',
                          border: isMastered
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : isPassed
                            ? '1px solid rgba(99, 102, 241, 0.3)'
                            : '1px solid rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        {a.score}%
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                            {a.title}
                          </h4>
                          {isMastered ? (
                            <Badge variant="success">Mastered</Badge>
                          ) : isPassed ? (
                            <Badge variant="primary">Passed</Badge>
                          ) : (
                            <Badge variant="warning">Remediation Triggered</Badge>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Topic: <strong>{a.topic}</strong> • Impact: {a.skillImpact || 'Updated'}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : 'Recent'}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={RefreshCw}
                        onClick={() => navigate(`/assessments/${a.missionId}`)}
                      >
                        Retake
                      </Button>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Strengths: {a.strengths?.join(', ') || 'Solid comprehension'}</span>
                    </div>
                    {a.weaknesses?.length > 0 && a.weaknesses[0] !== 'None' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24' }}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Focus Area: {a.weaknesses.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
