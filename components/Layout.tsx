import { useState } from 'react';
import { LayoutDashboard, Receipt, TrendingUp, Sparkles, Settings as SettingsIcon, FileText, Camera } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { Expenses } from './Expenses';
import { Analytics } from './Analytics';
import { Reports } from './Reports';
import { Settings } from './Settings';
import { Camera as CameraComponent } from './Camera';

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
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Expense Tracker</h1>
                <p className="text-sm text-gray-500">Smart financial management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation */}
        <nav className="flex gap-1 mb-8 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Main Content */}
        {renderView()}
      </div>
    </div>
  );
}