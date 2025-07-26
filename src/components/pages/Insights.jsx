import React, { useState, useEffect } from "react";
import { subDays, format, startOfDay, endOfDay } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Chart from "react-apexcharts";
import behaviorService from "@/services/api/behaviorService";

const Insights = () => {
  const [behaviors, setBehaviors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30");

  const loadBehaviors = async () => {
    try {
      setError(null);
      const data = await behaviorService.getAll();
      setBehaviors(data);
    } catch (err) {
      setError("Failed to load insights data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBehaviors();
  }, []);

  const getFilteredBehaviors = () => {
    const days = parseInt(dateRange);
    const cutoffDate = subDays(new Date(), days);
    return behaviors.filter(behavior => new Date(behavior.timestamp) >= cutoffDate);
  };

  const getBehaviorTrends = () => {
    const filtered = getFilteredBehaviors();
    const days = parseInt(dateRange);
    const trends = {};
    
    // Initialize days
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "MMM dd");
      trends[date] = 0;
    }

    // Count behaviors per day
    filtered.forEach(behavior => {
      const date = format(new Date(behavior.timestamp), "MMM dd");
      if (trends[date] !== undefined) {
        trends[date]++;
      }
    });

    return {
      categories: Object.keys(trends),
      data: Object.values(trends)
    };
  };

  const getBehaviorTypeDistribution = () => {
    const filtered = getFilteredBehaviors();
    const distribution = {};
    
    filtered.forEach(behavior => {
      const type = behavior.customType || behavior.type;
      distribution[type] = (distribution[type] || 0) + 1;
    });

    return {
      labels: Object.keys(distribution),
      data: Object.values(distribution)
    };
  };

  const getTriggerAnalysis = () => {
    const filtered = getFilteredBehaviors();
    const triggers = {};
    
    filtered.forEach(behavior => {
      const trigger = behavior.customTrigger || behavior.trigger;
      triggers[trigger] = (triggers[trigger] || 0) + 1;
    });

    return Object.entries(triggers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getIntensityAnalysis = () => {
    const filtered = getFilteredBehaviors();
    const intensities = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    
    filtered.forEach(behavior => {
      intensities[behavior.intensity]++;
    });

    const average = filtered.length > 0 
      ? filtered.reduce((sum, b) => sum + b.intensity, 0) / filtered.length 
      : 0;

    return {
      distribution: intensities,
      average: Math.round(average * 10) / 10
    };
  };

  const getRecommendations = () => {
    const filtered = getFilteredBehaviors();
    const topTriggers = getTriggerAnalysis();
    const intensity = getIntensityAnalysis();
    
    const recommendations = [];

    if (filtered.length === 0) {
      return ["Start logging behaviors to receive personalized insights and training recommendations."];
    }

    // High intensity behaviors
    if (intensity.average >= 4) {
      recommendations.push("Consider consulting a professional dog trainer - your dog is showing high-intensity behaviors consistently.");
    }

    // Common triggers
    if (topTriggers.length > 0) {
      const [topTrigger] = topTriggers[0];
      recommendations.push(`Focus on desensitization training for "${topTrigger}" - it's your dog's most common trigger.`);
    }

    // Frequency-based recommendations
    const dailyAverage = filtered.length / parseInt(dateRange);
    if (dailyAverage > 5) {
      recommendations.push("Consider increasing mental stimulation and physical exercise to reduce excessive behaviors.");
    } else if (dailyAverage < 1) {
      recommendations.push("Great job! Your consistent training seems to be paying off. Keep up the good work!");
    }

    return recommendations.length > 0 ? recommendations : [
      "Continue monitoring your dog's behavior patterns to identify areas for improvement."
    ];
  };

  if (loading) {
    return <Loading message="Analyzing behavior patterns..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadBehaviors} />;
  }

  const filteredBehaviors = getFilteredBehaviors();
  const trends = getBehaviorTrends();
  const distribution = getBehaviorTypeDistribution();
  const topTriggers = getTriggerAnalysis();
  const intensity = getIntensityAnalysis();
  const recommendations = getRecommendations();

  if (behaviors.length === 0) {
    return (
      <Empty
        title="No data to analyze"
        message="Start logging your dog's behaviors to see insights and trends"
        action={() => window.location.href = "/log"}
        actionLabel="Log First Behavior"
        icon="BarChart3"
      />
    );
  }

  const trendChartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif"
    },
    colors: ["#FF6B35"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    xaxis: {
      categories: trends.categories
    },
    yaxis: {
      title: { text: "Number of Behaviors" }
    },
    grid: {
      strokeDashArray: 3
    }
  };

  const distributionChartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif"
    },
    colors: ["#FF6B35", "#F7931E", "#4ECDC4", "#52C41A", "#1890FF", "#722ED1"],
    legend: {
      position: "bottom"
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom"
        }
      }
    }]
  };

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-gray-800">Analysis Period</h2>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-48"
          >
            <option value="7">Past 7 days</option>
            <option value="30">Past 30 days</option>
            <option value="90">Past 90 days</option>
          </Select>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Analyzing {filteredBehaviors.length} behaviors from the selected period
        </p>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-500 rounded-xl">
              <ApperIcon name="Activity" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{filteredBehaviors.length}</p>
              <p className="text-sm text-gray-600">Total Behaviors</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary-50 to-secondary-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-secondary-500 rounded-xl">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-600">{intensity.average}</p>
              <p className="text-sm text-gray-600">Avg Intensity</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent-50 to-accent-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-accent-500 rounded-xl">
              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-600">
                {Math.round((filteredBehaviors.length / parseInt(dateRange)) * 10) / 10}
              </p>
              <p className="text-sm text-gray-600">Per Day</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-display font-bold text-gray-800 mb-4">
            Behavior Trends
          </h3>
          {trends.data.every(val => val === 0) ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No data for selected period</p>
              </div>
            </div>
          ) : (
            <Chart
              options={trendChartOptions}
              series={[{ name: "Behaviors", data: trends.data }]}
              type="area"
              height={280}
            />
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-display font-bold text-gray-800 mb-4">
            Behavior Types
          </h3>
          {distribution.data.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No data for selected period</p>
              </div>
            </div>
          ) : (
            <Chart
              options={{
                ...distributionChartOptions,
                labels: distribution.labels
              }}
              series={distribution.data}
              type="donut"
              height={280}
            />
          )}
        </Card>
      </div>

      {/* Top Triggers */}
      <Card className="p-6">
        <h3 className="text-lg font-display font-bold text-gray-800 mb-4">
          Most Common Triggers
        </h3>
        {topTriggers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Target" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No triggers recorded for selected period</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topTriggers.map(([trigger, count], index) => (
              <div key={trigger} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-800">{trigger}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary-600">{count}</span>
                  <span className="text-sm text-gray-500">times</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl">
            <ApperIcon name="Lightbulb" className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-display font-bold text-gray-800">
            Training Recommendations
          </h3>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg">
              <div className="w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Insights;