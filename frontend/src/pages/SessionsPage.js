import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

const TYPE_ICONS = { technical:'💻', hr:'🤝', 'system-design':'🏗️', behavioral:'🎯', mock:'🎭', custom:'⚙️' };
const TYPE_COLORS = { technical:'#6c63ff', hr:'#00d4aa', 'system-design':'#ff6b6b', behavioral:'#ffd93d', mock:'#a78bfa', custom:'#888' };

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

 useEffect(() => {
  fetchSessions();
}, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?type=${filter}` : '';
      const res = await API.get(`/sessions${params}`);
      setSessions(res.data.sessions);
    } catch { toast.error('Failed to load sessions'); }
    finally { setLoading(false); }
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this session?')) return;
    try {
      await API.delete(`/sessions/${id}`);
      setSessions(prev => prev.filter(s => s._id !== id));
      toast.success('Session deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070d' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: '#f0f0ff', marginBottom: 4 }}>My Sessions</h1>
          <p style={{ color: '#8888aa' }}>All your interview practice sessions</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {['all', 'technical', 'hr', 'system-design', 'behavioral', 'mock'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 20, border: `1px solid ${filter === f ? '#6c63ff' : '#1e1e35'}`, background: filter === f ? 'rgba(108,99,255,0.2)' : 'transparent', color: filter === f ? '#f0f0ff' : '#8888aa', fontFamily: 'DM Sans', fontWeight: filter === f ? 600 : 400, fontSize: '0.85rem', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s' }}>
              {f === 'all' ? 'All Types' : f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {[1,2,3,4].map(i => <div key={i} className="shimmer" style={{ height: 80, borderRadius: 16 }} />)}
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', marginBottom: 8 }}>No sessions yet</h3>
            <p style={{ color: '#8888aa', marginBottom: 24 }}>Start practicing to see your sessions here</p>
            <button onClick={() => navigate('/chat')} style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer' }}>Start First Session</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {sessions.map(s => (
              <div key={s._id} onClick={() => navigate(`/chat/${s._id}`)} style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 16, padding: '20px 24px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2d2d52'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e35'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${TYPE_COLORS[s.type] || '#6c63ff'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    {TYPE_ICONS[s.type] || '📋'}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', marginBottom: 4 }}>{s.title}</div>
                    <div style={{ display: 'flex', gap: 12, color: '#555570', fontSize: '0.8rem', fontFamily: 'Space Mono' }}>
                      <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{s.questionsAsked || 0} questions</span>
                      {s.duration > 0 && <><span>•</span><span>{s.duration} min</span></>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {s.score > 0 && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, color: TYPE_COLORS[s.type] || '#6c63ff', fontSize: '1.2rem' }}>{s.score}</div>
                      <div style={{ color: '#555570', fontSize: '0.7rem' }}>/ 10</div>
                    </div>
                  )}
                  <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontFamily: 'Space Mono', background: s.status === 'completed' ? '#00d4aa22' : '#6c63ff22', color: s.status === 'completed' ? '#00d4aa' : '#6c63ff' }}>
                    {s.status}
                  </span>
                  <button onClick={(e) => deleteSession(s._id, e)} style={{ background: 'transparent', border: 'none', color: '#555570', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px', borderRadius: 6, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'}
                    onMouseLeave={e => e.currentTarget.style.color = '#555570'}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
