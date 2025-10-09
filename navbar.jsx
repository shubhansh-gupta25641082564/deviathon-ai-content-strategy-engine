import React, { useState, useEffect } from 'react';

const Navbar = ({ onStartJourney }) => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  // Automatically show after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginOptions(true);
    }, 5000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  // Close the floating UI
  const handleCloseOptions = () => {
    setShowLoginOptions(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLoginOptions && !event.target.closest('.floating-ui-container')) {
        handleCloseOptions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoginOptions]);

  return (
    <>
      <nav className="flex justify-between items-center p-4 relative">
        {/* Menu Icon (left) */}
        <div>
          <img
            src="https://www.shutterstock.com/image-vector/icon-menu-style-glyph-260nw-1967392993.jpg"
            alt="Menu icon"
            className="w-20 h-20 object-contain cursor-pointer"
          />
        </div>

        {/* Logo (center) */}
        <div className="flex items-center justify-center">
          <img
            src="src/assets/Screenshot 2025-10-09 161336.png"
            alt="Logo"
            className="w-50 h-20"
            style={{ paddingTop: '10px' }}
          />
        </div>

        {/* User Icon (right) */}
        <div className="relative">
          <img
            src="https://static.vecteezy.com/system/resources/previews/008/149/271/large_2x/user-icon-for-graphic-design-logo-website-social-media-mobile-app-ui-illustration-free-vector.jpg"
            alt="User icon"
            className="w-20 h-20 rounded-full object-cover cursor-pointer"
          />

          {/* Floating Login/Signup Options - Appears automatically after 5 seconds */}
          {showLoginOptions && (
            <div className="floating-ui-container absolute top-full right-0 mt-2 z-50 animate-fade-in">
              <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl p-6 text-center shadow-xl min-w-[280px]">
                {/* Close button */}
                <button
                  onClick={handleCloseOptions}
                  className="absolute top-2 right-3 text-gray-600 hover:text-gray-800 text-lg font-bold"
                >
                  ×
                </button>
                
                <h2 className="text-xl font-bold mb-4 text-gray-800">Start My Journey</h2>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      handleCloseOptions();
                      onStartJourney();
                    }}
                    className="bg-cyan-400 text-white font-semibold py-3 px-6 rounded-full hover:bg-cyan-500 transition duration-300 w-full"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      handleCloseOptions();
                      onStartJourney();
                    }}
                    className="bg-cyan-400 text-white font-semibold py-3 px-6 rounded-full hover:bg-cyan-500 transition duration-300 w-full"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay when floating UI is open */}
      {showLoginOptions && (
        <div className="fixed inset-0 bg-black/10 z-40" onClick={handleCloseOptions}></div>
      )}
    </>
  );
};

export default Navbar;