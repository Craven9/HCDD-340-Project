import { useState } from 'react';
import { 
  Bell, 
  Palette, 
  Shield, 
  Sparkles,
  Mail,
  CreditCard,
  Calendar,
  Tag,
  Moon,
  Sun,
  Eye,
  Database
} from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState({
    // Appearance
    darkMode: false,
    
    // Notifications
    emailNotifications: true,
    weeklyReports: true,
    
    // AI Settings
    autoCategorize: true,
    aiInsights: true,
    spendingPredictions: true,
    
    // Privacy
    dataSharing: false,
    analytics: true,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Manage your preferences</p>
      </div>

      {/* Appearance */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Appearance</h3>
            <p className="text-sm text-gray-500">Customize how the app looks</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-gray-600" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600" />
              )}
              <div>
                <div className="text-sm text-gray-900">Dark Mode</div>
                <div className="text-xs text-gray-500">Use dark theme across the app</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500">Manage how you receive updates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-900">Email Notifications</div>
                <div className="text-xs text-gray-500">Receive updates via email</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-900">Weekly Reports</div>
                <div className="text-xs text-gray-500">Receive weekly spending summaries</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('weeklyReports')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.weeklyReports ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-gray-900">AI Features</h3>
            <p className="text-sm text-gray-500">Control AI-powered functionality</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-900">Auto-Categorization</div>
                <div className="text-xs text-gray-500">Automatically categorize expenses using AI</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('autoCategorize')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoCategorize ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoCategorize ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-900">AI Insights</div>
                <div className="text-xs text-gray-500">Show personalized spending insights</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('aiInsights')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.aiInsights ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.aiInsights ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-900">Spending Predictions</div>
                <div className="text-xs text-gray-500">Predict future spending patterns</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('spendingPredictions')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.spendingPredictions ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.spendingPredictions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Privacy & Data</h3>
            <p className="text-sm text-gray-500">All data is stored locally on your device</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-900">Data Sharing</div>
                <div className="text-xs text-gray-500">Share anonymized data to improve AI</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('dataSharing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dataSharing ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-900">Usage Analytics</div>
                <div className="text-xs text-gray-500">Help us improve by tracking usage</div>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('analytics')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.analytics ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.analytics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}