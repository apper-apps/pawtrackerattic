import React from "react";
import QuickAddButton from "@/components/molecules/QuickAddButton";

const QuickAddGrid = ({ behaviors, onQuickAdd }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {behaviors.map((behavior) => (
        <QuickAddButton
          key={behavior.id}
          behavior={behavior}
          onClick={onQuickAdd}
          className="aspect-square"
        />
      ))}
    </div>
  );
};

export default QuickAddGrid;