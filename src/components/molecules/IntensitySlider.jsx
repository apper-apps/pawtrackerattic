import React from "react";
import { cn } from "@/utils/cn";

const IntensitySlider = ({ value, onChange, label, className }) => {
  const intensityLabels = ["Very Low", "Low", "Medium", "High", "Very High"];
  const colors = [
    "from-green-400 to-green-500",
    "from-yellow-400 to-yellow-500", 
    "from-orange-400 to-orange-500",
    "from-red-400 to-red-500",
    "from-purple-400 to-purple-500"
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, 
              #22c55e 0%, #22c55e ${value >= 1 ? "20%" : "0%"}, 
              #eab308 20%, #eab308 ${value >= 2 ? "40%" : "20%"}, 
              #f97316 40%, #f97316 ${value >= 3 ? "60%" : "40%"}, 
              #ef4444 60%, #ef4444 ${value >= 4 ? "80%" : "60%"}, 
              #a855f7 80%, #a855f7 ${value >= 5 ? "100%" : "80%"}, 
              #e5e7eb ${(value * 20)}%, #e5e7eb 100%)`
          }}
        />
        
        <div className="flex justify-between mt-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                "flex flex-col items-center cursor-pointer transition-all duration-200",
                value >= level ? "text-gray-800 font-medium" : "text-gray-400"
              )}
              onClick={() => onChange(level)}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 transform",
                  value >= level 
                    ? `bg-gradient-to-r ${colors[level - 1]} text-white scale-110 shadow-lg`
                    : "bg-gray-200 text-gray-500"
                )}
              >
                🐾
              </div>
              <span className="text-xs mt-1">{level}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r text-white shadow-md",
            colors[value - 1]
          )}>
            {intensityLabels[value - 1]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IntensitySlider;