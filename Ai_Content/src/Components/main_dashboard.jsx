import React from 'react';

// Demo trend anim
const flame =
  <svg className="w-8 h-8 animate-pulse" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2S7 8 9 13c2 5 3 5 3 5s1 0 3-5c2-5-3-11-3-11z"
      fill="#fff" stroke="#111" strokeWidth="2"
    />
    <circle cx="12" cy="17" r="3.5" fill="#fff" stroke="#111" strokeWidth="2" />
  </svg>;

export default function DashboardBW() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center px-4 py-8">
      {/* Title */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between mb-10 mt-2 gap-2">
        <h1 className="font-extrabold text-3xl md:text-4xl tracking-tight flex items-center gap-4">
          Main Dashboard
        </h1>
        <span className="text-gray-400 text-base md:text-lg">Last update: 3 mins ago</span>
      </div>
      {/* Main Card Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12 items-stretch">
        {/* Trending Post */}
        <div className="bg-[#18181b] border border-white/10 rounded-2xl shadow-lg flex flex-col p-7 animate-fade-in h-full">
          <div className="flex items-center gap-3 mb-4">
            {flame}
            <span className="text-lg font-bold">Trending Post</span>
          </div>
          <div className="rounded-xl bg-[#232323] border border-white/10 mb-4 p-4">
            <div className="font-semibold mb-1">"Top 5 AI Tools in 2025"</div>
            <div className="text-sm text-gray-300 mb-1">by @AIGuru</div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Views: <b className="text-gray-200">88.2K</b></span>
              <span>🔥 97% upvotes</span>
            </div>
          </div>
          <button className="py-2 px-5 rounded-lg bg-white text-black font-bold shadow w-max mt-2 transition hover:bg-gray-200">View Details</button>
        </div>

        {/* Content Score */}
        <div className="bg-[#18181b] border border-white/10 rounded-2xl shadow-lg flex flex-col items-center justify-center p-7 animate-fade-in h-full">
          <div className="text-lg font-bold mb-4">Content Score</div>
          {/* Progress Ring - Black and White Theme */}
          <div className="relative mb-2">
            <svg className="w-28 h-28">
              {/* Define gradients */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00ff87' }} />
                  <stop offset="100%" style={{ stopColor: '#60efff' }} />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0061ff' }} />
                  <stop offset="100%" style={{ stopColor: '#60efff' }} />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle
                className="opacity-20"
                strokeWidth="12"
                stroke="url(#gradient1)"
                fill="transparent"
                r="45"
                cx="56"
                cy="56"
              />
              {/* Foreground circle */}
              <circle
                strokeWidth="12"
                strokeDasharray={282.743}
                strokeDashoffset={56}
                strokeLinecap="round"
                stroke="url(#gradient2)"
                fill="transparent"
                r="45"
                cx="56"
                cy="56"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              80<span className="text-lg">/100</span>
            </span>
          </div>
          <div className="text-gray-300 text-sm">
            +6% this week • Above average
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-[#18181b] border border-white/10 rounded-2xl shadow-lg flex flex-col p-7 gap-y-5 animate-fade-in h-full">
          <div className="text-lg font-bold mb-2">Quick Stats</div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-[#232323] border border-white/10 rounded-xl p-4 flex-1 text-center">
              <div className="font-bold text-xl">12.8K</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="bg-[#232323] border border-white/10 rounded-xl p-4 flex-1 text-center">
              <div className="font-bold text-xl">957</div>
              <div className="text-xs text-gray-400">Likes</div>
            </div>
            <div className="bg-[#232323] border border-white/10 rounded-xl p-4 flex-1 text-center">
              <div className="font-bold text-xl">211</div>
              <div className="text-xs text-gray-400">Comments</div>
            </div>
            <div className="bg-[#232323] border border-white/10 rounded-xl p-4 flex-1 text-center">
              <div className="font-bold text-xl">135</div>
              <div className="text-xs text-gray-400">Shares</div>
            </div>
          </div>
        </div>
      </div>
      {/* Activity Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
        {/* Activity Chart */}
        <div className="col-span-2 bg-[#18181b] border border-white/10 rounded-2xl shadow-lg p-7 animate-fade-in flex flex-col">
          <div className="text-lg font-bold mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Your Activity
          </div>
          {/* Animated bars for daily activity */}
          <div className="flex items-end gap-3 h-32 mb-3 mt-4 w-full">
            {['M','T','W','T','F','S','S'].map((d,i) => (
              <div key={d} className="flex flex-col items-center justify-end w-12">
                  <div
                    style={{
                      height: [30,56,80,56,112,90,44][i],
                      background: "linear-gradient(to top, #fff, #111)"
                    }}
                    className="w-10 rounded-md mb-2 shadow"
                  />
                <div className="text-xs text-gray-400">{d}</div>
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-400">Weekly content actions</span>
        </div>
        {/* Recent Activity List */}
        <div className="bg-[#18181b] border border-white/10 rounded-2xl shadow-lg p-7 flex flex-col animate-fade-in">
          <div className="text-lg font-bold mb-3">Recent Activity</div>
          <ul className="flex-1 flex flex-col gap-4">
            <li className="flex items-center gap-3">
              <span className="h-3 w-3 inline-block rounded-full bg-green-400 animate-pulse"></span>
              <span>Uploaded: "<b>Beginner's Python Guide</b>"</span>
              <span className="ml-auto text-xs text-gray-400">1h ago</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-3 w-3 inline-block rounded-full bg-blue-400 animate-pulse"></span>
              <span>Shared trending post</span>
              <span className="ml-auto text-xs text-gray-400">2h ago</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-3 w-3 inline-block rounded-full bg-yellow-400 animate-pulse"></span>
              <span>Replied to comments</span>
              <span className="ml-auto text-xs text-gray-400">3h ago</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-3 w-3 inline-block rounded-full bg-violet-400 animate-pulse"></span>
              <span>Improved content score</span>
              <span className="ml-auto text-xs text-gray-400">6h ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
