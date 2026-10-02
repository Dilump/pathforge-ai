import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Cpu,
  Bot,
  Cloud,
  BarChart2,
  GitBranch,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';
import { roadmapService } from '../services/roadmapService';
import {
  CAREERS,
  SKILL_LEVELS,
  LEARNING_HOURS_OPTIONS,
  LEARNING_STYLES,
  ROADMAP_DURATIONS,
} from '../data/careers';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { MultiStageLoader } from '../components/common/LoadingState';

const careerIcons = {
  Cpu: Cpu,
  Bot: Bot,
  Cloud: Cloud,
  BarChart2: BarChart2,
  GitBranch: GitBranch,
};

export const OnboardingPage = () => {
  const { user, updateUser } = useAuth();
  const { refreshState } = useRoadmap();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 to 5
  const [selectedCareer, setSelectedCareer] = useState('mlops-engineer');
  const [skillRatings, setSkillRatings] = useState({
    python: 'intermediate',
    'machine-learning': 'beginner',
    git: 'intermediate',
    linux: 'beginner',
    docker: 'beginner',
    aws: 'none',
    cicd: 'none',
    kubernetes: 'none',
    'model-deployment': 'none',
    monitoring: 'none',
    'mlops-concepts': 'none',
  });
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [learningStyle, setLearningStyle] = useState('balanced');
  const [duration, setDuration] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);

  const careerObj = CAREERS.find((c) => c.id === selectedCareer) || CAREERS[0];

  const handleSelectSkillLevel = (skillId, level) => {
    setSkillRatings((prev) => ({
      ...prev,
      [skillId]: level,
    }));
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);

    try {
      const profile = {
        id: user?.id || `user-${Date.now()}`,
        name: user?.name || 'Learner',
        email: user?.email || 'learner@pathforge.ai',
        careerGoal: selectedCareer,
        weeklyHours,
        learningStyle,
        roadmapDuration: duration,
      };

      // Calls roadmapService which runs AI gap analysis and generates roadmap
      await roadmapService.generateAndSaveUserRoadmap(profile, skillRatings);
      await updateUser({
        careerGoal: selectedCareer,
        weeklyHours,
        learningStyle,
        roadmapDuration: duration,
        onboardingComplete: true,
      });

      refreshState();
      // Navigation is triggered when MultiStageLoader calls onComplete
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setIsGenerating(false);
    }
  };

  // Group Strong vs Gaps for summary
  const strongSkills = [];
  const gapSkills = [];
  careerObj.skills.forEach((s) => {
    const level = skillRatings[s.id] || 'none';
    if (level === 'advanced' || level === 'intermediate') {
      strongSkills.push(s.name);
    } else {
      gapSkills.push(s.name);
    }
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          height: '4.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 2rem',
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
            }}
          >
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>PathForge AI</span>
        </div>

        {/* Step Indicator */}
        {!isGenerating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Step {step} of 5
            </span>
            <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(step / 5) * 100}%`,
                  height: '100%',
                  background: 'var(--gradient-primary)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Body */}
      <main style={{ flex: 1, padding: '3rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '860px' }}>
          {isGenerating ? (
            <Card style={{ padding: '3rem 2rem', border: '1px solid rgba(139, 92, 246, 0.4)' }} glow>
              <MultiStageLoader
                onComplete={() => {
                  navigate('/roadmap');
                }}
              />
            </Card>
          ) : (
            <>
              {/* STEP 1: WELCOME */}
              {step === 1 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem auto',
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>

                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    Let's build your personalized career path.
                  </h1>

                  <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
                    PathForge will ask about your target career, current technical baseline, and weekly availability. We then generate an adaptive curriculum tailored specifically to your needs.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1.25rem',
                      textAlign: 'left',
                      marginBottom: '3rem',
                    }}
                  >
                    <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>01. GOAL</div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Select Target Role</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>MLOps, AI/ML, Cloud, Data Science, or DevOps</p>
                    </div>
                    <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>02. ASSESSMENT</div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Rate Current Skills</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Identify baseline competencies and gap areas</p>
                    </div>
                    <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>03. ROADMAP</div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Generate Curriculum</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Personalized weekly missions and challenges</p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    iconRight={ArrowRight}
                    onClick={() => setStep(2)}
                  >
                    Start Assessment
                  </Button>
                </div>
              )}

              {/* STEP 2: CAREER GOAL */}
              {step === 2 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Badge variant="purple" style={{ marginBottom: '0.5rem' }}>Step 2: Career Goal</Badge>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                      What career are you working toward?
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      Select the high-impact tech specialty you want to master.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                    {CAREERS.map((career) => {
                      const Icon = careerIcons[career.iconName] || Cpu;
                      const isSelected = selectedCareer === career.id;

                      return (
                        <Card
                          key={career.id}
                          interactive
                          glow={isSelected}
                          onClick={() => setSelectedCareer(career.id)}
                          style={{
                            padding: '1.25rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.25rem',
                            border: isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                            backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          }}
                        >
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: isSelected ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                              color: isSelected ? '#fff' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon className="w-6 h-6" />
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                                {career.title}
                              </h4>
                              {career.badge && <Badge variant="secondary">{career.badge}</Badge>}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {career.shortDescription}
                            </p>
                          </div>

                          <div
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              border: isSelected ? '2px solid #8b5cf6' : '2px solid rgba(255, 255, 255, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />}
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button variant="primary" iconRight={ArrowRight} onClick={() => setStep(3)}>
                      Next: Rate Your Skills
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: CURRENT SKILLS */}
              {step === 3 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Badge variant="purple" style={{ marginBottom: '0.5rem' }}>Step 3: Baseline Evaluation</Badge>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                      Assess Your Current Skills
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      For <strong>{careerObj.title}</strong>, how would you rate your hands-on experience in each domain?
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                    {careerObj.skills.map((skill) => {
                      const currentRating = skillRatings[skill.id] || 'none';

                      return (
                        <div
                          key={skill.id}
                          style={{
                            padding: '1.25rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                                {skill.name}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                                ({skill.category})
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              Target: {skill.requiredLevel}
                            </span>
                          </div>

                          {/* 4 Interactive Level Buttons */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                            {SKILL_LEVELS.map((level) => {
                              const isSelected = currentRating === level.value;
                              return (
                                <button
                                  key={level.value}
                                  type="button"
                                  onClick={() => handleSelectSkillLevel(skill.id, level.value)}
                                  style={{
                                    padding: '0.5rem 0.25rem',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.8rem',
                                    fontWeight: isSelected ? 700 : 500,
                                    border: isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                                    backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  {level.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button variant="primary" iconRight={ArrowRight} onClick={() => setStep(4)}>
                      Next: Learning Preferences
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: LEARNING PREFERENCES */}
              {step === 4 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Badge variant="purple" style={{ marginBottom: '0.5rem' }}>Step 4: Study Pace</Badge>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                      Learning Preferences
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      Tailor the intensity and duration of your roadmap.
                    </p>
                  </div>

                  {/* Hours per week */}
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                      Hours available per week
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                      {LEARNING_HOURS_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => setWeeklyHours(opt.value)}
                          style={{
                            padding: '1rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            border: weeklyHours === opt.value ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                            backgroundColor: weeklyHours === opt.value ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{opt.label}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{opt.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Style */}
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                      Preferred Learning Style
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                      {LEARNING_STYLES.map((style) => (
                        <div
                          key={style.value}
                          onClick={() => setLearningStyle(style.value)}
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: learningStyle === style.value ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                            backgroundColor: learningStyle === style.value ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{style.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{style.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                      Roadmap Duration
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                      {ROADMAP_DURATIONS.map((dur) => (
                        <div
                          key={dur.value}
                          onClick={() => setDuration(dur.value)}
                          style={{
                            padding: '1rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            border: duration === dur.value ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                            backgroundColor: duration === dur.value ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{dur.label}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{dur.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button variant="primary" iconRight={ArrowRight} onClick={() => setStep(5)}>
                      Next: Review & Forge Roadmap
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 5: SUMMARY & GENERATE */}
              {step === 5 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <Badge variant="purple" style={{ marginBottom: '0.5rem' }}>Step 5: Path Blueprint</Badge>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                      Ready to Forge Your Path
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      Review your profile parameters before our AI engine generates your personalized roadmap.
                    </p>
                  </div>

                  <Card style={{ padding: '2rem', marginBottom: '2rem' }} glow>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Career</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{careerObj.title}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weekly Commitment</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{weeklyHours} Hours / Week</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Duration</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc' }}>{duration} Weeks</div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', marginBottom: '0.4rem' }}>
                          Current Strongest Foundations:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {strongSkills.length > 0 ? (
                            strongSkills.map((s, i) => (
                              <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                {s}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Foundational level across all topics.</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.4rem' }}>
                          Identified Competencies Needing Development:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {gapSkills.slice(0, 6).map((s, i) => (
                            <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep(4)}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={Sparkles}
                      iconRight={ArrowRight}
                      onClick={handleStartGeneration}
                    >
                      Generate My AI Roadmap
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
