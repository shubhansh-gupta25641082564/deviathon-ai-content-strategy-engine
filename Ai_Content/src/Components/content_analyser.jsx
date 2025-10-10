import React, { useState } from "react";

const ContentAnalyzer = () => {
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("analyze");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState("quick");

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResults({
        overallScore: 87,
        sentiment: {
          score: 85,
          label: "Positive",
          color: "#5ADBFF"
        },
        readability: {
          score: 78,
          label: "Good",
          color: "#FFDD4A"
        },
        seo: {
          score: 92,
          label: "Excellent",
          color: "#FE9000"
        },
        engagement: {
          score: 81,
          label: "High",
          color: "#3C6997"
        },
        keywords: ["AI", "content", "analysis", "performance", "creative", "strategy", "optimization"],
        recommendations: [
          "Add more specific examples to support claims",
          "Include relevant data points for credibility",
          "Consider shortening complex sentences",
          "Add call-to-action for better engagement"
        ],
        metrics: {
          wordCount: 245,
          readingTime: "1.2 min",
          sentenceLength: "18.2 words",
          paragraphCount: 12
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleGenerate = () => {
    setContent("Here's AI-generated content optimized for your audience... This content follows best practices for engagement and incorporates data-driven insights to maximize impact and reach.");
  };

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
                  CA
                </span>
              </div>
              <div>
                <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                  Content Analyzer
                </h1>
                <p className="text-[#E2F3FF] text-lg font-medium">
                  Analyze, optimize, and create high-performing content
                </p>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('quick')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all relative overflow-hidden ${
                    viewMode === 'quick' 
                      ? 'bg-white text-[#3C6997] shadow-lg' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {viewMode === 'quick' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  )}
                  <span className="relative">Quick Analysis</span>
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
                  <span className="relative">Detailed Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview with Glow */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Avg. Score', value: '87%', color: '#3C6997' },
            { label: 'Processing Time', value: '1.2s', color: '#5ADBFF' },
            { label: 'Content Analyzed', value: '2.4K', color: '#FFDD4A' },
            { label: 'Success Rate', value: '98.7%', color: '#FE9000' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
            >
              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"
                style={{ backgroundColor: stat.color }}
              ></div>
              <div className="text-white/60 text-sm font-semibold mb-2 relative z-10">{stat.label}</div>
              <div 
                className="text-2xl font-bold relative z-10"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewMode === 'quick' ? (
        /* Quick Analysis View with Enhanced Effects */
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Input Panel */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-[#5ADBFF]/30 transition-all duration-500">
            {/* Panel Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3C6997]/10 via-transparent to-[#5ADBFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Tab Navigation */}
            <div className="flex gap-3 mb-8 relative z-10">
              {["analyze", "generate", "optimize"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all capitalize relative overflow-hidden ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-[#3C6997] to-[#5ADBFF] text-white shadow-lg' 
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {activeTab === tab && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  )}
                  <span className="relative">{tab}</span>
                </button>
              ))}
            </div>

            {/* Content Input */}
            <div className="mb-6 relative z-10">
              <label className="text-white font-semibold text-lg mb-4 block">
                {activeTab === 'analyze' ? 'Content to Analyze' : 
                 activeTab === 'generate' ? 'Content Brief' : 'Content to Optimize'}
              </label>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    activeTab === 'analyze' 
                      ? "Paste your content here for instant analysis...\n\nWe'll analyze:\n• Sentiment & Emotional Tone\n• Readability & Complexity\n• SEO Optimization\n• Engagement Potential\n• Keyword Effectiveness"
                      : activeTab === 'generate'
                      ? "Describe what you want to create...\n\nExamples:\n• Blog post about AI trends in 2025\n• Product description for new mobile app\n• Social media campaign for brand launch\n• Email newsletter for subscriber engagement"
                      : "Paste content that needs optimization...\n\nWe'll help you:\n• Improve readability scores\n• Enhance SEO performance\n• Boost engagement metrics\n• Optimize for target audience"
                  }
                  className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-white/40 resize-none outline-none transition-all focus:border-[#5ADBFF] focus:ring-2 focus:ring-[#5ADBFF]/20 backdrop-blur-sm"
                />
                <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg text-white/60 text-sm border border-white/10">
                  {content.length} characters
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-[#3C6997] to-[#5ADBFF] text-white font-bold py-4 px-6 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#5ADBFF] to-[#3C6997] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div>
                    <span className="relative z-10">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">🔍</span>
                    <span className="relative z-10">Analyze Content</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-[#FFDD4A] to-[#FE9000] text-[#0A192F] font-bold py-4 px-6 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FE9000] to-[#FFDD4A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                <span className="relative z-10">✨</span>
                <span className="relative z-10">Generate AI Content</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 relative z-10">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "📊", label: "SEO Check", color: "#3C6997" },
                  { icon: "🎯", label: "Optimize", color: "#5ADBFF" },
                  { icon: "📈", label: "A/B Test", color: "#FFDD4A" },
                  { icon: "💡", label: "Ideas", color: "#FE9000" },
                  { icon: "🔤", label: "Translate", color: "#3C6997" },
                  { icon: "📝", label: "Summarize", color: "#5ADBFF" }
                ].map((action, index) => (
                  <button
                    key={index}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Action Card Glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ backgroundColor: action.color }}
                    ></div>
                    <div 
                      className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10" 
                      style={{ color: action.color }}
                    >
                      {action.icon}
                    </div>
                    <div className="text-white/80 text-sm font-medium relative z-10">{action.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-[#FFDD4A]/30 transition-all duration-500">
            {/* Panel Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFDD4A]/10 via-transparent to-[#FE9000]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h2 className="text-white font-bold text-2xl mb-6 relative z-10">Analysis Results</h2>
            
            {analysisResults ? (
              <div className="space-y-6 relative z-10">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 bg-[#5ADBFF] rounded-full opacity-20 blur-xl animate-pulse"></div>
                    <svg className="w-32 h-32 transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke="url(#scoreGradient)" 
                        strokeWidth="8" 
                        fill="none" 
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 * (1 - analysisResults.overallScore / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3C6997" />
                          <stop offset="100%" stopColor="#5ADBFF" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white font-bold text-3xl drop-shadow-lg">{analysisResults.overallScore}</div>
                        <div className="text-white/60 text-sm">Overall</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metric Scores */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Sentiment", data: analysisResults.sentiment },
                    { label: "Readability", data: analysisResults.readability },
                    { label: "SEO Score", data: analysisResults.seo },
                    { label: "Engagement", data: analysisResults.engagement }
                  ].map((metric, index) => (
                    <div 
                      key={index} 
                      className="bg-white/5 rounded-xl p-4 text-center group hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Metric Card Glow */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{ backgroundColor: metric.data.color }}
                      ></div>
                      <div className="text-white/60 text-sm mb-1 relative z-10">{metric.label}</div>
                      <div className="text-2xl font-bold mb-1 relative z-10" style={{ color: metric.data.color }}>
                        {metric.data.score}
                      </div>
                      <div className="text-white/80 text-sm relative z-10">{metric.data.label}</div>
                    </div>
                  ))}
                </div>

                {/* Keywords */}
                <div className="relative z-10">
                  <h4 className="text-white font-semibold mb-3">Top Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-white/10 text-white/90 px-3 py-1 rounded-lg text-sm border border-white/10 hover:border-[#5ADBFF]/50 transition-all duration-300 hover:scale-105"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Metrics */}
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  {Object.entries(analysisResults.metrics).map(([key, value], index) => (
                    <div 
                      key={index} 
                      className="bg-white/5 rounded-xl p-3 text-center group hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="text-white/60 text-xs mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-white font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 relative z-10">
                <div className="text-6xl mb-4 opacity-50 animate-pulse">📊</div>
                <h3 className="text-white text-xl font-semibold mb-2">No Analysis Yet</h3>
                <p className="text-white/60">
                  {isAnalyzing 
                    ? "Analyzing your content..." 
                    : "Paste your content and click Analyze to get insights"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Detailed Report View - Enhanced with Glow Effects */
        <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-[#3C6997]/30 transition-all duration-500">
            {/* Main Panel Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3C6997]/10 via-transparent to-[#FE9000]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {/* Left Column - Detailed Metrics */}
              <div className="lg:col-span-2 space-y-6">
                {/* Comprehensive Score Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analysisResults ? Object.entries(analysisResults).filter(([key]) => 
                    ['sentiment', 'readability', 'seo', 'engagement'].includes(key)
                  ).map(([key, data]) => (
                    <div 
                      key={key} 
                      className="bg-white/5 rounded-2xl p-4 text-center group hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Score Card Glow */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{ backgroundColor: data.color }}
                      ></div>
                      <div className="text-white/60 text-sm mb-2 capitalize relative z-10">{key}</div>
                      <div className="text-3xl font-bold mb-1 relative z-10" style={{ color: data.color }}>
                        {data.score}
                      </div>
                      <div className="text-white/80 text-sm relative z-10">{data.label}</div>
                    </div>
                  )) : (
                    // Placeholder with glow
                    Array(4).fill(0).map((_, index) => (
                      <div key={index} className="bg-white/5 rounded-2xl p-4 text-center animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
                        <div className="h-4 bg-white/10 rounded mb-2 mx-auto w-16 relative z-10"></div>
                        <div className="h-8 bg-white/10 rounded mb-1 mx-auto w-12 relative z-10"></div>
                        <div className="h-4 bg-white/10 rounded mx-auto w-20 relative z-10"></div>
                      </div>
                    ))
                  )}
                </div>

                {/* Recommendations */}
                {analysisResults && (
                  <div className="bg-white/5 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                    {/* Recommendations Glow */}
                    <div className="absolute inset-0 bg-[#FFDD4A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2 relative z-10">
                      <span className="text-[#FFDD4A]">💡</span> Optimization Recommendations
                    </h3>
                    <div className="space-y-3 relative z-10">
                      {analysisResults.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 text-white/80 group-hover:text-white transition-colors">
                          <div className="w-2 h-2 bg-[#FE9000] rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                          <div>{rec}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Preview */}
                <div className="bg-white/5 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                  {/* Preview Glow */}
                  <div className="absolute inset-0 bg-[#5ADBFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <h3 className="text-white font-bold text-xl mb-4 relative z-10">Content Preview</h3>
                  <div className="bg-black/20 rounded-xl p-4 max-h-48 overflow-y-auto relative z-10">
                    <p className="text-white/70 text-sm leading-relaxed">
                      {content || "Your content will appear here after analysis..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions & Export */}
              <div className="space-y-6">
                {/* Export Options */}
                <div className="bg-white/5 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                  {/* Export Glow */}
                  <div className="absolute inset-0 bg-[#3C6997]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <h3 className="text-white font-bold text-xl mb-4 relative z-10">Export Report</h3>
                  <div className="space-y-3 relative z-10">
                    {['PDF Report', 'CSV Data', 'Shareable Link', 'Presentation'].map((option, index) => (
                      <button
                        key={index}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-white text-left transition-all duration-300 flex items-center justify-between group/btn hover:border-[#5ADBFF]/50"
                      >
                        <span>{option}</span>
                        <span className="text-white/60 group-hover/btn:text-white transition-colors">↓</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Suggestions */}
                <div className="bg-gradient-to-r from-[#FFDD4A] to-[#FE9000] rounded-2xl p-6 relative overflow-hidden group">
                  {/* AI Button Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FE9000] to-[#FFDD4A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                  <h3 className="text-[#0A192F] font-bold text-xl mb-3 relative z-10">AI Content Assistant</h3>
                  <p className="text-[#0A192F]/80 mb-4 text-sm relative z-10">
                    Let AI help you improve this content based on the analysis results.
                  </p>
                  <button className="w-full bg-white text-[#0A192F] font-bold py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg relative z-10">
                    Enhance with AI →
                  </button>
                </div>

                {/* Quick Stats */}
                {analysisResults && (
                  <div className="bg-white/5 rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                    {/* Stats Glow */}
                    <div className="absolute inset-0 bg-[#5ADBFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h3 className="text-white font-bold text-xl mb-4 relative z-10">Content Statistics</h3>
                    <div className="space-y-3 relative z-10">
                      {Object.entries(analysisResults.metrics).map(([key, value], index) => (
                        <div key={index} className="flex justify-between items-center group-hover:text-white transition-colors">
                          <span className="text-white/60 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-white font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
};

export default ContentAnalyzer;