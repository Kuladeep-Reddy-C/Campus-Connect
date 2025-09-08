import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../lib/util"

const inputVariants = cva(
    "flex h-10 w-full rounded-md border px-3 py-2 text-base bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "border-input",
                outline: "border-border bg-background",
                filled: "bg-muted border-transparent",
            },
            size: {
                default: "h-10",
                sm: "h-9",
                lg: "h-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Input = React.forwardRef(({ className, variant, size, ...props }, ref) => (
    <input ref={ref} className={cn(inputVariants({ variant, size, className }))} {...props} />
))
Input.displayName = "Input"

export { Input, inputVariants }
