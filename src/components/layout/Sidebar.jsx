import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  CheckSquare,
  Award,
  BookOpen,
  Bot,
  User,
  LogOut,
  Flame,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CAREERS } from '../../data/careers';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const careerObj = CAREERS.find((c) => c.id === user?.careerGoal);
  const careerTitle = careerObj?.title || 'Tech Professional';

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/roadmap', label: 'My Roadmap', icon: Compass },
    { to: '/missions', label: 'Missions', icon: CheckSquare },
    { to: '/skills', label: 'Skills', icon: Layers },
    { to: '/assessments', label: 'Assessments', icon: Award },
    { to: '/coach', label: 'AI Coach', icon: Bot, badge: 'AI' },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
          className="mobile-backdrop"
        />
      )}

      <aside
        style={{
          width: '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: '#0c101c',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 95,
          transition: 'transform 0.3s ease',
        }}
        className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>PathForge</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#c084fc',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  AI
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Adaptive Career Path</span>
            </div>
          </div>
        </div>

        {/* Target Career Snapshot */}
        <div
          style={{
            padding: '1rem 1.25rem',
            margin: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
              Target Career
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700 }}>
              <Flame className="w-3.5 h-3.5" />
              <span>{user?.stats?.currentStreak || 4}d streak</span>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {careerTitle}
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(139, 92, 246, 0.25)',
                      color: '#c084fc',
                    }}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 opacity-40" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / User Profile & Logout */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Learner'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'learner@pathforge.ai'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: '#f87171',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.16)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)')}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-container {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            box-shadow: 10px 0 25px rgba(0,0,0,0.5);
          }
          .sidebar-container.mobile-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};
