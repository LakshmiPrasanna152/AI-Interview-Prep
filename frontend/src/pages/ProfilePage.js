import React, { useState } from 'react';
import { useAuth, API } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

const SKILLS_LIST = ['JavaScript','Python','Java','C++','React','Node.js','SQL','MongoDB','AWS','Docker','Kubernetes','Machine Learning','Data Structures','Algorithms','System Design','TypeScript','GraphQL','Redis','Git','CI/CD'];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || '',
    experience: user?.experience || 'fresher',
    skills: user?.skills || [],
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [tab, setTab] = useState('profile');

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await API.put('/user/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.new.length < 6) return toast.error('Password must be at least 6 characters');
    setChangingPw(true);
    try {
      // Firebase handles password changes via email reset
      throw new Error('Password changes are handled via Firebase. Use the reset password link on the sign-in page.');
      toast.success('Password changed!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) { toast.error(err.message || err.response?.data?.error || 'Password change failed'); }
    finally { setChangingPw(false); }
  };

  const toggleSkill = (skill) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter(s => s !== skill) : [...p.skills, skill]
    }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070d' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: 760 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: '#f0f0ff', marginBottom: 4 }}>Profile Settings</h1>
          <p style={{ color: '#8888aa' }}>Manage your account and preferences</p>
        </div>

        {/* Avatar */}
        <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 20, padding: '24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: 'white', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem', color: '#f0f0ff' }}>{user?.name}</div>
            <div style={{ color: '#8888aa', fontSize: '0.875rem' }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#6c63ff', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontFamily: 'Space Mono' }}>
                {user?.experience || 'fresher'}
              </span>
              {user?.targetRole && (
                <span style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontFamily: 'Space Mono' }}>
                  {user.targetRole}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Sessions', value: user?.stats?.totalSessions || 0, icon: '📋', color: '#6c63ff' },
            { label: 'Questions', value: user?.stats?.totalQuestions || 0, icon: '❓', color: '#00d4aa' },
            { label: 'Avg Score', value: `${user?.stats?.avgScore || 0}/10`, icon: '⭐', color: '#ffd93d' },
          ].map(s => (
            <div key={s.label} style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem', color: s.color }}>{s.value}</div>
              <div style={{ color: '#8888aa', fontSize: '0.75rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#12121f', border: '1px solid #1e1e35', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
          {[['profile','Profile'],['security','Security']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', background: tab === t ? '#6c63ff' : 'transparent', color: tab === t ? 'white' : '#8888aa', transition: 'all 0.2s' }}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 20, padding: '28px', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', color: '#8888aa', fontSize: '0.8rem', marginBottom: 8, fontFamily: 'Space Mono' }}>FULL NAME</label>
                <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#8888aa', fontSize: '0.8rem', marginBottom: 8, fontFamily: 'Space Mono' }}>TARGET ROLE</label>
                <input className="input-field" value={form.targetRole} onChange={e => setForm(p => ({ ...p, targetRole: e.target.value }))} placeholder="e.g. Software Engineer" />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.8rem', marginBottom: 8, fontFamily: 'Space Mono' }}>EXPERIENCE LEVEL</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['fresher','junior','mid','senior','lead'].map(e => (
                  <button key={e} onClick={() => setForm(p => ({ ...p, experience: e }))} style={{ padding: '8px 18px', borderRadius: 10, border: `1px solid ${form.experience === e ? '#6c63ff' : '#1e1e35'}`, background: form.experience === e ? 'rgba(108,99,255,0.15)' : 'transparent', color: form.experience === e ? '#f0f0ff' : '#8888aa', fontFamily: 'DM Sans', fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', color: '#8888aa', fontSize: '0.8rem', marginBottom: 12, fontFamily: 'Space Mono' }}>SKILLS ({form.skills.length} selected)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SKILLS_LIST.map(skill => (
                  <button key={skill} onClick={() => toggleSkill(skill)} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${form.skills.includes(skill) ? '#6c63ff' : '#1e1e35'}`, background: form.skills.includes(skill) ? 'rgba(108,99,255,0.2)' : 'transparent', color: form.skills.includes(skill) ? '#f0f0ff' : '#8888aa', fontFamily: 'DM Sans', fontWeight: form.skills.includes(skill) ? 600 : 400, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving} style={{ background: saving ? '#4a4466' : '#6c63ff', color: 'white', border: 'none', padding: '13px 32px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: saving ? 'none' : '0 6px 20px rgba(108,99,255,0.4)' }}>
              {saving ? '⏳ Saving...' : '💾 Save Profile'}
            </button>
          </div>
        )}

        {tab === 'security' && (
          <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 20, padding: '28px', animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', marginBottom: 20 }}>Change Password</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
              {[['current','Current Password'],['new','New Password'],['confirm','Confirm New Password']].map(([k,l]) => (
                <div key={k}>
                  <label style={{ display: 'block', color: '#8888aa', fontSize: '0.8rem', marginBottom: 8, fontFamily: 'Space Mono' }}>{l.toUpperCase()}</label>
                  <input type="password" className="input-field" value={passwords[k]} onChange={e => setPasswords(p => ({ ...p, [k]: e.target.value }))} placeholder="••••••••" />
                </div>
              ))}
              <button onClick={changePassword} disabled={changingPw} style={{ background: changingPw ? '#4a4466' : '#6c63ff', color: 'white', border: 'none', padding: '13px 24px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 700, cursor: changingPw ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: 8 }}>
                {changingPw ? '⏳ Changing...' : '🔐 Change Password'}
              </button>
            </div>
          </div>
        )}
      </main>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }`}</style>
    </div>
  );
}
