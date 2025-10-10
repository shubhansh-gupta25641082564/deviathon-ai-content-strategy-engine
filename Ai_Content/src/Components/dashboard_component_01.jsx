import React, { useEffect, useState } from 'react';
import cclogo from '../assets/logos/cc_logo.png';

const DashboardComponent = ({ onShowLogin, onShowSignup }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Color constants
  const colors = {
    primary: '#094074',
    secondary: '#3C6997',
    accent: '#5ADBFF',
    warning: '#FFDD4A',
    orange: '#FE9000'
  };

  const features = [
    {
      title: "AI-Powered Analytics",
      description: "Get deep insights into your content performance with advanced AI algorithms",
      icon: "📊",
      gradient: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`
    },
    {
      title: "Competitor Intelligence", 
      description: "Stay ahead of the competition with real-time tracking and analysis",
      icon: "🔍",
      gradient: `linear-gradient(135deg, ${colors.warning} 0%, ${colors.orange} 100%)`
    },
    {
      title: "Content Strategy",
      description: "Optimize your content strategy with data-driven recommendations",
      icon: "🚀",
      gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
    },
    {
      title: "Trend Discovery",
      description: "Discover emerging trends before they go mainstream", 
      icon: "🌟",
      gradient: `linear-gradient(135deg, ${colors.orange} 0%, ${colors.warning} 100%)`
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "24/7", label: "Real-time Monitoring" },
    { number: "50+", label: "AI Models" }
  ];

  return (
    <div 
      className="min-h-screen font-sans overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)` 
      }}
    >
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ backgroundColor: colors.accent }}
          ></div>
          <div 
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"
            style={{ backgroundColor: colors.warning }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse delay-500"
            style={{ backgroundColor: colors.orange }}
          ></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Logo */}
          <div className={`mb-8 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <img 
              src={cclogo} 
              alt="ContentCraftAI Logo"
              className="mx-auto mb-6 h-24 md:h-32 w-auto"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
                const fallback = document.createElement('h1');
                fallback.className = 'text-6xl md:text-8xl font-bold mb-6';
                fallback.style.background = `linear-gradient(45deg, ${colors.warning}, ${colors.accent}, ${colors.orange})`;
                fallback.style.WebkitBackgroundClip = 'text';
                fallback.style.WebkitTextFillColor = 'transparent';
                fallback.style.backgroundClip = 'text';
                fallback.textContent = 'ContentCraftAI';
                e.target.parentNode.appendChild(fallback);
              }}
            />
            <p className="text-2xl md:text-3xl text-white mb-8 font-light">
              Transform Your Digital Strategy with <span style={{ color: colors.accent }} className="font-semibold">AI-Powered</span> Insights
            </p>
          </div>

          {/* Subheading */}
          <div className={`mb-12 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Unlock the power of artificial intelligence to analyze, optimize, and dominate your market. 
              Get actionable insights that drive real results.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button 
              onClick={onShowLogin}
              className="px-12 py-4 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
              style={{ 
                backgroundColor: colors.warning,
                color: colors.primary
              }}
            >
              Get Started Free
            </button>
            <button 
              onClick={onShowSignup}
              className="px-12 py-4 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all duration-300"
              style={{ 
                border: `2px solid ${colors.accent}`,
                color: colors.accent,
                backgroundColor: 'transparent'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = colors.accent;
                e.target.style.color = colors.primary;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = colors.accent;
              }}
            >
              Create Account
            </button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: colors.warning }}
                >
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="animate-bounce">
            <div 
              className="w-6 h-10 border-2 rounded-full flex justify-center"
              style={{ borderColor: colors.accent }}
            >
              <div 
                className="w-1 h-3 rounded-full mt-2 animate-pulse"
                style={{ backgroundColor: colors.accent }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div 
        className="py-20 px-4"
        style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <img 
              src={cclogo} 
              alt="ContentCraftAI Logo"
              className="mx-auto mb-6 h-16 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = document.createElement('h2');
                fallback.className = 'text-4xl md:text-5xl font-bold text-white mb-6';
                fallback.innerHTML = 'Why Choose <span style="color: #FFDD4A">ContentCraftAI</span>?';
                e.target.parentNode.appendChild(fallback);
              }}
            />
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with intuitive design to give you the competitive edge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-8 rounded-3xl text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl ${
                  loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  background: feature.gradient,
                  transitionDelay: `${800 + index * 200}ms` 
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-100 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div 
        className="py-20 px-4"
        style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)` }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`p-12 rounded-3xl shadow-2xl transition-all duration-1000 delay-1000 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ 
              background: `linear-gradient(45deg, ${colors.accent}, ${colors.warning})`
            }}
          >
            <img 
              src={cclogo} 
              alt="ContentCraftAI Logo"
              className="mx-auto mb-6 h-20 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = document.createElement('h2');
                fallback.className = 'text-4xl md:text-5xl font-bold mb-6';
                fallback.style.color = colors.primary;
                fallback.textContent = 'Ready to Transform Your Strategy?';
                e.target.parentNode.appendChild(fallback);
              }}
            />
            <p 
              className="text-xl mb-8"
              style={{ color: colors.primary, opacity: 0.8 }}
            >
              Join thousands of marketers and businesses already using ContentCraftAI to drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onShowSignup}
                className="px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
                style={{ 
                  backgroundColor: colors.primary,
                  color: 'white'
                }}
              >
                Start Your Free Trial
              </button>
              <button 
                onClick={onShowLogin}
                className="px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transform transition-all duration-300"
                style={{ 
                  border: `2px solid ${colors.primary}`,
                  color: colors.primary,
                  backgroundColor: 'transparent'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = colors.primary;
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = colors.primary;
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;