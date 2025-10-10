import React, { useState } from "react";

const platforms = [
  { label: "YouTube", value: "youtube" },
  { label: "Google Trends", value: "google-trends" },
  { label: "Reddit", value: "reddit" },
  { label: "News", value: "news" },
];

export default function NewStrategy() {
  const [selectedPlatform, setSelectedPlatform] = useState(""); // All unchecked initially
  const [timeHorizon, setTimeHorizon] = useState("7days");
  const [budget, setBudget] = useState("");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181B23] via-[#000000] to-[#000000] flex flex-col items-center">
      <div className="w-full max-w-lg mx-auto px-8 pt-10 pb-8 flex items-center bg-[#191c27] rounded-b-3xl shadow-lg mb-14">
        <button className="p-2 rounded-full hover:bg-[#22252e] bg-[#22252e] mr-4">
          <span className="material-symbols-outlined text-[#a8aacc]">close</span>
        </button>
        <h1 className="flex-1 text-3xl font-extrabold text-white tracking-tight">New Strategy</h1>
        <div className="w-8"></div>
      </div>
      <main className="w-full max-w-lg mx-auto px-8 pb-16">
        <div className="bg-[#22252e] rounded-2xl p-8 shadow-xl flex flex-col gap-7">
          {/* Topic */}
          <div className="space-y-2">
            <label className="font-medium text-sm text-[#A7B1C2]" htmlFor="topic">
              Topic / Keywords <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-[#181d23] border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-primary placeholder-gray-400 outline-none"
              id="topic"
              placeholder="e.g., 'sustainable fashion tips'"
              type="text"
            />
          </div>
          {/* Platform */}
          <div className="space-y-2">
            <label className="font-medium text-sm text-[#A7B1C2]">
              Platform <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  type="button"
                  key={platform.value}
                  onClick={() => setSelectedPlatform(platform.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition
                    ${
                      selectedPlatform === platform.value
                        ? "bg-blue-800/30 text-blue-200"
                        : "bg-[#181d23] text-[#A7B1C2] hover:bg-[#232931]"
                    }
                  `}
                >
                  <span className="material-symbols-outlined text-base" style={{ verticalAlign: "middle" }}>
                    {selectedPlatform === platform.value ? "check_circle" : "add_circle_outline"}
                  </span>
                  {platform.label}
                </button>
              ))}
            </div>
          </div>
          {/* Tone & Goal */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-sm text-[#A7B1C2]" htmlFor="tone">
                Tone <span className="text-red-400">*</span>
              </label>
              <select
                className="w-full bg-[#181d23] border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                id="tone"
              >
                <option>Professional</option>
                <option>Casual</option>
                <option>Witty</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm text-[#A7B1C2]" htmlFor="goal">
                Goal <span className="text-red-400">*</span>
              </label>
              <select
                className="w-full bg-[#181d23] border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                id="goal"
              >
                <option>Brand Awareness</option>
                <option>Lead Generation</option>
                <option>Sales</option>
              </select>
            </div>
          </div>
          {/* Time Horizon */}
          <div className="space-y-2">
            <label className="font-medium text-sm text-[#A7B1C2]">Time Horizon <span className="text-red-400">*</span></label>
            <div className="flex bg-[#181d23] rounded-lg p-1">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition 
                  ${timeHorizon === "7days" ? "bg-blue-700 text-white" : "text-[#A7B1C2] hover:bg-[#232931]"}`}
                onClick={() => setTimeHorizon("7days")}
              >7 Days</button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition 
                  ${timeHorizon === "30days" ? "bg-blue-700 text-white" : "text-[#A7B1C2] hover:bg-[#232931]"}`}
                onClick={() => setTimeHorizon("30days")}
              >30 Days</button>
            </div>
          </div>
          {/* Budget */}
          <div className="space-y-2">
            <label className="font-medium text-sm text-[#A7B1C2]" htmlFor="budget">Budget (Optional)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#A7B1C2]">$</span>
              <input
                className="w-full bg-[#181d23] border-none text-white p-3 pl-7 rounded-lg focus:ring-2 focus:ring-primary outline-none placeholder-gray-400"
                id="budget"
                placeholder="1000"
                type="number"
                min={0}
                value={budget}
                onChange={e => setBudget(e.target.value)}
              />
            </div>
          </div>
          {/* Advanced Options */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white">Advanced Options</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-medium text-sm text-[#A7B1C2]" htmlFor="frequency">
                  Frequency
                </label>
                <select
                  className="w-full bg-[#181d23] border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  id="frequency"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Bi-Weekly</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-medium text-sm text-[#A7B1C2]" htmlFor="formats">
                  Content Formats
                </label>
                <select
                  className="w-full bg-[#181d23] border-none text-white p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  id="formats"
                >
                  <option>Video, Carousel</option>
                  <option>Blog Post</option>
                  <option>Short Form Video</option>
                </select>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button className="flex-1 py-3 px-4 rounded-lg bg-[#232931] text-center font-bold text-[#A7B1C2] hover:bg-[#1b1f25] transition">Save Draft</button>
            <button className="flex-1 py-3 px-4 rounded-lg bg-white text-center font-bold text-[#232931] hover:bg-gray-200 transition">Generate</button>
          </div>
        </div>
      </main>
    </div>
  );
}
