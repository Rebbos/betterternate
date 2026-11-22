// ponytail: plain join, no conflict resolution. Add tailwind-merge if overrides start fighting.
export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ')
