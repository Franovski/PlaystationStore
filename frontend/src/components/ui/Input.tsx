import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`rounded border border-gray-600 bg-gray-700 p-2 text-white focus:border-blue-500 focus:outline-none ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
