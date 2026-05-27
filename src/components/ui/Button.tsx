import * as React from 'react';
import { cn } from './Card';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'gold';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ring-offset-background";
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    gold: "bg-gradient-to-r from-amber-200 to-yellow-500 text-gray-900 hover:opacity-90 font-bold",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />
  );
});
Button.displayName = "Button";
