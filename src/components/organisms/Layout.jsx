import React from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/organisms/BottomNavigation";

const Layout = ({ children }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/": return "Dashboard";
      case "/log": return "Log Behavior";
      case "/history": return "History";
      case "/insights": return "Insights";
      default: return "PawTracker";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={getPageTitle()} />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;