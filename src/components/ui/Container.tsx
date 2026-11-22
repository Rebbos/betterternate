import { useId, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)} {...props} />
}

/** Page section with optional h2; labelled by its heading for screen readers. */
export function Section({
  title,
  className,
  children,
  ...props
}: { title?: ReactNode } & HTMLAttributes<HTMLElement>) {
  const id = useId()
  return (
    <section
      aria-labelledby={title ? id : undefined}
      className={cn('py-8 md:py-12', className)}
      {...props}
    >
      {title && (
        <h2 id={id} className="mb-4 text-xl font-bold md:text-2xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
