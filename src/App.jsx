import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Search, UserPlus, UserCheck, Download, Menu, X, Home } from 'lucide-react';
import './App.css';

// Import pages
import LandingPage from './pages/LandingPage';
import ReportPage from './pages/ReportPage';
import SearchPage from './pages/SearchPage';
import SelfCheckinPage from './pages/SelfCheckinPage';
import ExportPage from './pages/ExportPage';
import EventSelector from './components/EventSelector';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're in demo mode
  const isDemoMode = location.pathname.startsWith('/demo');

  const navItems = isDemoMode ? [
    { path: '/demo', label: 'Search', icon: Search },
    { path: '/demo/report', label: 'Report Missing', icon: UserPlus },
    { path: '/demo/checkin', label: 'Check In Safe', icon: UserCheck },
    { path: '/demo/export', label: 'Export Data', icon: Download },
  ] : [
    { path: '/', label: 'Home', icon: Home },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/demo' && location.pathname === '/demo') return true;
    if (path !== '/' && path !== '/demo' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to={isDemoMode ? "/demo" : "/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                CrisisMatch
                {isDemoMode && (
                  <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">
                    DEMO
                  </span>
                )}
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!isDemoMode && (
              <Link
                to="/demo"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Try Demo</span>
              </Link>
            )}
            
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isDemoMode && (
              <Link
                to="/"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-300"
              >
                <Home className="w-4 h-4" />
                <span>Back to Main</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {!isDemoMode && (
                <Link
                  to="/demo"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-blue-100 text-blue-700"
                >
                  <Search className="w-5 h-5" />
                  <span>Try Demo</span>
                </Link>
              )}
              
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isDemoMode && (
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300"
                >
                  <Home className="w-5 h-5" />
                  <span>Back to Main</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function DemoBanner() {
  return (
    <div className="bg-yellow-100 border-b border-yellow-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              DEMONSTRATION VERSION
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              This is a live demonstration of CrisisMatch functionality. 
              In a real emergency deployment, this would show actual missing person reports for your specific disaster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          CrisisMatch
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Emergency Missing Person Reporting & Safety Check-in System
        </p>
      </div>

      <div className="mb-8">
        <EventSelector />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/report"
          className="bg-red-50 border border-red-200 rounded-lg p-6 hover:bg-red-100 transition-colors"
        >
          <UserPlus className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Report Missing Person</h3>
          <p className="text-red-700 text-sm">
            Report someone as missing during a disaster or emergency situation.
          </p>
        </Link>

        <Link
          to="/checkin"
          className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition-colors"
        >
          <UserCheck className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Check In as Safe</h3>
          <p className="text-green-700 text-sm">
            If you've been reported missing, mark yourself as safe to notify loved ones.
          </p>
        </Link>

        <Link
          to="/"
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors"
        >
          <Search className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Search Reports</h3>
          <p className="text-blue-700 text-sm">
            Search for missing persons and check their current status.
          </p>
        </Link>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">How It Works</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>1. Report:</strong> Family or friends can report someone as missing by providing basic information.
          </p>
          <p>
            <strong>2. Search:</strong> Anyone can search for missing persons using names or locations.
          </p>
          <p>
            <strong>3. Check In:</strong> Missing persons can mark themselves as safe using their personal information.
          </p>
          <p>
            <strong>4. Privacy:</strong> All personal data is hashed and names are masked for privacy protection.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isDemoMode = location.pathname.startsWith('/demo');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {isDemoMode && <DemoBanner />}
      
      <main className="py-6">
        <Routes>
          {/* Main hub route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Demo routes - using existing components with demo context */}
          <Route path="/demo" element={<SearchPage />} />
          <Route path="/demo/report" element={<ReportPage />} />
          <Route path="/demo/checkin" element={<SelfCheckinPage />} />
          <Route path="/demo/export" element={<ExportPage />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/checkin" element={<SelfCheckinPage />} />
          <Route path="/export" element={<ExportPage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>CrisisMatch - Emergency Response System</p>
            <p className="mt-1">
              Helping coordinate emergency response and family reunification during disasters.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrap App with Router
function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
