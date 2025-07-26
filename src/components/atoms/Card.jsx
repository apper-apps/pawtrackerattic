import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, children, ...props }, ref) => {
  const baseStyles = "bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl";

  return (
    <div className={cn(baseStyles, className)} ref={ref} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;