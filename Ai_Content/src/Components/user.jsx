import React, { useState } from 'react';

export default function UserProfileSettingsLaptop() {
  const [pushEnabled, setPushEnabled] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101828] px-6">
      <div className="flex w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden bg-[#151c2c]">
        {/* LEFT: Profile Info */}
        <div className="w-2/5 flex flex-col items-center justify-center p-12">
          <h1 className="text-white font-bold text-2xl mb-7 tracking-wide">Settings</h1>
          <img
            src="https://randomuser.me/api/portraits/women/65.jpg"
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-[#20253b] shadow mb-4"
          />
          <div className="text-center mb-7">
            <div className="text-2xl font-semibold text-white">Sophia Bennett</div>
            <div className="text-gray-400 text-md">sophia.bennett@email.com</div>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg mt-2">
            Edit Profile
          </button>
        </div>
        {/* RIGHT: Account & Notifications */}
        <div className="w-3/5 flex flex-col justify-center p-12 space-y-7 border-l border-[#202535]">
          {/* Account */}
          <div>
            <div className="text-xs text-gray-400 font-semibold mb-2">ACCOUNT</div>
            <div className="flex items-center justify-between bg-[#19213a] rounded-xl px-6 py-4 hover:bg-[#212c45] cursor-pointer transition">
              <div className="flex items-center gap-3">
                <span className="bg-blue-900 p-2 rounded-full">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 16v-.01M8 12h.01M16 12h.01M9 8h6M4 18v-6.5C4 8.015 7.582 5 12 5s8 3.015 8 6.5V18" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-white">API Keys</div>
                  <div className="text-gray-400 text-xs">Manage your API keys</div>
                </div>
              </div>
              <span className="text-gray-500 text-xl">{'>'}</span>
            </div>
          </div>
          {/* Notifications */}
          <div>
            <div className="text-xs text-gray-400 font-semibold mb-2">NOTIFICATIONS</div>
            <div className="flex items-center justify-between bg-[#19213a] rounded-xl px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-900 p-2 rounded-full">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C6.67 7.165 6 8.97 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-white">Push Notifications</div>
                  <div className="text-gray-400 text-xs">Enable push notifications</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={pushEnabled} onChange={() => setPushEnabled(v => !v)} />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
          {/* Logout Button */}
          <button className="mt-8 w-full bg-red-900 hover:bg-red-800 text-red-200 font-bold py-3 rounded-lg transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
