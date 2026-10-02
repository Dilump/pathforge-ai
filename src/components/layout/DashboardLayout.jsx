import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Sparkles, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useRoadmap } from '../../context/RoadmapContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { adaptationAlert, clearAdaptationAlert } = useRoadmap();
  const navigate = useNavigate();

  const handleViewAdaptedRoadmap = () => {
    clearAdaptationAlert();
    navigate('/roadmap');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Desktop / Mobile Responsive Sidebar */}
      <Sidebar isMobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '4rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(10, 13, 22, 0.7)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.45rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
              className="mobile-burger-btn"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Workspace</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                PathForge Core
              </span>
            </div>
          </div>

          {/* Top Right Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                fontSize: '0.75rem',
                color: '#c084fc',
              }}
              className="aws-arch-badge"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AWS Hackathon Local MVP</span>
            </div>
          </div>
        </header>

        {/* Child Page Content */}
        <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1380px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      {/* Adaptive Roadmap Modal (Triggered when assessment score < 60%) */}
      <Modal
        isOpen={Boolean(adaptationAlert)}
        onClose={clearAdaptationAlert}
        title="Your Roadmap Has Been Adapted"
        subtitle="AI Adaptive Curriculum Adjustment"
        maxWidth="600px"
        footer={
          <>
            <Button variant="ghost" onClick={clearAdaptationAlert}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              iconRight={ArrowRight}
              onClick={handleViewAdaptedRoadmap}
            >
              View Updated Roadmap
            </Button>
          </>
        }
      >
        {adaptationAlert && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                marginBottom: '1.25rem',
              }}
            >
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" style={{ marginTop: '0.15rem' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.25rem' }}>
                  {adaptationAlert.reason || 'Remediation Required'}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#fde68a', lineHeight: 1.5 }}>
                  {adaptationAlert.message}
                </p>
              </div>
            </div>

            {/* Added Mission Details */}
            {adaptationAlert.addedMission && (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Badge variant="purple">Newly Inserted Mission</Badge>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {adaptationAlert.addedMission.estimatedHours} Hours
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                  {adaptationAlert.addedMission.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {adaptationAlert.addedMission.objective}
                </p>

                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c084fc' }}>
                  Why it was added: {adaptationAlert.addedMission.adaptationReason}
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>AI Recommendation:</strong> {adaptationAlert.recommendation}
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .mobile-burger-btn {
          display: none;
        }
        @media (max-width: 900px) {
          .mobile-burger-btn {
            display: flex !important;
          }
        }
        @media (min-width: 640px) {
          .aws-arch-badge {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
