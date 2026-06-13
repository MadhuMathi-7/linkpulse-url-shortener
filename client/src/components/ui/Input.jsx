import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  error,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-dark-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          className={twMerge(
            clsx(
              'w-full bg-dark-900 border border-dark-700/80 rounded-xl px-4 py-2.5 text-sm text-dark-100 placeholder:text-dark-600 focus:outline-none focus:border-brand-indigo/60 focus:ring-1 focus:ring-brand-indigo/60 transition-all duration-150',
              Icon && 'pl-11',
              error && 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger/30'
            ),
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-brand-danger font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
