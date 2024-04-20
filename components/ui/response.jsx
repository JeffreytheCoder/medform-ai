import * as React from 'react';
import { cn } from '@/lib/utils';

const Response = React.forwardRef(({ className, ...props }, ref) => {
  const textareaRef = React.useRef(null); // Using a specific ref for the textarea

  // Adjust the height of the textarea based on its content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset the height to recalculate
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scroll height
    }
  };

  // Handle input change and adjust height
  const handleChange = (e) => {
    adjustHeight();
  };

  // Adjust height after initial rendering (for pre-filled content)
  React.useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <textarea
      rows="1" // Start with a single text row
      ref={textareaRef} // Attach ref
      className={cn(
        "flex w-full rounded-md py-2 text-2xl text-white placeholder:text-gray-600 caret-white",
        "bg-transparent resize-none overflow-hidden",
        "border-none focus:border-b`-2 focus:border-gray-300", // Underline only on focus
        "focus:ring-0 focus:outline-none", // Ensure no border or outline on focus
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );
});

Response.displayName = "Textarea";

export { Response };  
