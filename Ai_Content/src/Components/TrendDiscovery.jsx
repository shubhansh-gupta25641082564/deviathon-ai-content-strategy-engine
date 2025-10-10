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
  const [dataSource, setDataSource] = useState('loading'); // 'real', 'fallback', 'loading'

  const platforms = [
    { id: 'YouTube', name: 'YouTube Shorts', icon: <img src={shorts} alt="Yt Shorts" className='w-20' />, color: 'from-red-500 to-red-600' },
    { id: 'Reddit', name: 'Reddit', icon: <img src={reddit} alt="Reddit" className='w-20' />, color: 'from-orange-500 to-red-500' },
    { id: 'Trends', name: 'Google Trends', icon: <img src={g_trends} alt="G Trends" className='w-20' />, color: 'from-blue-500 to-green-500' },
    { id: 'News', name: 'Tech News', icon: <img src={news} alt="News" className='w-20' />, color: 'from-gray-600 to-gray-700' }
  ];

  const interests = ['All', 'Technology', 'Lifestyle', 'Gaming', 'Education', 'Business', 'Entertainment'];
  const sortOptions = ['trending', 'engagement', 'recent', 'viral'];

  useEffect(() => {
    loadTrends();
    loadFeaturedCreators();
  }, [selectedPlatform, selectedInterest, sortBy]);

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
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  const KeywordGraph = () => {
    if (!selectedKeywords.length) return null;

    const maxValue = Math.max(...selectedKeywords.map(() => Math.random() * 100 + 50));

    return (
      <div className="bg-[#18181b] border border-white/10 rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-bold text-white mb-6">Keyword Trend Analysis</h3>
        <div className="space-y-4">
          {selectedKeywords.map((keyword, index) => {
            const value = Math.random() * 100 + 50;
            const percentage = (value / maxValue) * 100;

            return (
              <div key={keyword} className="space-y-2">
                <div className="flex justify-between text-white">
                  <span className="font-medium">{keyword}</span>
                  <span className="text-cyan-400">{Math.round(value)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Trend Discovery
            </h1>
            {dataSource !== 'loading' && (
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                dataSource === 'real' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {dataSource === 'real' ? '🔴 LIVE DATA' : '⚡ DEMO DATA'}
              </div>
            )}
          </div>
          <p className="text-gray-400 text-lg">
            {dataSource === 'real' 
              ? 'Real-time trending content from live APIs'
              : 'Trending content across all major platforms'
            }
          </p>
          {dataSource === 'fallback' && (
            <p className="text-yellow-400 text-sm mt-2">
              💡 Start the backend server with "npm start" in the server folder to see real live data
            </p>
          )}
        </div>

        {/* Featured Creators */}
        {featuredCreators.length > 0 && (
          <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">👑</span>
              <h3 className="text-xl font-bold text-white">Featured Creators on {selectedPlatform}</h3>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
                LIVE
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Popular content creators who excel in this platform's trending topics
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredCreators.map((creator, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 hover:border-purple-400/40 hover:from-purple-500/15 hover:to-pink-500/15 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {creator.avatar}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-white text-sm group-hover:text-purple-200 transition-colors">
                          {creator.name}
                        </span>
                        {creator.verified && (
                          <span className="text-blue-400 text-xs">✓</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                        {creator.followers}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-300 font-medium">{creator.specialty}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Platform Selection */}
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-3 rounded-xl border transition-all duration-300 ${selectedPlatform === platform.id
                    ? `bg-gradient-to-r ${platform.color} border-transparent text-white`
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                    }`}
                >
                  <div className="text-2xl mb-1 ml-14">{platform.icon}</div>
                  <div className="text-sm font-medium">{platform.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interest Selection */}
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Interest</h3>
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="w-full bg-[#232323] border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {interests.map((interest) => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#232323] border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trends Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {loading && trends.length === 0 ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-[#18181b] border border-white/10 rounded-2xl p-6 animate-pulse">
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
                className="bg-[#18181b] border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Trend Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {platforms.find(p => p.id === trend.platform)?.icon || '📱'}
                    </span>
                    <span className="text-sm text-gray-400">{trend.platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={getSentimentColor(trend.sentiment || 'neutral')}>
                      {getSentimentIcon(trend.sentiment || 'neutral')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(trend.engagement || 0).toLocaleString()} interactions
                    </span>
                  </div>
                </div>

                {/* Hashtag */}
                <div
                  className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-3 py-1 rounded-full text-sm font-medium mb-3 cursor-pointer hover:from-cyan-300 hover:to-blue-400"
                  onClick={() => toggleKeyword(trend.hashtag || '#trending')}
                >
                  {trend.hashtag || '#trending'}
                </div>

                {/* Headline */}
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{trend.headline || 'Trending Content'}</h3>

                {/* Content */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{trend.content || 'Exciting trending content for your audience'}</p>

                {/* Music */}
                <div className="flex items-center mb-4">
                  <span className="text-lg mr-2">🎵</span>
                  <span className="text-sm text-cyan-400">{trend.music || 'Trending Beat'}</span>
                </div>

                {/* Popular Creators */}
                {trend.creators && trend.creators.length > 0 && (
                  <div className="mb-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-purple-400 font-semibold">👑 Popular Creators</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trend.creators.map((creator, creatorIndex) => (
                        <div
                          key={creatorIndex}
                          className="group flex items-center space-x-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-3 py-1 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400 transition-all duration-300 cursor-pointer"
                          title={`${creator.name} - ${creator.specialty}`}
                        >
                          <span className="text-sm">{creator.avatar}</span>
                          <span className="text-xs font-medium text-white group-hover:text-purple-200 transition-colors">
                            {creator.name}
                          </span>
                          {creator.verified && (
                            <span className="text-xs text-blue-400">✓</span>
                          )}
                          <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                            {creator.followers}
                          </span>
                        </div>
                      ))}
                    </div>
                    {trend.creators[0]?.specialty && (
                      <div className="text-xs text-purple-300 mt-2 flex items-center space-x-1">
                        <span>✨</span>
                        <span>Expert in {trend.creators[0].specialty}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-2 text-center mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Likes</div>
                    <div className="text-sm font-bold text-red-400">{trend.metrics?.likes || 50}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Shares</div>
                    <div className="text-sm font-bold text-green-400">{trend.metrics?.shares || 30}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Views</div>
                    <div className="text-sm font-bold text-blue-400">{trend.metrics?.views || 60}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Comments</div>
                    <div className="text-sm font-bold text-yellow-400">{trend.metrics?.comments || 20}%</div>
                  </div>
                </div>

                {/* Growth Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Growth:</span>
                    <span className="text-xs font-bold text-green-400">+{trend.growth || 25}%</span>
                  </div>
                  <button
                    onClick={() => toggleKeyword(trend.hashtag || '#trending')}
                    className={`px-3 py-1 rounded-lg text-xs transition-all duration-300 ${selectedKeywords.includes(trend.hashtag || '#trending')
                      ? 'bg-cyan-400 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                  >
                    {selectedKeywords.includes(trend.hashtag || '#trending') ? 'Added' : 'Add to Graph'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        <div className="text-center mb-8">
          <button
            onClick={loadMoreTrends}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-3 rounded-xl font-semibold hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'Load More Trends'
            )}
          </button>
        </div>

        {/* Selected Keywords */}
        {selectedKeywords.length > 0 && (
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Selected Keywords for Analysis</h3>
              <button
                onClick={() => setShowGraph(!showGraph)}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-4 py-2 rounded-lg font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300"
              >
                {showGraph ? 'Hide Graph' : 'Show Graph'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
                >
                  <span>{keyword}</span>
                  <button
                    onClick={() => toggleKeyword(keyword)}
                    className="text-black hover:text-gray-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Keyword Graph */}
        {showGraph && <KeywordGraph />}
      </div>
    </div>
  );
};

export default TrendDiscovery;
