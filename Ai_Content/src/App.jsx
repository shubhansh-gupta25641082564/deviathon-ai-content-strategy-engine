import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ContentAnalyzer from './Components/content_analyser';
import ContentAnalysisError from './Components/error';
import SettingsPage from './Components/Setting';
import AboutUsMinimal from './Components/About_us';
import StrategyInteractive from './Components/Statergy';
import DashboardBW from './Components/main_dashboard';
import CompetitorTracker from './Components/competitive_tracker';
import Navbar from './Components/navbar';
import Footer from './Components/footer';
import TrendDiscovery from './Components/TrendDiscovery';
import Login from './Components/Login';
import Signup from './Components/Signup';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Handle navigation
  const handleNavigate = (view) => {
    setCurrentView(view);
    setShowLogin(false);
    setShowSignup(false);
  };

  // Handle login
  const handleShowLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  // Handle signup
  const handleShowSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  // Handle successful login
  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowLogin(false);
    setCurrentView('dashboard');
  };

  // Handle successful signup
  const handleSignupSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowSignup(false);
    setCurrentView('dashboard');
  };

  // Render current view
  const renderCurrentView = () => {
    if (showLogin) {
      return <Login onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />;
    }
    if (showSignup) {
      return <Signup onSignupSuccess={handleSignupSuccess} onClose={() => setShowSignup(false)} />;
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <TrendDiscovery />
            <DashboardBW />
          </>
        );
      case 'content':
        return <ContentAnalyzer />;
      case 'strategy':
        return <StrategyInteractive />;
      case 'competitor':
        return <CompetitorTracker />;
      case 'about':
        return <AboutUsMinimal />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <>
            <TrendDiscovery />
            <DashboardBW />
          </>
        );
    }
  };

  return (
    <>
      <Navbar 
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowLogin={handleShowLogin}
        onShowSignup={handleShowSignup}
        onNavigate={handleNavigate}
      />
      {renderCurrentView()}
      <Footer />
    </>
  )
}

export default App