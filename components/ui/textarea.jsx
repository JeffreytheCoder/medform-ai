import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  const textareaRef = React.useRef(null);

  // Adjust the height of the textarea based on its content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  React.useImperativeHandle(ref, () => ({
    // This function exposes the `value` and any other properties or methods you want to expose to the parent component
    get value() {
      return textareaRef.current.value;
    },
    set value(val) {
      textareaRef.current.value = val;
    },
    adjustHeight,
  }));

  // Handle input change and adjust height
  const handleChange = (e) => {
    adjustHeight();
  };

  // Adjust height after initial rendering
  React.useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <textarea
      rows="1"
      ref={textareaRef}
      className={cn(
        "flex w-full rounded-md py-2 text-2xl text-white placeholder:text-gray-600 caret-white",
        "bg-transparent resize-none overflow-hidden",
        "border-none focus:border-b-2 focus:border-gray-300",
        "focus:ring-0 focus:outline-none",
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
