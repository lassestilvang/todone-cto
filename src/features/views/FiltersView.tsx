import { Filter } from 'lucide-react';
import { FilterManager } from '@/components/filters/FilterManager';

export const FiltersView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Filter className="h-6 w-6 text-brand-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Filters</h1>
          <p className="text-sm text-white/60">Create custom views with powerful query language</p>
        </div>
      </div>

      <FilterManager />
    </div>
  );
};
