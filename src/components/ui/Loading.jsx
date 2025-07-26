import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon name="Heart" className="w-6 h-6 text-primary-600 animate-pulse" />
        </div>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loading;