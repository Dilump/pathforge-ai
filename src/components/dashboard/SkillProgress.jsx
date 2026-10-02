import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';

export const SkillProgress = ({ skills = [] }) => {
  const [chartType, setChartType] = useState('radar'); // 'radar' | 'bar'

  // Prepare chart data
  const chartData = skills.slice(0, 7).map((s) => ({
    subject: s.name.length > 12 ? `${s.name.slice(0, 11)}..` : s.name,
    fullName: s.name,
    mastery: s.mastery,
    benchmark: 80, // Target industry standard
  }));

  return (
    <Card style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Career Readiness & Skill Mastery
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Demonstrated competencies vs. role requirements
          </p>
        </div>

        {/* Toggle View */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px',
          }}
        >
          <button
            onClick={() => setChartType('radar')}
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: chartType === 'radar' ? 'var(--accent-primary)' : 'transparent',
              color: chartType === 'radar' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Radar
          </button>
          <button
            onClick={() => setChartType('bar')}
            style={{
              padding: '0.25rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: chartType === 'bar' ? 'var(--accent-primary)' : 'transparent',
              color: chartType === 'bar' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Bar
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div style={{ width: '100%', height: 260, marginBottom: '1.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'radar' ? (
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 9 }}
              />
              <Radar
                name="Target Benchmark"
                dataKey="benchmark"
                stroke="#64748b"
                fill="#64748b"
                fillOpacity={0.1}
              />
              <Radar
                name="Current Mastery"
                dataKey="mastery"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.4}
              />
            </RadarChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="mastery" name="Current Mastery %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Key Skills Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {skills.slice(0, 4).map((skill) => (
          <div key={skill.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{skill.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {skill.status === 'strong' ? 'Strong' : skill.status === 'developing' ? 'Developing' : 'Needs Work'}
                </span>
                <span style={{ fontWeight: 700, color: '#c084fc', fontSize: '0.85rem' }}>
                  {skill.mastery}%
                </span>
              </div>
            </div>
            <ProgressBar
              value={skill.mastery}
              size="sm"
              variant={skill.mastery >= 70 ? 'success' : skill.mastery >= 40 ? 'primary' : 'warning'}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
