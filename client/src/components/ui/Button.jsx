import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55';
  
  const variants = {
    primary: 'bg-brand-indigo hover:bg-brand-indigo/90 text-white shadow-lg hover:shadow-brand-indigo/20 shadow-brand-indigo/10 border border-brand-indigo/20',
    secondary: 'bg-dark-800 hover:bg-dark-700 text-dark-100 border border-dark-700/80 shadow-md',
    cyan: 'bg-brand-cyan hover:bg-brand-cyan/90 text-dark-950 font-semibold shadow-lg hover:shadow-brand-cyan/20 shadow-brand-cyan/10',
    outline: 'border border-dark-700 hover:bg-dark-800 text-dark-100',
    ghost: 'hover:bg-dark-800 hover:text-dark-100 text-dark-400',
    danger: 'bg-brand-danger hover:bg-brand-danger/90 text-white shadow-lg hover:shadow-brand-danger/20 border border-brand-danger/20',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
    icon: 'p-2.5',
  };

  return (
    <button
      type={type}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
