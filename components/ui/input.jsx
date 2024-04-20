import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      placeholder="Answer here"
      className={cn(
        "flex h-10 w-full rounded-md px-3 py-2 text-xl text-white placeholder:text-gray-500 caret-gray-500 focus:ring-0 focus:border-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "bg-transparent border-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
