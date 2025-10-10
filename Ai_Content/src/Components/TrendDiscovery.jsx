import React, { useState, useEffect } from 'react';
import { generatePlatformContent, generatePerformanceMetrics } from './generator/platform_generators';
import shorts from '../assets/logos/yt_shorts.png'
import reddit from '../assets/logos/reddit.png'
import g_trends from '../assets/logos/g_trends.png'
import news from '../assets/logos/news.jpg'

const TrendDiscovery = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube');
  const [selectedInterest, setSelectedInterest] = useState('All');
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [sortBy, setSortBy] = useState('trending');

  const platforms = [
    { id: 'YouTube', name: 'YouTube Shorts', icon: <img src={shorts} alt="Yt Shorts" className='w-50'/>, color: 'from-red-500 to-red-600' },
    { id: 'Reddit', name: 'Reddit', icon: <img src={reddit} alt="Reddit"  className='w-50'/>, color: 'from-orange-500 to-red-500' },
    { id: 'Trends', name: 'Google Trends', icon: <img src={g_trends} alt="G Trends" className='w-50'/>, color: 'from-blue-500 to-green-500' },
    { id: 'News', name: 'Tech News', icon: <img src={news} alt="News" className='w-50'/>, color: 'from-gray-600 to-gray-700' }
  ];

  const interests = ['All', 'Technology', 'Lifestyle', 'Gaming', 'Education', 'Business', 'Entertainment'];
  const sortOptions = ['trending', 'engagement', 'recent', 'viral'];

  useEffect(() => {
    loadTrends();
  }, [selectedPlatform, selectedInterest, sortBy]);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const data = await generatePlatformContent(selectedPlatform, 1);
      const trendsWithMetrics = await Promise.all(
        data.map(async (trend) => ({
          ...trend,
          platform: selectedPlatform,
          metrics: await generatePerformanceMetrics(selectedPlatform),
          sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
          engagement: Math.floor(Math.random() * 50000) + 10000,
          growth: Math.floor(Math.random() * 200) + 50
        }))
      );
      setTrends(trendsWithMetrics);
      setPage(1);
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTrends = async () => {
    setLoading(true);
    try {
      const newPage = page + 1;
      const data = await generatePlatformContent(selectedPlatform, newPage);
      const trendsWithMetrics = await Promise.all(
        data.map(async (trend) => ({
          ...trend,
          platform: selectedPlatform,
          metrics: await generatePerformanceMetrics(selectedPlatform),
          sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
          engagement: Math.floor(Math.random() * 50000) + 10000,
          growth: Math.floor(Math.random() * 200) + 50
        }))
      );
      setTrends(prev => [...prev, ...trendsWithMetrics]);
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
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Trend Discovery
          </h1>
          <p className="text-gray-400 text-lg">
            Real-time trending content across all major platforms
          </p>
        </div>

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
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    selectedPlatform === platform.id
                      ? `bg-gradient-to-r ${platform.color} border-transparent text-white`
                      : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  }`}
                >
                  <div className="text-2xl mb-1">{platform.icon}</div>
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
                      {platforms.find(p => p.id === trend.platform)?.icon}
                    </span>
                    <span className="text-sm text-gray-400">{trend.platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={getSentimentColor(trend.sentiment)}>
                      {getSentimentIcon(trend.sentiment)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {trend.engagement.toLocaleString()} interactions
                    </span>
                  </div>
                </div>

                {/* Hashtag */}
                <div
                  className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-3 py-1 rounded-full text-sm font-medium mb-3 cursor-pointer hover:from-cyan-300 hover:to-blue-400"
                  onClick={() => toggleKeyword(trend.hashtag)}
                >
                  {trend.hashtag}
                </div>

                {/* Headline */}
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{trend.headline}</h3>

                {/* Content */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{trend.content}</p>

                {/* Music */}
                <div className="flex items-center mb-4">
                  <span className="text-lg mr-2">🎵</span>
                  <span className="text-sm text-cyan-400">{trend.music}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-2 text-center mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Likes</div>
                    <div className="text-sm font-bold text-red-400">{trend.metrics.likes}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Shares</div>
                    <div className="text-sm font-bold text-green-400">{trend.metrics.shares}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Views</div>
                    <div className="text-sm font-bold text-blue-400">{trend.metrics.views}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Comments</div>
                    <div className="text-sm font-bold text-yellow-400">{trend.metrics.comments}%</div>
                  </div>
                </div>

                {/* Growth Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Growth:</span>
                    <span className="text-xs font-bold text-green-400">+{trend.growth}%</span>
                  </div>
                  <button
                    onClick={() => toggleKeyword(trend.hashtag)}
                    className={`px-3 py-1 rounded-lg text-xs transition-all duration-300 ${
                      selectedKeywords.includes(trend.hashtag)
                        ? 'bg-cyan-400 text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {selectedKeywords.includes(trend.hashtag) ? 'Added' : 'Add to Graph'}
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
