import React, { useState } from 'react';

const PLATFORMS = [
  { name: 'YouTube', icon: '🎬' },
  { name: 'Facebook', icon: '📘' },
  { name: 'Instagram', icon: '📸' },
  { name: 'Twitter', icon: '🐦' },
  { name: 'TikTok', icon: '🎵' }
];

const performance = [92, 85, 78, 68, 80];
const graphColors = ["#0099ff", "#5865F2", "#FBC531", "#F23A50", "#23B37A"];

export default function StrategyInteractive() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  function togglePlatform(name) {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  }

  function handleGenerate() {
    setLoading(true); setOutput('');
    setTimeout(() => {
      setOutput(`AI Strategy:
- Platforms: ${selected.join(', ')}
- Focus on visual content, reels, and shorts for Instagram & TikTok.
- Boost engagement on Facebook with Q&As and polls.
- Optimize YouTube SEO and cross-post highlights to Twitter.
- Schedule: 1 long-form/week, 4-5 shorts, weekly engagement check-in.`);
      setLoading(false);
    }, 1400);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#19202a] via-[#272a38] to-[#243346] flex flex-col items-center px-0 py-12">
      <div className="w-full max-w-7xl mx-auto bg-[#20232b] border border-white/10 rounded-3xl shadow-2xl p-14 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-2 text-white">AI Strategy Generator</h1>
        <div className="text-gray-400 mb-10 text-lg text-center max-w-2xl">
          Select your platforms, generate an AI-driven content plan, and view insights and graphs!
        </div>
        <div className="flex gap-8 mb-14 flex-wrap justify-center w-full">
          {PLATFORMS.map(pl => (
            <button key={pl.name}
              className={`px-8 py-5 rounded-xl font-bold flex items-center gap-2 text-xl w-56
                transition duration-200 border shadow-lg
                text-black
                ${selected.includes(pl.name)
                  ? "bg-blue-100 border-blue-300 scale-105"
                  : "bg-[#f8f9fb] border-[#cfd8ea] hover:bg-blue-50"}`}
              onClick={() => togglePlatform(pl.name)}
              aria-pressed={selected.includes(pl.name)}
            >
              <span className="text-2xl">{pl.icon}</span>
              {pl.name}
            </button>
          ))}
        </div>
        {/* Generate Button with BLACK TEXT */}
        <button
          className={`w-full max-w-xl py-5 rounded-2xl font-extrabold text-2xl mb-14 shadow-lg flex justify-center items-center border-2 transition
            ${selected.length === 0 || loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
              : "bg-white text-black border-gray-300 hover:bg-gray-200"}`}
          disabled={selected.length === 0 || loading}
          onClick={handleGenerate}
        >
          {loading ? <span className="animate-spin mr-2">🔄</span> : null}
          Generate
        </button>
        {/* Output block */}
        {output && (
          <div className="w-full bg-[#1e212e] border border-white/10 rounded-2xl p-10 mb-12 animate-fade-in shadow-xl">
            <div className="text-xl text-blue-400 font-bold mb-3 flex items-center gap-2">
              <svg className="w-7 h-7 text-blue-400 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="10"/>
              </svg>
              Generated AI Strategy
            </div>
            <pre className="text-lg text-white whitespace-pre-line">{output}</pre>
          </div>
        )}
        {/* Animated Graphs */}
        {output && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            {/* Platform Performance Bars */}
            <div className="rounded-2xl bg-[#242842] p-9 shadow-lg flex flex-col items-center animate-fade-in">
              <div className="text-lg font-bold text-white mb-2">Platform Performance</div>
              <div className="flex flex-wrap gap-5 justify-center mt-5">
                {PLATFORMS.map((pl, idx) => (
                  <div key={pl.name} className="flex flex-col items-center">
                    <div
                      style={{
                        height: `${performance[idx]}px`,
                        background: graphColors[idx] + "cc"
                      }}
                      className="w-10 rounded-xl shadow-lg animate-grow origin-bottom"
                    />
                    <span className="mt-2 text-base text-gray-200">{pl.icon}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                {PLATFORMS.map((pl, idx) => (
                  <div key={pl.name} className="flex items-center gap-2 text-sm text-gray-200">
                    <span style={{ color: graphColors[idx] }}>{pl.icon}</span>
                    {pl.name}
                  </div>
                ))}
              </div>
            </div>
            {/* Donut Engagement Chart */}
            <div className="rounded-2xl bg-[#242842] p-9 shadow-lg flex flex-col items-center animate-fade-in">
              <div className="text-lg font-bold text-white mb-4">Engagement Breakdown</div>
              <svg width="180" height="180" viewBox="0 0 36 36" className="mb-7">
                <circle cx="18" cy="18" r="16" fill="#1c1e2d"/>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#5865F2" strokeWidth="4" strokeDasharray="75 85" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#23B37A" strokeWidth="4" strokeDasharray="40 120" strokeDashoffset="-75" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#FBC531" strokeWidth="4" strokeDasharray="30 130" strokeDashoffset="-115" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#F23A50" strokeWidth="4" strokeDasharray="20 140" strokeDashoffset="-145" />
              </svg>
              <div className="grid grid-cols-2 gap-x-16 gap-y-2">
                <div className="text-blue-400 text-lg font-bold">52% Likes</div>
                <div className="text-green-300 text-lg font-bold">28% Shares</div>
                <div className="text-yellow-400 text-lg font-bold">14% Views</div>
                <div className="text-red-400 text-lg font-bold">6% Comments</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* CSS Animations */}
      <style>{`
        .animate-grow { animation: growHeight 1s cubic-bezier(.49,1.52,.64,1) both; }
        @keyframes growHeight { from { height: 30px; } }
        .animate-fade-in { animation: fadeInUp 1s cubic-bezier(.49,1.52,.64,1); }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
