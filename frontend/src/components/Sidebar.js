import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const NAV_ITEMS = [
  { path: '/dashboard', icon: '', label: 'Dashboard' },
  { path: '/chat', icon: '', label: 'AI Interview' },
  { path: '/sessions', icon: '', label: 'My Sessions' },
  { path: '/questions', icon: '', label: 'Question Bank' },
  { path: '/resume', icon: '', label: 'Resume Analysis' },
  { path: '/profile', icon: '', label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

 

  return (
    <aside style={{ width: 240, background: '#0a0a14', borderRight: `1px solid '#1e1e35' : '#d8d8ec'}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${isDark ? '#1e1e35' : '#d8d8ec'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem', color:  '#f0f0ff'  }}>
            <span style={{ color: '#6c63ff' }}>Interview</span>AI
          </div>
          <div style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color:  '#555570' , marginTop: 4 }}>Powered by Claude</div>
        </div>

        
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.path} to={item.path} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 10, marginBottom: 4,
            textDecoration: 'none', fontFamily: 'DM Sans', fontWeight: isActive ? 600 : 400, fontSize: '0.9rem',
            color: isActive ? '#f0f0ff' : '#8888aa',
            background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
            borderLeft: isActive ? '2px solid #6c63ff' : '2px solid transparent',
            transition: 'all 0.15s'
          })}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {/* Quick Start Button */}
        <div style={{ marginTop: 20, padding: '0 0 4px' }}>
          <button onClick={() => navigate('/chat')} style={{ width: '100%', background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', color: 'white', border: 'none', padding: '12px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
             New Interview
          </button>
        </div>
      </nav>

      {/* User info */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid #1e1e35' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: '#12121f', marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #00d4aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: '0.85rem', color: 'white', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', color: '#f0f0ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: '#555570', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: '1px solid #1e1e35', color: '#8888aa', padding: '10px', borderRadius: 10, fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6b6b44'; e.currentTarget.style.color = '#ff6b6b'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e35'; e.currentTarget.style.color = '#8888aa'; }}>
          ↩ Sign Out
        </button>
      </div>
    </aside>
  );
}