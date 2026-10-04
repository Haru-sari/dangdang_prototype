import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
}

export function BigButton({ variant = 'primary', className, type = 'button', ...rest }: Props) {
  return <button type={type} className={`btn btn--${variant} ${className ?? ''}`} {...rest} />;
}
