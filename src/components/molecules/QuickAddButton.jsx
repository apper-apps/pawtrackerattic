import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const QuickAddButton = ({ behavior, onClick, className }) => {
  const getBehaviorIcon = (type) => {
    const iconMap = {
      "Barking": "Volume2",
      "Chewing": "Smile", 
      "Aggression": "AlertTriangle",
      "Accidents": "Droplets",
      "Jumping": "ArrowUp",
      "Whining": "Volume1",
      "Digging": "Shovel",
      "Running": "Zap"
    };
    return iconMap[type] || "Circle";
  };

  const getGradientColor = (type) => {
    const colorMap = {
      "Barking": "from-blue-400 to-blue-500",
      "Chewing": "from-green-400 to-green-500",
      "Aggression": "from-red-400 to-red-500", 
      "Accidents": "from-yellow-400 to-yellow-500",
      "Jumping": "from-purple-400 to-purple-500",
      "Whining": "from-pink-400 to-pink-500",
      "Digging": "from-orange-400 to-orange-500",
      "Running": "from-teal-400 to-teal-500"
    };
    return colorMap[type] || "from-gray-400 to-gray-500";
  };

  return (
    <button
      onClick={() => onClick(behavior)}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95",
        getGradientColor(behavior.name),
        className
      )}
    >
      <div className="mb-2">
        <ApperIcon 
          name={getBehaviorIcon(behavior.name)} 
          className="w-8 h-8" 
        />
      </div>
      <span className="text-sm font-medium text-center leading-tight">
        {behavior.name}
      </span>
    </button>
  );
};

export default QuickAddButton;