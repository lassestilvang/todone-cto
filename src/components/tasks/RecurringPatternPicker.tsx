import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Repeat, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { RecurringPattern } from '@/types';
import { describeRecurringPattern } from '@/lib/recurrence';

interface RecurringPatternPickerProps {
  value: RecurringPattern | undefined;
  onChange: (pattern: RecurringPattern | undefined) => void;
}

type PresetOption = 'daily' | 'weekly' | 'monthly' | 'yearly' | null;

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PRESET_OPTIONS: Exclude<PresetOption, null>[] = ['daily', 'weekly', 'monthly', 'yearly'];

const resolvePreset = (type: RecurringPattern['type'] | undefined): PresetOption =>
  (type && PRESET_OPTIONS.includes(type as Exclude<PresetOption, null>))
    ? (type as PresetOption)
    : null;

export const RecurringPatternPicker: React.FC<RecurringPatternPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetOption>(resolvePreset(value?.type));
  const [interval, setInterval] = useState(value?.interval ?? 1);
  const [selectedDays, setSelectedDays] = useState<number[]>(value?.daysOfWeek ?? []);
  const [dayOfMonth, setDayOfMonth] = useState(value?.dayOfMonth ?? new Date().getDate());
  const [endDate, setEndDate] = useState<string>(value?.endDate ? format(value.endDate, 'yyyy-MM-dd') : '');
  const [exceptions, setExceptions] = useState<string[]>(
    value?.exceptions?.map((date) => format(date, 'yyyy-MM-dd')) ?? [],
  );
  const [exceptionInput, setExceptionInput] = useState('');

  useEffect(() => {
    if (!value) {
      setSelectedPreset(null);
      setInterval(1);
      setSelectedDays([]);
      setDayOfMonth(new Date().getDate());
      setEndDate('');
      setExceptions([]);
      return;
    }

    setSelectedPreset(resolvePreset(value.type));
    setInterval(value.interval);
    setSelectedDays(value.daysOfWeek ?? []);
    setDayOfMonth(value.dayOfMonth ?? new Date().getDate());
    setEndDate(value.endDate ? format(value.endDate, 'yyyy-MM-dd') : '');
    setExceptions(value.exceptions?.map((date) => format(date, 'yyyy-MM-dd')) ?? []);
  }, [value]);

  const handlePresetSelect = (preset: PresetOption) => {
    setSelectedPreset(preset);
    setInterval(1);
    setEndDate('');
    setExceptions([]);

    if (preset === 'weekly') {
      const today = new Date().getDay();
      setSelectedDays([today]);
    } else {
      setSelectedDays([]);
    }

    if (preset === 'monthly') {
      setDayOfMonth(new Date().getDate());
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort(),
    );
  };

  const addException = () => {
    if (!exceptionInput || exceptions.includes(exceptionInput)) return;
    setExceptions((current) => [...current, exceptionInput].sort());
    setExceptionInput('');
  };

  const removeException = (date: string) => {
    setExceptions((current) => current.filter((d) => d !== date));
  };

  const clearPattern = () => {
    setSelectedPreset(null);
    setInterval(1);
    setSelectedDays([]);
    setDayOfMonth(new Date().getDate());
    setEndDate('');
    setExceptions([]);
    onChange(undefined);
  };

  const buildPatternFromState = (): RecurringPattern | undefined => {
    if (!selectedPreset) return undefined;

    const pattern: RecurringPattern = {
      type: selectedPreset,
      interval,
    };

    if (selectedPreset === 'weekly') {
      const days = selectedDays.length > 0 ? selectedDays : [new Date().getDay()];
      pattern.daysOfWeek = days;
    }

    if (selectedPreset === 'monthly') {
      pattern.dayOfMonth = dayOfMonth;
    }

    if (endDate) {
      pattern.endDate = new Date(endDate);
    }

    if (exceptions.length > 0) {
      pattern.exceptions = exceptions.map((date) => new Date(date));
    }

    return pattern;
  };

  const previewPattern = buildPatternFromState();

  const handleApply = () => {
    onChange(previewPattern);
    setIsOpen(false);
  };

  const buttonLabel = value ? describeRecurringPattern(value) : 'Add repeat';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-6 border px-3 py-1.5 text-sm transition ${
          value
            ? 'border-brand-500/50 bg-brand-500/10 text-brand-300 hover:border-brand-500'
            : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
        }`}
      >
        <Repeat className="h-3.5 w-3.5" />
        <span className="truncate max-w-[200px] text-left">{buttonLabel}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-96 rounded-lg border border-white/10 bg-slate-900 p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Recurring Pattern</h4>
            <button onClick={() => setIsOpen(false)} className="rounded-6 p-1 text-white/50 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4 space-y-2">
            <p className="text-xs text-white/50">Quick presets:</p>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_OPTIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`rounded-6 border px-3 py-2 text-sm transition ${
                    selectedPreset === preset
                      ? 'border-brand-500 bg-brand-500/20 text-brand-300'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {preset.charAt(0).toUpperCase()}
                  {preset.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {selectedPreset && (
            <div className="space-y-4 border-t border-white/10 pt-4">
              <div className="space-y-2">
                <label className="block text-xs text-white/50">Repeat every:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={interval}
                    onChange={(e) => setInterval(Math.max(1, Number(e.target.value) || 1))}
                    className="w-20 rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                  />
                  <span className="text-sm text-white/70">
                    {selectedPreset === 'daily' && 'day(s)'}
                    {selectedPreset === 'weekly' && 'week(s)'}
                    {selectedPreset === 'monthly' && 'month(s)'}
                    {selectedPreset === 'yearly' && 'year(s)'}
                  </span>
                </div>
              </div>

              {selectedPreset === 'weekly' && (
                <div className="space-y-2">
                  <label className="block text-xs text-white/50">On days:</label>
                  <div className="grid grid-cols-7 gap-1">
                    {WEEKDAY_NAMES.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`rounded-6 px-2 py-1.5 text-xs transition ${
                          selectedDays.includes(index)
                            ? 'bg-brand-500 text-white'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {WEEKDAY_SHORT[index]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedPreset === 'monthly' && (
                <div className="space-y-2">
                  <label className="block text-xs text-white/50">Day of month:</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dayOfMonth}
                    onChange={(e) =>
                      setDayOfMonth(Math.max(1, Math.min(31, Number(e.target.value) || 1)))
                    }
                    className="w-20 rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs text-white/50">End date (optional):</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-6 border border-white/10 bg-slate-800 py-2 pl-10 pr-3 text-sm text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-white/50">Skip specific dates</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={exceptionInput}
                    onChange={(e) => setExceptionInput(e.target.value)}
                    className="flex-1 rounded-6 border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={addException} disabled={!exceptionInput}>
                    Add
                  </Button>
                </div>
                {exceptions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exceptions.map((date) => (
                      <span
                        key={date}
                        className="flex items-center gap-1 rounded-6 bg-white/10 px-2 py-1 text-xs text-white/80"
                      >
                        {format(new Date(date), 'MMM d, yyyy')}
                        <button
                          type="button"
                          onClick={() => removeException(date)}
                          className="text-white/60 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 rounded-6 border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                <p className="text-xs uppercase text-white/40">Preview</p>
                <p>{previewPattern ? describeRecurringPattern(previewPattern) : 'Not repeating'}</p>
              </div>

              <div className="flex justify-between gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={clearPattern}>
                  Clear
                </Button>
                <Button type="button" size="sm" onClick={handleApply} disabled={!selectedPreset}>
                  Apply pattern
                </Button>
              </div>
            </div>
          )}

          {!selectedPreset && (
            <div className="mt-4 space-y-2 rounded-6 border border-white/10 bg-white/5 p-3 text-sm text-white/70">
              <p className="text-xs uppercase text-white/40">Preview</p>
              <p>Not repeating</p>
              <Button type="button" variant="ghost" size="sm" onClick={clearPattern} className="w-full">
                Clear Pattern
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
