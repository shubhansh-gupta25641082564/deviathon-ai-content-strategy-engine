import React, { useState, useEffect } from 'react';

const Navbar = ({ isAuthenticated, currentUser, onLogout, onShowLogin, onShowSignup, onNavigate }) => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

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

  // Handle user icon click
  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setShowUserDropdown(!showUserDropdown);
      setShowLoginOptions(false);
    } else {
      setShowLoginOptions(true);
      setShowUserDropdown(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    onLogout();
    setShowUserDropdown(false);
    // Show login options after logout
    setTimeout(() => {
      setShowLoginOptions(true);
    }, 300);
  };

  // Handle login button click
  const handleLoginClick = () => {
    onShowLogin();
    setShowLoginOptions(false);
  };

  // Handle signup button click
  const handleSignupClick = () => {
    onShowSignup();
    setShowLoginOptions(false);
  };

  // Handle menu icon click
  const handleMenuClick = () => {
    setShowSidebar(!showSidebar);
  };

  // Close sidebar
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((showLoginOptions || showUserDropdown) && !event.target.closest('.floating-ui-container')) {
        handleCloseOptions();
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoginOptions, showUserDropdown]);

  return (
    <>
      <nav className="flex justify-between items-center p-4 relative">
        {/* Menu Icon (left) */}
        <div>
          <img
            src="https://www.shutterstock.com/image-vector/icon-menu-style-glyph-260nw-1967392993.jpg"
            alt="Menu icon"
            className="w-20 h-20 object-contain cursor-pointer"
            onClick={handleMenuClick}
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
            onClick={handleUserIconClick}
          />

          {/* User Dropdown - Shows when authenticated */}
          {showUserDropdown && isAuthenticated && (
            <div className="floating-ui-container absolute top-full right-0 mt-2 z-50 animate-fade-in">
              <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl p-6 text-center shadow-xl min-w-[280px]">
                {/* Close button */}
                <button
                  onClick={() => setShowUserDropdown(false)}
                  className="absolute top-2 right-3 text-gray-600 hover:text-gray-800 text-lg font-bold"
                >
                  ×
                </button>
                
                <h2 className="text-xl font-bold mb-4 text-gray-800">User Menu</h2>
                <div className="flex flex-col gap-3">
                  <div className="text-lg font-semibold text-gray-700 mb-2">
                    Welcome, {currentUser?.username || 'User'}!
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-red-600 transition duration-300 w-full"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Login/Signup Options - Appears automatically after 5 seconds or when not authenticated */}
          {showLoginOptions && !isAuthenticated && (
            <div className="floating-ui-container absolute top-full right-0 mt-2 z-50 animate-fade-in">
              <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl p-6 text-center shadow-xl min-w-[280px]">
                {/* Close button */}
                <button
                  onClick={handleCloseOptions}
                  className="absolute top-2 right-3 text-gray-600 hover:text-gray-800 text-lg font-bold"
                >
                  ×
                </button>
                
                <h2 className="text-xl font-bold mb-4 text-gray-800">Login / Sign Up</h2>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleLoginClick}
                    className="bg-cyan-400 text-white font-semibold py-3 px-6 rounded-full hover:bg-cyan-500 transition duration-300 w-full"
                  >
                    Login
                  </button>
                  <button 
                    onClick={handleSignupClick}
                    className="bg-green-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-green-600 transition duration-300 w-full"
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
      {(showLoginOptions || showUserDropdown) && (
        <div className="fixed inset-0 bg-black/10 z-40" onClick={() => {
          handleCloseOptions();
          setShowUserDropdown(false);
        }}></div>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50" 
            onClick={closeSidebar}
          ></div>
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 bg-[#18181b] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button
                  onClick={closeSidebar}
                  className="text-white hover:text-gray-300 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    onNavigate('strategy');
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#232323] border border-white/10 text-white hover:bg-white/5 transition duration-300 group"
                >
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-semibold">Strategy Analysis</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('competitor');
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#232323] border border-white/10 text-white hover:bg-white/5 transition duration-300 group"
                >
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-semibold">Competitor Tracker</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('content');
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#232323] border border-white/10 text-white hover:bg-white/5 transition duration-300 group"
                >
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">Content Analysis</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('about');
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#232323] border border-white/10 text-white hover:bg-white/5 transition duration-300 group"
                >
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">About Us</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#232323] border border-white/10 text-white hover:bg-white/5 transition duration-300 group"
                >
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-semibold">Settings</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#232323] border border-white/10 text-white hover:bg-white/5 transition duration-300 group"
                >
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-semibold">Main Dashboard</span>
                </button>
              </nav>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-gray-400 text-sm text-center">
                  AI Content Dashboard
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;