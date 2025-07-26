import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const navItems = [
    { path: "/", icon: "Home", label: "Dashboard" },
    { path: "/log", icon: "Plus", label: "Log" },
    { path: "/history", icon: "History", label: "History" },
    { path: "/insights", icon: "BarChart3", label: "Insights" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-primary-600 bg-primary-50 transform scale-110"
                  : "text-gray-500 hover:text-primary-500"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-1 rounded-lg transition-all duration-200",
                  isActive && "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                )}>
                  <ApperIcon name={item.icon} className="w-6 h-6" />
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;