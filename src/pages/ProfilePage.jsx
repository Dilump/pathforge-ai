import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';
import { userService } from '../services/userService';
import { CAREERS, LEARNING_HOURS_OPTIONS, LEARNING_STYLES, ROADMAP_DURATIONS } from '../data/careers';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { User, Sparkles, RefreshCw, AlertTriangle, Check, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser, loginDemo } = useAuth();
  const { refreshState } = useRoadmap();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [weeklyHours, setWeeklyHours] = useState(user?.weeklyHours || 8);
  const [learningStyle, setLearningStyle] = useState(user?.learningStyle || 'balanced');
  const [duration, setDuration] = useState(user?.roadmapDuration || 8);
  const [careerGoal, setCareerGoal] = useState(user?.careerGoal || 'mlops-engineer');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [pendingCareerGoal, setPendingCareerGoal] = useState(null);

  const currentCareer = CAREERS.find((c) => c.id === user?.careerGoal) || CAREERS[0];

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({
        name,
        weeklyHours,
        learningStyle,
        roadmapDuration: duration,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCareerChangeAttempt = (newGoalId) => {
    if (newGoalId === user?.careerGoal) return;
    setPendingCareerGoal(newGoalId);
    setShowCareerModal(true);
  };

  const handleConfirmCareerChange = async () => {
    setShowCareerModal(false);
    if (!pendingCareerGoal) return;

    await userService.resetCareerGoal(pendingCareerGoal);
    await updateUser({
      careerGoal: pendingCareerGoal,
      onboardingComplete: false,
    });
    refreshState();
    navigate('/onboarding');
  };

  const handleReloadDemo = async () => {
    await loginDemo();
    refreshState();
    setName('Alex Rivera');
    setEmail('alex.rivera@pathforge.ai');
    setWeeklyHours(8);
    setLearningStyle('balanced');
    setDuration(8);
    setCareerGoal('mlops-engineer');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Learner Profile & Settings
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Manage your personal details, study commitment, and roadmap preferences.
        </p>
      </div>

      {savedSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '0.85rem',
          }}
        >
          <Check className="w-4 h-4" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      {/* Target Career Section */}
      <Card style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Current Target Path
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
              {currentCareer.title}
            </h3>
          </div>
          <Badge variant="purple">Active Curriculum</Badge>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {currentCareer.description}
        </p>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Switch Target Career Path (Requires Generating New Roadmap)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CAREERS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCareerChangeAttempt(c.id)}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: c.id === user?.careerGoal ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: c.id === user?.careerGoal ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                  color: c.id === user?.careerGoal ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Profile Details & Study Preferences Form */}
      <Card style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
          Learning Preferences
        </h3>

        <form onSubmit={handleSavePreferences}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">
                Email Address
              </label>
              <input
                id="profile-email"
                type="email"
                disabled
                className="form-input"
                value={email}
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          {/* Weekly Hours */}
          <div className="form-group">
            <label className="form-label">
              Weekly Learning Hours Commitment
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
              {LEARNING_HOURS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setWeeklyHours(opt.value)}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    border: weeklyHours === opt.value ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                    backgroundColor: weeklyHours === opt.value ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    color: weeklyHours === opt.value ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Style */}
          <div className="form-group">
            <label className="form-label">
              Preferred Learning Style
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {LEARNING_STYLES.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setLearningStyle(st.value)}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    border: learningStyle === st.value ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                    backgroundColor: learningStyle === st.value ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    color: learningStyle === st.value ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Roadmap Duration */}
          <div className="form-group">
            <label className="form-label">
              Curriculum Duration
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {ROADMAP_DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    border: duration === d.value ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                    backgroundColor: duration === d.value ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    color: duration === d.value ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              icon={Save}
            >
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Demo Reset Card */}
      <Card style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
              AWS Hackathon Demo Controls
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Reload Alex Rivera's initial state (Week 3 Docker in progress, 38% completion).
            </p>
          </div>
          <Button
            variant="outline-purple"
            size="sm"
            icon={RefreshCw}
            onClick={handleReloadDemo}
          >
            Reset to Demo State
          </Button>
        </div>
      </Card>

      {/* Career Change Confirmation Modal */}
      <Modal
        isOpen={showCareerModal}
        onClose={() => setShowCareerModal(false)}
        title="Regenerate Personalized Roadmap?"
        subtitle="Confirm Career Goal Switch"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCareerModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmCareerChange}>
              Proceed to Assessment
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
            }}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
              Switching your target career requires evaluating your baseline for the new role and generating a brand new AI roadmap. Your current mission progress will be archived.
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to transition to <strong>{CAREERS.find((c) => c.id === pendingCareerGoal)?.title}</strong>?
          </p>
        </div>
      </Modal>
    </div>
  );
};
