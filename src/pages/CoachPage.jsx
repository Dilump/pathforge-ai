import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';
import { aiService } from '../services/aiService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const CoachPage = () => {
  const { user } = useAuth();
  const { roadmap, missions, skills, activeMission } = useRoadmap();

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm your **PathForge AI Career Coach**.\n\nI have complete visibility into your current journey toward **${user?.careerGoal || 'MLOps Engineer'}**, your active progress on **${activeMission?.title || 'Docker Fundamentals'}**, and your demonstrated skills.\n\nWhat would you like to explore today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'What should I focus on this week?',
    'Why do I need Kubernetes for MLOps?',
    'What project should I build after Docker?',
    'Which skill am I weakest at?',
    'How do I prepare for AWS certifications?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const context = {
        careerGoal: user?.careerGoal || 'MLOps Engineer',
        currentMission: activeMission,
        stats: user?.stats,
        skills,
      };

      const aiResponse = await aiService.generateCoachResponse(context, text);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiResponse,
          timestamp: 'Just now',
        },
      ]);
    } catch (err) {
      console.error('Error generating coach response:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I ran into an issue analyzing your roadmap context. Please try again.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', height: 'calc(100vh - 8rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
              PathForge AI Career Coach
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Tailored guidance using Amazon Bedrock context-aware modeling
            </p>
          </div>
        </div>

        <Badge variant="purple" icon={Sparkles}>
          Active Mission Context
        </Badge>
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(p)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <Card
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '1.25rem',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '0.5rem' }}>
          {messages.map((m) => {
            const isAi = m.sender === 'ai';

            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignSelf: isAi ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                }}
              >
                {isAi && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                )}

                <div
                  style={{
                    padding: '0.85rem 1.15rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: isAi ? 'rgba(15, 23, 42, 0.85)' : 'rgba(99, 102, 241, 0.25)',
                    border: isAi ? '1px solid var(--border-subtle)' : '1px solid rgba(99, 102, 241, 0.4)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: '#f8fafc',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {m.text}
                </div>

                {!isAi && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', gap: '0.85rem', alignSelf: 'flex-start', alignItems: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                }}
              >
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>Coach is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask about this week's mission, portfolio advice, or technical concepts..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button
            variant="primary"
            disabled={!inputText.trim() || loading}
            onClick={() => handleSendMessage()}
            icon={Send}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};
