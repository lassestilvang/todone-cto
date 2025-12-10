import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({ className, padding = 'md', ...props }) => {
  return (
    <div
      className={cn(
        'rounded-8 border border-white/5 bg-slate-800/70 shadow-lg shadow-black/20 backdrop-blur',
        paddingStyles[padding],
        className,
      )}
      {...props}
    />
  );
};
