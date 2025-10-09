import React from 'react';

export default function ConnectionErrorPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#181c20] via-[#232836] to-[#22263a] flex items-center justify-center px-4 md:px-10">
      <div className="w-full max-w-6xl h-[85vh] flex flex-col items-center justify-center rounded-3xl shadow-2xl bg-[#20232a] border border-white/10 relative overflow-hidden">
        {/* Animated background rings */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg width="100%" height="100%">
            <circle cx="50%" cy="40%" r="280" fill="none" stroke="#2642a7" strokeWidth="2" />
            <circle cx="55%" cy="45%" r="160" fill="none" stroke="#233469" strokeWidth="2" />
            <circle cx="60%" cy="50%" r="80" fill="none" stroke="#1a2a5c" strokeWidth="2" />
          </svg>
        </div>
        
        {/* Animated error icon */}
        <div className="z-10 flex flex-col items-center mb-12">
          <svg width="180" height="180" viewBox="0 0 144 144" fill="none" className="mb-6 animate-[pulse_2s_ease-in-out_infinite]">
            <circle cx="72" cy="72" r="60" stroke="#2961fa" strokeWidth="10" fill="#23293a" />
            <circle cx="72" cy="72" r="40" stroke="#3672fa" strokeWidth="7" />
            <rect x="68" y="40" width="8" height="28" rx="4" fill="#2961fa" />
            <rect x="68" y="86" width="8" height="8" rx="4" fill="#2961fa" />
            <line x1="50" y1="50" x2="94" y2="94" stroke="#223368" strokeWidth="8" strokeLinecap="round"/>
          </svg>
          <span className="mt-4 block text-[3rem] font-black text-white tracking-tight">Connection Error</span>
        </div>
        
        <div className="z-10 mt-4 max-w-2xl">
          <p className="text-gray-300 text-2xl mb-12 text-center mx-auto leading-relaxed">
            Oops! Looks like you've lost your connection.<br/>
            Please check your internet connection and try again.
          </p>
        </div>
        
        <button
          className="z-10 mt-6 bg-white text-black font-bold rounded-xl px-16 py-5 text-xl shadow-2xl transition-all duration-300 hover:bg-gray-100 hover:scale-105 border border-gray-200 hover:shadow-3xl"
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>
        
        {/* Additional decorative elements for desktop */}
        <div className="absolute bottom-10 left-10 w-20 h-20 opacity-20">
          <div className="w-full h-full border-2 border-blue-500 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-10 right-10 w-16 h-16 opacity-20">
          <div className="w-full h-full border-2 border-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}