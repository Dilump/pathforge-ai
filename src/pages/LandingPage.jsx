import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Target,
  Layers,
  Cpu,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldCheck,
  Zap,
  PlayCircle,
  Award,
  Cloud,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { loginDemo, isAuthenticated } = useAuth();

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleDemo = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 4rem 0',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Small Badge */}
          <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            <Badge variant="purple" icon={Sparkles} style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
              AI-Powered Adaptive Learning
            </Badge>
          </div>

          {/* Main Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              maxWidth: '920px',
              margin: '0 auto 1.5rem auto',
            }}
          >
            Forge Your Path to Your <span className="text-gradient">Dream Tech Career</span>
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
            }}
          >
            PathForge AI analyzes your current skills, pinpoints critical gaps, crafts a personalized learning roadmap, and continuously adapts your weekly missions as you demonstrate real mastery.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Button
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              onClick={handleStart}
            >
              Build My Roadmap
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See How It Works
            </Button>
            <button
              onClick={handleDemo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                color: '#c084fc',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.22)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.12)')}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Explore Demo (Alex - MLOps)</span>
            </button>
          </div>

          {/* Visually Attractive Hero Dashboard Preview */}
          <div
            style={{
              maxWidth: '1060px',
              margin: '0 auto',
              borderRadius: 'var(--radius-xl)',
              padding: '1rem',
              background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.7) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 45px rgba(139, 92, 246, 0.25)',
            }}
          >
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#0c111e',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              {/* Fake Browser/App Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1.25rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    pathforge.ai/dashboard/mlops-engineer
                  </span>
                </div>
                <Badge variant="purple" icon={Sparkles}>
                  Adaptive Roadmap Active
                </Badge>
              </div>

              {/* Preview Content Grid */}
              <div style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {/* Preview Card 1: Active Mission */}
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700 }}>WEEK 3 • CURRENT FOCUS</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2h 30m left</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
                    Docker Fundamentals
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Master containerization and package production prediction APIs.
                  </p>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: 'var(--gradient-primary)' }} />
                  </div>
                </div>

                {/* Preview Card 2: Skill Radar / Matrix */}
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>DEMONSTRATED READINESS</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399' }}>38% Overall</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#fff', marginBottom: '2px' }}>
                        <span>Python</span>
                        <span>85%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                        <div style={{ width: '85%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#fff', marginBottom: '2px' }}>
                        <span>Git & Linux</span>
                        <span>70%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                        <div style={{ width: '70%', height: '100%', background: '#6366f1', borderRadius: '2px' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#fff', marginBottom: '2px' }}>
                        <span>Kubernetes (Gap)</span>
                        <span>18%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                        <div style={{ width: '18%', height: '100%', background: '#f59e0b', borderRadius: '2px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Card 3: Adaptive Notification */}
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ADAPTIVE ENGINE NOTIFICATION</span>
                  </div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                    Curriculum Auto-Adjusted
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#fde68a', lineHeight: 1.4 }}>
                    Evaluates quiz scores after each weekly milestone. If mastery falls below 60%, a targeted remediation challenge is dynamically inserted!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" style={{ padding: '5rem 0', backgroundColor: '#090d18', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
            <Badge variant="purple" style={{ marginBottom: '0.75rem' }}>
              Engineered For Career Growth
            </Badge>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Beyond Static Roadmaps & Generic Chatbots
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Most platforms offer rigid lists or free-form chatbots that forget your background. PathForge builds a living, evolving roadmap that responds to what you actually prove you know.
            </p>
          </div>

          <div className="grid-3">
            {/* Feature 1 */}
            <Card style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Target className="w-5 h-5" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>
                AI Skill Gap Analysis
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Benchmark your baseline knowledge against real-world job roles (MLOps, AI/ML, Cloud, Data Science, DevOps) to identify exact competency blind spots.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Layers className="w-5 h-5" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>
                Personalized Roadmaps
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Structured multi-week learning journeys mapped strictly to your target career, existing strengths, preferred learning style, and available weekly study hours.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>
                Weekly Actionable Missions
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Convert intimidating long-term career aspirations into bite-sized weekly task checklists, curated references, and real-world practical milestone challenges.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card style={{ padding: '2rem' }} glow>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Brain className="w-5 h-5" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>
                Adaptive Learning Engine
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The core differentiator: Assessment quizzes evaluate your comprehension. Low scores trigger targeted reinforcement missions before advancing to dependent topics.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>
                Progress & Readiness Analytics
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Visualize your skills matrix using radar charts, track study hours, monitor streaks, and see your quantitative readiness score climb toward 100%.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Cpu className="w-5 h-5" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>
                Context-Aware AI Coach
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                An intelligent career mentor that has full context of your target role, current weekly mission, quiz scores, and weak points to answer questions accurately.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How PathForge Works Section */}
      <section id="how-it-works" style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
            <Badge variant="secondary" style={{ marginBottom: '0.75rem' }}>
              Step-by-Step Architecture
            </Badge>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              How PathForge AI Works
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              From initial baseline evaluation to verified career mastery, here is how the continuous learning cycle operates:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { num: '01', title: 'Choose Your Career', desc: 'Select from high-demand roles like MLOps, AI/ML, Cloud Architecture, Data Science, or DevOps.' },
              { num: '02', title: 'Tell Us Your Skills', desc: 'Rate your baseline experience across foundational and advanced industry competencies.' },
              { num: '03', title: 'Generate Your Roadmap', desc: 'AI analyzes your gap and architects a week-by-week sequence matched to your schedule.' },
              { num: '04', title: 'Complete Missions', desc: 'Work through interactive tasks, curated guides, and practical portfolio-grade code challenges.' },
              { num: '05', title: 'Test Your Knowledge', desc: 'Take focused 5-question multiple-choice assessments that test true conceptual comprehension.' },
              { num: '06', title: 'Adapt and Improve', desc: 'The curriculum dynamically inserts reinforcement challenges if gaps are detected, ensuring solid mastery.' },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#818cf8', opacity: 0.8 }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWS Hackathon Architecture Section */}
      <section id="aws-architecture" style={{ padding: '5rem 0', backgroundColor: '#080c16', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
            <Badge variant="purple" icon={Cloud} style={{ marginBottom: '0.75rem' }}>
              AWS Architecture Migration Blueprint
            </Badge>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Built for Scale on Amazon Web Services
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              While this MVP runs locally with high-fidelity service layers, each module is cleanly architected for direct plug-and-play migration to AWS cloud services.
            </p>
          </div>

          <div className="grid-3">
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.25rem' }}>AI CORE</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Amazon Bedrock</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Powers roadmap generation, adaptive curriculum restructuring, assessment creation, and context-aware career coaching using Claude 3.5 Sonnet foundation models.
              </p>
            </Card>

            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.25rem' }}>API & COMPUTE</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>API Gateway & AWS Lambda</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Serverless REST API tier executing skill-gap algorithms, grading assessments, and handling roadmap adaptation triggers without maintaining persistent servers.
              </p>
            </Card>

            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', marginBottom: '0.25rem' }}>PERSISTENCE</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Amazon DynamoDB</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Single-digit millisecond latency NoSQL database storing user profiles, personalized roadmaps, weekly task completion states, and assessment audit history.
              </p>
            </Card>

            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.25rem' }}>SECURITY</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Amazon Cognito</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Enterprise-grade identity federation, user pool authentication, JWT verification, and encrypted token management replacing local session storage.
              </p>
            </Card>

            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.25rem' }}>DEPLOYMENT</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>AWS Amplify Hosting</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Continuous git-backed deployment, global CloudFront content delivery, custom domain SSL/TLS certificates, and preview branches for PR review.
              </p>
            </Card>

            <Card style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.25rem' }}>OBSERVABILITY</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Amazon CloudWatch</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Real-time API latency metrics, Lambda execution tracing via AWS X-Ray, error alert alarms, and client-side error telemetry for 99.9% uptime.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ padding: '6rem 0', textAlign: 'center', position: 'relative' }}>
        <div className="container-sm">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to Forge Your Path?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Join thousands of early-career engineers and students building career-ready tech mastery through adaptive learning.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              onClick={handleStart}
            >
              Get Started for Free
            </Button>
            <Button
              variant="outline-purple"
              size="lg"
              onClick={handleDemo}
            >
              Launch Demo Workspace
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
