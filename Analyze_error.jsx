import React from 'react';

// Helper to choose gradient based on progress %
function getDynamicGradient(progress) {
  if (progress < 20)
    return "from-red-400 via-orange-400 to-yellow-400";      // 0-19%: red/orange/yellow
  if (progress < 50)
    return "from-yellow-300 via-yellow-400 to-green-200";    // 20-49%: yellow/green
  if (progress < 80)
    return "from-green-400 via-emerald-400 to-blue-400";     // 50-79%: green/blue
  if (progress < 100)
    return "from-blue-400 via-indigo-400 to-purple-400";     // 80-99%: blue/purple
  return "from-green-400 via-green-500 to-emerald-500";      // 100%: green
}

const statusText = {
  pending: "Analysis Pending",
  running: "Analysis Running",
  success: "Analysis Complete",
  failed: "Analysis Failed"
};

const statusColor = {
  pending: "text-yellow-700",
  running: "text-blue-600",
  success: "text-green-600",
  failed: "text-red-600"
};

export default function ContentAnalysisError({
  processState = "running",
  progress = 65,
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-100 to-gray-200 flex items-center justify-center px-6 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-black/10 to-transparent"></div>
        <div className="absolute left-10 top-1/4 w-32 h-32 bg-white/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-10 top-1/3 w-40 h-40 bg-black/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute left-20 bottom-1/4 w-28 h-28 bg-gray-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-20 bottom-1/3 w-36 h-36 bg-gray-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 opacity-2 bg-[length:80px_80px] bg-grid-black"></div>
      </div>

      {/* Main center container */}
      <div className="w-full max-w-5xl h-[80vh] flex flex-col items-center justify-center rounded-2xl shadow-2xl bg-white border border-gray-300 relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-200 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-5 bg-[length:50px_50px] bg-grid-black"></div>

        {/* Main content area */}
        <div className="z-10 flex flex-col items-center text-center px-8 w-full">
          {/* Error Icon */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl flex items-center justify-center shadow-2xl rotate-45 transform">
              <svg 
                className="w-16 h-16 text-black -rotate-45" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="absolute -inset-4 border-2 border-black/10 rounded-3xl animate-pulse"></div>
          </div>

          {/* Title & Description */}
          <h1 className="text-4xl font-bold text-black mb-4 tracking-tight">
            Analysis Interrupted
          </h1>
          <p className="text-xl text-gray-700 mb-2 max-w-3xl leading-relaxed">
            We encountered an issue while analyzing your content
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-3xl">
            The analysis process was interrupted before completion
          </p>

          {/* Status Block with animated colorful bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-12 border border-gray-300 w-full max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-lg">Status</span>
              <span className={`${statusColor[processState]} font-semibold text-lg`}>
                {statusText[processState]}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${getDynamicGradient(progress)} h-3 rounded-full transition-all duration-700 animate-pulse`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-gray-600 text-sm mt-3 text-left">
              Process {progress !== 100 ? `stopped at ${progress}%` : 'complete'} - Content analysis {processState === 'failed' ? 'incomplete' : (processState === 'success' ? 'completed' : 'in progress')}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-8 w-full max-w-4xl">
            <button
              className="flex-1 px-12 py-6 bg-gradient-to-r from-black to-gray-900 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 hover:from-gray-700 hover:to-black hover:scale-105 hover:shadow-3xl border border-gray-500 text-xl"
              onClick={() => window.location.reload()}
            >
              Retry Analysis
            </button>
            <button
              className="flex-1 px-12 py-6 bg-white text-black font-bold rounded-xl border border-gray-300 shadow-2xl transition-all duration-300 hover:bg-gray-200 hover:scale-105 text-xl"
            >
              Upload New Content
            </button>
          </div>

          {/* Help Text */}
          <p className="text-gray-600 mt-8 text-lg">
            Need help? <span className="text-black cursor-pointer hover:text-gray-700">Contact support</span>
          </p>
        </div>

        {/* Decorative container elements */}
        <div className="absolute top-8 right-8 w-6 h-6 bg-white rounded-full animate-bounce"></div>
        <div className="absolute bottom-8 left-8 w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Additional background orbs */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full animate-bounce delay-300"></div>
      <div className="absolute right-4 top-1/3 w-6 h-6 bg-gray-300 rounded-full animate-pulse delay-700"></div>
      <div className="absolute left-6 bottom-1/4 w-10 h-10 bg-white/60 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute right-8 bottom-1/2 w-7 h-7 bg-gray-200 rounded-full animate-pulse delay-500"></div>
    </div>
  );
}
