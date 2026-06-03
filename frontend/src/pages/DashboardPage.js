import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const SESSION_TYPES = [
  { type: 'technical', label: 'Technical', icon: '💻', color: '#6c63ff', desc: 'DSA, Algorithms, CS Fundamentals' },
  { type: 'hr', label: 'HR Interview', icon: '🤝', color: '#00d4aa', desc: 'Behavioral & Cultural Fit' },
  { type: 'system-design', label: 'System Design', icon: '🏗️', color: '#ff6b6b', desc: 'Architecture & Scalability' },
  { type: 'behavioral', label: 'Behavioral', icon: '🎯', color: '#ffd93d', desc: 'STAR Method Practice' },
  { type: 'mock', label: 'Full Mock', icon: '🎭', color: '#a78bfa', desc: 'Complete Simulation' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tip, setTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    API.get('/sessions/stats/overview')
      .then(res => setStats(res.data))
      .catch(() => {});
    fetchTip();
  }, []);

  const fetchTip = async () => {
    setLoadingTip(true);
    try {
      const topics = ['confidence', 'technical answers', 'STAR method', 'system design', 'coding interviews'];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const res = await API.post('/ai/tip', { topic });
      setTip(res.data.tip);
    } catch { setTip('Practice consistently for 30 minutes daily for maximum improvement.'); }
    finally { setLoadingTip(false); }
  };

  const radarData = [
    { subject: 'Technical', A: user?.stats?.avgScore || 0 },
    { subject: 'Communication', A: 65 },
    { subject: 'Problem Solving', A: 70 },
    { subject: 'Behavioral', A: 60 },
    { subject: 'System Design', A: 55 },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070d' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', minWidth: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Mono', fontSize: '0.7rem', color: '#555570', marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            DASHBOARD
          </div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#f0f0ff' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p style={{ color: '#8888aa', marginTop: 6 }}>Ready to ace your next interview? Let's practice!</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Sessions', value: stats?.total || 0, icon: '📋', color: '#6c63ff' },
            { label: 'Completed', value: stats?.completed || 0, icon: '✅', color: '#00d4aa' },
            { label: 'Avg Score', value: `${stats?.avgScore || 0}/10`, icon: '⭐', color: '#ffd93d' },
            { label: 'Questions Done', value: user?.stats?.totalQuestions || 0, icon: '❓', color: '#ff6b6b' },
          ].map(s => (
            <div key={s.label} style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 16, padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, background: `${s.color}22`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                <div style={{ color: '#8888aa', fontSize: '0.8rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Start Interview Section */}
        <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 20, padding: '28px', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem', color: '#f0f0ff', marginBottom: 6 }}>🚀 Start a New Interview</h2>
          <p style={{ color: '#8888aa', fontSize: '0.9rem', marginBottom: 20 }}>Choose your interview type and dive in</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {SESSION_TYPES.map(t => (
              <button key={t.type} onClick={() => navigate(`/chat?type=${t.type}`)} style={{ background: '#0e0e1a', border: `1px solid ${t.color}33`, borderRadius: 14, padding: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${t.color}11`; e.currentTarget.style.borderColor = `${t.color}88`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0e0e1a'; e.currentTarget.style.borderColor = `${t.color}33`; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, color: t.color, fontSize: '0.9rem', marginBottom: 4 }}>{t.label}</div>
                <div style={{ color: '#8888aa', fontSize: '0.75rem' }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Charts + Tip Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Skills Radar */}
          <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 20, padding: '24px' }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', marginBottom: 20 }}>Skills Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e1e35" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#8888aa', fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Tip */}
          <div style={{ background: 'linear-gradient(135deg, #12122a, #1a1a3a)', border: '1px solid #6c63ff33', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff' }}>💡 AI Tip of the Day</h3>
              <button onClick={fetchTip} style={{ background: 'rgba(108,99,255,0.2)', border: 'none', color: '#6c63ff', padding: '6px 12px', borderRadius: 8, fontFamily: 'DM Sans', fontSize: '0.8rem', cursor: 'pointer' }}>New tip</button>
            </div>
            {loadingTip ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="typing-dots"><span/><span/><span/></div>
              </div>
            ) : (
              <p style={{ color: '#c0c0d8', lineHeight: 1.7, flex: 1, fontSize: '0.95rem', fontStyle: 'italic' }}>"{tip}"</p>
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        {stats?.recentSessions?.length > 0 && (
          <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 20, padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff' }}>Recent Sessions</h3>
              <button onClick={() => navigate('/sessions')} style={{ color: '#6c63ff', background: 'none', border: 'none', fontFamily: 'DM Sans', fontSize: '0.85rem', cursor: 'pointer' }}>View all →</button>
            </div>
            {stats.recentSessions.map(s => (
              <div key={s._id} onClick={() => navigate(`/chat/${s._id}`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: '#0e0e1a', marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a1a2e'}
                onMouseLeave={e => e.currentTarget.style.background = '#0e0e1a'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.2rem' }}>{SESSION_TYPES.find(t => t.type === s.type)?.icon || '📋'}</span>
                  <div>
                    <div style={{ fontFamily: 'DM Sans', fontWeight: 500, color: '#f0f0ff', fontSize: '0.9rem' }}>{s.title}</div>
                    <div style={{ color: '#555570', fontSize: '0.75rem' }}>{new Date(s.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {s.score > 0 && <span style={{ fontFamily: 'Space Mono', fontSize: '0.85rem', color: '#6c63ff' }}>{s.score}/10</span>}
                  <span style={{ padding: '3px 8px', borderRadius: 8, fontSize: '0.7rem', fontFamily: 'Space Mono', background: s.status === 'completed' ? '#00d4aa22' : '#6c63ff22', color: s.status === 'completed' ? '#00d4aa' : '#6c63ff' }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
    </div>
  );
}
