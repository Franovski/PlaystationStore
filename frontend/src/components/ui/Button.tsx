import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ className = '', type = 'button', ...props }) => (
  <button
    type={type}
    className={`rounded px-4 py-2 font-bold transition-colors disabled:opacity-60 ${className}`}
    {...props}
  />
);

export default Button;
