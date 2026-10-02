import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const QuizQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  onSelectAnswer,
  selectedAnswer,
  onNext,
  isLastQuestion,
  submitting = false,
}) => {
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <Card
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2.25rem',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Progress header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 600, color: '#c084fc' }}>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{progressPercent}% Complete</span>
        </div>
        <ProgressBar value={progressPercent} size="sm" variant="primary" />
      </div>

      {/* Question prompt */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.5,
          marginBottom: '1.75rem',
        }}
      >
        {question.question}
      </h3>

      {/* 4 Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;

          return (
            <div
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.25)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: isSelected ? '#8b5cf6' : 'rgba(255, 255, 255, 0.06)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  flexShrink: 0,
                }}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span style={{ fontSize: '0.925rem', color: isSelected ? '#ffffff' : 'var(--text-primary)', lineHeight: 1.4 }}>
                {option}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Next button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          size="lg"
          disabled={selectedAnswer === null || selectedAnswer === undefined}
          loading={submitting}
          iconRight={ArrowRight}
          onClick={onNext}
        >
          {isLastQuestion ? 'Submit Assessment' : 'Next Question'}
        </Button>
      </div>
    </Card>
  );
};
