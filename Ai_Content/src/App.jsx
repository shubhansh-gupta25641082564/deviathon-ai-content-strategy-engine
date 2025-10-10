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
import DashboardComponent from './Components/dashboard_component_01';

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
    setCurrentView('maindashboard'); // Make sure this is set correctly
  };

  // Handle successful signup
  const handleSignupSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowSignup(false);
    setCurrentView('maindashboard'); // Make sure this is set correctly
  };

  // Render current view
  const renderCurrentView = () => {
    let mainContent;

    // If user is not authenticated, show DashboardComponent
    if (!isAuthenticated) {
      return (
        <>
          {showLogin && (
            <Login
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setShowLogin(false)}
              onShowSignup={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
            />
          )}
          {showSignup && (
            <Signup
              onSignupSuccess={handleSignupSuccess}
              onClose={() => setShowSignup(false)}
              onShowLogin={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            />
          )}
          <DashboardComponent
            onShowLogin={handleShowLogin}
            onShowSignup={handleShowSignup}
          />
        </>
      );
    }

    // If user is authenticated, show the main application views
    switch (currentView) {
      case 'maindashboard':
        mainContent = (
          <>
            <TrendDiscovery />
            <DashboardBW />
          </>
        );
        break;
      case 'dashboard':
        mainContent = (
          <>
            <TrendDiscovery />
            <DashboardBW />
          </>
        );
        break;
      case 'content':
        mainContent = <ContentAnalyzer />;
        break;
      case 'strategy':
        mainContent = <StrategyInteractive />;
        break;
      case 'competitor':
        mainContent = <CompetitorTracker />;
        break;
      case 'about':
        mainContent = <AboutUsMinimal />;
        break;
      case 'settings':
        mainContent = <SettingsPage />;
        break;
      default:
        mainContent = (
          <>
            <TrendDiscovery />
            <DashboardBW />
          </>
        );
    }

    return (
      <>
        {showLogin && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
            onShowSignup={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
          />
        )}
        {showSignup && (
          <Signup
            onSignupSuccess={handleSignupSuccess}
            onClose={() => setShowSignup(false)}
            onShowLogin={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        )}
        {mainContent}
      </>
    );
  };

  return (
    <>
      {/* Only show Navbar for authenticated users */}
      {isAuthenticated && (
        <Navbar
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogout={handleLogout}
          onShowLogin={handleShowLogin}
          onShowSignup={handleShowSignup}
          onNavigate={handleNavigate}
        />
      )}
      {renderCurrentView()}
      {/* Only show Footer for authenticated users */}
      {isAuthenticated && <Footer />}
    </>
  )
}

export default App