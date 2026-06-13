import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = React.forwardRef(({ className, glow = false, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(
      clsx(
        glow ? 'glass-panel-glow hover:border-brand-indigo/35' : 'glass-panel',
        'p-6'
      ),
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }) => (
  <div className={twMerge('flex flex-col space-y-1.5 pb-4', className)} {...props} />
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = ({ className, ...props }) => (
  <h3 className={twMerge('text-lg font-semibold leading-none tracking-tight text-white', className)} {...props} />
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = ({ className, ...props }) => (
  <p className={twMerge('text-sm text-dark-400', className)} {...props} />
);
CardDescription.displayName = 'CardDescription';

export const CardContent = ({ className, ...props }) => (
  <div className={twMerge('pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

export const CardFooter = ({ className, ...props }) => (
  <div className={twMerge('flex items-center pt-4 border-t border-dark-700/50 mt-4', className)} {...props} />
);
CardFooter.displayName = 'CardFooter';
