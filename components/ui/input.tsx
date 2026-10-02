import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, style, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      style={{ border: "none", outline: "none", boxShadow: "none", ...style }}
      className={cn(
        "h-9 w-full min-w-0 rounded-lg !border-0 !border-none bg-neutral-100 dark:bg-[#141414] px-3 py-1.5 text-sm transition-colors !outline-none !shadow-none !ring-0 text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
