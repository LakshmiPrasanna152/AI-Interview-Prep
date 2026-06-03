const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { run, get, all } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Call OpenRouter (Claude)
async function callClaude(messages, systemPrompt) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'InterviewAI'
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      max_tokens: 1500,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function buildSystemPrompt(type, role, difficulty, resumeText) {
  const roleStr = role ? ` for the role of ${role}` : '';
  const resumeCtx = resumeText
    ? `\n\nCandidate Resume:\n${resumeText.substring(0, 2000)}`
    : '';

  const baseInstructions = `You are a professional AI interviewer conducting a ${type} interview${roleStr}. Difficulty: ${difficulty}.${resumeCtx}

Rules:
- Ask ONE clear interview question per turn.
- After the candidate answers, provide:
  1. A score out of 10 (format: "Score: X/10")
  2. Brief constructive feedback (2-3 sentences)
  3. Then ask the next question
- If asked for a model/ideal answer, provide a detailed, well-structured example answer.
- Keep responses professional, encouraging, and realistic.
- Adapt difficulty based on the candidate's performance.`;

  if (type === 'technical') return baseInstructions + '\n- Focus on DSA, coding patterns, CS fundamentals, system concepts.';
  if (type === 'hr') return baseInstructions + '\n- Focus on cultural fit, motivations, teamwork, and situational questions.';
  if (type === 'system-design') return baseInstructions + '\n- Focus on scalability, architecture, trade-offs, and design patterns.';
  if (type === 'behavioral') return baseInstructions + '\n- Use the STAR method. Focus on past experiences and behavioral competencies.';
  return baseInstructions + '\n- Mix technical, behavioral, and situational questions for a full mock interview.';
}

function extractScore(text) {
  const match = text.match(/Score:\s*(\d+(?:\.\d+)?)\/10/i);
  return match ? parseFloat(match[1]) : null;
}

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { sessionId, message, type = 'technical', role = '', difficulty = 'medium' } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required' });

    let session = null;
    let currentSessionId = sessionId;
    let history = [];

    if (sessionId) {
      session = get('SELECT * FROM sessions WHERE id = ? AND user_id = ?', [sessionId, req.user.id]);
      if (session) {
        history = JSON.parse(session.messages || '[]');
      }
    }

    // Build messages for Claude
    const claudeMessages = [
      ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: message }
    ];

    const systemPrompt = buildSystemPrompt(type, role, difficulty, req.user.resumeText);
    const aiResponse = await callClaude(claudeMessages, systemPrompt);
    const score = extractScore(aiResponse);

    // Save to DB
    const newUserMsg = { role: 'user', content: message, timestamp: new Date().toISOString() };
    const newAiMsg = { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString(), metadata: { score } };
    const updatedHistory = [...history, newUserMsg, newAiMsg];

    const questionsAsked = updatedHistory.filter(m => m.role === 'assistant').length;
    const scores = updatedHistory.filter(m => m.metadata?.score != null).map(m => m.metadata.score);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    if (!currentSessionId) {
      currentSessionId = uuidv4();
      run(
        'INSERT INTO sessions (id, user_id, title, type, role, difficulty, messages, score, questions_asked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          currentSessionId,
          req.user.id,
          `${type.charAt(0).toUpperCase() + type.slice(1)} Interview${role ? ' — ' + role : ''}`,
          type, role, difficulty,
          JSON.stringify(updatedHistory),
          avgScore,
          questionsAsked
        ]
      );
      // Update user stats
      run('UPDATE users SET stats_total_sessions = stats_total_sessions + 1 WHERE id = ?', [req.user.id]);
    } else {
      run(
        'UPDATE sessions SET messages = ?, score = ?, questions_asked = ? WHERE id = ?',
        [JSON.stringify(updatedHistory), avgScore, questionsAsked, currentSessionId]
      );
    }

    // Update questions stat
    run('UPDATE users SET stats_total_questions = stats_total_questions + 1 WHERE id = ?', [req.user.id]);

    res.json({
      message: aiResponse,
      sessionId: currentSessionId,
      score,
      sessionScore: Math.round(avgScore * 10) / 10,
      questionsAsked
    });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: err.message || 'AI request failed' });
  }
});

// POST /api/ai/report
router.post('/report', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const session = get('SELECT * FROM sessions WHERE id = ? AND user_id = ?', [sessionId, req.user.id]);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const history = JSON.parse(session.messages || '[]');
    const transcript = history.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n\n');

    const reportPrompt = `Analyze this interview transcript and return a JSON report with this exact structure:
{
  "overallScore": <number 0-100>,
  "grade": "<A+/A/B+/B/C/D>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "technicalSkills": { "score": <0-100>, "feedback": "<1 sentence>" },
  "communication": { "score": <0-100>, "feedback": "<1 sentence>" },
  "problemSolving": { "score": <0-100>, "feedback": "<1 sentence>" },
  "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
  "summary": "<2-3 sentence overall summary>",
  "readyForInterview": <true/false>
}
Return ONLY the JSON object, no markdown, no extra text.

Transcript:
${transcript.substring(0, 6000)}`;

    const raw = await callClaude([{ role: 'user', content: reportPrompt }], 'You are an expert interview coach generating structured performance reports.');
    let report;
    try {
      report = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      report = {
        overallScore: Math.round(session.score * 10),
        grade: session.score >= 9 ? 'A+' : session.score >= 8 ? 'A' : session.score >= 7 ? 'B+' : session.score >= 6 ? 'B' : 'C',
        strengths: ['Good effort throughout the session'],
        improvements: ['Continue practicing regularly'],
        technicalSkills: { score: 70, feedback: 'Solid foundation shown.' },
        communication: { score: 75, feedback: 'Clear and structured responses.' },
        problemSolving: { score: 70, feedback: 'Good approach to problems.' },
        recommendations: ['Practice daily', 'Review core concepts', 'Do mock interviews'],
        summary: 'Overall a good interview performance. Keep practicing.',
        readyForInterview: session.score >= 7
      };
    }

    // Update session status
    run('UPDATE sessions SET status = ? WHERE id = ?', ['completed', sessionId]);

    res.json({ report });
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate report' });
  }
});

module.exports = router;
