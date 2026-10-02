import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../common/Card';

export const SkillChart = ({ skills = [] }) => {
  const chartData = skills.map((s) => ({
    name: s.name.length > 13 ? `${s.name.slice(0, 11)}..` : s.name,
    fullName: s.name,
    mastery: s.mastery,
    category: s.category,
  }));

  return (
    <Card style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Target Career Competency Profile
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Visualizing current mastery levels across core technology domain areas.
        </p>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`, 'Mastery']}
              labelFormatter={(label, item) => item?.[0]?.payload?.fullName || label}
            />
            <Bar dataKey="mastery" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
