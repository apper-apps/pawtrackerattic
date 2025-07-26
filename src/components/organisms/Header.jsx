import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title }) => {
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold mb-1">{title}</h1>
            <p className="text-primary-100 text-sm">{today}</p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <ApperIcon name="Heart" className="w-8 h-8" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;