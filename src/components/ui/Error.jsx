import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops!</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} className="w-full">
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;