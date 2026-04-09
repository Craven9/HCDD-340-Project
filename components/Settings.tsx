import { useState, useEffect } from 'react';
import { 
  Bell, 
  Palette, 
  Shield, 
  Sparkles,
  Mail,
  FileText,
  Calendar,
  Tag,
  Moon,
  Minimize2,
  Eye,
  Database,
  Brain
} from 'lucide-react';

type SettingsKeys = 'darkMode' | 'notifications' | 'emailNotifications' | 'weeklyReports' | 'compactView' | 'autoCategorize' | 'aiInsights' | 'spendingPredictions' | 'dataSharing' | 'analytics';

type SettingsState = Record<SettingsKeys, boolean>;

const DEFAULT_SETTINGS: SettingsState = {
  darkMode: false,
  notifications: true,
  emailNotifications: true,
  weeklyReports: true,
  compactView: false,
  autoCategorize: true,
  aiInsights: true,
  spendingPredictions: false,
  dataSharing: false,
  analytics: true,
};

export function Settings() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('expenseTracker_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const toggleSetting = (key: SettingsKeys) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('expenseTracker_settings', JSON.stringify(settings));
    setHasChanges(false);
    
    // Show success toast
    if ((window as any).addToast) {
      (window as any).addToast({
        message: 'Settings saved successfully!',
        type: 'success'
      });
    }
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem('expenseTracker_settings');
      setHasChanges(false);
      
      // Show success toast
      if ((window as any).addToast) {
        (window as any).addToast({
          message: 'Settings reset to default values',
          type: 'info'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your preferences and account settings</p>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Appearance</h3>
                <p className="text-gray-600">Customize how your app looks and feels</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Dark Mode</div>
                  <div className="text-sm text-gray-500">Switch to dark theme for better night viewing</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('darkMode')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                  settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                style={{
                  minWidth: '48px',
                  minHeight: '28px',
                  backgroundColor: settings.darkMode ? '#2563eb' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff',
                    width: '20px',
                    height: '20px',
                    transform: settings.darkMode ? 'translateX(20px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Minimize2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Compact View</div>
                  <div className="text-sm text-gray-500">Show more content in condensed layout</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('compactView')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                  settings.compactView ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                style={{
                  minWidth: '48px',
                  minHeight: '28px',
                  backgroundColor: settings.compactView ? '#2563eb' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ${
                    settings.compactView ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff',
                    width: '20px',
                    height: '20px',
                    transform: settings.compactView ? 'translateX(20px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
                <p className="text-gray-600">Control how you receive updates and alerts</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Email Notifications</div>
                  <div className="text-sm text-gray-500">Receive expense alerts and updates via email</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('emailNotifications')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer ${
                  settings.emailNotifications ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
                style={{
                  minWidth: '48px',
                  minHeight: '28px',
                  backgroundColor: settings.emailNotifications ? '#059669' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff',
                    width: '20px',
                    height: '20px',
                    transform: settings.emailNotifications ? 'translateX(20px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Weekly Reports</div>
                  <div className="text-sm text-gray-500">Get comprehensive weekly spending summaries</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('weeklyReports')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer ${
                  settings.weeklyReports ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
                style={{
                  minWidth: '48px',
                  minHeight: '28px',
                  backgroundColor: settings.weeklyReports ? '#059669' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ${
                    settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff',
                    width: '20px',
                    height: '20px',
                    transform: settings.weeklyReports ? 'translateX(20px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* AI Features */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">AI Features</h3>
                <p className="text-gray-600">Intelligent expense management and insights</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Auto-Categorize</div>
                  <div className="text-sm text-gray-500">Automatically categorize expenses using AI</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('autoCategorize')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer ${
                  settings.autoCategorize ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                style={{
                  minWidth: '48px',
                  minHeight: '28px',
                  backgroundColor: settings.autoCategorize ? '#9333ea' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ${
                    settings.autoCategorize ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff',
                    width: '20px',
                    height: '20px',
                    transform: settings.autoCategorize ? 'translateX(20px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Smart Insights</div>
                  <div className="text-sm text-gray-500">Get personalized spending insights and tips</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('aiInsights')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer ${
                  settings.aiInsights ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                style={{
                  minWidth: '48px',
                  minHeight: '28px',
                  backgroundColor: settings.aiInsights ? '#9333ea' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ${
                    settings.aiInsights ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff',
                    width: '20px',
                    height: '20px',
                    transform: settings.aiInsights ? 'translateX(20px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Spending Predictions</div>
                  <div className="text-sm text-gray-500">Predict future spending patterns and trends</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('spendingPredictions')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer ${
                  settings.spendingPredictions ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                style={{
                  minWidth: '48px',
                  minHeight: '28px',
                  backgroundColor: settings.spendingPredictions ? '#9333ea' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ${
                    settings.spendingPredictions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff',
                    width: '20px',
                    height: '20px',
                    transform: settings.spendingPredictions ? 'translateX(20px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Privacy & Security</h3>
                <p className="text-gray-600">Control your data privacy and security settings</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Data Sharing</div>
                  <div className="text-sm text-gray-500">Share anonymized data to improve AI features</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('dataSharing')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
                  settings.dataSharing ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
                style={{
                  minWidth: '48px',
                  minHeight: '28px',
                  backgroundColor: settings.dataSharing ? '#4f46e5' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ${
                    settings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff',
                    width: '20px',
                    height: '20px',
                    transform: settings.dataSharing ? 'translateX(20px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Usage Analytics</div>
                  <div className="text-sm text-gray-500">Help us improve by sharing usage statistics</div>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('analytics')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
                  settings.analytics ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
                style={{
                  minWidth: '48px',
                  minHeight: '28px',
                  backgroundColor: settings.analytics ? '#4f46e5' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-200 ${
                    settings.analytics ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{
                    backgroundColor: '#ffffff',
                    width: '20px',
                    height: '20px',
                    transform: settings.analytics ? 'translateX(20px)' : 'translateX(4px)'
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Your data is secure</p>
              <p className="text-blue-700">All your financial data is encrypted and stored locally on your device. We never store your sensitive information on our servers.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          {hasChanges && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              You have unsaved changes
            </div>
          )}
          {!hasChanges && <div></div>}
          
          <div className="flex gap-3">
            <button 
              onClick={resetToDefault}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Reset to Default
            </button>
            <button 
              onClick={saveSettings}
              disabled={!hasChanges}
              className={`px-6 py-3 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                hasChanges 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}