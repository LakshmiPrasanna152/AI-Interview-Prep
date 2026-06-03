import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const ROLES = ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Product Manager', 'Data Analyst', 'QA Engineer', 'System Architect', 'Mobile Developer'];

export default function ChatPage() {
  const { sessionId: paramSessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sessionId, setSessionId] = useState(paramSessionId || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(!paramSessionId);
  const [setup, setSetup] = useState({
    type: searchParams.get('type') || 'technical',
    role: user?.targetRole || '',
    difficulty: 'medium'
  });
  const [sessionScore, setSessionScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(null);
  const [modelAnswers, setModelAnswers] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (paramSessionId) {
      loadSession(paramSessionId);
    }
  }, [paramSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadSession = async (id) => {
    try {
      const res = await API.get(`/sessions/${id}`);
      const s = res.data.session;
      setMessages(s.messages.map(m => ({ role: m.role, content: m.content, score: m.metadata?.score })));
      setSessionScore(s.score);
      setQuestionsAsked(s.questionsAsked);
      setShowSetup(false);
    } catch {
      toast.error('Session not found');
      navigate('/chat');
    }
  };

  const startSession = () => {
    setShowSetup(false);
    const welcomeMsg = {
      role: 'assistant',
      content: `# Welcome to your ${setup.type === 'technical' ? '💻 Technical' : setup.type === 'hr' ? '🤝 HR' : setup.type === 'system-design' ? '🏗️ System Design' : setup.type === 'behavioral' ? '🎯 Behavioral' : '🎭 Mock'} Interview!\n\nI'm your AI interviewer for today. ${setup.role ? `We'll be focusing on a **${setup.role}** position.` : ''}\n\nDifficulty: **${setup.difficulty}**\n\nWhen you're ready, type **"Start the interview"** or just say **"Ready"** and I'll begin with your first question!\n\n*Tip: Answer as you would in a real interview. I'll score each response and provide detailed feedback.*`
    };
    setMessages([welcomeMsg]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/ai/chat', {
        sessionId,
        message: userMsg.content,
        type: setup.type,
        role: setup.role,
        difficulty: setup.difficulty
      });

      if (!sessionId) {
        setSessionId(res.data.sessionId);
        navigate(`/chat/${res.data.sessionId}`, { replace: true });
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.message,
        score: res.data.score
      }]);
      setSessionScore(res.data.sessionScore || 0);
      setQuestionsAsked(res.data.questionsAsked || 0);
    } catch (err) {
      toast.error(err.message || err.response?.data?.error || 'Failed to get AI response');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fetchModelAnswer = async (msgIndex, question) => {
    setLoadingAnswer(msgIndex);
    try {
      const res = await API.post('/ai/chat', {
        sessionId,
        message: `Please provide a model/ideal answer for this question: ${question}`,
        type: setup.type,
        role: setup.role,
        difficulty: setup.difficulty,
        modelAnswerRequest: true
      });
      setModelAnswers(prev => ({ ...prev, [msgIndex]: res.data.message }));
    } catch {
      toast.error('Failed to fetch model answer');
    } finally {
      setLoadingAnswer(null);
    }
  };

  const getReport = async () => {
    if (!sessionId) return toast.error('No active session');
    setGenerating(true);
    try {
      const res = await API.post('/ai/report', { sessionId });
      const report = res.data.report;
      const reportMsg = {
        role: 'assistant',
        content: `# 📊 Performance Report\n\n**Overall Score: ${report.overallScore}/100** (${report.grade})\n\n## Strengths\n${report.strengths?.map(s => `- ${s}`).join('\n')}\n\n## Areas for Improvement\n${report.improvements?.map(i => `- ${i}`).join('\n')}\n\n## Skill Breakdown\n- **Technical Skills**: ${report.technicalSkills?.score}/100 — ${report.technicalSkills?.feedback}\n- **Communication**: ${report.communication?.score}/100 — ${report.communication?.feedback}\n- **Problem Solving**: ${report.problemSolving?.score}/100 — ${report.problemSolving?.feedback}\n\n## Recommendations\n${report.recommendations?.map(r => `- ${r}`).join('\n')}\n\n## Summary\n${report.summary}\n\n**Interview Ready: ${report.readyForInterview ? '✅ Yes!' : '⚠️ Needs more practice'}**`
      };
      setMessages(prev => [...prev, reportMsg]);
      toast.success('Report generated!');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  if (showSetup) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#07070d' }}>
        <Sidebar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
          <div style={{ width: '100%', maxWidth: 560, animation: 'fadeIn 0.4s ease-out' }}>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#f0f0ff', marginBottom: 8 }}>Configure Interview</h1>
            <p style={{ color: '#8888aa', marginBottom: 36 }}>Set up your personalized AI interview session</p>

            {/* Type */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.85rem', fontWeight: 500, marginBottom: 12, fontFamily: 'Space Mono' }}>INTERVIEW TYPE</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { value: 'technical', label: 'Technical', icon: '💻' },
                  { value: 'hr', label: 'HR', icon: '🤝' },
                  { value: 'system-design', label: 'System Design', icon: '🏗️' },
                  { value: 'behavioral', label: 'Behavioral', icon: '🎯' },
                  { value: 'mock', label: 'Full Mock', icon: '🎭' },
                  { value: 'custom', label: 'Custom', icon: '⚙️' },
                ].map(t => (
                  <button key={t.value} onClick={() => setSetup(p => ({ ...p, type: t.value }))} style={{ padding: '14px 10px', borderRadius: 12, border: `1px solid ${setup.type === t.value ? '#6c63ff' : '#1e1e35'}`, background: setup.type === t.value ? 'rgba(108,99,255,0.15)' : '#12121f', color: setup.type === t.value ? '#f0f0ff' : '#8888aa', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: setup.type === t.value ? 600 : 400, fontSize: '0.85rem', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '1.4rem' }}>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Role */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.85rem', fontWeight: 500, marginBottom: 12, fontFamily: 'Space Mono' }}>TARGET ROLE</label>
              <select value={setup.role} onChange={e => setSetup(p => ({ ...p, role: e.target.value }))} className="input-field" style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="">General Position</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: 36 }}>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.85rem', fontWeight: 500, marginBottom: 12, fontFamily: 'Space Mono' }}>DIFFICULTY</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {DIFFICULTIES.map(d => (
                  <button key={d} onClick={() => setSetup(p => ({ ...p, difficulty: d }))} style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${setup.difficulty === d ? (d === 'easy' ? '#00d4aa' : d === 'medium' ? '#ffd93d' : '#ff6b6b') : '#1e1e35'}`, background: setup.difficulty === d ? `${d === 'easy' ? '#00d4aa' : d === 'medium' ? '#ffd93d' : '#ff6b6b'}22` : '#12121f', color: setup.difficulty === d ? '#f0f0ff' : '#8888aa', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.15s' }}>
                    {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startSession} style={{ width: '100%', background: '#6c63ff', color: 'white', padding: '16px', borderRadius: 14, border: 'none', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 8px 28px rgba(108,99,255,0.4)', transition: 'all 0.2s' }}>
              ⚡ Start Interview Session
            </button>
          </div>
        </main>
        <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070d' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Chat header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e1e35', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a14' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/chat')} style={{ background: 'none', border: 'none', color: '#8888aa', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', fontSize: '0.95rem' }}>
                {setup.type === 'technical' ? '💻' : setup.type === 'hr' ? '🤝' : setup.type === 'system-design' ? '🏗️' : setup.type === 'behavioral' ? '🎯' : '🎭'} {setup.type.charAt(0).toUpperCase() + setup.type.slice(1)} Interview
                {setup.role && ` — ${setup.role}`}
              </div>
              <div style={{ color: '#555570', fontSize: '0.75rem', fontFamily: 'Space Mono' }}>{questionsAsked} questions • Session score: {sessionScore}/10</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={getReport} disabled={generating || !sessionId} style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa', padding: '8px 16px', borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
              {generating ? '⏳ Generating...' : '📊 Get Report'}
            </button>
            <button onClick={() => navigate('/chat')} style={{ background: '#12121f', border: '1px solid #2d2d52', color: '#8888aa', padding: '8px 16px', borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
              New Session
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', background: msg.role === 'user' ? 'linear-gradient(135deg, #6c63ff, #00d4aa)' : '#1a1a2e', border: '1px solid #2d2d52', color: 'white', fontFamily: 'Syne', fontWeight: 700 }}>
                {msg.role === 'user' ? (user?.name?.charAt(0) || 'U') : '🤖'}
              </div>
              <div style={{ maxWidth: '75%', minWidth: 80 }}>
                {msg.score !== null && msg.score !== undefined && (
                  <div style={{ marginBottom: 6, fontFamily: 'Space Mono', fontSize: '0.7rem', color: msg.score >= 7 ? '#00d4aa' : msg.score >= 5 ? '#ffd93d' : '#ff6b6b' }}>
                    SCORE: {msg.score}/10 {msg.score >= 7 ? '🌟' : msg.score >= 5 ? '👍' : '💪'}
                  </div>
                )}
                <div style={{ background: msg.role === 'user' ? 'rgba(108,99,255,0.2)' : '#12121f', border: `1px solid ${msg.role === 'user' ? 'rgba(108,99,255,0.3)' : '#1e1e35'}`, borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', padding: '14px 18px', color: '#e8e8f0', lineHeight: 1.7, fontSize: '0.93rem' }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.role === 'assistant' && i > 0 && !msg.content.includes('Performance Report') && !msg.content.includes('Welcome to your') && (
                  <div style={{ marginTop: 8 }}>
                    {!modelAnswers[i] ? (
                      <button
                        onClick={() => fetchModelAnswer(i, msg.content)}
                        disabled={loadingAnswer === i}
                        style={{ background: 'rgba(255,217,61,0.1)', border: '1px solid rgba(255,217,61,0.3)', color: '#ffd93d', padding: '6px 14px', borderRadius: 8, fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.75rem', cursor: loadingAnswer === i ? 'not-allowed' : 'pointer', transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        onMouseEnter={e => { if (loadingAnswer !== i) { e.currentTarget.style.background = 'rgba(255,217,61,0.2)'; }}}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,217,61,0.1)'; }}
                      >
                        {loadingAnswer === i ? '⏳ Loading...' : '💡 Show Model Answer'}
                      </button>
                    ) : (
                      <div style={{ marginTop: 4, background: 'rgba(255,217,61,0.05)', border: '1px solid rgba(255,217,61,0.2)', borderRadius: 12, padding: '14px 18px' }}>
                        <div style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: '#ffd93d', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>💡</span> MODEL ANSWER
                        </div>
                        <div style={{ color: '#c8c8e0', lineHeight: 1.7, fontSize: '0.9rem' }}>
                          <ReactMarkdown>{modelAnswers[i]}</ReactMarkdown>
                        </div>
                        <button
                          onClick={() => setModelAnswers(prev => { const n = {...prev}; delete n[i]; return n; })}
                          style={{ marginTop: 8, background: 'none', border: 'none', color: '#555570', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'DM Sans' }}
                        >
                          Hide answer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 14, animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a2e', border: '1px solid #2d2d52', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
              <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: '4px 18px 18px 18px', padding: '18px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div className="typing-dots"><span/><span/><span/></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px 20px', borderTop: '1px solid #1e1e35', background: '#0a0a14' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer... (Shift+Enter for new line, Enter to send)"
              rows={3}
              style={{ flex: 1, background: '#12121f', border: '1px solid #2d2d52', borderRadius: 14, padding: '14px 18px', color: '#f0f0ff', fontFamily: 'DM Sans', fontSize: '0.93rem', resize: 'none', lineHeight: 1.6, transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#6c63ff'}
              onBlur={e => e.target.style.borderColor = '#2d2d52'}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: loading || !input.trim() ? '#2d2d52' : '#6c63ff', color: 'white', border: 'none', width: 52, height: 52, borderRadius: 14, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontSize: '1.3rem', transition: 'all 0.2s', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: loading || !input.trim() ? 'none' : '0 4px 16px rgba(108,99,255,0.4)' }}>
              {loading ? '⏳' : '↑'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {['Ready to start', 'Can you give a hint?', 'Next question please', 'I need more time', 'Skip this question'].map(q => (
              <button key={q} onClick={() => setInput(q)} style={{ background: '#12121f', border: '1px solid #1e1e35', color: '#8888aa', padding: '5px 12px', borderRadius: 20, fontFamily: 'DM Sans', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c63ff44'; e.currentTarget.style.color = '#f0f0ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e35'; e.currentTarget.style.color = '#8888aa'; }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </main>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
