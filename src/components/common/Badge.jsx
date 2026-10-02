import React from 'react';

export const Badge = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple' | 'muted'
  icon: Icon = null,
  className = '',
  style = {},
}) => {
  const variantClass = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    purple: 'badge-purple',
    muted: 'badge-muted',
  }[variant] || 'badge-primary';

  return (
    <span className={`badge ${variantClass} ${className}`} style={style}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};
