import React, { useState, useEffect } from "react";

const platforms = [
  { label: "YouTube", value: "youtube", icon: "📺" },
  { label: "Google Trends", value: "google-trends", icon: "📊" },
  { label: "Reddit", value: "reddit", icon: "👥" },
  { label: "News", value: "news", icon: "📰" },
];

const tones = [
  { label: "Professional", value: "professional", description: "Formal and business-oriented" },
  { label: "Casual", value: "casual", description: "Friendly and approachable" },
  { label: "Witty", value: "witty", description: "Humorous and engaging" },
  { label: "Inspirational", value: "inspirational", description: "Motivational and uplifting" },
];

const goals = [
  { label: "Brand Awareness", value: "awareness", description: "Increase visibility and recognition" },
  { label: "Lead Generation", value: "leads", description: "Capture potential customer information" },
  { label: "Sales", value: "sales", description: "Drive direct purchases" },
  { label: "Engagement", value: "engagement", description: "Boost interactions and community" },
];

export default function NewStrategy() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [budget, setBudget] = useState("");
  const [topic, setTopic] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate progress based on form completion
  useEffect(() => {
    let progress = 1; // Start at step 1
    
    if (topic) progress = 2;
    if (topic && selectedPlatforms.length > 0) progress = 3;
    if (topic && selectedPlatforms.length > 0 && selectedTone && selectedGoal && timeHorizon) progress = 4;
    
    setActiveStep(progress);
  }, [topic, selectedPlatforms, selectedTone, selectedGoal, timeHorizon]);

  const togglePlatform = (platformValue) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformValue) 
        ? prev.filter(p => p !== platformValue)
        : [...prev, platformValue]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Handle generation logic here
    }, 2000);
  };

  const getStepStatus = (step) => {
    if (step < activeStep) return "completed";
    if (step === activeStep) return "active";
    return "upcoming";
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
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(#5ADBFF 1px, transparent 1px), linear-gradient(90deg, #5ADBFF 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Enhanced Header */}
      <div className="w-full max-w-4xl mx-auto px-6 mb-12 relative z-10">
        <div className="bg-gradient-to-r from-[#3C6997] to-[#5ADBFF] rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-[#5ADBFF]/30">
          {/* Animated Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-white rounded-2xl flex items-center justify-center w-20 h-20 shadow-2xl relative">
                <div className="absolute inset-0 bg-[#5ADBFF] rounded-2xl opacity-20 blur-md"></div>
                <span className="text-4xl font-black bg-gradient-to-r from-[#3C6997] to-[#5ADBFF] bg-clip-text text-transparent relative z-10">
                  SG
                </span>
              </div>
              <div>
                <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                  Strategy Generator
                </h1>
                <p className="text-[#E2F3FF] text-lg font-medium">
                  Create winning content strategies with AI-powered insights
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Progress Steps */}
          <div className="relative z-10 mt-8">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: "Topic", icon: "🎯" },
                { step: 2, label: "Platforms", icon: "📱" },
                { step: 3, label: "Strategy", icon: "⚡" },
                { step: 4, label: "Review", icon: "📋" }
              ].map(({ step, label, icon }) => {
                const status = getStepStatus(step);
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-500 relative ${
                        status === "completed" 
                          ? 'bg-[#5ADBFF] text-white scale-110 shadow-lg' 
                          : status === "active"
                          ? 'bg-white text-[#3C6997] scale-110 shadow-lg ring-4 ring-[#5ADBFF]/30'
                          : 'bg-white/20 text-white/60'
                      }`}>
                        {status === "completed" ? (
                          <span className="text-lg">✓</span>
                        ) : (
                          <span className="text-sm">{icon}</span>
                        )}
                      </div>
                      <span className={`text-xs mt-2 font-medium transition-all duration-300 ${
                        status === "completed" || status === "active" 
                          ? 'text-white' 
                          : 'text-white/60'
                      }`}>
                        {label}
                      </span>
                    </div>
                    {step < 4 && (
                      <div className={`flex-1 h-1 mx-2 transition-all duration-500 ${
                        status === "completed" ? 'bg-[#5ADBFF]' : 'bg-white/20'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Text */}
          <div className="text-center mt-4 relative z-10">
            <span className="text-white/80 text-sm">
              {activeStep === 1 && "Start by entering your topic"}
              {activeStep === 2 && "Select your target platforms"}
              {activeStep === 3 && "Define your strategy details"}
              {activeStep === 4 && "Ready to generate your strategy!"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="w-full max-w-4xl mx-auto px-6 pb-16 relative z-10">
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-[#5ADBFF]/30 transition-all duration-500">
          {/* Panel Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3C6997]/10 via-transparent to-[#5ADBFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Topic */}
              <div className="space-y-3">
                <label className="font-semibold text-lg text-white flex items-center gap-2">
                  <span className="text-[#FFDD4A]">🎯</span>
                  Topic / Keywords <span className="text-red-400">*</span>
                </label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white p-4 rounded-2xl focus:border-[#5ADBFF] focus:ring-2 focus:ring-[#5ADBFF]/20 outline-none transition-all placeholder-white/40"
                  placeholder="e.g., 'sustainable fashion tips for beginners'"
                  type="text"
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-3">
                <label className="font-semibold text-lg text-white flex items-center gap-2">
                  <span className="text-[#5ADBFF]">📱</span>
                  Platform <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <button
                      type="button"
                      key={platform.value}
                      onClick={() => togglePlatform(platform.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                        selectedPlatforms.includes(platform.value)
                          ? "border-[#5ADBFF] bg-[#5ADBFF]/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      {/* Platform Card Glow */}
                      {selectedPlatforms.includes(platform.value) && (
                        <div className="absolute inset-0 bg-[#5ADBFF]/20 blur-md"></div>
                      )}
                      <div className="relative z-10 flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <span className={`font-semibold ${
                          selectedPlatforms.includes(platform.value) ? "text-white" : "text-white/80"
                        }`}>
                          {platform.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Horizon */}
              <div className="space-y-3">
                <label className="font-semibold text-lg text-white flex items-center gap-2">
                  <span className="text-[#FE9000]">⏰</span>
                  Time Horizon <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "7days", label: "7 Days", desc: "Quick campaign" },
                    { value: "30days", label: "30 Days", desc: "Full month strategy" }
                  ].map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setTimeHorizon(option.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                        timeHorizon === option.value
                          ? "border-[#FE9000] bg-[#FE9000]/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      {/* Time Card Glow */}
                      {timeHorizon === option.value && (
                        <div className="absolute inset-0 bg-[#FE9000]/20 blur-md"></div>
                      )}
                      <div className="relative z-10 text-center">
                        <div className={`font-bold text-lg ${
                          timeHorizon === option.value ? "text-white" : "text-white/80"
                        }`}>
                          {option.label}
                        </div>
                        <div className="text-white/60 text-sm">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Tone Selection */}
              <div className="space-y-3">
                <label className="font-semibold text-lg text-white flex items-center gap-2">
                  <span className="text-[#FFDD4A]">🎭</span>
                  Tone <span className="text-red-400">*</span>
                </label>
                <div className="space-y-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => setSelectedTone(tone.value)}
                      className={`w-full border rounded-2xl p-4 text-left transition-all duration-300 group relative overflow-hidden ${
                        selectedTone === tone.value
                          ? "border-[#FFDD4A] bg-[#FFDD4A]/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      {/* Tone Card Glow */}
                      {selectedTone === tone.value && (
                        <div className="absolute inset-0 bg-[#FFDD4A]/20 blur-md"></div>
                      )}
                      <div className="relative z-10">
                        <div className="flex justify-between items-center">
                          <span className={`font-semibold ${
                            selectedTone === tone.value ? "text-white" : "text-white/80"
                          }`}>
                            {tone.label}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                            selectedTone === tone.value 
                              ? "bg-[#FFDD4A] border-[#FFDD4A]" 
                              : "border-white/30 group-hover:border-[#FFDD4A]"
                          }`}>
                            {selectedTone === tone.value && (
                              <div className="w-full h-full flex items-center justify-center text-[#0A192F] text-xs font-bold">
                                ✓
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-white/60 text-sm mt-1">{tone.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Selection */}
              <div className="space-y-3">
                <label className="font-semibold text-lg text-white flex items-center gap-2">
                  <span className="text-[#3C6997]">🎯</span>
                  Goal <span className="text-red-400">*</span>
                </label>
                <div className="space-y-2">
                  {goals.map((goal) => (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => setSelectedGoal(goal.value)}
                      className={`w-full border rounded-2xl p-4 text-left transition-all duration-300 group relative overflow-hidden ${
                        selectedGoal === goal.value
                          ? "border-[#3C6997] bg-[#3C6997]/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      {/* Goal Card Glow */}
                      {selectedGoal === goal.value && (
                        <div className="absolute inset-0 bg-[#3C6997]/20 blur-md"></div>
                      )}
                      <div className="relative z-10">
                        <div className="flex justify-between items-center">
                          <span className={`font-semibold ${
                            selectedGoal === goal.value ? "text-white" : "text-white/80"
                          }`}>
                            {goal.label}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                            selectedGoal === goal.value 
                              ? "bg-[#3C6997] border-[#3C6997]" 
                              : "border-white/30 group-hover:border-[#3C6997]"
                          }`}>
                            {selectedGoal === goal.value && (
                              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                ✓
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-white/60 text-sm mt-1">{goal.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-3">
                <label className="font-semibold text-lg text-white flex items-center gap-2">
                  <span className="text-[#5ADBFF]">💰</span>
                  Budget (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#5ADBFF] text-lg">$</span>
                  <input
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white p-4 pl-10 rounded-2xl focus:border-[#5ADBFF] focus:ring-2 focus:ring-[#5ADBFF]/20 outline-none transition-all placeholder-white/40"
                    placeholder="Enter your budget amount"
                    type="number"
                    min={0}
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 relative z-10">
            <button className="flex-1 py-4 px-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-bold text-lg transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105">
              Save Draft
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || activeStep < 4}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FFDD4A] to-[#FE9000] text-[#0A192F] font-bold text-lg transition-all hover:scale-105 hover:shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FE9000] to-[#FFDD4A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <div className="w-5 h-5 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin"></div>
                    Generating Strategy...
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FE9000] to-[#FFDD4A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                  <span className="relative z-10">
                    {activeStep < 4 ? `Complete Step ${activeStep} of 4` : "Generate Strategy"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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