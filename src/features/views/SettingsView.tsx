import { useState } from 'react';
import { Settings, User, Bell, Palette, Globe, Calendar, Keyboard } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/useAuthStore';

type SettingsTab = 'account' | 'appearance' | 'notifications' | 'general' | 'shortcuts';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  const tabs = [
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'general' as const, label: 'General', icon: Globe },
    { id: 'shortcuts' as const, label: 'Shortcuts', icon: Keyboard },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-brand-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-white/60">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="w-48 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-6 px-3 py-2 text-sm transition ${
                  activeTab === tab.id
                    ? 'bg-brand-500/20 text-brand-300'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'shortcuts' && <ShortcutsSettings />}
        </div>
      </div>
    </div>
  );
};

const AccountSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Account Settings</h2>
        <p className="text-sm text-white/60">Manage your profile information</p>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="text-xs text-white/50">Used for login and notifications</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Avatar</label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
              <Button variant="secondary" size="sm">
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <Button>Save Changes</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Change Password</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Current Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">New Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Confirm New Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button variant="secondary">Update Password</Button>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
          <p className="text-sm text-white/60">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="ghost" className="text-red-400 hover:text-red-300">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

const AppearanceSettings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [accentColor, setAccentColor] = useState('#10b981');

  const themes = [
    { value: 'light' as const, label: 'Light', description: 'Bright and clean' },
    { value: 'dark' as const, label: 'Dark', description: 'Easy on the eyes' },
    { value: 'system' as const, label: 'System', description: 'Follows your OS' },
  ];

  const accentColors = [
    { color: '#10b981', name: 'Emerald' },
    { color: '#3b82f6', name: 'Blue' },
    { color: '#8b5cf6', name: 'Purple' },
    { color: '#f59e0b', name: 'Amber' },
    { color: '#ef4444', name: 'Red' },
    { color: '#ec4899', name: 'Pink' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Appearance</h2>
        <p className="text-sm text-white/60">Customize how Todone looks</p>
      </div>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Theme</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`rounded-8 border p-4 text-left transition ${
                  theme === themeOption.value
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <p className="font-medium text-white">{themeOption.label}</p>
                <p className="text-xs text-white/60">{themeOption.description}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Accent Color</h3>
          <div className="grid grid-cols-6 gap-3">
            {accentColors.map((colorOption) => (
              <button
                key={colorOption.color}
                onClick={() => setAccentColor(colorOption.color)}
                className={`rounded-6 p-4 transition ${
                  accentColor === colorOption.color
                    ? 'ring-2 ring-white/80 ring-offset-2 ring-offset-slate-900'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: colorOption.color }}
              >
                <span className="sr-only">{colorOption.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-white/50">
            Currently using: {accentColors.find((c) => c.color === accentColor)?.name}
          </p>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Display Options</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Compact mode</p>
              <p className="text-xs text-white/50">Reduce spacing throughout the app</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Show completed tasks</p>
              <p className="text-xs text-white/50">Display completed tasks in lists</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>

          <div className="border-t border-white/10 pt-4">
            <Button>Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
        <p className="text-sm text-white/60">Manage how you receive notifications</p>
      </div>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Email Notifications</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Task reminders</p>
                <p className="text-xs text-white/50">Get reminded about upcoming tasks</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Comments and mentions</p>
                <p className="text-xs text-white/50">When someone comments or mentions you</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Task assignments</p>
                <p className="text-xs text-white/50">When a task is assigned to you</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Daily summary</p>
                <p className="text-xs text-white/50">Daily digest of your tasks</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Overdue tasks</p>
                <p className="text-xs text-white/50">Get notified about overdue tasks</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Goal achievements</p>
                <p className="text-xs text-white/50">Celebrate when you hit your goals</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <Button>Save Preferences</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Push Notifications</h3>
          <p className="text-sm text-white/60">
            Enable browser notifications to get real-time updates
          </p>
          <Button variant="secondary">Enable Push Notifications</Button>
        </div>
      </Card>
    </div>
  );
};

const GeneralSettings: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [startOfWeek, setStartOfWeek] = useState('sunday');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">General</h2>
        <p className="text-sm text-white/60">Configure general app settings</p>
      </div>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Regional Settings</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Date Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-white"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Time Format</label>
            <select
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              className="w-full rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-white"
            >
              <option value="12h">12-hour (3:00 PM)</option>
              <option value="24h">24-hour (15:00)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Start of week</label>
            <select
              value={startOfWeek}
              onChange={(e) => setStartOfWeek(e.target.value)}
              className="w-full rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-white"
            >
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Task Defaults</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Default view on launch</label>
            <select className="w-full rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-white">
              <option value="today">Today</option>
              <option value="inbox">Inbox</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Auto-add time to tasks</p>
              <p className="text-xs text-white/50">Automatically suggest time when adding tasks</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Show weekends</p>
              <p className="text-xs text-white/50">Display weekends in Upcoming view</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>

          <div className="border-t border-white/10 pt-4">
            <Button>Save Settings</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Data & Privacy</h3>
          
          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              <Calendar className="h-4 w-4" />
              Export All Data (JSON)
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Calendar className="h-4 w-4" />
              Download Activity Log
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ShortcutsSettings: React.FC = () => {
  const shortcuts = [
    { keys: 'Cmd/Ctrl + K', description: 'Open command palette' },
    { keys: 'Q', description: 'Quick add task' },
    { keys: '/', description: 'Search' },
    { keys: 'Escape', description: 'Close modal' },
    { keys: 'G then I', description: 'Go to Inbox' },
    { keys: 'G then T', description: 'Go to Today' },
    { keys: 'G then U', description: 'Go to Upcoming' },
    { keys: 'G then P', description: 'Go to Productivity' },
    { keys: 'G then F', description: 'Go to Filters' },
    { keys: 'G then L', description: 'Go to Labels' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
        <p className="text-sm text-white/60">Learn and customize keyboard shortcuts</p>
      </div>

      <Card>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0"
            >
              <p className="text-sm text-white/80">{shortcut.description}</p>
              <kbd className="rounded-6 border border-white/20 bg-white/5 px-3 py-1 text-xs font-mono text-white">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Customize Shortcuts</h3>
          <p className="text-sm text-white/60">
            Custom keyboard shortcuts will be available in a future update.
          </p>
          <Button variant="secondary" disabled>
            Customize Shortcuts (Coming Soon)
          </Button>
        </div>
      </Card>
    </div>
  );
};
