import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const StartJourney = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Reset both states when going back to main screen
  const handleBack = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  if (showLogin) {
    return <Login onBack={handleBack} />;
  }

  if (showSignup) {
    return <Signup onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-400">
      {/* Blur White Box */}
      <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl p-10 text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-white">Start My Journey</h2>
        <div className="flex justify-center gap-6">
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-cyan-400 text-white font-semibold py-3 px-8 rounded-full hover:bg-cyan-500 transition duration-300"
          >
            Login
          </button>
          <button 
            onClick={() => setShowSignup(true)}
            className="bg-cyan-400 text-white font-semibold py-3 px-8 rounded-full hover:bg-cyan-500 transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartJourney;