import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfDay, endOfDay } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import QuickAddGrid from "@/components/organisms/QuickAddGrid";
import BehaviorCard from "@/components/molecules/BehaviorCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import behaviorService from "@/services/api/behaviorService";
import behaviorTypeService from "@/services/api/behaviorTypeService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [todayBehaviors, setTodayBehaviors] = useState([]);
  const [behaviorTypes, setBehaviorTypes] = useState([]);
  const [summary, setSummary] = useState({
    totalToday: 0,
    averageIntensity: 0,
    mostCommonBehavior: "",
    mostCommonTrigger: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [behaviors, types] = await Promise.all([
        behaviorService.getAll(),
        behaviorTypeService.getAll()
      ]);

      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      const todayData = behaviors.filter(behavior => {
        const behaviorDate = new Date(behavior.timestamp);
        return behaviorDate >= todayStart && behaviorDate <= todayEnd;
      });

      setTodayBehaviors(todayData);
      setBehaviorTypes(types);
      
      // Calculate summary
      const totalToday = todayData.length;
      const averageIntensity = totalToday > 0 
        ? todayData.reduce((sum, b) => sum + (b.intensity || 0), 0) / totalToday 
        : 0;

      const behaviorCounts = {};
      const triggerCounts = {};

      todayData.forEach(behavior => {
        const behaviorType = behavior.customType || behavior.type;
        const trigger = behavior.customTrigger || behavior.trigger;
        
        if (behaviorType) {
          behaviorCounts[behaviorType] = (behaviorCounts[behaviorType] || 0) + 1;
        }
        if (trigger) {
          triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        }
      });

      const mostCommonBehavior = Object.keys(behaviorCounts).length > 0 
        ? Object.keys(behaviorCounts).reduce((a, b) => 
            behaviorCounts[a] > behaviorCounts[b] ? a : b
          ) 
        : "";

      const mostCommonTrigger = Object.keys(triggerCounts).length > 0
        ? Object.keys(triggerCounts).reduce((a, b) => 
            triggerCounts[a] > triggerCounts[b] ? a : b
          )
        : "";

      setSummary({
        totalToday,
        averageIntensity: Math.round(averageIntensity * 10) / 10,
        mostCommonBehavior,
        mostCommonTrigger
      });

    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

const handleQuickAdd = async (behaviorType) => {
    try {
      const behaviorData = {
        type: behaviorType.Name || behaviorType.name,
        trigger: "Unknown",
        intensity: 3,
        timestamp: new Date().toISOString(),
        notes: `Quick logged via dashboard`
      };

      const result = await behaviorService.create(behaviorData);
      if (result) {
        toast.success(`${behaviorType.Name || behaviorType.name} logged successfully!`);
        loadDashboardData();
      }
    } catch (error) {
      console.error("Failed to log behavior:", error);
      toast.error("Failed to log behavior");
    }
  };

const handleDeleteBehavior = async (behaviorId) => {
    if (!window.confirm("Are you sure you want to delete this behavior entry?")) {
      return;
    }

    try {
      const result = await behaviorService.delete(behaviorId);
      if (result) {
        toast.success("Behavior deleted successfully");
        loadDashboardData();
      }
    } catch (error) {
      console.error("Failed to delete behavior:", error);
      toast.error("Failed to delete behavior");
    }
  };

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500 rounded-xl">
              <ApperIcon name="Activity" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{summary.totalToday}</p>
              <p className="text-sm text-gray-600">Today's Behaviors</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent-50 to-accent-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent-500 rounded-xl">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-600">{summary.averageIntensity}</p>
              <p className="text-sm text-gray-600">Avg Intensity</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 col-span-2 lg:col-span-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Target" className="w-5 h-5 text-secondary-600" />
              <p className="text-sm font-medium text-gray-700">Most Common</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-bold text-secondary-600 truncate">
                  {summary.mostCommonBehavior || "None"}
                </p>
                <p className="text-xs text-gray-500">Behavior</p>
              </div>
              <div>
                <p className="text-lg font-bold text-secondary-600 truncate">
                  {summary.mostCommonTrigger || "None"}
                </p>
                <p className="text-xs text-gray-500">Trigger</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Add Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-gray-800">Quick Log</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/log")}
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Detailed Log
          </Button>
        </div>
        
        <QuickAddGrid 
          behaviors={behaviorTypes.slice(0, 8)} 
          onQuickAdd={handleQuickAdd}
        />
      </Card>

      {/* Recent Behaviors */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-gray-800">
            Today's Activity
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/history")}
          >
            View All
          </Button>
        </div>

        {todayBehaviors.length === 0 ? (
          <Empty
            title="No behaviors logged today"
            message="Start tracking your dog's behavior to see patterns and insights"
            action={() => navigate("/log")}
            actionLabel="Log First Behavior"
            icon="PawPrint"
          />
        ) : (
          <div className="space-y-4">
            {todayBehaviors.slice(0, 5).map((behavior) => (
              <BehaviorCard
                key={behavior.id}
                behavior={behavior}
                onEdit={(behavior) => navigate("/log", { state: { behavior } })}
                onDelete={handleDeleteBehavior}
              />
            ))}
            
            {todayBehaviors.length > 5 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/history")}
                >
                  View {todayBehaviors.length - 5} more behaviors
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;