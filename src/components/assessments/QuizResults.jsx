import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CheckCircle2, XCircle, Award, Sparkles, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';

export const QuizResults = ({
  result,
  questions = [],
  userAnswers = [],
  onUpdateRoadmap,
  onRetake,
  isUpdating = false,
}) => {
  const isMastered = result.score >= 80;
  const isPassed = result.score >= 60;
  const needsReinforcement = result.score < 60;

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Score Header Card */}
      <Card
        glow
        style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          background: isMastered
            ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)'
            : isPassed
            ? 'linear-gradient(180deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)'
            : 'linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: isMastered
            ? '1px solid rgba(16, 185, 129, 0.35)'
            : isPassed
            ? '1px solid rgba(99, 102, 241, 0.35)'
            : '1px solid rgba(245, 158, 11, 0.35)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            backgroundColor: isMastered
              ? 'rgba(16, 185, 129, 0.2)'
              : isPassed
              ? 'rgba(99, 102, 241, 0.2)'
              : 'rgba(245, 158, 11, 0.2)',
            border: isMastered
              ? '1px solid #10b981'
              : isPassed
              ? '1px solid #8b5cf6'
              : '1px solid #f59e0b',
          }}
        >
          {isMastered ? (
            <Award className="w-8 h-8 text-emerald-400" />
          ) : isPassed ? (
            <Sparkles className="w-8 h-8 text-purple-400" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          )}
        </div>

        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Assessment Evaluation Complete
        </span>

        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '0.25rem 0' }}>
          {result.score}%
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          You answered <strong>{result.correctCount}</strong> of <strong>{result.totalQuestions}</strong> questions correctly.
        </p>

        {/* Skill Impact Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Skill Mastery Impact:</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isMastered ? '#34d399' : isPassed ? '#818cf8' : '#fbbf24' }}>
            {result.skillImpact}
          </span>
        </div>

        {/* Action Button */}
        <div>
          <Button
            variant={needsReinforcement ? 'primary' : 'success'}
            size="lg"
            loading={isUpdating}
            iconRight={ArrowRight}
            onClick={onUpdateRoadmap}
          >
            {needsReinforcement ? 'View Adaptive Roadmap' : 'Update My Roadmap'}
          </Button>
        </div>
      </Card>

      {/* Strengths & Weaknesses Breakdown */}
      <div className="grid-2">
        {/* Strengths */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Demonstrated Strengths</h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {result.strengths.map((str, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Areas for Improvement */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Needs Improvement</h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {result.weaknesses.map((weak, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Detailed Question Review */}
      {questions.length > 0 && (
        <Card style={{ padding: '1.75rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
            Detailed Answers & Explanations
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {questions.map((q, idx) => {
              const selectedIdx = userAnswers[idx];
              const isCorrect = selectedIdx === q.correctIndex;

              return (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Question {idx + 1}
                    </span>
                    {isCorrect ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>
                        <CheckCircle2 className="w-4 h-4" />
                        Correct
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#f87171' }}>
                        <XCircle className="w-4 h-4" />
                        Incorrect
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
                    {q.question}
                  </p>

                  <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: isCorrect ? '#34d399' : '#f87171' }}>
                    <strong>Your Answer:</strong> {q.options[selectedIdx] || 'None'}
                  </div>

                  {!isCorrect && (
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: '#34d399' }}>
                      <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                    </div>
                  )}

                  {q.explanation && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <em>Explanation: {q.explanation}</em>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Retake option */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onRetake}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retake Assessment</span>
        </button>
      </div>
    </div>
  );
};
