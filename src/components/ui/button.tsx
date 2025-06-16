
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Prioridad 1: primary.500 como base, 600-700 para estados activos
        default: "bg-primary-500 text-primary-50 hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md border border-primary-400",
        
        // Prioridad 2: secondary.500 como base suave
        secondary: "bg-secondary-500 text-secondary-50 hover:bg-secondary-600 active:bg-secondary-700 shadow-sm hover:shadow-md border border-secondary-400",
        
        // Prioridad 3: accent.500 para highlights importantes
        accent: "bg-accent-500 text-accent-50 hover:bg-accent-600 active:bg-accent-700 shadow-sm hover:shadow-md border border-accent-400",
        
        // Estados destructivos con tonos 600-700 para texto activo
        destructive: "bg-red-500 text-red-50 hover:bg-red-600 active:bg-red-700 shadow-sm hover:shadow-md border border-red-400",
        
        // Outline usa neutral.500 base con bordes 600
        outline: "border border-neutral-600 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-700 active:bg-neutral-200",
        
        // Ghost usa tonos suaves 100-200 para hover
        ghost: "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 hover:text-neutral-800",
        
        // Link usa primary.600 para texto activo
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 active:text-primary-800",
        
        // Success, warning, info usan 500 como base
        success: "bg-green-500 text-green-50 hover:bg-green-600 active:bg-green-700 shadow-sm hover:shadow-md border border-green-400",
        warning: "bg-amber-500 text-amber-50 hover:bg-amber-600 active:bg-amber-700 shadow-sm hover:shadow-md border border-amber-400",
        info: "bg-blue-500 text-blue-50 hover:bg-blue-600 active:bg-blue-700 shadow-sm hover:shadow-md border border-blue-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base font-semibold",
        icon: "h-10 w-10",
        xs: "h-6 px-2 text-xs rounded",
        xl: "h-14 px-10 text-lg font-bold rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
