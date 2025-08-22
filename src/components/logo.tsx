import { Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Github className="h-6 w-6 text-primary" />
      <h1 className="text-lg font-semibold text-foreground">Github Explorer</h1>
    </div>
  );
}
