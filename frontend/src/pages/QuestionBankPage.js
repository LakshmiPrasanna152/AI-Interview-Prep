import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

const TOPICS = {
  technical: ['Data Structures', 'Algorithms', 'System Design', 'OOP', 'Databases', 'Networking', 'OS Concepts', 'React', 'Node.js', 'Python', 'Java', 'JavaScript'],
  hr: ['Leadership', 'Teamwork', 'Conflict Resolution', 'Career Goals', 'Strengths & Weaknesses', 'Time Management', 'Communication'],
  behavioral: ['Problem Solving', 'Adaptability', 'Initiative', 'Customer Focus', 'Decision Making', 'Mentoring'],
};

export default function QuestionBankPage() {
  const [category, setCategory] = useState('technical');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedQ, setExpandedQ] = useState(null);
  const navigate = useNavigate();

  const generateQuestions = async () => {
    if (!topic) return toast.error('Please select a topic');
    setLoading(true);
    try {
      const res = await API.post('/ai/generate-questions', { topic, difficulty, count: 10, type: category });
      setQuestions(res.data.questions || []);
      setExpandedQ(null);
    } catch { toast.error('Failed to generate questions'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070d' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: '#f0f0ff', marginBottom: 4 }}>Question Bank</h1>
          <p style={{ color: '#8888aa' }}>AI-generated questions tailored to your needs</p>
        </div>

        {/* Controls */}
        <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 20, padding: '24px', marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.8rem', marginBottom: 8, fontFamily: 'Space Mono' }}>CATEGORY</label>
              <select value={category} onChange={e => { setCategory(e.target.value); setTopic(''); }} className="input-field">
                <option value="technical">Technical</option>
                <option value="hr">HR / Behavioral</option>
                <option value="behavioral">Behavioral STAR</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.8rem', marginBottom: 8, fontFamily: 'Space Mono' }}>TOPIC</label>
              <select value={topic} onChange={e => setTopic(e.target.value)} className="input-field">
                <option value="">Select a topic...</option>
                {(TOPICS[category] || []).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.8rem', marginBottom: 8, fontFamily: 'Space Mono' }}>DIFFICULTY</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="input-field">
                <option value="easy"> Easy</option>
                <option value="medium"> Medium</option>
                <option value="hard"> Hard</option>
              </select>
            </div>
          </div>
          <button onClick={generateQuestions} disabled={loading || !topic} style={{ background: loading ? '#4a4466' : '#6c63ff', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 700, cursor: loading || !topic ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 16px rgba(108,99,255,0.4)' }}>
            {loading ? '⏳ Generating...' : ' Generate  Questions'}
          </button>
        </div>

        {/* Questions */}
        {loading ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {[1,2,3,4,5].map(i => <div key={i} className="shimmer" style={{ height: 80, borderRadius: 16 }} />)}
          </div>
        ) : questions.length > 0 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff' }}>{questions.length} Questions — {topic}</h3>
              <button onClick={() => navigate(`/chat?type=${category}`)} style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa', padding: '8px 16px', borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                 Practice with AI →
              </button>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {questions.map((q, i) => (
                <div key={i} style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s' }}>
                  <div onClick={() => setExpandedQ(expandedQ === i ? null : i)} style={{ padding: '18px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1a1a2e'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1 }}>
                      <span style={{ fontFamily: 'Space Mono', color: '#555570', fontSize: '0.8rem', flexShrink: 0, marginTop: 2 }}>Q{i + 1}</span>
                      <span style={{ color: '#e8e8f0', lineHeight: 1.6, fontWeight: 500 }}>{q.question}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      {q.difficulty && <span style={{ padding: '2px 8px', borderRadius: 8, fontSize: '0.7rem', background: q.difficulty === 'easy' ? '#00d4aa22' : q.difficulty === 'hard' ? '#ff6b6b22' : '#ffd93d22', color: q.difficulty === 'easy' ? '#00d4aa' : q.difficulty === 'hard' ? '#ff6b6b' : '#ffd93d', fontFamily: 'Space Mono' }}>{q.difficulty}</span>}
                      <span style={{ color: '#6c63ff', fontSize: '0.9rem' }}>{expandedQ === i ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {expandedQ === i && (
                    <div style={{ padding: '0 24px 20px', borderTop: '1px solid #1e1e35', animation: 'fadeIn 0.2s ease-out' }}>
                      {q.hint && (
                        <div style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, padding: '12px 16px', marginTop: 16, marginBottom: 12 }}>
                          <div style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: '#6c63ff', marginBottom: 6 }}> HINT</div>
                          <p style={{ color: '#c0c0d8', fontSize: '0.9rem', lineHeight: 1.6 }}>{q.hint}</p>
                        </div>
                      )}
                      {q.sampleAnswer && (
                        <div style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 10, padding: '12px 16px' }}>
                          <div style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: '#00d4aa', marginBottom: 6 }}> SAMPLE ANSWER</div>
                          <p style={{ color: '#c0c0d8', fontSize: '0.9rem', lineHeight: 1.6 }}>{q.sampleAnswer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>❓</div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', marginBottom: 8 }}>Select a topic and generate questions</h3>
            <p style={{ color: '#8888aa' }}>Choose a category, topic, and difficulty level to get started</p>
          </div>
        )}
      </main>
      <style>{`@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`}</style>
    </div>
  );
}
