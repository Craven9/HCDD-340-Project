import { useState } from 'react';
import { LayoutDashboard, Receipt, TrendingUp, Sparkles, Settings as SettingsIcon, FileText, Camera } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { Expenses } from './Expenses';
import { Analytics } from './Analytics';
import { Reports } from './Reports';
import { Settings } from './Settings';
import { Camera as CameraComponent } from './Camera';
import { ToastContainer } from './Toast';

type View = 'dashboard' | 'expenses' | 'camera' | 'analytics' | 'reports' | 'settings';

export function Layout() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses' as View, label: 'Expenses', icon: Receipt },
    { id: 'camera' as View, label: 'Camera', icon: Camera },
    { id: 'analytics' as View, label: 'Analytics', icon: TrendingUp },
    { id: 'reports' as View, label: 'Reports', icon: FileText },
    { id: 'settings' as View, label: 'Settings', icon: SettingsIcon },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <Expenses />;
      case 'camera':
        return <CameraComponent />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header - Enhanced */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Expense Tracker
                </h1>
                <p className="text-sm text-gray-600 font-medium">Smart financial management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation - Centered and visually improved */}
        <nav className="flex justify-center mb-8">
          <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-lg backdrop-blur-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`nav-button flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-102'
                  }`}
                  style={{
                    minWidth: '120px',
                    boxShadow: isActive ? '0 8px 25px rgba(37, 99, 235, 0.3)' : undefined
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        {renderView()}
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}