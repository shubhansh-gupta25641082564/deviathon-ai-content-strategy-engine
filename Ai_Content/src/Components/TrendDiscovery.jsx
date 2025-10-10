import React, { useState, useEffect } from 'react';
import { generatePlatformContent, generatePerformanceMetrics } from '../generator/platform_generators';
import { getTrendingCreators, getRelevantCreators } from '../generator/creators_data';
import shorts from '../assets/logos/yt_shorts.png'
import reddit from '../assets/logos/reddit.png'
import g_trends from '../assets/logos/g_trends.png'
import news from '../assets/logos/news.png'

const TrendDiscovery = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube');
  const [selectedInterest, setSelectedInterest] = useState('All');
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [sortBy, setSortBy] = useState('trending');
  const [featuredCreators, setFeaturedCreators] = useState([]);
  const [dataSource, setDataSource] = useState('loading');
  const [activeTab, setActiveTab] = useState('trends');
  const [timeRange, setTimeRange] = useState('24h');

  // Enhanced color constants with gradients
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

  const platforms = [
    { 
      id: 'YouTube', 
      name: 'YouTube Shorts', 
      icon: <img src={shorts} alt="Yt Shorts" className='w-14 h-14' />, 
      gradient: colors.gradients.primary,
      stats: '2.3M trends',
      growth: '+12.4%',
      color: colors.primary
    },
    { 
      id: 'Reddit', 
      name: 'Reddit', 
      icon: <img src={reddit} alt="Reddit" className='w-14 h-14' />, 
      gradient: colors.gradients.orange,
      stats: '1.1M posts',
      growth: '+8.7%',
      color: colors.orange
    },
    { 
      id: 'Trends', 
      name: 'Google Trends', 
      icon: <img src={g_trends} alt="G Trends" className='w-14 h-14' />, 
      gradient: colors.gradients.accent,
      stats: '850K searches',
      growth: '+15.2%',
      color: colors.accent
    },
    { 
      id: 'News', 
      name: 'Tech News', 
      icon: <img src={news} alt="News" className='w-14 h-14' />, 
      gradient: `linear-gradient(135deg, ${colors.secondary} 0%, #6B93C0 100%)`,
      stats: '450K articles',
      growth: '+5.9%',
      color: colors.secondary
    }
  ];

  const interests = ['All', 'Technology', 'Lifestyle', 'Gaming', 'Education', 'Business', 'Entertainment'];
  const sortOptions = ['trending', 'engagement', 'recent', 'viral'];
  const tabs = [
    { id: 'trends', label: '🔥 Trends', icon: '🚀' },
    { id: 'analytics', label: '📊 Analytics', icon: '📈' },
    { id: 'creators', label: '👑 Creators', icon: '⭐' }
  ];
  const timeRanges = [
    { id: '1h', label: '1 Hour' },
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' }
  ];

  // Mock stats data
  const platformStats = {
    totalTrends: 12457,
    activeUsers: 89234,
    engagementRate: 68.2,
    growthRate: 23.7
  };

  useEffect(() => {
    loadTrends();
    loadFeaturedCreators();
  }, [selectedPlatform, selectedInterest, sortBy, timeRange]);

  const loadFeaturedCreators = () => {
    try {
      const creators = getRelevantCreators(selectedPlatform, 'tech', 4);
      setFeaturedCreators(creators);
    } catch (error) {
      console.error('Error loading featured creators:', error);
      setFeaturedCreators([]);
    }
  };

  const loadTrends = async () => {
    setLoading(true);
    try {
      console.log(`Loading REAL data for platform: ${selectedPlatform}`);
      
      // Try to fetch from backend API first
      try {
        const response = await fetch(`http://localhost:5002/api/trends?platform=${selectedPlatform}&interest=${selectedInterest}&sortBy=${sortBy}&page=1`);
        
        if (response.ok) {
          const apiData = await response.json();
          console.log('✅ Real API data loaded:', apiData);
          setDataSource('real');
          
          // Add creators to the real data
          const enrichedTrends = await Promise.all(
            apiData.map(async (item, index) => {
              const { suggestCreatorsForContent } = await import('../generator/creators_data.js');
              const creators = suggestCreatorsForContent(item.headline || item.content, selectedPlatform);
              
              return {
                ...item,
                creators: creators
              };
            })
          );
          
          setTrends(enrichedTrends);
          setPage(1);
          console.log('🎉 Real trends with creators set:', enrichedTrends);
          return;
        } else {
          console.warn('Backend API not available, falling back to client-side generators');
        }
      } catch (apiError) {
        console.warn('Backend API error:', apiError.message, 'falling back to client-side generators');
      }
      
      // Fallback to client-side generators
      console.log('Using client-side generators as fallback');
      setDataSource('fallback');
      const contentData = await generatePlatformContent(selectedPlatform, 1);
      console.log('Generated content:', contentData);
      
      // Transform the data to match the expected format
      const transformedTrends = await Promise.all(
        contentData.map(async (item, index) => {
          const metrics = await generatePerformanceMetrics(selectedPlatform);
          
          return {
            id: `${selectedPlatform}-${index}`,
            platform: selectedPlatform,
            hashtag: item.hashtag,
            headline: item.headline,
            content: item.content,
            music: item.music,
            metrics: metrics,
            engagement: Math.floor(Math.random() * 10000) + 1000,
            sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
            growth: Math.floor(Math.random() * 50) + 10,
            timestamp: new Date().toISOString(),
            url: item.url || '#',
            creators: item.creators || []
          };
        })
      );
      
      setTrends(transformedTrends);
      setPage(1);
      console.log('Fallback trends set:', transformedTrends);
    } catch (error) {
      console.error('Error loading trends:', error);
      // Final fallback data
      setTrends([{
        id: 'fallback-1',
        platform: selectedPlatform,
        hashtag: '#TechTrends',
        headline: 'Tech Content Ideas',
        content: 'Generate engaging tech content for your audience',
        music: 'Tech Beat',
        metrics: { likes: 50, shares: 30, views: 60, comments: 20 },
        engagement: 5000,
        sentiment: 'positive',
        growth: 25,
        timestamp: new Date().toISOString(),
        url: '#',
        creators: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTrends = async () => {
    setLoading(true);
    try {
      const newPage = page + 1;
      console.log(`Loading more REAL data for platform: ${selectedPlatform}, page: ${newPage}`);
      
      // Try to fetch from backend API first
      try {
        const response = await fetch(`http://localhost:5002/api/trends?platform=${selectedPlatform}&interest=${selectedInterest}&sortBy=${sortBy}&page=${newPage}`);
        
        if (response.ok) {
          const apiData = await response.json();
          console.log('✅ More real API data loaded:', apiData);
          
          // Add creators to the real data
          const enrichedTrends = await Promise.all(
            apiData.map(async (item, index) => {
              const { suggestCreatorsForContent } = await import('../generator/creators_data.js');
              const creators = suggestCreatorsForContent(item.headline || item.content, selectedPlatform);
              
              return {
                ...item,
                creators: creators
              };
            })
          );
          
          setTrends(prev => [...prev, ...enrichedTrends]);
          setPage(newPage);
          return;
        }
      } catch (apiError) {
        console.warn('Backend API error for more trends:', apiError.message);
      }
      
      // Fallback to client-side generators
      const contentData = await generatePlatformContent(selectedPlatform, newPage);
      
      // Transform the new data
      const newTransformedTrends = await Promise.all(
        contentData.map(async (item, index) => {
          const metrics = await generatePerformanceMetrics(selectedPlatform);
          
          return {
            id: `${selectedPlatform}-${newPage}-${index}`,
            platform: selectedPlatform,
            hashtag: item.hashtag,
            headline: item.headline,
            content: item.content,
            music: item.music,
            metrics: metrics,
            engagement: Math.floor(Math.random() * 10000) + 1000,
            sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
            growth: Math.floor(Math.random() * 50) + 10,
            timestamp: new Date().toISOString(),
            url: item.url || '#',
            creators: item.creators || []
          };
        })
      );
      
      setTrends(prev => [...prev, ...newTransformedTrends]);
      setPage(newPage);
    } catch (error) {
      console.error('Error loading more trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return colors.accent;
      case 'negative': return '#EF4444';
      default: return colors.warning;
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '🚀';
      case 'negative': return '📉';
      default: return '📊';
    }
  };

  const StatCard = ({ title, value, change, icon, color }) => (
    <div 
      className="relative p-6 rounded-3xl border-2 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
        borderColor: `${color}30`
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500" 
           style={{ backgroundColor: color }}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl">{icon}</div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-2">{value}</div>
        <div className="text-gray-400 text-sm font-medium">{title}</div>
      </div>
    </div>
  );

  const KeywordGraph = () => {
    if (!selectedKeywords.length) return null;

    const maxValue = Math.max(...selectedKeywords.map(() => Math.random() * 100 + 50));

    return (
      <div 
        className="relative backdrop-blur-xl rounded-3xl p-8 mt-8 border-2 overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, rgba(5, 64, 116, 0.2) 0%, rgba(60, 105, 151, 0.1) 100%)`,
          borderColor: `${colors.accent}30`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-12 rounded-full" style={{ background: colors.gradients.accent }}></div>
              <div>
                <h3 className="text-2xl font-bold text-white">Keyword Trend Analysis</h3>
                <p className="text-gray-400">Real-time performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-semibold">Live</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {selectedKeywords.map((keyword, index) => {
              const value = Math.random() * 100 + 50;
              const percentage = (value / maxValue) * 100;

              return (
                <div key={keyword} className="space-y-4 group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: colors.gradients.primary }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-bold text-white text-lg">{keyword}</span>
                        <div className="text-gray-400 text-sm">Trending in {selectedPlatform}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-2xl font-bold" style={{ color: colors.accent }}>{Math.round(value)}%</span>
                        <div className="text-gray-400 text-sm">Engagement</div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${value > 70 ? 'bg-green-400' : value > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-4 backdrop-blur-sm overflow-hidden">
                    <div
                      className="h-4 rounded-full transition-all duration-1000 backdrop-blur-sm relative"
                      style={{ 
                        width: `${percentage}%`,
                        background: colors.gradients.accent
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: colors.gradients.accent }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse delay-1000"
          style={{ background: colors.gradients.warning }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-10 animate-pulse delay-500"
          style={{ background: colors.gradients.primary }}
        ></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div 
                  className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-20 animate-pulse"
                ></div>
                <h1 className="text-6xl font-bold relative">
                  <span 
                    className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x"
                  >
                    Trend Discovery
                  </span>
                </h1>
                <p className="text-gray-400 text-xl mt-3 ml-1">
                  Real-time insights across all major platforms
                </p>
              </div>
              {dataSource !== 'loading' && (
                <div className={`px-5 py-3 rounded-2xl text-sm font-bold backdrop-blur-xl border-2 ${
                  dataSource === 'real' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/40 shadow-2xl shadow-green-500/25'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 shadow-2xl shadow-yellow-500/25'
                }`}>
                  {dataSource === 'real' ? '🔴 LIVE DATA STREAM' : '⚡ ENHANCED DEMO MODE'}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{platformStats.totalTrends.toLocaleString()}</div>
              <div className="text-gray-400">Total Trends Tracked</div>
            </div>
          </div>

          {/* Enhanced Navigation Tabs */}
          <div 
            className="flex space-x-2 backdrop-blur-xl rounded-3xl p-2 border-2 max-w-md"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              borderColor: `${colors.accent}20`
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-500 flex-1 text-center justify-center ${
                  activeTab === tab.id
                    ? 'text-white shadow-2xl transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                style={activeTab === tab.id ? { 
                  background: colors.gradients.secondary,
                  boxShadow: `0 20px 40px ${colors.accent}25`
                } : {}}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Active Trends" 
            value={platformStats.totalTrends.toLocaleString()} 
            change={12.4}
            icon="🔥"
            color={colors.accent}
          />
          <StatCard 
            title="Engagement Rate" 
            value={`${platformStats.engagementRate}%`} 
            change={8.7}
            icon="📈"
            color={colors.warning}
          />
          <StatCard 
            title="Platform Growth" 
            value={`${platformStats.growthRate}%`} 
            change={15.2}
            icon="🚀"
            color={colors.orange}
          />
          <StatCard 
            title="Active Users" 
            value={platformStats.activeUsers.toLocaleString()} 
            change={5.9}
            icon="👥"
            color={colors.secondary}
          />
        </div>

        {/* Enhanced Platform Selection */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-12 rounded-full" style={{ background: colors.gradients.primary }}></div>
              <div>
                <h2 className="text-3xl font-bold text-white">Select Platform</h2>
                <p className="text-gray-400">Choose your content discovery source</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Last updated: Just now
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`relative p-8 rounded-3xl border-2 backdrop-blur-xl cursor-pointer transform transition-all duration-500 group overflow-hidden ${
                  selectedPlatform === platform.id
                    ? 'shadow-2xl scale-105'
                    : 'hover:scale-105 hover:shadow-2xl'
                }`}
                style={{
                  background: selectedPlatform === platform.id 
                    ? platform.gradient
                    : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                  borderColor: selectedPlatform === platform.id 
                    ? `${platform.color}60`
                    : 'rgba(255,255,255,0.1)'
                }}
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ background: `radial-gradient(circle at center, ${platform.color}15 0%, transparent 70%)` }}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${
                      selectedPlatform === platform.id ? 'bg-white/20' : 'bg-white/5'
                    }`}>
                      {platform.icon}
                    </div>
                    {selectedPlatform === platform.id && (
                      <div className="w-4 h-4 rounded-full animate-ping" style={{ backgroundColor: platform.color }}></div>
                    )}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${
                    selectedPlatform === platform.id ? 'text-white' : 'text-white'
                  }`}>
                    {platform.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${
                      selectedPlatform === platform.id ? 'text-white/80' : 'text-gray-400'
                    }`}>
                      {platform.stats}
                    </p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      selectedPlatform === platform.id ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400'
                    }`}>
                      {platform.growth}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Filters & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <div 
            className="backdrop-blur-xl rounded-2xl p-6 border-2"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              borderColor: `${colors.accent}20`
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center space-x-2">
              <span>🎯</span>
              <span>Interest</span>
            </h3>
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50"
              style={{ focusBorderColor: colors.accent }}
            >
              {interests.map((interest) => (
                <option key={interest} value={interest} className="bg-gray-800">{interest}</option>
              ))}
            </select>
          </div>

          <div 
            className="backdrop-blur-xl rounded-2xl p-6 border-2"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              borderColor: `${colors.warning}20`
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center space-x-2">
              <span>📊</span>
              <span>Sort By</span>
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400/50"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option} className="bg-gray-800">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div 
            className="backdrop-blur-xl rounded-2xl p-6 border-2"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              borderColor: `${colors.orange}20`
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center space-x-2">
              <span>⏰</span>
              <span>Time Range</span>
            </h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 backdrop-blur-sm transition-all duration-300 hover:border-orange-400/50"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id} className="bg-gray-800">{range.label}</option>
              ))}
            </select>
          </div>

          <div 
            className="backdrop-blur-xl rounded-2xl p-6 border-2 flex items-center justify-center group cursor-pointer transform transition-all duration-500 hover:scale-105"
            style={{ 
              background: colors.gradients.premium,
              borderColor: `${colors.warning}40`
            }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {trends.length}
              </div>
              <div className="text-white/90 font-semibold">Active Trends</div>
              <div className="text-white/70 text-sm mt-1">Real-time count</div>
            </div>
          </div>
        </div>

        {/* Featured Creators Section */}
        {featuredCreators.length > 0 && (
          <div 
            className="backdrop-blur-xl rounded-3xl p-8 mb-12 border-2 relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.accent}10 100%)`,
              borderColor: `${colors.accent}30`
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full opacity-10" 
                 style={{ background: colors.gradients.accent }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-12 rounded-full" style={{ background: colors.gradients.warning }}></div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Featured Creators</h3>
                    <p className="text-gray-400">Top performers on {selectedPlatform}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold border border-cyan-500/30">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>LIVE RANKING</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCreators.map((creator, index) => (
                  <div
                    key={index}
                    className="group backdrop-blur-lg border-2 border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {creator.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white group-hover:text-cyan-200 transition-colors">
                            {creator.name}
                          </span>
                          {creator.verified && (
                            <span className="text-cyan-400 text-sm">✓</span>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                          {creator.followers}
                        </div>
                      </div>
                    </div>
                    <div className="text-cyan-300 font-medium text-sm mb-3">{creator.specialty}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Engagement</span>
                      <span className="text-green-400 text-sm font-bold">{(Math.random() * 30 + 10).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Trends Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-12 rounded-full" style={{ background: colors.gradients.orange }}></div>
              <div>
                <h2 className="text-3xl font-bold text-white">Trending Content</h2>
                <p className="text-gray-400">Real-time trending topics and insights</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {loading ? 'Loading...' : `${trends.length} trends found`}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading && trends.length === 0 ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="backdrop-blur-lg border-2 border-white/10 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-700 rounded"></div>
                </div>
              ))
            ) : (
              trends.map((trend, index) => (
                <div
                  key={index}
                  className="group backdrop-blur-lg border-2 border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                >
                  {/* Gradient accent line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Trend Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors duration-300">
                        {platforms.find(p => p.id === trend.platform)?.icon}
                      </div>
                      <span className="text-sm text-gray-400 font-medium">{trend.platform}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold backdrop-blur-sm"
                        style={{ backgroundColor: getSentimentColor(trend.sentiment || 'neutral') + '20', color: getSentimentColor(trend.sentiment || 'neutral') }}
                      >
                        {getSentimentIcon(trend.sentiment || 'neutral')}
                      </div>
                    </div>
                  </div>

                  {/* Hashtag */}
                  <div
                    className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 cursor-pointer transition-all duration-300 group-hover:scale-105 shadow-lg"
                    style={{ background: colors.gradients.accent }}
                    onClick={() => toggleKeyword(trend.hashtag || '#trending')}
                  >
                    {trend.hashtag || '#trending'}
                  </div>

                  {/* Headline */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-100 transition-colors">
                    {trend.headline || 'Trending Content'}
                  </h3>

                  {/* Content */}
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {trend.content || 'Exciting trending content for your audience'}
                  </p>

                  {/* Music */}
                  <div className="flex items-center mb-6 bg-white/5 rounded-xl p-3 group-hover:bg-white/10 transition-colors duration-300">
                    <span className="text-lg mr-3">🎵</span>
                    <span className="text-cyan-400 font-medium">{trend.music || 'Trending Beat'}</span>
                  </div>

                  {/* Popular Creators */}
                  {trend.creators && trend.creators.length > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4 group-hover:border-cyan-400/40 transition-colors duration-300">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-cyan-400 text-sm font-semibold">👑 Popular Creators</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trend.creators.slice(0, 3).map((creator, creatorIndex) => (
                          <div
                            key={creatorIndex}
                            className="group/creator flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 cursor-pointer"
                            title={`${creator.name} - ${creator.specialty}`}
                          >
                            <span className="text-sm">{creator.avatar}</span>
                            <span className="text-xs font-medium text-white group-hover/creator:text-cyan-200 transition-colors">
                              {creator.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-3 text-center mb-6">
                    {[
                      { label: 'Likes', value: trend.metrics?.likes || 50, color: '#EF4444' },
                      { label: 'Shares', value: trend.metrics?.shares || 30, color: '#10B981' },
                      { label: 'Views', value: trend.metrics?.views || 60, color: colors.accent },
                      { label: 'Comments', value: trend.metrics?.comments || 20, color: colors.warning }
                    ].map((metric, idx) => (
                      <div key={idx} className="text-center group/metric">
                        <div className="text-xs text-gray-500 mb-1 group-hover/metric:text-white transition-colors">{metric.label}</div>
                        <div className="text-lg font-bold group-hover/metric:scale-110 transition-transform duration-300" style={{ color: metric.color }}>
                          {metric.value}%
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Growth & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400">Growth:</span>
                      <span className="text-green-400 font-bold">+{trend.growth || 25}%</span>
                    </div>
                    <button
                      onClick={() => toggleKeyword(trend.hashtag || '#trending')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        selectedKeywords.includes(trend.hashtag || '#trending')
                          ? 'shadow-2xl transform scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                      }`}
                      style={selectedKeywords.includes(trend.hashtag || '#trending') ? { 
                        background: colors.gradients.accent 
                      } : {}}
                    >
                      {selectedKeywords.includes(trend.hashtag || '#trending') ? '✓ Added' : '+ Analyze'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Load More */}
        <div className="text-center mb-12">
          <button
            onClick={loadMoreTrends}
            disabled={loading}
            className="relative px-12 py-4 rounded-2xl font-bold text-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            style={{ 
              background: colors.gradients.premium,
              boxShadow: '0 20px 40px rgba(91, 219, 255, 0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 group-hover:from-white/10 group-hover:to-transparent transition-all duration-500"></div>
            <span className="relative z-10">
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading More Trends...</span>
                </div>
              ) : (
                '🚀 Load More Trends'
              )}
            </span>
          </button>
        </div>

        {/* Selected Keywords & Graph */}
        {selectedKeywords.length > 0 && (
          <div className="space-y-8">
            <div 
              className="backdrop-blur-xl rounded-3xl p-8 border-2 relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.warning}10 100%)`,
                borderColor: `${colors.warning}30`
              }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 -mr-24 -mt-24 rounded-full opacity-10" 
                   style={{ background: colors.gradients.warning }}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-12 rounded-full" style={{ background: colors.gradients.warning }}></div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Selected Keywords</h3>
                      <p className="text-gray-400">Ready for in-depth analysis</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGraph(!showGraph)}
                    className="px-6 py-3 rounded-xl font-bold transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                    style={{ 
                      background: colors.gradients.warning,
                      boxShadow: showGraph ? `0 20px 40px ${colors.warning}25` : 'none'
                    }}
                  >
                    {showGraph ? '📊 Hide Analysis' : '📈 Show Analysis'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-4 py-2 rounded-full font-semibold flex items-center space-x-2 group hover:scale-105 transition-all duration-300 shadow-lg"
                      style={{ background: colors.gradients.accent }}
                    >
                      <span>{keyword}</span>
                      <button
                        onClick={() => toggleKeyword(keyword)}
                        className="text-black hover:text-gray-700 font-bold text-lg transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {showGraph && <KeywordGraph />}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendDiscovery;