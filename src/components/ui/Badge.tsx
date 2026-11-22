import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

// Text stays text-text for contrast; the tone shows in border + tint.
const tones: Record<Tone, string> = {
  neutral: 'border-muted bg-surface',
  primary: 'border-primary bg-primary/10',
  success: 'border-success bg-success/10',
  warning: 'border-warning bg-warning/10',
  danger: 'border-danger bg-danger/10',
  info: 'border-info bg-info/10',
}

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: { tone?: Tone } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-text',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
