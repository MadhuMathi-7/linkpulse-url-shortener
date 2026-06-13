import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto rounded-xl border border-dark-700/60 bg-dark-900/40">
    <table
      ref={ref}
      className={twMerge('w-full caption-bottom text-sm border-collapse', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={twMerge('bg-dark-800/80 border-b border-dark-700/80', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={twMerge('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={twMerge('bg-dark-800/50 font-medium text-white border-t border-dark-700/80', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={twMerge(
      'border-b border-dark-700/40 transition-colors hover:bg-dark-800/30 data-[state=selected]:bg-dark-800',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={twMerge(
      'h-12 px-4 text-left align-middle font-semibold text-dark-400 uppercase tracking-wider text-xs',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={twMerge('p-4 align-middle text-dark-100', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={twMerge('mt-4 text-sm text-dark-600', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';
