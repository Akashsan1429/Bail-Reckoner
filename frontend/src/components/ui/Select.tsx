import React, { forwardRef } from 'react'

interface Option {
  value: string | number
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  error?: string
  helperText?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(2, 9)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-ink">
            {label}
            {props.required && <span className="text-verdict-not-eligible ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-ink bg-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${
            error ? 'border-verdict-not-eligible focus:ring-verdict-not-eligible' : 'border-surface-deep'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="text-sm font-medium text-verdict-not-eligible flex items-center gap-1">
            <span aria-hidden="true">⚠️</span> {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="text-xs text-ink-muted">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
