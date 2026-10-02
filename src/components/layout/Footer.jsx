import React from 'react';
import { Compass, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#070a12',
        padding: '3.5rem 0 2rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>PathForge AI</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Forge your path. Master your future. Continuous adaptive learning roadmaps generated and tuned by AI according to demonstrated skill mastery.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#818cf8' }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>AWS Hackathon Architecture Ready</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>Skill-Gap Analysis</li>
              <li>Adaptive Roadmaps</li>
              <li>Weekly Missions & Challenges</li>
              <li>Mastery Assessments</li>
              <li>Contextual AI Coach</li>
            </ul>
          </div>

          {/* AWS Target Architecture */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AWS Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>Amazon Bedrock (Claude 3.5 & Titan)</li>
              <li>Amazon API Gateway (REST API)</li>
              <li>AWS Lambda (Serverless Compute)</li>
              <li>Amazon DynamoDB (NoSQL Data)</li>
              <li>Amazon Cognito (Secure Auth)</li>
              <li>AWS Amplify & Amazon CloudWatch</li>
            </ul>
          </div>

          {/* Target Tech Careers */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Careers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>MLOps Engineer</li>
              <li>AI/ML Engineer</li>
              <li>Cloud Engineer</li>
              <li>Data Scientist</li>
              <li>DevOps Engineer</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} PathForge AI. Built for AWS Hackathon. Local MVP.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for modern tech learners</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
