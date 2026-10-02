import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  Award,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';
import { CAREERS } from '../data/careers';
import { StatCard } from '../components/dashboard/StatCard';
import { CurrentMission } from '../components/dashboard/CurrentMission';
import { SkillProgress } from '../components/dashboard/SkillProgress';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { roadmap, missions, skills, activities, activeMission } = useRoadmap();
  const navigate = useNavigate();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Learner';
  const careerObj = CAREERS.find((c) => c.id === user?.careerGoal);
  const careerTitle = careerObj?.title || 'MLOps Engineer';

  // Overall stats
  const overallProgress = user?.stats?.overallProgress ?? 38;
  const missionsCompleted = missions.filter((m) => m.status === 'completed').length;
  const totalMissions = missions.length || 8;
  const avgQuizScore = user?.stats?.averageQuizScore ?? 85;
  const learningHours = user?.stats?.learningHours ?? 14.5;
  const streak = user?.stats?.currentStreak ?? 4;

  // Upcoming 3 missions
  const upcomingMissions = missions
    .filter((m) => m.status === 'locked')
    .slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Welcome back, {firstName}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Continue forging your path to becoming a <strong>{careerTitle}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="outline-purple"
            size="sm"
            onClick={() => navigate('/coach')}
            icon={Sparkles}
          >
            Ask AI Coach
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconRight={ArrowRight}
            onClick={() => navigate('/roadmap')}
          >
            Full Roadmap
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          subtitle="Target competency completion"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Missions Completed"
          value={`${missionsCompleted} / ${totalMissions}`}
          subtitle={`${totalMissions - missionsCompleted} milestones remaining`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Average Assessment"
          value={`${avgQuizScore}%`}
          subtitle="Demonstrated knowledge score"
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Learning Hours"
          value={`${learningHours}h`}
          subtitle="Hands-on practice logged"
          icon={Clock}
          color="cyan"
        />
        <StatCard
          title="Current Streak"
          value={`${streak} days`}
          subtitle="Consistent study habit"
          icon={Flame}
          color="amber"
        />
      </div>

      {/* Main Focus Area: Current Mission & Career Readiness */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        {/* Left Column: Current Active Mission */}
        <div>
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Continue Learning
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Week {activeMission?.week || 3}
            </span>
          </div>
          <CurrentMission mission={activeMission} />
        </div>

        {/* Right Column: Skill Readiness Chart & Mastery */}
        <div>
          <SkillProgress skills={skills} />
        </div>
      </div>

      {/* Secondary Row: Upcoming Missions & Recent Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        {/* Upcoming Missions */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Upcoming Milestones
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Next in sequence
            </span>
          </div>

          {upcomingMissions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>You are on the final milestones of your path!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {upcomingMissions.map((um) => (
                <div
                  key={um.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        padding: '0.35rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {um.title}
                      </h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Week {um.week} • {um.skills?.[0] || 'Core Topic'}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {um.estimatedHours}h
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Activity Feed */}
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
};
