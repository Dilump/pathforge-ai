import React from 'react';

export const Card = ({
  children,
  className = '',
  interactive = false,
  glow = false,
  onClick,
  style = {},
  ...props
}) => {
  const classes = [
    'card',
    interactive ? 'card-interactive' : '',
    glow ? 'border-purple-glow' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      style={{
        ...(glow ? { borderColor: 'rgba(139, 92, 246, 0.4)', boxShadow: 'var(--shadow-purple-glow)' } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
