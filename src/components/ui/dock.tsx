import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const dockVariants = cva(
  "pointer-events-none fixed z-50 flex h-16 items-end gap-4"
)

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string
  children?: React.ReactNode
  direction?: "top" | "bottom" | "left" | "right" | "middle"
}

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ className, children, direction = "bottom", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          dockVariants(),
          {
            "left-1/2 top-2 -translate-x-1/2": direction === "top",
            "left-1/2 bottom-2 -translate-x-1/2": direction === "bottom",
            "left-2 top-1/2 -translate-y-1/2 flex-col h-auto w-16": direction === "left",
            "right-2 top-1/2 -translate-y-1/2 flex-col h-auto w-16": direction === "right",
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2": direction === "middle",
          },
          className
        )}
        {...props}
      >
        <div className="pointer-events-auto mb-2 flex h-full items-end gap-2 rounded-2xl border bg-background/80 backdrop-blur-md px-2 shadow-lg">
          {children}
        </div>
      </div>
    )
  }
)
Dock.displayName = "Dock"

const DockIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl transition-all duration-300 hover:scale-110",
        className
      )}
      {...props}
    />
  )
})
DockIcon.displayName = "DockIcon"

export { Dock, DockIcon }
