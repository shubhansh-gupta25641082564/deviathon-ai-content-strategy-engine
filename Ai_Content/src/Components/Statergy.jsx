import React, { useState } from 'react';

const PLATFORMS = [
  {
    name: 'YouTube',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="5" y="12" width="30" height="16" rx="3" fill="#FF0000"/>
        <polygon points="16,14 16,26 26,20" fill="white"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #232526 0%, #414345 100%)"
  },
  {
    name: 'Instagram',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <defs>
          <linearGradient id="instagramGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#fd1d1d"/>
            <stop offset="50%" stopColor="#fcb045"/>
            <stop offset="100%" stopColor="#833ab4"/>
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="24" height="24" rx="6" fill="url(#instagramGrad)"/>
        <circle cx="20" cy="20" r="6" fill="none" stroke="white" strokeWidth="2.5"/>
        <circle cx="26" cy="14" r="1.5" fill="white"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #fd1d1d 0%, #fcb045 40%, #833ab4 100%)"
  },
  {
    name: 'Trends',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <defs>
          <linearGradient id="trendsGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4286f4"/>
            <stop offset="33%" stopColor="#34e89e"/>
            <stop offset="67%" stopColor="#fd6e6a"/>
            <stop offset="100%" stopColor="#ffc837"/>
          </linearGradient>
        </defs>
        <rect x="7" y="28" width="3" height="5" rx="1.5" fill="url(#trendsGrad)"/>
        <rect x="13" y="23" width="3" height="10" rx="1.5" fill="url(#trendsGrad)"/>
        <rect x="19" y="13" width="3" height="20" rx="1.5" fill="url(#trendsGrad)"/>
        <rect x="25" y="7" width="3" height="26" rx="1.5" fill="url(#trendsGrad)"/>
        <rect x="31" y="17" width="3" height="16" rx="1.5" fill="url(#trendsGrad)"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg,#4286f4,#34e89e,#fd6e6a,#ffc837)"
  },
  {
    name: 'News',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="8" y="10" width="24" height="20" rx="3" fill="#252B48"/>
        <rect x="11" y="14" width="18" height="3" rx="1" fill="#efefef"/>
        <rect x="11" y="19" width="10" height="2" rx="1" fill="#bbb"/>
        <rect x="23" y="19" width="6" height="2" rx="1" fill="#ffc837"/>
        <rect x="11" y="23" width="18" height="2" rx="1" fill="#bbb"/>
        <rect x="11" y="27" width="14" height="2" rx="1" fill="#bbb"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg,#252B48,#444F70,#ffc837)"
  },
  {
    name: 'Reddit',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="18" fill="#FF4500"/>
        <circle cx="14" cy="18" r="2.5" fill="white"/>
        <circle cx="26" cy="18" r="2.5" fill="white"/>
        <path d="M 12 24 Q 20 28 28 24" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg,#FF5700 0%,#FFC837 100%)"
  }
];

const performance = [92, 78, 80, 85, 68];
const graphColors = ["#232526", "#fd1d1d", "#4286f4", "#252B48", "#FF5700"];

const sampleRows = [
  {
    hashtag: "#ViralShorts",
    headline: "Unlock Viral Growth Today!",
    music: "Trending Beat 2025",
    content: "Create a short reel under 1 min using witty captions & humor."
  },
  {
    hashtag: "#AIRevolution",
    headline: "How AI Transforms Content",
    music: "Futuristic Synth",
    content: "Post a carousel series showing AI before/after effects."
  },
  {
    hashtag: "#CreatorsUnite",
    headline: "Join the Creator Movement",
    music: "Upbeat Indie Pop",
    content: "Go live and host a Q&A about content creation."
  }
];

export default function StrategyInteractive() {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableRows, setTableRows] = useState([]);

  function selectPlatform(name) {
    setSelected(name);
  }

  function handleGenerate() {
    setLoading(true);
    setTableRows([]);
    setTimeout(() => {
      const idx = PLATFORMS.findIndex(pl => pl.name === selected);
      setTableRows(sampleRows.slice(idx, idx + 1));
      setLoading(false);
    }, 1400);
  }

  const minY = 50, maxY = 180;
  const minX = 55, step = 70;
  const graphPoints = performance.map((val, i) => {
    const x = minX + i * step;
    const y = maxY - ((val - 60) / 40) * (maxY - minY);
    return [x, y];
  });
  const polyline = graphPoints.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181B23] via-[#000000] to-[#000000] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto px-10 pt-8 pb-8 flex items-center bg-[#191c27] rounded-b-3xl shadow-lg mb-12">
        <div className="bg-white rounded-xl flex items-center justify-center w-16 h-16 shadow-lg mr-6">
          <span className="text-4xl font-extrabold text-[#191c27]">AI</span>
        </div>
        <h2 className="flex-1 text-left text-4xl font-extrabold text-white tracking-tight">AI Strategy Generator</h2>
      </div>

      <div className="w-full max-w-7xl mx-auto px-10 pb-24">
        <div className="text-[#A7B1C2] mb-10 text-lg text-center max-w-2xl mx-auto">
          Select your platform, generate an AI-driven content plan, and view insights and graphs!
        </div>

        <div className="flex gap-8 mb-14 flex-wrap justify-center w-full">
          {PLATFORMS.map(pl => (
            <button
              key={pl.name}
              className={`px-8 py-6 rounded-xl font-bold flex items-center gap-3 text-xl w-56 transition duration-200 border-none shadow-lg relative
                ${selected === pl.name ? "scale-105 ring-2 ring-blue-400" : ""}`
              }
              style={{ background: pl.gradient, color: "white" }}
              onClick={() => selectPlatform(pl.name)}
              aria-pressed={selected === pl.name}
              type="button"
            >
              {pl.icon}
              <span className="font-bold">{pl.name}</span>
            </button>
          ))}
        </div>

        <button
          className={`w-full max-w-xl mx-auto block py-5 rounded-2xl font-extrabold text-2xl mb-14 shadow-lg flex justify-center items-center border-2 transition
            ${!selected || loading
              ? "bg-[#2a2d38] text-[#5a5d68] cursor-not-allowed border-[#2a2d38]"
              : "bg-white text-black border-white hover:bg-gray-200"}`
          }
          disabled={!selected || loading}
          onClick={handleGenerate}
        >
          {loading ? <span className="animate-spin mr-2">🔄</span> : "✦ "}
          Generate
        </button>

        {/* Output table */}
        {tableRows.length > 0 && (
          <div className="w-full bg-[#181d23] border border-[#2a2d38] rounded-2xl p-10 mb-12 animate-fade-in shadow-xl">
            <div className="text-xl text-blue-400 font-bold mb-3 flex items-center gap-2">
              <svg className="w-7 h-7 text-blue-400 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="10" />
              </svg>
              Generated AI Strategy (Table)
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-white">
                <thead>
                  <tr className="bg-[#22252e]">
                    <th className="px-4 py-3 text-left font-bold">Hashtag</th>
                    <th className="px-4 py-3 text-left font-bold">Headline</th>
                    <th className="px-4 py-3 text-left font-bold">Trending Music</th>
                    <th className="px-4 py-3 text-left font-bold">Content</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr key={idx} className="border-t border-[#2a2d38]">
                      <td className="px-4 py-3 text-gray-200">{row.hashtag}</td>
                      <td className="px-4 py-3 text-gray-200">{row.headline}</td>
                      <td className="px-4 py-3 text-gray-200">{row.music}</td>
                      <td className="px-4 py-3 text-gray-200">{row.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Animated Line Graph & Engagement Table */}
        {tableRows.length > 0 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            <div className="rounded-2xl bg-[#22252e] p-9 shadow-xl flex flex-col items-center animate-fade-in border border-[#2a2d38]">
              <div className="text-lg font-bold text-white mb-4">Platform Performance</div>
              <svg width="420" height="240" viewBox="0 0 420 240" className="mt-4 mb-1">
                <rect x="35" y="30" width="350" height="150" rx="28" fill="#181d23"/>
                <polyline 
                  fill="none" 
                  stroke="#0080ff"
                  strokeWidth="4"
                  points={polyline}
                />
                {graphPoints.map(([x, y], idx) => (
                  <circle 
                    key={idx} 
                    cx={x} 
                    cy={y} 
                    r="10"
                    fill={graphColors[idx]} 
                    stroke="#fff"
                    strokeWidth="3"
                  />
                ))}
                {PLATFORMS.map((pl, idx) => (
                  <g key={pl.name}>
                    <text 
                      x={graphPoints[idx][0]} 
                      y={215} 
                      fontSize="14"
                      textAnchor="middle"
                      fill="#A7B1C2"
                      fontWeight="500"
                    >
                      {pl.name}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="flex gap-3 mt-6 flex-wrap justify-center">
                {PLATFORMS.map((pl, idx) => (
                  <div key={pl.name} className="flex items-center gap-2 text-sm text-[#A7B1C2]">
                    <span style={{ color: graphColors[idx] }}>{pl.icon}</span>
                    {pl.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-[#22252e] p-9 shadow-xl flex flex-col items-center animate-fade-in border border-[#2a2d38]">
              <div className="text-lg font-bold text-white mb-4">Engagement Breakdown</div>
              <svg width="180" height="180" viewBox="0 0 36 36" className="mb-7">
                <circle cx="18" cy="18" r="16" fill="#181d23" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#0099ff" strokeWidth="4" strokeDasharray="75 85" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#23B37A" strokeWidth="4" strokeDasharray="40 120" strokeDashoffset="-75" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#FBC531" strokeWidth="4" strokeDasharray="30 130" strokeDashoffset="-115" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#F23A50" strokeWidth="4" strokeDasharray="20 140" strokeDashoffset="-145" />
              </svg>
              <div className="grid grid-cols-2 gap-x-16 gap-y-2">
                <div className="text-blue-400 text-lg font-bold">52% Likes</div>
                <div className="text-green-400 text-lg font-bold">28% Shares</div>
                <div className="text-yellow-500 text-lg font-bold">14% Views</div>
                <div className="text-red-400 text-lg font-bold">6% Comments</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .animate-grow { animation: growHeight 1s cubic-bezier(.49,1.52,.64,1) both; }
        @keyframes growHeight { from { height: 30px; } }
        .animate-fade-in { animation: fadeInUp 1s cubic-bezier(.49,1.52,.64,1); }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}