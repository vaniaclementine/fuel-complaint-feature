import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
        default: "!bg-[#1B4E9B] !text-white hover:!bg-[#1B4E9B]/90 shadow-sm",
        destructive: "bg-red-500 text-gray-50 hover:bg-red-500/90",
        outline: "border-2 border-[#1B4E9B] bg-white text-[#1B4E9B] hover:bg-blue-50",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        ghost: "hover:bg-neutral-100 hover:text-neutral-900",
        link: "text-[#1B4E9B] underline-offset-4 hover:underline",
        pertamax: "!bg-[#00A651] !text-white hover:!bg-[#00A651]/90 shadow-sm",
    }

    const sizes = {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10",
    }

    return (
        <Comp
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            ref={ref}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </Comp>
    )
})
Button.displayName = "Button"

export { Button }
