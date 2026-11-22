import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/cn'

type FieldProps = { label: ReactNode; hint?: ReactNode; error?: ReactNode }

// 16px text stops iOS zoom-on-focus; border-muted keeps >= 3:1 non-text contrast.
const control =
  'block w-full min-h-tap rounded-md border border-muted bg-bg px-3 text-base text-text placeholder:text-muted aria-invalid:border-danger'

function useField(hint: ReactNode, error: ReactNode) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  return {
    id,
    controlProps: {
      id,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy || undefined,
    },
  }
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({
  label,
  hint,
  error,
  className,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const { id, controlProps } = useField(hint, error)
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <input className={cn(control, className)} {...controlProps} {...props} />
    </Field>
  )
}

export function Textarea({
  label,
  hint,
  error,
  className,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { id, controlProps } = useField(hint, error)
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <textarea className={cn(control, 'min-h-28 py-2', className)} {...controlProps} {...props} />
    </Field>
  )
}

export function Select({
  label,
  hint,
  error,
  className,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const { id, controlProps } = useField(hint, error)
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <select className={cn(control, className)} {...controlProps} {...props} />
    </Field>
  )
}
