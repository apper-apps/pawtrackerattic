import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const BehaviorCard = ({ behavior, onEdit, onDelete }) => {
  const intensityColors = {
    1: "text-green-600 bg-green-100",
    2: "text-yellow-600 bg-yellow-100",
    3: "text-orange-600 bg-orange-100", 
    4: "text-red-600 bg-red-100",
    5: "text-purple-600 bg-purple-100"
  };

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

  return (
    <Card className="p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-2 bg-gradient-to-r from-primary-100 to-primary-200 rounded-xl">
            <ApperIcon 
              name={getBehaviorIcon(behavior.type)} 
              className="w-5 h-5 text-primary-600" 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-800 truncate">
                {behavior.customType || behavior.type}
              </h3>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                intensityColors[behavior.intensity]
              )}>
                {behavior.intensity}/5
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              Trigger: {behavior.customTrigger || behavior.trigger}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <ApperIcon name="Clock" className="w-3 h-3" />
                <span>{format(new Date(behavior.timestamp), "MMM d, h:mm a")}</span>
              </span>
              
              {behavior.location && (
                <span className="flex items-center space-x-1">
                  <ApperIcon name="MapPin" className="w-3 h-3" />
                  <span>{behavior.location}</span>
                </span>
              )}
              
              {behavior.duration && (
                <span className="flex items-center space-x-1">
                  <ApperIcon name="Timer" className="w-3 h-3" />
                  <span>{behavior.duration}min</span>
                </span>
              )}
            </div>
            
            {behavior.notes && (
              <p className="text-sm text-gray-600 mt-2 italic">
                "{behavior.notes}"
              </p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(behavior)}
            className="p-2 text-gray-500 hover:text-primary-600"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(behavior.id)}
            className="p-2 text-gray-500 hover:text-red-600"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BehaviorCard;