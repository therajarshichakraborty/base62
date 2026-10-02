import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border-0 bg-neutral-100 dark:bg-[#141414] px-3 py-1.5 text-sm transition-colors outline-none text-foreground placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
