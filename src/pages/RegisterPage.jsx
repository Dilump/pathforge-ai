import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2.5rem 1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand */}
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
            Create Your Account
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Start your personalized adaptive tech career roadmap today.
          </p>
        </div>

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

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                required
                className="form-input"
                placeholder="e.g. Jordan Hayes"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                required
                className="form-input"
                placeholder="jordan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                required
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm">
                Confirm Password
              </label>
              <input
                id="register-confirm"
                type="password"
                required
                className="form-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Continue to Onboarding
            </Button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>
                Sign In
              </Link>
            </div>
            <button
              onClick={handleDemo}
              style={{
                background: 'none',
                border: 'none',
                color: '#c084fc',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Skip registration and explore demo profile
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
