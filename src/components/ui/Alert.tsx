import type { HTMLAttributes, ReactNode } from 'react'
import { CircleCheck, CircleX, Info, TriangleExclamationPoint } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'info' | 'success' | 'warning' | 'danger'

const tones = {
  info: { cls: 'border-info bg-info/10', icon: 'text-info', Icon: Info },
  success: { cls: 'border-success bg-success/10', icon: 'text-success', Icon: CircleCheck },
  warning: {
    cls: 'border-warning bg-warning/10',
    icon: 'text-warning',
    Icon: TriangleExclamationPoint,
  },
  danger: { cls: 'border-danger bg-danger/10', icon: 'text-danger', Icon: CircleX },
}

/** Static callout. For live messages pass role="status" or role="alert". */
export function Alert({
  tone = 'info',
  title,
  children,
  className,
  ...props
}: { tone?: Tone; title?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const { cls, icon, Icon } = tones[tone]
  return (
    <div
      className={cn('flex gap-3 rounded-md border-l-4 p-4 text-text', cls, className)}
      {...props}
    >
      <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', icon)} />
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
