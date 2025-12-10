import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onChange, ...props }, ref) => {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = onChange ?? (() => undefined);

    return (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-4 border border-white/20 bg-white/5 transition peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-300',
            className,
          )}
        >
          {checked && !indeterminate && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
          {indeterminate && <div className="h-0.5 w-3 rounded-full bg-white" />}
        </div>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
