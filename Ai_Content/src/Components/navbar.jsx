import React, { useState, useEffect } from 'react';
import ccLogo from '../assets/logos/cc_logo.png';

const Navbar = ({ isAuthenticated, currentUser, onLogout, onShowLogin, onShowSignup, onNavigate }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeItem, setActiveItem] = useState('strategy');

  const handleMenuClick = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const handleNavigation = (id) => {
    setActiveItem(id);
    if (onNavigate) {
      onNavigate(id);
    }
    if (showSidebar) {
      closeSidebar();
    }
  };

  const menuItems = [
    {
      id: 'strategy',
      label: 'Strategy Analysis',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'competitor',
      label: 'Competitor Tracker',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'content',
      label: 'Content Analysis',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'about',
      label: 'About Us',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Minimized Sidebar (Always Visible) */}
      <div className="fixed top-0 left-0 h-full w-20 z-40 shadow-lg flex flex-col items-center py-6" style={{ backgroundColor: '#094074' }}>
        {/* Logo */}
        <button
          onClick={handleMenuClick}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold mb-8 transition-transform hover:scale-105"
          style={{ backgroundColor: '#FFDD4A', color: '#094074' }}
        >
          <span className="text-xl">CC</span>
        </button>

        {/* Menu Icons */}
        <div className="flex-1 flex flex-col gap-2 w-full px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className="w-full h-12 flex items-center justify-center rounded-xl transition-all duration-200 relative group"
              style={{
                backgroundColor: activeItem === item.id ? '#5ADBFF' : 'transparent',
                color: activeItem === item.id ? '#094074' : '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                if (activeItem !== item.id) {
                  e.currentTarget.style.backgroundColor = '#3C6997';
                }
              }}
              onMouseLeave={(e) => {
                if (activeItem !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.icon}
              {activeItem === item.id && (
                <div className="absolute right-0 w-1 h-8 rounded-l-full" style={{ backgroundColor: '#5ADBFF' }}></div>
              )}
            </button>
          ))}
        </div>

        {/* Profile Icon */}
        <button
          onClick={() => isAuthenticated ? onLogout() : onShowLogin()}
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-110 mt-4"
          style={{ backgroundColor: '#FE9000', color: '#FFFFFF' }}
        >
          {isAuthenticated ? (currentUser?.username?.[0]?.toUpperCase() || 'U') : '👤'}
        </button>
      </div>

      {/* Expanded Sidebar */}
      {showSidebar && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-45 backdrop-blur-sm"
            onClick={closeSidebar}
          ></div>

          {/* Full Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 z-50 shadow-2xl" style={{ backgroundColor: '#094074' }}>
            <div className="h-full flex flex-col">
              {/* Header with Logo */}
              <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid #3C6997' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold" style={{ backgroundColor: '#FFDD4A', color: '#094074' }}>
                    CC
                  </div>
                  {/* Replace text with image */}
                  <img
                    src={ccLogo}
                    alt="Aceagency Logo"
                    className="h-8 w-auto"
                  // onError={(e) => {
                  //   // Fallback in case image fails to load
                  //   e.target.style.display = 'none';
                  //   const fallback = document.createElement('span');
                  //   fallback.className = 'text-lg font-bold text-white';
                  //   fallback.textContent = 'Aceagency';
                  //   e.target.parentNode.appendChild(fallback);
                  // }}
                  />
                </div>
                <button
                  onClick={closeSidebar}
                  className="text-2xl font-bold transition-colors hover:text-5ADBFF"
                  style={{ color: '#FFFFFF' }}
                >
                  ←
                </button>
              </div>

              {/* Menu Section */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="text-xs font-semibold mb-3 tracking-wider" style={{ color: '#5ADBFF', opacity: 0.9 }}>MENU</div>
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative"
                      style={{
                        backgroundColor: activeItem === item.id ? '#5ADBFF' : 'transparent',
                        color: activeItem === item.id ? '#094074' : '#FFFFFF'
                      }}
                      onMouseEnter={(e) => {
                        if (activeItem !== item.id) {
                          e.currentTarget.style.backgroundColor = '#3C6997';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeItem !== item.id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {item.icon}
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* User Profile Footer */}
              <div className="p-6" style={{ borderTop: '1px solid #3C6997' }}>
                <button
                  onClick={() => isAuthenticated ? onLogout() : onShowLogin()}
                  className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3C6997'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#FE9000', color: '#FFFFFF' }}>
                    {isAuthenticated ? (currentUser?.username?.[0]?.toUpperCase() || 'A') : 'A'}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>
                      {isAuthenticated ? currentUser?.username : 'AmiiBaglan'}
                    </div>
                    <div className="text-xs" style={{ color: '#5ADBFF', opacity: 0.9 }}>Product Designer</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;