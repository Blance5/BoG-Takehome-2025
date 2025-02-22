import React from 'react';

type ButtonVariant = 'primary' | 'inverted';

interface ButtonProps {
  variant?: ButtonVariant;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  type = 'button',
  onClick,
  children,
}: ButtonProps) {
  const baseStyles = 'py-2 px-4 rounded-md transition w-full ';

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-primary border border-primary text-white hover:bg-white hover:text-primary',
    inverted:
      'bg-primary-fill text-primary border border-white hover:bg-primary hover:text-white',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
