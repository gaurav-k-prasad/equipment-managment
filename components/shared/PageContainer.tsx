
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageContainer({ title, description, actions, children, className }: PageContainerProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {title && (
            <div>
              <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">{title}</h1>
              {description && <p className="text-muted-foreground mt-1">{description}</p>}
            </div>
          )}
          {actions && <div className="flex gap-2 items-center shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
