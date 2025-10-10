import React, { useState } from 'react';

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
    notes: 'Shorts boost reach, collab videos get high likes.',
    performance: 87,
    trend: 'up',
    category: 'Technology'
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
    notes: 'Live streams spike engagement; top cities: Delhi, Mumbai.',
    performance: 92,
    trend: 'up',
    category: 'Food & Cooking'
  },
  {
    handle: '@GamingPro',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    platform: 'YouTube',
    recentUpload: 'New Game Release Review',
    uploadDate: '2025-10-07',
    recentViews: '210,500',
    trendingPost: 'Epic Gaming Moments',
    trendingViews: '1.2M',
    mostReachable: 'Gaming Setup Tour 2025',
    mostReachViews: '950,800',
    dailyUploads: 3,
    subscribers: '2.1M',
    engagement: '4.9%',
    growth: '+3.2% monthly',
    audience: 'Gamers, Teens & Young Adults',
    notes: 'Live streaming drives most engagement; collabs with other gamers boost growth.',
    performance: 78,
    trend: 'down',
    category: 'Gaming'
  },
  {
    handle: '@FitnessCoach',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    platform: 'YouTube',
    recentUpload: 'Morning Yoga Routine',
    uploadDate: '2025-10-10',
    recentViews: '89,300',
    trendingPost: '30-Day Fitness Challenge',
    trendingViews: '540,600',
    mostReachable: 'Home Workout for Beginners',
    mostReachViews: '720,900',
    dailyUploads: 2,
    subscribers: '1.1M',
    engagement: '7.2%',
    growth: '+2.8% monthly',
    audience: 'Fitness enthusiasts, Health conscious',
    notes: 'Interactive challenges drive high participation and sharing.',
    performance: 85,
    trend: 'up',
    category: 'Fitness'
  }
];

export default function CompetitorTracker() {
  const [selectedCompetitor, setSelectedCompetitor] = useState(0);
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompetitors = competitors.filter(comp =>
    comp.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0A192F] via-[#0F2A4A] to-[#0A192F] flex flex-col items-center py-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Glowing Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#3C6997] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#5ADBFF] rounded-full opacity-15 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FFDD4A] rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-[#FE9000] rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-40 right-40 w-3 h-3 bg-[#5ADBFF] rounded-full opacity-40 animate-float" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-[#FFDD4A] rounded-full opacity-50 animate-float" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-20 right-32 w-3 h-3 bg-[#3C6997] rounded-full opacity-30 animate-float" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
        <div className="absolute top-60 left-1/4 w-3 h-3 bg-[#FE9000] rounded-full opacity-40 animate-float" style={{animationDelay: '1.5s', animationDuration: '3.2s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(#5ADBFF 1px, transparent 1px), linear-gradient(90deg, #5ADBFF 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Enhanced Header */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <div className="bg-gradient-to-r from-[#3C6997] to-[#5ADBFF] rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-[#5ADBFF]/30">
          {/* Animated Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDD4A] rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FE9000] rounded-full translate-y-24 -translate-x-24"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-white rounded-2xl flex items-center justify-center w-20 h-20 shadow-2xl relative">
                {/* Icon Glow Effect */}
                <div className="absolute inset-0 bg-[#5ADBFF] rounded-2xl opacity-20 blur-md"></div>
                <span className="text-4xl font-black bg-gradient-to-r from-[#3C6997] to-[#5ADBFF] bg-clip-text text-transparent relative z-10">
                  CT
                </span>
              </div>
              <div>
                <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                  Competitor Tracker
                </h1>
                <p className="text-[#E2F3FF] text-lg font-medium">
                  Track, analyze, and outperform your competition
                </p>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all relative overflow-hidden ${
                    viewMode === 'cards' 
                      ? 'bg-white text-[#3C6997] shadow-lg' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {viewMode === 'cards' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  )}
                  <span className="relative">Cards View</span>
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all relative overflow-hidden ${
                    viewMode === 'detailed' 
                      ? 'bg-white text-[#3C6997] shadow-lg' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {viewMode === 'detailed' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  )}
                  <span className="relative">Detailed View</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Stats Bar */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search competitors or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/40 outline-none transition-all focus:border-[#5ADBFF] focus:ring-2 focus:ring-[#5ADBFF]/20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                🔍
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Tracked', value: competitors.length, color: '#3C6997' },
              { label: 'Avg Engagement', value: '6.2%', color: '#5ADBFF' },
              { label: 'Top Performer', value: '@FoodieVlog', color: '#FFDD4A' },
              { label: 'Growth Leader', value: '+3.2%', color: '#FE9000' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-300 min-w-32"
              >
                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"
                  style={{ backgroundColor: stat.color }}
                ></div>
                <div className="text-white/60 text-sm font-semibold mb-1 relative z-10">{stat.label}</div>
                <div 
                  className="text-xl font-bold relative z-10"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'cards' ? (
        /* Cards View with Enhanced Effects */
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
          {filteredCompetitors.map((comp, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group relative overflow-hidden"
              onClick={() => setSelectedCompetitor(idx)}
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3C6997]/10 via-transparent to-[#5ADBFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Performance Ring */}
              <div className="relative w-20 h-20 mb-6 mx-auto">
                <div className="absolute inset-0 bg-[#5ADBFF] rounded-full opacity-20 blur-xl animate-pulse"></div>
                <svg className="w-20 h-20 transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={comp.trend === 'up' ? '#5ADBFF' : '#FE9000'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - comp.performance / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg relative z-10 drop-shadow-lg">{comp.performance}</span>
                </div>
              </div>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#5ADBFF] rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
                  <img src={comp.avatar} alt={comp.handle} className="w-14 h-14 rounded-2xl border-2 border-white/20 relative z-10" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-lg">{comp.handle}</div>
                  <div className="text-[#5ADBFF] text-sm font-semibold">{comp.platform}</div>
                  <div className="text-[#FFDD4A] text-xs">{comp.category}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  comp.trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {comp.trend === 'up' ? '↑ TRENDING' : '↓ DECLINING'}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                <div className="bg-white/5 rounded-xl p-3 text-center group/metric hover:bg-white/10 transition-all duration-300">
                  <div className="text-[#FFDD4A] font-bold text-lg group-hover/metric:scale-110 transition-transform duration-300">{comp.subscribers}</div>
                  <div className="text-white/60 text-xs">Subscribers</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center group/metric hover:bg-white/10 transition-all duration-300">
                  <div className="text-[#5ADBFF] font-bold text-lg group-hover/metric:scale-110 transition-transform duration-300">{comp.engagement}</div>
                  <div className="text-white/60 text-xs">Engagement</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center group/metric hover:bg-white/10 transition-all duration-300">
                  <div className="text-[#FE9000] font-bold text-lg group-hover/metric:scale-110 transition-transform duration-300">{comp.dailyUploads}/day</div>
                  <div className="text-white/60 text-xs">Uploads</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center group/metric hover:bg-white/10 transition-all duration-300">
                  <div className="text-[#3C6997] font-bold text-lg group-hover/metric:scale-110 transition-transform duration-300">{comp.growth}</div>
                  <div className="text-white/60 text-xs">Growth</div>
                </div>
              </div>

              {/* Top Content */}
              <div className="space-y-3 mb-6 relative z-10">
                <div className="flex items-center gap-2 group/content hover:bg-white/5 rounded-lg p-2 transition-all duration-300">
                  <div className="w-2 h-2 bg-[#FFDD4A] rounded-full animate-pulse"></div>
                  <div className="text-white/80 text-sm truncate flex-1">{comp.trendingPost}</div>
                  <div className="text-[#5ADBFF] text-xs font-semibold">{comp.trendingViews}</div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-[#FFDD4A] to-[#FE9000] text-[#0A192F] font-bold py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg relative overflow-hidden group/btn">
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FE9000] to-[#FFDD4A] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-md"></div>
                <span className="relative z-10">Compare Strategy</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed View with Enhanced Effects */
        <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-[#3C6997]/30 transition-all duration-500">
            {/* Main Panel Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3C6997]/10 via-transparent to-[#FE9000]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Competitor Selector */}
            <div className="flex gap-3 mb-8 relative z-10 overflow-x-auto pb-2">
              {filteredCompetitors.map((comp, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCompetitor(idx)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all relative overflow-hidden flex-shrink-0 ${
                    selectedCompetitor === idx
                      ? 'bg-gradient-to-r from-[#3C6997] to-[#5ADBFF] text-white shadow-lg'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {selectedCompetitor === idx && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  )}
                  <span className="relative">{comp.handle}</span>
                </button>
              ))}
            </div>

            {filteredCompetitors[selectedCompetitor] && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Left Column - Profile & Stats */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white/5 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                    {/* Profile Glow */}
                    <div className="absolute inset-0 bg-[#5ADBFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#FFDD4A] rounded-2xl opacity-20 blur-md"></div>
                        <img src={filteredCompetitors[selectedCompetitor].avatar} alt="avatar" className="w-16 h-16 rounded-2xl border-2 border-[#5ADBFF] relative z-10" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-2xl">{filteredCompetitors[selectedCompetitor].handle}</div>
                        <div className="text-[#5ADBFF] font-semibold">{filteredCompetitors[selectedCompetitor].platform}</div>
                        <div className="text-[#FFDD4A] text-sm">{filteredCompetitors[selectedCompetitor].category}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 relative z-10">
                      {[
                        { label: 'Subscribers', value: filteredCompetitors[selectedCompetitor].subscribers, color: '#FFDD4A' },
                        { label: 'Engagement', value: filteredCompetitors[selectedCompetitor].engagement, color: '#5ADBFF' },
                        { label: 'Daily Uploads', value: `${filteredCompetitors[selectedCompetitor].dailyUploads}/day`, color: '#FE9000' },
                        { label: 'Monthly Growth', value: filteredCompetitors[selectedCompetitor].growth, color: '#3C6997' }
                      ].map((stat, idx) => (
                        <div key={idx} className="flex justify-between items-center group/stat hover:bg-white/5 rounded-lg p-2 transition-all duration-300">
                          <span className="text-white/60">{stat.label}</span>
                          <span className="font-bold group-hover/stat:scale-110 transition-transform duration-300" style={{ color: stat.color }}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                    {/* Audience Glow */}
                    <div className="absolute inset-0 bg-[#FFDD4A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h3 className="text-white font-bold mb-4 relative z-10">Audience Insights</h3>
                    <div className="text-[#A5B6C5] text-sm leading-relaxed relative z-10">
                      {filteredCompetitors[selectedCompetitor].audience}
                    </div>
                  </div>
                </div>

                {/* Right Column - Content & Performance */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                      {/* Trending Glow */}
                      <div className="absolute inset-0 bg-[#3C6997]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2 relative z-10">
                        <span className="text-[#FFDD4A]">📈</span> Trending Content
                      </h3>
                      <div className="text-white font-semibold mb-2 relative z-10">{filteredCompetitors[selectedCompetitor].trendingPost}</div>
                      <div className="text-[#5ADBFF] font-bold text-lg relative z-10">{filteredCompetitors[selectedCompetitor].trendingViews} views</div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                      {/* Reach Glow */}
                      <div className="absolute inset-0 bg-[#FE9000]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2 relative z-10">
                        <span className="text-[#FE9000]">🎯</span> Highest Reach
                      </h3>
                      <div className="text-white font-semibold mb-2 relative z-10">{filteredCompetitors[selectedCompetitor].mostReachable}</div>
                      <div className="text-[#5ADBFF] font-bold text-lg relative z-10">{filteredCompetitors[selectedCompetitor].mostReachViews} views</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                    {/* Notes Glow */}
                    <div className="absolute inset-0 bg-[#5ADBFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h3 className="text-white font-bold mb-4 relative z-10">Channel Notes & Strategy</h3>
                    <div className="text-[#A5B6C5] leading-relaxed relative z-10">
                      {filteredCompetitors[selectedCompetitor].notes}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#FFDD4A] to-[#FE9000] rounded-2xl p-6 relative overflow-hidden group">
                    {/* CTA Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FE9000] to-[#FFDD4A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                    <h3 className="text-[#0A192F] font-bold text-xl mb-4 relative z-10">Ready to Outperform?</h3>
                    <p className="text-[#0A192F]/80 mb-4 relative z-10">
                      Compare your strategy with {filteredCompetitors[selectedCompetitor].handle} and identify growth opportunities.
                    </p>
                    <button className="bg-white text-[#0A192F] font-bold py-4 px-8 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg relative z-10">
                      Launch Competitive Analysis →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}