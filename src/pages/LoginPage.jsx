import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, LogIn, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.onboardingComplete) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleExploreDemo = async () => {
    setError('');
    setDemoLoading(true);
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to initialize demo workspace.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>PathForge AI</span>
          </Link>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Sign in to resume your adaptive learning journey.
          </p>
        </div>

        {/* Demo Fast-Track Banner */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Sparkles className="w-4 h-4" />
            <span>AWS HACKATHON EVALUATION MODE</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Instantly load Alex Rivera's pre-populated MLOps journey with quiz history, 38% progress, and active Docker mission.
          </p>
          <Button
            variant="outline-purple"
            size="sm"
            style={{ width: '100%' }}
            loading={demoLoading}
            onClick={handleExploreDemo}
          >
            Explore Demo Learner
          </Button>
        </div>

        {/* Card Form */}
        <Card style={{ padding: '2rem' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ width: '100%', marginTop: '0.5rem' }}
              iconRight={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}
          >
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
