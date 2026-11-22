import { cn } from '@/lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('rounded-md bg-border motion-safe:animate-pulse', className)} />
  )
}
