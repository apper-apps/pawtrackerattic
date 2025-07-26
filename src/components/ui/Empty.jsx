import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No data yet", 
  message = "Start by adding your first entry", 
  action,
  actionLabel = "Get Started",
  icon = "Package"
}) => {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
      </div>
      
      <h3 className="text-xl font-display font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      
      {action && (
        <Button onClick={action} className="w-full">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;