import { useEffect, useState } from 'react';
import { Trophy, Target, Flame, TrendingUp, Settings as SettingsIcon, Award } from 'lucide-react';
import { useProductivityStore } from '@/stores/useProductivityStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ProductivityView: React.FC = () => {
  const { stats, settings, load, updateStats, updateSettings, getCompletionHistory } =
    useProductivityStore();
  const [showSettings, setShowSettings] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal);
  const [weeklyGoal, setWeeklyGoal] = useState(settings.weeklyGoal);
  const [weekHistory, setWeekHistory] = useState<{ date: string; count: number }[]>([]);
  const [monthHistory, setMonthHistory] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    updateStats();
  }, [updateStats]);

  useEffect(() => {
    const loadHistory = async () => {
      const week = await getCompletionHistory(7);
      const month = await getCompletionHistory(28);
      setWeekHistory(week);
      setMonthHistory(month);
    };
    loadHistory();
  }, [getCompletionHistory]);

  const dailyProgress = stats.dailyGoal > 0 ? (stats.todayCompleted / stats.dailyGoal) * 100 : 0;
  const weeklyProgress =
    stats.weeklyGoal > 0 ? (stats.thisWeekCompleted / stats.weeklyGoal) * 100 : 0;

  const handleSaveSettings = async () => {
    await updateSettings({
      dailyGoal: Number(dailyGoal),
      weeklyGoal: Number(weeklyGoal),
    });
    setShowSettings(false);
  };

  const getKarmaLevelProgress = () => {
    const levels = [
      { name: 'Beginner', min: 0, max: 999 },
      { name: 'Novice', min: 1000, max: 2499 },
      { name: 'Intermediate', min: 2500, max: 4999 },
      { name: 'Advanced', min: 5000, max: 9999 },
      { name: 'Professional', min: 10000, max: 19999 },
      { name: 'Expert', min: 20000, max: 39999 },
      { name: 'Master', min: 40000, max: 79999 },
      { name: 'Grandmaster', min: 80000, max: 159999 },
      { name: 'Enlightened', min: 160000, max: Infinity },
    ];

    const currentLevel = levels.find(
      (level) => stats.karma >= level.min && stats.karma <= level.max,
    );
    if (!currentLevel) return { progress: 0, nextLevel: 'Unknown', pointsNeeded: 0 };

    const progress =
      currentLevel.max === Infinity
        ? 100
        : ((stats.karma - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;

    const nextLevelIndex = levels.indexOf(currentLevel) + 1;
    const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex].name : 'Max';
    const pointsNeeded = currentLevel.max === Infinity ? 0 : currentLevel.max - stats.karma + 1;

    return { progress, nextLevel, pointsNeeded };
  };

  const { progress: karmaProgress, nextLevel, pointsNeeded } = getKarmaLevelProgress();

  if (showSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-brand-400" />
            <h1 className="text-2xl font-bold text-white">Productivity Settings</h1>
          </div>
          <Button variant="ghost" onClick={() => setShowSettings(false)}>
            Back
          </Button>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Daily Goal</label>
              <Input
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                min={0}
              />
              <p className="text-xs text-white/60">
                Set to 0 to disable daily goals. Current: {stats.dailyGoal} tasks/day
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Weekly Goal</label>
              <Input
                type="number"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                min={0}
              />
              <p className="text-xs text-white/60">
                Set to 0 to disable weekly goals. Current: {stats.weeklyGoal} tasks/week
              </p>
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-brand-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Productivity</h1>
            <p className="text-sm text-white/60">Track your progress and maintain your momentum</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => setShowSettings(true)}>
          <SettingsIcon className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Karma Section */}
      {settings.karmaEnabled && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-8 bg-brand-500/20 p-3">
                  <Award className="h-8 w-8 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Todone Karma</p>
                  <h2 className="text-3xl font-bold text-white">{stats.karma}</h2>
                  <p className="text-sm text-brand-400">{stats.karmaLevel}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60">
                <span>{stats.karmaLevel}</span>
                <span>
                  {nextLevel !== 'Max' ? `${pointsNeeded} points to ${nextLevel}` : 'Max Level'}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all"
                  style={{ width: `${Math.min(karmaProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-8 bg-emerald-500/20 p-3">
              <Trophy className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Completed</p>
              <p className="text-3xl font-bold text-white">{stats.totalCompleted}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-8 bg-orange-500/20 p-3">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Current Streak</p>
              <p className="text-3xl font-bold text-white">{stats.currentStreak}</p>
              <p className="text-xs text-white/40">Longest: {stats.longestStreak} days</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-8 bg-blue-500/20 p-3">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Today's Progress</p>
              <p className="text-3xl font-bold text-white">
                {stats.todayCompleted}/{stats.dailyGoal}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Goal Progress */}
      {stats.dailyGoal > 0 && (
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Daily Goal</p>
                <p className="text-xs text-white/60">
                  {stats.todayCompleted} of {stats.dailyGoal} tasks completed today
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{Math.round(dailyProgress)}%</p>
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                style={{ width: `${Math.min(dailyProgress, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Goal Progress */}
      {stats.weeklyGoal > 0 && (
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Weekly Goal</p>
                <p className="text-xs text-white/60">
                  {stats.thisWeekCompleted} of {stats.weeklyGoal} tasks completed this week
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{Math.round(weeklyProgress)}%</p>
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Last 7 Days Chart */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-400" />
            <h3 className="text-lg font-semibold text-white">Last 7 Days</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { weekday: 'short' });
                }}
              />
              <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Last 4 Weeks Chart */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-400" />
            <h3 className="text-lg font-semibold text-white">Last 4 Weeks</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                tickFormatter={(value, index) => {
                  if (index % 7 === 0) {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }
                  return '';
                }}
              />
              <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
