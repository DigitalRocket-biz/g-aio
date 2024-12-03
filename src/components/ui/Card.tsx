// src/components/ui/Card.tsx

import { cn } from '@/utils';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-slate-800 rounded-xl shadow-lg border border-slate-700 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }: CardProps) => (
  <div className={`p-4 border-b border-slate-700 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }: CardProps) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

export { CardTitle }
