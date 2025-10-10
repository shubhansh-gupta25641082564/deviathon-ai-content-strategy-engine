import React from 'react';

const competitors = [
  {
    handle: '@TechBros',
    avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
    platform: 'YouTube',
    recentUpload: 'Latest iPhone 15 Camera Review',
    uploadDate: '2025-10-08',
    recentViews: '135,400',
    trendingPost: '5G vs 4G Speed Test',
    trendingViews: '800,200',
    mostReachable: 'Top Hidden Android Features',
    mostReachViews: '900,300',
    dailyUploads: 2,
    subscribers: '1.3M',
    engagement: '5.8%',
    growth: '+2.0% monthly',
    audience: 'Tech fans, Young adults',
    notes: 'Shorts boost reach, collab videos get high likes.'
  },
  {
    handle: '@FoodieVlog',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    platform: 'YouTube',
    recentUpload: 'Making Sourdough at Home',
    uploadDate: '2025-10-09',
    recentViews: '75,010',
    trendingPost: 'Street Food Tour: Delhi',
    trendingViews: '630,100',
    mostReachable: 'Vegan Meals in 20 Minutes',
    mostReachViews: '490,700',
    dailyUploads: 1,
    subscribers: '820K',
    engagement: '6.7%',
    growth: '+1.7% monthly',
    audience: 'Food lovers, Families',
    notes: 'Live streams spike engagement; top cities: Delhi, Mumbai.'
  }
];

export default function CompetitorTracker() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181B23] via-[#000000] to-[#000000] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto px-10 pt-8 pb-8 flex items-center bg-[#191c27] rounded-b-3xl shadow-lg mb-12">
        <div className="bg-white rounded-xl flex items-center justify-center w-16 h-16 shadow-lg mr-6">
          <span className="text-4xl font-extrabold text-[#191c27]">CT</span>
        </div>
        <h2 className="flex-1 text-left text-4xl font-extrabold text-white tracking-tight">Competitor Tracker </h2>
      </div>
      <div className="w-full max-w-6xl mx-auto px-10 pb-24 grid grid-cols-1 md:grid-cols-2 gap-16">
        {competitors.map((comp, idx) => (
          <div key={idx} className="bg-[#22252e] rounded-2xl p-8 shadow-xl flex flex-col">
            {/* Header Row */}
            <div className="flex items-center gap-7 mb-6">
              <img src={comp.avatar} alt={comp.handle} className="w-16 h-16 rounded-full bg-[#F1F5F9] shadow" />
              <div>
                <span className="block text-white font-semibold text-2xl">{comp.handle}</span>
                <span className="block text-base text-[#A7B1C2]">{comp.platform}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-6">
              <div>
                <div className="text-white font-bold mb-1">Recent Upload</div>
                <div className="text-gray-200">{comp.recentUpload}</div>
                <div className="text-xs text-green-300">Date: {comp.uploadDate}</div>
                <div className="text-xs text-blue-300">Views: {comp.recentViews}</div>
              </div>
              <div>
                <div className="text-white font-bold mb-1">Trending Post</div>
                <div className="text-gray-200">{comp.trendingPost}</div>
                <div className="text-xs text-blue-300">Views: {comp.trendingViews}</div>
              </div>
              <div>
                <div className="text-white font-bold mb-1">Most Reachable</div>
                <div className="text-gray-200">{comp.mostReachable}</div>
                <div className="text-xs text-green-300">Views: {comp.mostReachViews}</div>
              </div>
              <div>
                <div className="text-white font-bold mb-1">Uploads/Day</div>
                <div className="text-blue-400 font-bold text-lg">{comp.dailyUploads}</div>
                <div className="text-xs text-[#A7B1C2]">Subscribers: {comp.subscribers}</div>
              </div>
              <div>
                <div className="text-white font-bold mb-1">Engagement</div>
                <div className="text-blue-400 font-bold text-lg">{comp.engagement}</div>
              </div>
              <div>
                <div className="text-white font-bold mb-1">Growth</div>
                <div className="text-green-400 font-bold text-lg">{comp.growth}</div>
              </div>
              <div>
                <div className="text-white font-bold mb-1">Audience</div>
                <div className="text-gray-200">{comp.audience}</div>
              </div>
            </div>
            <div className="bg-[#181d23] rounded-xl p-5 mb-2">
              <div className="text-white font-bold mb-1">Channel Notes</div>
              <div className="text-sm text-[#A5B6C5]">{comp.notes}</div>
            </div>
            {/* BUTTON: THIS PART MODIFIED - black text */}
            <button className="w-full bg-white text-black font-bold py-4 mt-3 rounded-xl text-lg transition hover:bg-gray-200">
              ✦ Compare with my strategy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
