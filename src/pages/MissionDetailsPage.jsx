import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { TaskList } from '../components/missions/TaskList';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';

export const MissionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { missions, toggleTask, toggleChallenge } = useRoadmap();

  const mission = missions.find((m) => m.id === id) || missions[0];

  if (!mission) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Mission not found.</p>
        <Button variant="primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/missions')}>
          Back to Missions
        </Button>
      </div>
    );
  }

  const completedTasks = mission.tasks ? mission.tasks.filter((t) => t.completed).length : 0;
  const totalTasks = mission.tasks ? mission.tasks.length : 0;
  const canTakeAssessment = completedTasks >= 3 || mission.status === 'completed' || Boolean(mission.challenge?.completed);

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back button & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate('/missions')}
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
          <span>Back to All Missions</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link to="/roadmap" style={{ color: 'inherit' }}>Roadmap</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span style={{ color: 'var(--text-primary)' }}>Week {mission.week}</span>
        </div>
      </div>

      {/* Mission Hero Header Card */}
      <Card
        glow
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(26, 34, 56, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Badge variant="purple">Week {mission.week} Milestone</Badge>
            {mission.isAdapted && (
              <Badge variant="warning" icon={AlertTriangle}>
                AI Adapted Mission
              </Badge>
            )}
            {mission.status === 'completed' && (
              <Badge variant="success" icon={CheckCircle2}>
                Completed
              </Badge>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock className="w-4 h-4 text-purple-400" />
              <span>{mission.estimatedHours} Hours Required</span>
            </div>
            <span>•</span>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{mission.difficulty}</span>
          </div>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          {mission.title}
        </h1>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {mission.objective}
        </p>

        {/* Skills Tag List */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
          {mission.skills?.map((skill, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#e2e8f0',
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Mission Progress</span>
            <span style={{ fontWeight: 700, color: '#c084fc' }}>{mission.progress}%</span>
          </div>
          <ProgressBar value={mission.progress} size="md" variant={mission.status === 'completed' ? 'success' : 'primary'} />
        </div>
      </Card>

      {/* Two Column Section: Interactive TaskList + Curated Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Tasks & Challenge */}
        <div style={{ gridColumn: 'span 2' }}>
          <TaskList
            tasks={mission.tasks || []}
            onToggleTask={(taskId) => toggleTask(mission.id, taskId)}
            challenge={mission.challenge}
            onToggleChallenge={() => toggleChallenge(mission.id)}
            onTakeAssessment={() => navigate(`/assessments/${mission.id}`)}
            canTakeAssessment={canTakeAssessment}
            assessmentCompleted={mission.status === 'completed'}
          />
        </div>

        {/* Right Sidebar: Resources & Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Curated Resources Card */}
          <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <BookOpen className="w-4 h-4 text-purple-400" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                Curated References
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mission.resources?.map((res, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {res.type}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                    {res.title}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Coach Hint Box */}
          <Card style={{ padding: '1.25rem', backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc' }}>
                Need Assistance?
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
              Our AI Career Coach has deep context on <strong>{mission.title}</strong> and can explain concepts or review architectural design decisions.
            </p>
            <Button
              variant="outline-purple"
              size="sm"
              onClick={() => navigate('/coach')}
              style={{ width: '100%' }}
            >
              Consult AI Coach
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
