import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
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

  const handleForgotPassword = async () => {
    if (!form.email) {
      toast.error('Enter your email first');
      return;
    }
    try {
      await resetPassword(form.email);
      toast.success('Password reset email sent!');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07070d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(ellipse, rgba(108,99,255,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      
      <div style={{ width: '100%', maxWidth: 440, animation: 'fadeIn 0.5s ease-out', position: 'relative' }}>
        <Link to="/" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: '#f0f0ff', marginBottom: 48, display: 'block', textAlign: 'center' }}>
          <span style={{ color: '#6c63ff' }}>Interview</span>AI
        </Link>

        <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 24, padding: '40px' }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: '#f0f0ff', marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: '#8888aa', marginBottom: 32, fontSize: '0.95rem' }}>Continue your interview preparation</p>

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoading} style={{ width: '100%', background: '#0e0e1a', border: '1px solid #2d2d52', color: '#f0f0ff', padding: '13px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 500, cursor: googleLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20, transition: 'all 0.2s' }}
            onMouseEnter={e => { if (!googleLoading) e.currentTarget.style.borderColor = '#6c63ff'; }}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2d2d52'}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#1e1e35' }} />
            <span style={{ color: '#555570', fontSize: '0.8rem', fontFamily: 'Space Mono' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#1e1e35' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.85rem', marginBottom: 8 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required style={{ background: '#0e0e1a' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ color: '#8888aa', fontSize: '0.85rem' }}>Password</label>
                <span onClick={handleForgotPassword} style={{ color: '#6c63ff', fontSize: '0.8rem', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required style={{ background: '#0e0e1a' }} />
            </div>
            <button type="submit" disabled={loading} style={{ background: loading ? '#4a4466' : '#6c63ff', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: 4, boxShadow: loading ? 'none' : '0 8px 24px rgba(108,99,255,0.4)' }}>
              {loading ? '⏳ Signing in...' : '→ Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#8888aa', marginTop: 24, fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#6c63ff', fontWeight: 600 }}>Create one free</Link>
        </p>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
