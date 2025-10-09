import React from 'react';

export default function NoTrendFound() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1d23] via-[#232733] to-[#22252c] flex items-center justify-center">
      <div className="w-full max-w-7xl flex flex-col items-center py-32 px-4 md:px-20">
        {/* Light blue-black illustration */}
        <div className="mb-14">
          <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
            <ellipse cx="120" cy="180" rx="100" ry="30" fill="#2d3440" opacity="0.20"/>
            <circle cx="120" cy="104" r="80" fill="#232637" />
            <rect x="84" y="154" width="72" height="18" rx="9" fill="#3a4967"/>
            <ellipse cx="120" cy="93" rx="40" ry="22" fill="#28395c" />
            <ellipse cx="100" cy="104" rx="5" ry="5" fill="#d0e7ff" opacity="0.7"/>
            <ellipse cx="140" cy="104" rx="5" ry="5" fill="#d0e7ff" opacity="0.7"/>
            <path d="M105 123c6 10 34 10 40 0" stroke="#96c6ff" strokeWidth="4" strokeLinecap="round"/>
            <line x1="180" y1="65" x2="220" y2="37" stroke="#78aaff" strokeWidth="11" strokeLinecap="round" opacity="0.12"/>
            <circle cx="75" cy="90" r="10" fill="#7dc6ff" opacity="0.10"/>
            <circle cx="210" cy="165" r="9" fill="#7dc6ff" opacity="0.10"/>
          </svg>
        </div>
        {/* Message */}
        <h1 className="text-white font-extrabold text-5xl mb-8 text-center tracking-tight">No Trends Found</h1>
        <p className="text-gray-300 text-2xl mb-14 text-center max-w-3xl">
          There are currently no trends to display.<br />
          Try refreshing, changing your filters, or come back later for new insights!
        </p>
        {/* CTA */}
        <button
          className="bg-white text-black px-16 py-5 rounded-xl text-2xl font-bold shadow-lg hover:bg-gray-200 transition"
          onClick={() => window.location.reload()}
        >
          Refresh Trends
        </button>
      </div>
    </div>
  );
}
