// src/components/ui/Input.tsx

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', icon, error, ...props }, ref) => (
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {icon}
                </div>
            )}
            <input
                ref={ref}
                className={`
          w-full rounded-lg bg-slate-700 border border-slate-600
          px-4 py-2 text-slate-100 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
);

Input.displayName = 'Input';