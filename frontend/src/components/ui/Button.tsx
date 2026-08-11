import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none min-h-[44px] px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-accent text-white hover:bg-accent-hover active:bg-accent-hover shadow-sm',
    secondary: 'bg-surface-deep text-ink hover:bg-surface-mid active:bg-surface-mid',
    outline: 'border-2 border-accent text-accent hover:bg-accent/10 active:bg-accent/20',
    danger: 'bg-verdict-not-eligible text-white hover:bg-red-700 active:bg-red-800',
    ghost: 'text-ink hover:bg-surface-light active:bg-surface-mid',
  }

  const sizeStyles = {
    sm: 'text-sm py-1.5 px-3 min-h-[38px]',
    md: 'text-base py-2.5 px-5 min-h-[44px]',
    lg: 'text-lg py-3 px-6 min-h-[50px]',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
