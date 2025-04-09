

import React from 'react';

const Card = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  const classes = ['rounded-[20px]', 'border', 'border-solid', 'border-[#e4e4e4]', 'bg-white', 'shadow-form-pop-up-shadow', 'overflow-hidden', className].filter(Boolean).join(' ');
  return (
    <div
      ref={ref}
      className={classes}
      {...rest}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  const classes = ['flex', 'flex-col', 'space-y-1.5', 'p-6', className].filter(Boolean).join(' ');
  return (
    <div
      ref={ref}
      className={classes}
      {...rest}
    />
  );
});
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  const classes = ['font-semibold', 'text-lg', 'leading-none', 'tracking-tight', className].filter(Boolean).join(' ');
  return (
    <div
      ref={ref}
      className={classes}
      {...rest}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  const classes = ['text-sm', 'text-muted-foreground', className].filter(Boolean).join(' ');
  return (
    <div
      ref={ref}
      className={classes}
      {...rest}
    />
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  const classes = ['p-5', 'pt-0', className].filter(Boolean).join(' ');
  return <div ref={ref} className={classes} {...rest} />;
});
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  const classes = ['flex', 'items-center', 'p-6', 'pt-0', className].filter(Boolean).join(' ');
  return (
    <div
      ref={ref}
      className={classes}
      {...rest}
    />
  );
});
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};