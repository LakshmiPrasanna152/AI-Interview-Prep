import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();

  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(
  form.name,
  form.email,
  form.password
);

toast.success(
  'Account created successfully. Please sign in.'
);

navigate('/signin');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // setGoogleLoading(true);
    try {
      await googleLogin();
      toast.success('Welcome! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };
 

  return (
    <div style={{ minHeight: '100vh', background: '#07070d', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', minWidth: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '35%', width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(108,99,255,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        
        <Link to="/" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: '#f0f0ff', marginBottom: 48, display: 'inline-block' }}>
          <span style={{ color: '#6c63ff' }}>Interview</span>AI
        </Link>

        <div style={{ maxWidth: 460, width: '100%', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.2rem', color: '#f0f0ff', marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: '#8888aa', marginBottom: 40 }}>Start your interview preparation journey today</p>

          {/* Google button */}
          <button onClick={handleGoogleSignIn} style={{ width: '100%', background: '#12121f', border: '1px solid #2d2d52', color: '#f0f0ff', padding: '14px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6c63ff'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2d2d52'}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: '#1e1e35' }} />
            <span style={{ color: '#555570', fontSize: '0.85rem', fontFamily: 'Space Mono' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#1e1e35' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.85rem', marginBottom: 8, fontWeight: 500 }}>Full Name</label>
              <input className="input-field" type="text" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.85rem', marginBottom: 8, fontWeight: 500 }}>Email Address</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.85rem', marginBottom: 8, fontWeight: 500 }}>Password</label>
              <input className="input-field" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.85rem', marginBottom: 8, fontWeight: 500 }}>Confirm Password</label>
              <input className="input-field" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            <button type="submit" disabled={loading} style={{ background: loading ? '#4a4466' : '#6c63ff', color: 'white', padding: '15px', borderRadius: 12, border: 'none', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 8px 24px rgba(108,99,255,0.4)' }}>
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#8888aa', marginTop: 32, fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: '#6c63ff', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '45%', background: 'linear-gradient(135deg, #0e0e1a 0%, #12122a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', borderLeft: '1px solid #1e1e35', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(108,99,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'Space Mono', color: '#6c63ff', fontSize: '0.75rem', marginBottom: 32, letterSpacing: 2 }}>WHY INTERVIEWAI?</div>
          {[
            ['🎯', 'Personalized to your role', 'Tailored questions for your target position and experience level'],
            ['⚡', 'Instant AI feedback', 'Get scored and reviewed after every single answer'],
            ['📈', 'Track your progress', 'See improvement over time with detailed analytics'],
            ['🏆', 'Proven results', '92% of users report improved interview confidence'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: 16, marginBottom: 28, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(108,99,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', marginBottom: 4 }}>{title}</div>
                <div style={{ color: '#8888aa', fontSize: '0.875rem', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
