import { Tags } from 'lucide-react';
import { LabelManager } from '@/components/labels/LabelManager';

export const LabelsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Tags className="h-6 w-6 text-brand-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Labels</h1>
          <p className="text-sm text-white/60">Organize tasks by context, energy level, or location</p>
        </div>
      </div>

      <LabelManager />
    </div>
  );
};
