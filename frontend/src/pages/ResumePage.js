import React, { useState, useRef } from 'react';
import { API } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [tab, setTab] = useState('upload');
  const fileRef = useRef();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      await API.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Resume uploaded!');
      if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
      } else {
        setResumeText(`[File uploaded: ${file.name}]`);
      }
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleTextUpload = async () => {
    if (!resumeText.trim()) return toast.error('Please paste your resume text');
    setUploading(true);
    try {
      await API.post('/resume/upload', { text: resumeText });
      toast.success('Resume saved!');
    } catch { toast.error('Failed to save resume'); }
    finally { setUploading(false); }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return toast.error('Please add your resume first');
    setAnalyzing(true);
    try {
      const res = await API.post('/ai/analyze-resume', { resumeText, targetRole });
      setAnalysis(res.data.analysis);
      setTab('results');
    } catch { toast.error('Analysis failed'); }
    finally { setAnalyzing(false); }
  };

  const ScoreArc = ({ score }) => {
    const pct = score / 100;
    const r = 54; 
    const circumference = Math.PI * r;
    const offset = circumference * (1 - pct);
    return (
      <svg width="128" height="80" viewBox="0 0 128 80">
        <path d={`M 10 70 A ${r} ${r} 0 0 1 118 70`} fill="none" stroke="#1e1e35" strokeWidth="10" strokeLinecap="round"/>
        <path d={`M 10 70 A ${r} ${r} 0 0 1 118 70`} fill="none" stroke={score >= 80 ? '#00d4aa' : score >= 60 ? '#ffd93d' : '#ff6b6b'} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }}/>
        <text x="64" y="68" textAnchor="middle" fill="#f0f0ff" fontSize="22" fontFamily="Syne" fontWeight="800">{score}</text>
        <text x="64" y="82" textAnchor="middle" fill="#8888aa" fontSize="9" fontFamily="Space Mono">/ 100</text>
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070d' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: 900 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: '#f0f0ff', marginBottom: 4 }}>Resume Analysis</h1>
          <p style={{ color: '#8888aa' }}>Upload your resume for AI-powered gap analysis and personalized preparation</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#12121f', border: '1px solid #1e1e35', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
          {[['upload',' Upload Resume'],['results',' Analysis Results']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', background: tab === t ? '#6c63ff' : 'transparent', color: tab === t ? 'white' : '#8888aa', transition: 'all 0.2s' }}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'upload' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Drag/drop */}
            <div onClick={() => fileRef.current.click()} style={{ border: '2px dashed #2d2d52', borderRadius: 20, padding: '48px', textAlign: 'center', cursor: 'pointer', marginBottom: 24, transition: 'all 0.2s', background: '#12121f' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.background = 'rgba(108,99,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d2d52'; e.currentTarget.style.background = '#12121f'; }}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#6c63ff'; }}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) { fileRef.current.files = e.dataTransfer.files; handleFileUpload({ target: { files: [f] } }); } }}>
              <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>{uploading ? '⏳' : '📁'}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', marginBottom: 8 }}>{uploading ? 'Uploading...' : 'Drop your resume here'}</div>
              <div style={{ color: '#8888aa', fontSize: '0.875rem' }}>PDF, TXT, DOC files up to 5MB</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: '#1e1e35' }} />
              <span style={{ color: '#555570', fontFamily: 'Space Mono', fontSize: '0.75rem' }}>OR PASTE TEXT</span>
              <div style={{ flex: 1, height: 1, background: '#1e1e35' }} />
            </div>

            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume content here..." rows={12} style={{ width: '100%', background: '#12121f', border: '1px solid #2d2d52', borderRadius: 16, padding: '18px', color: '#f0f0ff', fontFamily: 'DM Sans', fontSize: '0.9rem', resize: 'vertical', lineHeight: 1.6, marginBottom: 16 }} />

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#8888aa', fontSize: '0.8rem', marginBottom: 8, fontFamily: 'Space Mono' }}>TARGET ROLE (optional)</label>
                <input className="input-field" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Software Engineer at Google" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleTextUpload} disabled={uploading} style={{ background: '#12121f', border: '1px solid #2d2d52', color: '#f0f0ff', padding: '13px 24px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                Save Resume
              </button>
              <button onClick={analyzeResume} disabled={analyzing || !resumeText.trim()} style={{ background: analyzing ? '#4a4466' : 'linear-gradient(135deg, #6c63ff, #00d4aa)', color: 'white', border: 'none', padding: '13px 32px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 700, cursor: analyzing ? 'not-allowed' : 'pointer', boxShadow: analyzing ? 'none' : '0 6px 24px rgba(108,99,255,0.4)', transition: 'all 0.2s' }}>
                {analyzing ? '⏳ Analyzing with AI...' : ' Analyze Resume'}
              </button>
            </div>
          </div>
        )}

        {tab === 'results' && analysis && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Score card */}
            <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 20, padding: '28px', marginBottom: 20, display: 'flex', gap: 32, alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <ScoreArc score={analysis.score || 0} />
                <div style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: '#8888aa', marginTop: 8 }}>RESUME SCORE</div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: '#f0f0ff', marginBottom: 8 }}>Overall Assessment</h3>
                <p style={{ color: '#c0c0d8', lineHeight: 1.7, fontSize: '0.93rem' }}>{analysis.recommendation}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Strengths */}
              <div style={{ background: '#12121f', border: '1px solid #00d4aa33', borderRadius: 16, padding: '20px' }}>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#00d4aa', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>Strengths</h4>
                {(analysis.strengths || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, color: '#c0c0d8', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    <span style={{ color: '#00d4aa', flexShrink: 0 }}>•</span>{s}
                  </div>
                ))}
              </div>
              {/* Weaknesses */}
              <div style={{ background: '#12121f', border: '1px solid #ff6b6b33', borderRadius: 16, padding: '20px' }}>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#ff6b6b', marginBottom: 14 }}> Gaps & Weaknesses</h4>
                {(analysis.weaknesses || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, color: '#c0c0d8', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    <span style={{ color: '#ff6b6b', flexShrink: 0 }}>•</span>{s}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Missing Skills */}
              <div style={{ background: '#12121f', border: '1px solid #ffd93d33', borderRadius: 16, padding: '20px' }}>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#ffd93d', marginBottom: 14 }}> Missing Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(analysis.missingSkills || []).map((s, i) => (
                    <span key={i} style={{ background: '#ffd93d22', border: '1px solid #ffd93d44', color: '#ffd93d', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontFamily: 'Space Mono' }}>{s}</span>
                  ))}
                </div>
              </div>
              {/* Suggested Interview Topics */}
              <div style={{ background: '#12121f', border: '1px solid #6c63ff33', borderRadius: 16, padding: '20px' }}>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#6c63ff', marginBottom: 14 }}> Practice These Topics</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(analysis.suggestedTopics || []).map((t, i) => (
                    <span key={i} style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#6c63ff', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontFamily: 'Space Mono' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ATS Tips */}
            <div style={{ background: '#12121f', border: '1px solid #1e1e35', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', marginBottom: 14 }}> ATS Optimization Tips</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(analysis.atsTips || []).map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, color: '#c0c0d8', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    <span style={{ color: '#00d4aa', flexShrink: 0 }}>→</span>{t}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setTab('upload')} style={{ background: 'transparent', border: '1px solid #2d2d52', color: '#8888aa', padding: '12px 24px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer' }}>
              ← Re-analyze another resume
            </button>
          </div>
        )}

        {tab === 'results' && !analysis && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}></div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f0ff', marginBottom: 8 }}>No analysis yet</h3>
            <p style={{ color: '#8888aa', marginBottom: 20 }}>Upload your resume and run an analysis first</p>
            <button onClick={() => setTab('upload')} style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 12, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer' }}>
              Upload Resume
            </button>
          </div>
        )}
      </main>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }`}</style>
    </div>
  );
}
