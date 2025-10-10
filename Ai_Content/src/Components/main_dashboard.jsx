import React, { useState, useEffect } from 'react';

// Enhanced flame animation
const FlameIcon = () => (
  <div className="relative">
    <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-50 animate-pulse"></div>
    <svg className="w-8 h-8 relative z-10" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2S7 8 9 13c2 5 3 5 3 5s1 0 3-5c2-5-3-11-3-11z"
        fill="url(#flameGradient)"
        stroke="#111"
        strokeWidth="2"
      />
      <circle cx="12" cy="17" r="3.5" fill="url(#flameGradient)" stroke="#111" strokeWidth="2" />
      <defs>
        <linearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFDD4A" />
          <stop offset="50%" stopColor="#FE9000" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default function DashboardBW() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedScore, setAnimatedScore] = useState(0);

  // Color constants matching your theme
  const colors = {
    primary: '#094074',
    secondary: '#3C6997',
    accent: '#5ADBFF',
    warning: '#FFDD4A',
    orange: '#FE9000',
    gradients: {
      primary: 'linear-gradient(135deg, #094074 0%, #3C6997 100%)',
      secondary: 'linear-gradient(135deg, #3C6997 0%, #5ADBFF 100%)',
      accent: 'linear-gradient(135deg, #5ADBFF 0%, #94E6FF 100%)',
      warning: 'linear-gradient(135deg, #FFDD4A 0%, #FFE88C 100%)',
      orange: 'linear-gradient(135deg, #FE9000 0%, #FFAD4D 100%)',
      premium: 'linear-gradient(135deg, #094074 0%, #5ADBFF 50%, #FFDD4A 100%)'
    }
  };

  // Stats data
  const stats = {
    followers: { value: 12800, change: '+12.4%' },
    likes: { value: 9570, change: '+8.7%' },
    comments: { value: 2110, change: '+15.2%' },
    shares: { value: 1350, change: '+23.1%' }
  };

  const recentActivities = [
    { type: 'upload', title: "Beginner's Python Guide", time: '1h ago', color: colors.accent },
    { type: 'share', title: 'Shared trending post', time: '2h ago', color: colors.secondary },
    { type: 'comment', title: 'Replied to comments', time: '3h ago', color: colors.warning },
    { type: 'improvement', title: 'Improved content score', time: '6h ago', color: colors.orange }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Animate score counter
    const scoreTimer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= 80) {
          setAnimatedScore(80);
          clearInterval(interval);
        } else {
          setAnimatedScore(current);
        }
      }, 30);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(scoreTimer);
    };
  }, []);

  const StatCard = ({ title, value, change, icon, color }) => (
    <div 
      className="relative p-6 rounded-2xl border-2 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
        borderColor: `${color}30`
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500" 
           style={{ backgroundColor: color }}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl">{icon}</div>
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
            change.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {change}
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value.toLocaleString()}</div>
        <div className="text-gray-400 text-sm font-medium">{title}</div>
      </div>
    </div>
  );

  const ActivityBar = ({ day, height, index }) => (
    <div className="flex flex-col items-center justify-end w-12 group">
      <div
        style={{
          height: `${height}%`,
          background: colors.gradients.accent
        }}
        className="w-10 rounded-t-xl mb-2 transition-all duration-500 group-hover:shadow-2xl group-hover:scale-110 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 group-hover:to-white/40 transition-all duration-300"></div>
      </div>
      <div className="text-xs text-gray-400 group-hover:text-white transition-colors">{day}</div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: colors.gradients.accent }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse delay-1000"
          style={{ background: colors.gradients.warning }}
        ></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-2 h-12 rounded-full" style={{ background: colors.gradients.accent }}></div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Main Dashboard
                </h1>
                <p className="text-gray-400 text-lg mt-2">Real-time performance insights and analytics</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div 
              className="px-6 py-3 rounded-2xl backdrop-blur-xl border-2"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                borderColor: `${colors.accent}30`
              }}
            >
              <div className="text-sm text-gray-400">Last update</div>
              <div className="text-white font-semibold">{currentTime.toLocaleTimeString()}</div>
            </div>
            
            <div 
              className="px-6 py-3 rounded-2xl backdrop-blur-xl border-2"
              style={{ 
                background: colors.gradients.primary,
                borderColor: `${colors.primary}60`
              }}
            >
              <div className="text-sm text-white/80">Live Status</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-white font-semibold">All Systems Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Trending Post Card */}
          <div 
            className="backdrop-blur-xl rounded-3xl border-2 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.accent}10 100%)`,
              borderColor: `${colors.accent}30`
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10" 
                 style={{ background: colors.gradients.accent }}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <FlameIcon />
                <div>
                  <h3 className="text-xl font-bold text-white">Trending Post</h3>
                  <p className="text-gray-400 text-sm">Currently viral content</p>
                </div>
              </div>
              
              <div 
                className="rounded-2xl p-6 mb-6 border-2 transition-all duration-300 group-hover:border-cyan-400/50 group-hover:bg-white/5"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                  borderColor: `${colors.accent}20`
                }}
              >
                <div className="font-bold text-lg mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  "Top 5 AI Tools in 2025"
                </div>
                <div className="text-sm text-gray-300 mb-3">by @AIGuru • Trending in Technology</div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">Views: <b className="text-white">{88.2}K</b></span>
                    <span className="text-gray-400">Engagement: <b className="text-white">97%</b></span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <span>🔥</span>
                    <span>Viral</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl group/btn"
                style={{ background: colors.gradients.accent }}
              >
                <span className="flex items-center space-x-2">
                  <span>View Details</span>
                  <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </button>
            </div>
          </div>

          {/* Content Score Card */}
          <div 
            className="backdrop-blur-xl rounded-3xl border-2 p-8 flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.warning}10 100%)`,
              borderColor: `${colors.warning}30`
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10" 
                 style={{ background: colors.gradients.warning }}></div>
            <div className="relative z-10 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Content Score</h3>
              <p className="text-gray-400 text-sm mb-6">Performance metric</p>
              
              {/* Enhanced Progress Ring */}
              <div className="relative mb-4">
                <svg className="w-36 h-36 transform group-hover:scale-110 transition-transform duration-500">
                  <defs>
                    <linearGradient id="scoreGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={colors.accent} />
                      <stop offset="100%" stopColor={colors.warning} />
                    </linearGradient>
                    <linearGradient id="scoreGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={colors.primary} />
                      <stop offset="100%" stopColor={colors.secondary} />
                    </linearGradient>
                  </defs>
                  
                  {/* Background circle */}
                  <circle
                    className="opacity-20"
                    strokeWidth="12"
                    stroke="url(#scoreGradient2)"
                    fill="transparent"
                    r="52"
                    cx="72"
                    cy="72"
                  />
                  
                  {/* Animated foreground circle */}
                  <circle
                    strokeWidth="12"
                    strokeDasharray={326.725}
                    strokeDashoffset={326.725 * (1 - animatedScore / 100)}
                    strokeLinecap="round"
                    stroke="url(#scoreGradient1)"
                    fill="transparent"
                    r="52"
                    cx="72"
                    cy="72"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
                    {animatedScore}
                  </span>
                  <span className="text-gray-400 text-sm">/100</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span className="text-green-400 font-semibold">↑ +6%</span>
                <span className="text-gray-400">this week</span>
              </div>
              <div className="text-gray-300 text-sm mt-1">Above average performance</div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div 
            className="backdrop-blur-xl rounded-3xl border-2 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${colors.orange}15 0%, ${colors.warning}10 100%)`,
              borderColor: `${colors.orange}30`
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10" 
                 style={{ background: colors.gradients.orange }}></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  title="Followers" 
                  value={stats.followers.value} 
                  change={stats.followers.change}
                  icon="👥"
                  color={colors.accent}
                />
                <StatCard 
                  title="Likes" 
                  value={stats.likes.value} 
                  change={stats.likes.change}
                  icon="❤️"
                  color={colors.warning}
                />
                <StatCard 
                  title="Comments" 
                  value={stats.comments.value} 
                  change={stats.comments.change}
                  icon="💬"
                  color={colors.secondary}
                />
                <StatCard 
                  title="Shares" 
                  value={stats.shares.value} 
                  change={stats.shares.change}
                  icon="🔄"
                  color={colors.orange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Chart */}
          <div 
            className="lg:col-span-2 backdrop-blur-xl rounded-3xl border-2 p-8 transition-all duration-500 hover:shadow-2xl group overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}10 100%)`,
              borderColor: `${colors.secondary}30`
            }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 -mr-24 -mt-24 rounded-full opacity-10" 
                 style={{ background: colors.gradients.secondary }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: colors.gradients.accent }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Activity</h3>
                    <p className="text-gray-400 text-sm">Weekly performance metrics</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-semibold">Live</span>
                </div>
              </div>

              {/* Enhanced Activity Bars */}
              <div className="flex items-end justify-between h-40 mb-6 px-4">
                {[
                  { day: 'Mon', height: 30 },
                  { day: 'Tue', height: 56 },
                  { day: 'Wed', height: 80 },
                  { day: 'Thu', height: 56 },
                  { day: 'Fri', height: 112 },
                  { day: 'Sat', height: 90 },
                  { day: 'Sun', height: 44 }
                ].map((item, index) => (
                  <ActivityBar key={item.day} day={item.day} height={item.height} index={index} />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Weekly content actions and engagement</span>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: colors.gradients.accent }}></div>
                    <span className="text-gray-400">Current Week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div 
            className="backdrop-blur-xl rounded-3xl border-2 p-8 transition-all duration-500 hover:shadow-2xl group overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${colors.warning}10 0%, ${colors.orange}5 100%)`,
              borderColor: `${colors.warning}30`
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10" 
                 style={{ background: colors.gradients.warning }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                <div className="text-cyan-400 text-sm font-semibold">Today</div>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group/item"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                      borderColor: `${activity.color}20`
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse"
                      style={{ backgroundColor: activity.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{activity.title}</div>
                    </div>
                    <div className="text-gray-400 text-sm flex-shrink-0">{activity.time}</div>
                  </div>
                ))}
              </div>

              <button 
                className="w-full mt-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 border-2"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                  borderColor: `${colors.accent}30`,
                  color: colors.accent
                }}
              >
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}