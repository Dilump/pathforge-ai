import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { SkillCard } from '../components/skills/SkillCard';
import { SkillChart } from '../components/skills/SkillChart';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Layers, CheckCircle2, AlertTriangle, Sparkles, Filter } from 'lucide-react';

export const SkillsPage = () => {
  const { skills, skillGap } = useRoadmap();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(skills.map((s) => s.category).filter(Boolean))];

  const filteredSkills = skills.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const strongCount = skills.filter((s) => s.mastery >= 70).length;
  const developingCount = skills.filter((s) => s.mastery >= 40 && s.mastery < 70).length;
  const needsAttentionCount = skills.filter((s) => s.mastery < 40).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Skill Mastery Matrix
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Continuous tracking of your verified technical competencies against industry benchmarks.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Strong Competencies</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>
            {strongCount} Skills
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Exceeding 70% demonstrated mastery
          </span>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Developing</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#818cf8' }}>
            {developingCount} Skills
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Active progress in current weekly missions
          </span>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Targeted Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24' }}>
            {needsAttentionCount} Skills
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Prioritized for upcoming missions & remediation
          </span>
        </Card>
      </div>

      {/* Visual Chart */}
      <SkillChart skills={skills} />

      {/* Category Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
          Competency Breakdown
        </h3>

        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                backgroundColor: selectedCategory === cat ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                border: selectedCategory === cat ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filteredSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
};
