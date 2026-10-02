import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { isAuthenticated, user, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(10, 13, 22, 0.85)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                PathForge
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#c084fc',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                }}
              >
                AI
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1 }}>
              Adaptive Career Engine
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-nav-links"
        >
          <a
            href="#features"
            style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => (e.target.style.color = '#fff')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => (e.target.style.color = '#fff')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            How It Works
          </a>
          <a
            href="#aws-architecture"
            style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => (e.target.style.color = '#fff')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            AWS Architecture
          </a>
        </div>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              iconRight={ArrowRight}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDemoClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  color: '#c084fc',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Explore Demo</span>
              </button>

              <Link
                to="/login"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  padding: '0.45rem 0.75rem',
                }}
              >
                Login
              </Link>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav-links {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};
