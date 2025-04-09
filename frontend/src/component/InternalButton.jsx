import React from 'react';

const Button = React.forwardRef((props, ref) => {
  const { children, className = '', variant = 'default', size = 'default', asChild = false, ...rest } = props;

  // Define base classes
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'whitespace-nowrap',
    'rounded-md',
    'text-sm',
    'font-medium',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-1',
    'focus-visible:ring-ring',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
    className,
  ].filter(Boolean).join(' ');

  // Define variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-600 text-white shadow-sm hover:bg-red-700';
      case 'outline':
        return 'border border-gray-300 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900';
      case 'secondary':
        return 'bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300';
      case 'ghost':
        return 'hover:bg-gray-100 hover:text-gray-900';
      case 'link':
        return 'text-blue-600 underline-offset-4 hover:underline';
      case 'default':
      default:
        return 'bg-[#4d007c] text-white shadow hover:bg-purple-800';
    }
  };

  // Define size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 rounded-md px-3 text-xs';
      case 'lg':
        return 'h-10 rounded-md px-8';
      case 'icon':
        return 'h-9 w-9';
      case 'default':
      default:
        return 'h-9 px-4 py-2';
    }
  };

  const Comp = asChild ? 'button' : 'button'; // Simplified asChild logic (Slot removed)
  const classes = [baseClasses, getVariantClasses(), getSizeClasses()].filter(Boolean).join(' ');

  return (
    <Comp
      ref={ref}
      className={classes}
      {...rest}
    >
      {children}
    </Comp>
  );
});
Button.displayName = 'Button';

export { Button };