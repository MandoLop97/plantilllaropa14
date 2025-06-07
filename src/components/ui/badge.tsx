
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        // primary.500 como base con tonos suaves para fondo
        default: "border-primary-300 bg-primary-100 text-primary-700 hover:bg-primary-200",
        
        // secondary.500 base para UI suave
        secondary: "border-secondary-300 bg-secondary-100 text-secondary-700 hover:bg-secondary-200",
        
        // Destructive usa tonos 600-700 para contraste
        destructive: "border-red-300 bg-red-100 text-red-700 hover:bg-red-200",
        
        // Outline usa neutral.500 base con bordes 600
        outline: "border-neutral-600 text-neutral-700 hover:bg-neutral-100",
        
        // Success, warning, info, accent usan 500 como base
        success: "border-green-300 bg-green-100 text-green-700 hover:bg-green-200",
        warning: "border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-200",
        info: "border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200",
        
        // accent.500 para highlights importantes
        accent: "border-accent-300 bg-accent-100 text-accent-700 hover:bg-accent-200",
        
        // neutral.500 para elementos base
        neutral: "border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
