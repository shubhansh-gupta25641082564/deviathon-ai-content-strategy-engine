import { useState } from 'react'
import './App.css'
import Navbar from './Components/navbar'
import DashboardComponent from './Components/dashboard_component_01'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Footer from './Components/footer'
import DashboardBW from './Components/main_dashboard'
import StrategyInteractive from './Components/Statergy'
import ContentAnalyzer from './Components/content_analyser'
import SettingsPage from './Components/Setting'
import AboutUsMinimal from './Components/About_us'
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentUser({ username: 'User' }); // Replace with actual user data
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch(currentView) {
      case 'strategy':
        return <StrategyInteractive />;
      case 'content':
        return <ContentAnalyzer/>;
      case 'about':
        return <AboutUsMinimal/>;
      case 'settings':
        return <SettingsPage/>;
      case 'login':
        return <Login onLogin={handleLogin} onBack={() => setCurrentView('dashboard')} />;
      case 'signup':
        return <Signup onSignup={handleLogin} onBack={() => setCurrentView('dashboard')} />;
      default:
        return <DashboardBW />;
    }
  };

  return (
    <>
      <Navbar 
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowLogin={() => setCurrentView('login')}
        onShowSignup={() => setCurrentView('signup')}
        onNavigate={setCurrentView}
      />
      {renderView()}
      <Footer />
    </>
  )
}

export default App;


