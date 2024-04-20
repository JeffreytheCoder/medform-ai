import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      placeholder="Answer here"
      className={cn(
        "flex h-10 w-full rounded-md py-2 text-2xl text-whit placeholder:text-gray-600 caret-gray-600 focus:ring-0 focus:border-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
