import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: '', title: 'AI-Powered Interviews', desc: 'Claude AI conducts realistic mock interviews tailored to your target role and experience level.' },
  { icon: '', title: 'Real-time Feedback', desc: 'Get instant scores, detailed feedback, and model answers after every response.' },
  { icon: '', title: 'Resume Analysis', desc: 'Upload your resume for AI-powered gap analysis and personalized question suggestions.' },
  { icon: '', title: 'Multiple Interview Types', desc: 'Technical, HR, Behavioral, System Design, and Full Mock interviews available.' },
  { icon: '', title: 'Progress Tracking', desc: 'Track your improvement over time with detailed analytics and performance history.' },
  { icon: '', title: 'Question Bank', desc: 'Access thousands of curated questions across all domains and difficulty levels.' },
];



export default function HomePage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#07070d', overflowX: 'hidden' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 50 ? 'rgba(7,7,13,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid #1e1e35' : 'none',
        transition: 'all 0.3s ease',
        padding: '16px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: '#f0f0ff' }}>
          <span style={{ color: '#6c63ff' }}>Interview</span>AI
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => navigate('/signin')} style={{ background: 'transparent', border: '1px solid #2d2d52', color: '#f0f0ff', padding: '10px 24px', borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} style={{ background: '#6c63ff', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(108,99,255,0.4)' }}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '120px 24px 80px', textAlign: 'center' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, background: 'radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '40%', left: '20%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(0,212,170,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '30%', right: '20%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(255,107,107,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#6c63ff" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div style={{ position: 'relative', maxWidth: 800, animation: 'fadeIn 0.8s ease-out' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 32, fontFamily: 'Space Mono', fontSize: '0.75rem', color: '#6c63ff' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', animation: 'pulse 2s infinite' }} />
            AI-Powered Interview Coach — Powered by Claude
          </div>

          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: 24, color: '#f0f0ff' }}>
            Crack Every Interview
            <br />
            <span style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              With AI Confidence
            </span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#8888aa', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7, fontWeight: 300 }}>
            Practice unlimited technical and HR interviews with our AI interviewer. Get real-time feedback, scores, and personalized improvement plans.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <button onClick={() => navigate('/signup')} style={{ background: '#6c63ff', color: 'white', padding: '16px 40px', borderRadius: 14, fontFamily: 'DM Sans', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', border: 'none', boxShadow: '0 8px 32px rgba(108,99,255,0.5)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10 }}>
               Start Practicing Free
            </button>
            <button onClick={() => navigate('/signin')} style={{ background: 'transparent', color: '#f0f0ff', padding: '16px 40px', borderRadius: 14, fontFamily: 'DM Sans', fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', border: '1px solid #2d2d52', transition: 'all 0.2s' }}>
              Sign In
            </button>
          </div>

        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f0f0ff', marginBottom: 16 }}>
            Everything You Need to
            <span style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Succeed</span>
          </h2>
          <p style={{ color: '#8888aa', fontSize: '1.1rem' }}>A complete interview preparation platform powered by Claude AI</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 20, padding: '32px', transition: 'all 0.2s', cursor: 'default', animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2d2d52'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(108,99,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e35'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', color: '#f0f0ff', marginBottom: 12 }}>{f.title}</h3>
              <p style={{ color: '#8888aa', lineHeight: 1.7, fontSize: '0.95rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Types */}
      <section style={{ padding: '100px 24px', background: '#0a0a14' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f0f0ff', marginBottom: 16 }}>Choose Your Interview Mode</h2>
          <p style={{ color: '#8888aa', fontSize: '1.1rem', marginBottom: 64 }}>Specialized AI interviewers for every scenario</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Technical', icon: '', color: '#6c63ff', desc: 'DSA, Coding, CS fundamentals' },
              { label: 'HR', icon: '', color: '#00d4aa', desc: 'Behavioral & cultural fit' },
              { label: 'System Design', icon: '', color: '#ff6b6b', desc: 'Architecture & scalability' },
              { label: 'Behavioral', icon: '', color: '#ffd93d', desc: 'STAR method practice' },
              { label: 'Mock Interview', icon: '', color: '#a78bfa', desc: 'Full realistic simulation' },
            ].map(t => (
              <div key={t.label} onClick={() => navigate('/signup')} style={{ background: '#12121f', border: `1px solid ${t.color}33`, borderRadius: 16, padding: '24px 32px', cursor: 'pointer', transition: 'all 0.2s', minWidth: 180, flex: '0 1 auto' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${t.color}11`; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#12121f'; e.currentTarget.style.transform = 'scale(1)'; }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, color: t.color, fontSize: '1rem' }}>{t.label}</div>
                <div style={{ color: '#8888aa', fontSize: '0.8rem', marginTop: 6 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f0f0ff', marginBottom: 24, lineHeight: 1.1 }}>
            Ready to Land Your Dream Job?
          </h2>
          <p style={{ color: '#8888aa', fontSize: '1.1rem', marginBottom: 40 }}>Join thousands of students who've already aced their interviews with AI coaching.</p>
          <button onClick={() => navigate('/signup')} style={{ background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', color: 'white', padding: '18px 48px', borderRadius: 16, fontFamily: 'DM Sans', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', border: 'none', boxShadow: '0 12px 40px rgba(108,99,255,0.4)', transition: 'all 0.2s' }}>
            Start For Free 
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0a14', borderTop: '1px solid #1e1e35', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: '#f0f0ff' }}>
          <span style={{ color: '#6c63ff' }}>Interview</span>AI
        </div>
        <p style={{ color: '#555570', fontSize: '0.85rem' }}>© 2024 InterviewAI. Built with Claude AI.</p>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}