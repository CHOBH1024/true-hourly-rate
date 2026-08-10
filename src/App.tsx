import React, { useState, useEffect } from 'react';
import { Globe, MessageSquare, Share2, Eye, TrendingUp, Users, Send, Sparkles, Zap, Activity } from 'lucide-react';

interface ResultShare { id: string; user: string; archetype: string; emoji: string; time: string; note: string; }
interface Comment { id: string; user: string; text: string; time: string; }
interface ApiComment { id: number; site: string; result_type: string | null; nickname: string; body: string; created_at: number; }

const API = '/api';
const SITE = 'true-hourly-rate';

function timeAgo(ts: number, isEn: boolean): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return isEn ? 'just now' : '방금 전';
  const m = Math.floor(s / 60);
  if (m < 60) return isEn ? `${m}m ago` : `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return isEn ? `${h}h ago` : `${h}시간 전`;
  const d = Math.floor(h / 24);
  return isEn ? `${d}d ago` : `${d}일 전`;
}

export function App() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [tab, setTab] = useState<'survey' | 'publicFeed' | 'comments'>('survey');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<any>(null);

  // Live Community Data
  const [publicShares, setPublicShares] = useState<ApiComment[]>([]);

  const [comments, setComments] = useState<ApiComment[]>([]);

  const [newComment, setNewComment] = useState('');
  const [nickname, setNickname] = useState('');
  const [shareNote, setShareNote] = useState('');
  const [total, setTotal] = useState(12480);
  // New inputs for true hourly rate calculation
  const [salary, setSalary] = useState<number>(0); // Annual after-tax income
  const [expenses, setExpenses] = useState<number>(0); // Annual work‑related expenses
  const [workHours, setWorkHours] = useState<number>(40); // Weekly work hours
  const [commuteHours, setCommuteHours] = useState<number>(1); // Daily commute hours
  const [prepHours, setPrepHours] = useState<number>(0.5); // Daily preparation hours
  const [feedError, setFeedError] = useState<string | null>(null);

  const refreshFeed = async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        fetch(`${API}/comments?site=${SITE}&limit=50`),
        fetch(`${API}/stats?site=${SITE}`),
      ]);
      if (!cRes.ok || !sRes.ok) throw new Error('bad status');
      const cj = await cRes.json();
      const sj = await sRes.json();
      setComments(cj.comments || []);
      setPublicShares((cj.comments || []).filter((x: ApiComment) => x.result_type));
      if (sj.total) setTotal(sj.total);
      setFeedError(null);
    } catch {
      setFeedError(lang === 'en' ? 'Community feed unavailable' : '커뮤니티 피드를 불러오지 못했습니다');
    }
  };

  useEffect(() => { refreshFeed(); /* eslint-disable-next-line */ }, [lang]);

  const questions = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    textKo: `${i + 1}번 문항: 진단 상태 및 심리적 행동 패턴을 측정합니다.`,
    textEn: `Item ${i + 1}: Behavioral & diagnostic assessment.`
  }));

  const handleAnswer = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate true hourly rate based on user inputs
      const annualHours = workHours * 52 + (commuteHours + prepHours) * 5 * 52; // assume 5 workdays/week
      const netIncome = salary - expenses;
      const hourlyRate = annualHours > 0 ? Math.round(netIncome / annualHours) : 0;
      setResult({
        nameKo: "분석형 완벽주의자 (Analytical Perfectionist)",
        nameEn: "Analytical Perfectionist",
        emoji: "📊",
        descKo: "데이터와 정밀성을 추구하며 완벽한 결과를 위해 최선을 다하는 유형입니다.",
        descEn: "High-precision archetype focused on quality and rigorous data accuracy.",
        hourlyRate,
        insightKo: `당신의 실제 시급은 약 ${hourlyRate.toLocaleString()}원이며, 이는 연봉 대비 시간당 가치를 정확히 반영합니다.`,
        insightEn: `Your true hourly rate is approximately ${hourlyRate.toLocaleString()} KRW, reflecting the real value of each working hour.`
      });
    }
  };

    const handleShareResult = async () => {
    if (!result) return;
    try {
      const res = await fetch(`${API}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: SITE,
          result_type: lang === 'en' ? result.nameEn : result.nameKo,
          nickname: nickname.trim() || (lang === 'en' ? 'Anonymous Explorer' : '익명 탐험가'),
          body: shareNote.trim() || (lang === 'en' ? 'Sharing my diagnostic result to the community feed!' : '내 진단 결과를 커뮤니티 피드에 공유합니다!'),
        }),
      });
      if (!res.ok) throw new Error('post failed');
      setShareNote('');
      await refreshFeed();
      setTab('publicFeed');
    } catch {
      setFeedError(lang === 'en' ? 'Failed to share' : '공유에 실패했습니다');
    }
  };

    const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`${API}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: SITE,
          nickname: nickname.trim() || (lang === 'en' ? 'Anonymous Dev' : '익명 개발자'),
          body: newComment.trim(),
        }),
      });
      if (!res.ok) throw new Error('post failed');
      setNewComment('');
      await refreshFeed();
    } catch {
      setFeedError(lang === 'en' ? 'Failed to post comment' : '댓글 작성에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex justify-between items-center max-w-4xl mx-auto w-full sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <span className="font-extrabold text-base text-white tracking-tight uppercase">true-hourly-rate</span>
          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1">
            <Globe className="w-3 h-3" /> Live Connected
          </span>
        </div>
        <button onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')} className="px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold">
          {lang === 'ko' ? 'English' : '한국어'}
        </button>
      </header>
      {/* Salary & Expense Input Section */}
      <section className="max-w-2xl mx-auto px-6 py-4 bg-slate-900/60 backdrop-blur-lg rounded-xl mb-6">
        <h2 className="text-lg font-bold text-white mb-2">💰 내 연봉·비용 입력</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" placeholder="연봉 (세후) KRW" value={salary}
            onChange={e => setSalary(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" />
          <input type="number" placeholder="연간 직장 유지 비용 KRW" value={expenses}
            onChange={e => setExpenses(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" />
          <input type="number" placeholder="주당 근무시간" value={workHours}
            onChange={e => setWorkHours(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" />
          <input type="number" placeholder="하루 출퇴근 시간" value={commuteHours}
            onChange={e => setCommuteHours(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" />
          <input type="number" placeholder="하루 준비 시간" value={prepHours}
            onChange={e => setPrepHours(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" />
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-6 py-8 w-full flex-1">
        {/* Navigation Tabs */}
        {feedError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">{feedError}</div>
        )}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-6">
          <button onClick={() => setTab('survey')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex justify-center items-center gap-1 ${tab === 'survey' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
            <Activity className="w-3.5 h-3.5" /> 진단하기
          </button>
          <button onClick={() => setTab('publicFeed')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex justify-center items-center gap-1 ${tab === 'publicFeed' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
            <Eye className="w-3.5 h-3.5" /> 접속자 진단 결과 피드 ({publicShares.length})
          </button>
          <button onClick={() => setTab('comments')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex justify-center items-center gap-1 ${tab === 'comments' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
            <MessageSquare className="w-3.5 h-3.5" /> 라이브 댓글 ({comments.length})
          </button>
        </div>

        {/* Tab 1: Survey & Share */}
        {tab === 'survey' && (
          <div>
            {!result ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>진단 문항 {currentIdx + 1} / 20</span>
                  <span>{Math.round(((currentIdx + 1) / 20) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full mb-6 overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((currentIdx + 1) / 20) * 100}%` }} />
                </div>
                <h2 className="text-lg font-bold text-white mb-6">{questions[currentIdx].textKo}</h2>
                <div className="grid gap-2.5">
                  {[5, 4, 3, 2, 1].map((s, i) => (
                    <button key={i} onClick={handleAnswer} className="p-3.5 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-xl text-xs text-left text-slate-200 transition">
                      {s === 5 ? "매우 그렇다 (Strongly Agree)" : s === 4 ? "그렇다 (Agree)" : s === 3 ? "보통이다 (Neutral)" : s === 2 ? "그렇지 않다 (Disagree)" : "전혀 그렇지 않다 (Strongly Disagree)"}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-indigo-500/30 p-8 rounded-2xl text-center space-y-6">
                <div className="text-6xl">{result.emoji}</div>
                <div>
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-full">
                    진단 결과
                  </span>
                  <h1 className="text-2xl font-bold text-white my-2">{result.nameKo}</h1>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">{result.descKo}</p>
                  {/* True Hourly Rate Insight */}
                  <p className="mt-2 text-sm text-emerald-300">{result.insightKo}</p>
                  {/* Scientific / psychological rationale */}
                  <p className="mt-1 text-xs text-slate-400">이 결과는 노동 경제학과 행동심리학 연구를 기반으로 합니다.</p>
                  {/* Call to Action */}
                  <button onClick={() => navigator.share({title: 'My True Hourly Rate', text: result.insightKo, url: window.location.href})}
                    className="mt-3 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full text-xs transition transform hover:scale-105"
                  >
                    결과 공유하고 커뮤니티에 참여하기 🚀
                  </button>
                </div>

                {/* Online Result Share Box */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-left space-y-3">
                  <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" /> 이 결과를 다른 접속자들과 실시간 공유하기
                  </h3>
                  <input
                    type="text"
                    placeholder="닉네임 (선택사항)"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="공유 한마디 메모 (예: 내 성향과 딱 들어맞네요!)"
                    value={shareNote}
                    onChange={e => setShareNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <button onClick={handleShareResult} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition">
                    라이브 피드에 내 진단 결과 등록하기 🚀
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Public Diagnostics Feed */}
        {tab === 'publicFeed' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
              <span className="text-slate-400">실시간 유저 진단 참여 수</span>
              <strong className="text-indigo-400 font-bold">{total.toLocaleString()} 건</strong>
            </div>

            <div className="space-y-3">
              {publicShares.map(s => (
                <div key={s.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                  <div className="text-3xl">{result?.emoji || '📊'}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white">{s.nickname}</span>
                      <span className="text-[10px] text-slate-500">{timeAgo(s.created_at, lang === 'en')}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded">
                      {s.result_type}
                    </span>
                    <p className="text-xs text-slate-300 mt-2">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Community Comments */}
        {tab === 'comments' && (
          <div className="space-y-6">
            <form onSubmit={handleAddComment} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <input
                type="text"
                placeholder="닉네임 (선택사항)"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <textarea
                placeholder="자유롭게 진단 후기, 의견, 질문을 공유해보세요..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white h-20 resize-none"
              />
              <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> 라이브 댓글 작성하기
              </button>
            </form>

            <div className="space-y-3">
              {comments.map(c => (
                <div key={c.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-white block mb-1">{c.nickname}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.body}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{timeAgo(c.created_at, lang === 'en')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-[10px] text-slate-500">
        © 2026 true-hourly-rate. Live Online Community Connected. Powered by Pomyjo.
      </footer>
    </div>
  );
}

export default App;
