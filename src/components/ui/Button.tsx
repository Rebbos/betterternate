import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-contrast hover:opacity-90',
  secondary: 'border border-muted bg-bg text-text hover:bg-surface',
  ghost: 'text-text hover:bg-surface',
}
// Every size keeps the 44px minimum tap target.
const sizes: Record<Size, string> = {
  sm: 'min-h-tap min-w-tap px-3 text-sm',
  md: 'min-h-tap min-w-tap px-4 text-base',
  lg: 'min-h-14 min-w-tap px-6 text-lg',
}

type StyleProps = { variant?: Variant; size?: Size }

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: StyleProps & LinkProps) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
