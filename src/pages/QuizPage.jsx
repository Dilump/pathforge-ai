import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoadmap } from '../context/RoadmapContext';
import { quizService } from '../services/quizService';
import { QuizQuestion } from '../components/assessments/QuizQuestion';
import { QuizResults } from '../components/assessments/QuizResults';
import { LoadingSpinner } from '../components/common/LoadingState';
import { ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { missions, handleAssessmentCompleted } = useRoadmap();

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [completedResult, setCompletedResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find mission matching id
  const mission = missions.find((m) => m.id === id) || missions[0];

  useEffect(() => {
    let isMounted = true;
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        if (mission) {
          const generated = await quizService.getQuizForMission(mission);
          if (isMounted) setQuizData(generated);
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQuiz();
    return () => {
      isMounted = false;
    };
  }, [mission]);

  if (loading) {
    return <LoadingSpinner text="Generating tailored assessment questions via AI..." size="lg" />;
  }

  if (!quizData || !quizData.questions?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Could not load assessment questions.</p>
        <Button variant="primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/missions')}>
          Return to Missions
        </Button>
      </div>
    );
  }

  const questions = quizData.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectAnswer = (index) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: index,
    }));
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Submit assessment
      setIsSubmitting(true);
      try {
        const answersArray = questions.map((_, i) => userAnswers[i] ?? -1);
        const { assessment, adaptation } = await handleAssessmentCompleted(
          mission,
          questions,
          answersArray
        );
        setCompletedResult(assessment);
      } catch (err) {
        console.error('Error submitting assessment:', err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleUpdateRoadmap = () => {
    navigate('/roadmap');
  };

  const handleRetake = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setCompletedResult(null);
  };

  // Demo helper: Fill answers for testing adaptation (<60% score)
  const handleSimulateLowScore = () => {
    const fakeAnswers = {};
    questions.forEach((q, idx) => {
      // Pick correct only for 1st question, wrong for others (20% score)
      fakeAnswers[idx] = idx === 0 ? q.correctIndex : (q.correctIndex + 1) % 4;
    });
    setUserAnswers(fakeAnswers);
  };

  // Demo helper: Fill answers for high score (80% or 100%)
  const handleSimulateHighScore = () => {
    const fakeAnswers = {};
    questions.forEach((q, idx) => {
      fakeAnswers[idx] = q.correctIndex;
    });
    setUserAnswers(fakeAnswers);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          onClick={() => navigate(`/missions/${mission?.id}`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Assessment</span>
        </button>

        {/* Quick simulation chips for Judges */}
        {!completedResult && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Judge Demo Tools:</span>
            <button
              type="button"
              onClick={handleSimulateLowScore}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                cursor: 'pointer',
              }}
              title="Pre-fills answers with 20% score to immediately trigger the adaptive remediation engine"
            >
              Test Adaptive Trigger (&lt;60%)
            </button>
            <button
              type="button"
              onClick={handleSimulateHighScore}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                cursor: 'pointer',
              }}
              title="Pre-fills all answers correctly (100% score)"
            >
              Test High Score (100%)
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      {!completedResult ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              WEEK {mission?.week} ASSESSMENT
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {mission?.title} Mastery Evaluation
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Answer each conceptual question carefully to evaluate mastery and update your adaptive roadmap.
            </p>
          </div>

          <QuizQuestion
            question={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onSelectAnswer={handleSelectAnswer}
            selectedAnswer={userAnswers[currentQuestionIndex]}
            onNext={handleNext}
            isLastQuestion={isLastQuestion}
            submitting={isSubmitting}
          />
        </div>
      ) : (
        <QuizResults
          result={completedResult}
          questions={questions}
          userAnswers={userAnswers}
          onUpdateRoadmap={handleUpdateRoadmap}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
};
