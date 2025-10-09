import React, { useState } from 'react';

// Toggle button (switch) with ball always visible
function ToggleItem({ label, checked, setChecked, className = "" }) {
  return (
    <div className={`flex items-center justify-between py-5 px-8 ${className}`}>
      <span className="text-lg">{label}</span>
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={() => setChecked(v => !v)} />
        <div className="relative w-12.5 h-7.5 bg-gray-300 peer-checked:bg-gradient-to-r peer-checked:from-blue-400 peer-checked:via-cyan-400 peer-checked:to-green-400 border border-gray-300 rounded-full peer transition-all duration-200 shadow-inner">
          <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : ""
          }`}></div>
        </div>
      </label>
    </div>
  );
}

export default function SettingsPage() {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-900 py-12 px-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl shadow-2xl p-12 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center pb-7 border-b border-gray-200">
          <span className="text-2xl">&#8592;</span>
          <h1 className="flex-1 text-center text-2xl font-extrabold tracking-wide text-gray-900">Settings</h1>
          <span className="w-8" />
        </div>

        {/* ACCOUNT */}
        <div className="mt-10 mb-1 font-bold text-base uppercase tracking-wider text-gray-600">Account</div>
        <div className="bg-gray-50 rounded-xl mb-8 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow">
          <div>
            <div className="mb-1 font-semibold text-gray-900">email Address</div>
            <div className="text-xs text-gray-500">
              username
            </div>
          </div>
          <button
            className="bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-900 font-bold py-2 px-7 rounded-lg text-base border-2 border-gray-300 shadow-lg transition transform hover:-translate-y-2 hover:shadow-2xl active:scale-95"
            onClick={() => alert('Manage Button Pressed')}
          >
            Change Account
          </button>
        </div>

        {/* GENERAL */}
        <div className="mb-1 font-bold text-base uppercase tracking-wider text-gray-600">General</div>
        <div className="bg-gray-50 rounded-xl mb-8 divide-y divide-gray-200 shadow">
          <ToggleItem label="Push Notifications" checked={pushNotifications} setChecked={setPushNotifications} />
          <ToggleItem label="Email Notifications" checked={emailNotifications} setChecked={setEmailNotifications} />
        </div>

        {/* ABOUT */}
        <div className="mb-1 font-bold text-base uppercase tracking-wider text-gray-600">About</div>
        <div className="bg-gray-50 rounded-xl text-lg shadow">
          <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
            <span>App Version</span>
            <span className="text-gray-400 text-base">1.0.0</span>
          </div>
          <button className="w-full text-left px-8 py-6 border-b border-gray-200 text-blue-400 font-bold hover:bg-gray-100 rounded-t-none rounded-b-xl transition">
            Support
          </button>
          <button className="w-full text-left px-8 py-6 text-blue-400 font-bold hover:bg-gray-100 rounded-t-none rounded-b-xl transition">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
