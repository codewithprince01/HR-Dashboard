import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

const Checkbox = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  const classes = [
    'peer',
    'h-4',
    'w-4',
    'shrink-0',
    'rounded-sm',
    'border',
    'border-[#4d007c]',
    'shadow',
    'focus-visible:outline-none',
    'focus-visible:ring-1',
    'focus-visible:ring-[#4d007c]',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'data-[state=checked]:bg-[#4d007c]',
    'data-[state=checked]:text-white',
    className,
  ].filter(Boolean).join(' ');
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={classes}
      {...rest}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };