import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
            {label}
            {props.required && <span className="text-verdict-not-eligible ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-ink bg-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${
            error ? 'border-verdict-not-eligible focus:ring-verdict-not-eligible' : 'border-surface-deep'
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm font-medium text-verdict-not-eligible flex items-center gap-1">
            <span aria-hidden="true">⚠️</span> {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-ink-muted">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
