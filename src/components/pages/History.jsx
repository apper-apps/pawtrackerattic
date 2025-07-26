import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import BehaviorCard from "@/components/molecules/BehaviorCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import behaviorService from "@/services/api/behaviorService";

const History = () => {
  const navigate = useNavigate();
  const [behaviors, setBehaviors] = useState([]);
  const [filteredBehaviors, setFilteredBehaviors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [intensityFilter, setIntensityFilter] = useState("all");

const loadBehaviors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await behaviorService.getAll();
      setBehaviors(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (err) {
      console.error("Failed to load behavior history:", err);
      setError("Failed to load behavior history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBehaviors();
  }, []);

  useEffect(() => {
    let filtered = [...behaviors];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(behavior => 
        (behavior.customType || behavior.type).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (behavior.customTrigger || behavior.trigger).toLowerCase().includes(searchQuery.toLowerCase()) ||
        behavior.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let filterDate;
      
      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(behavior => {
            const behaviorDate = new Date(behavior.timestamp);
            return behaviorDate >= startOfDay(now) && behaviorDate <= endOfDay(now);
          });
          break;
        case "week":
          filterDate = subDays(now, 7);
          filtered = filtered.filter(behavior => new Date(behavior.timestamp) >= filterDate);
          break;
        case "month":
          filterDate = subDays(now, 30);
          filtered = filtered.filter(behavior => new Date(behavior.timestamp) >= filterDate);
          break;
      }
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(behavior => 
        (behavior.customType || behavior.type) === typeFilter
      );
    }

    // Apply intensity filter
    if (intensityFilter !== "all") {
      const intensity = parseInt(intensityFilter);
      filtered = filtered.filter(behavior => behavior.intensity === intensity);
    }

    setFilteredBehaviors(filtered);
  }, [behaviors, searchQuery, dateFilter, typeFilter, intensityFilter]);

const handleDeleteBehavior = async (behaviorId) => {
    if (!window.confirm("Are you sure you want to delete this behavior entry?")) {
      return;
    }

    try {
      const result = await behaviorService.delete(behaviorId);
      if (result) {
        toast.success("Behavior deleted successfully");
        loadBehaviors();
      }
    } catch (error) {
      console.error("Failed to delete behavior:", error);
      toast.error("Failed to delete behavior");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateFilter("all");
    setTypeFilter("all");
    setIntensityFilter("all");
  };

  const getUniqueTypes = () => {
    const types = behaviors.map(b => b.customType || b.type);
    return [...new Set(types)].sort();
  };

  if (loading) {
    return <Loading message="Loading behavior history..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadBehaviors} />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-gray-800">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500"
          >
            <ApperIcon name="X" className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search behaviors, triggers, or notes..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Date Range"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </Select>

            <Select
              label="Behavior Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>

            <Select
              label="Intensity Level"
              value={intensityFilter}
              onChange={(e) => setIntensityFilter(e.target.value)}
            >
              <option value="all">All Intensities</option>
              <option value="1">1 - Very Low</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - High</option>
              <option value="5">5 - Very High</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-800">
              Behavior History
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredBehaviors.length} of {behaviors.length} behaviors
            </p>
          </div>
          
          <Button onClick={() => navigate("/log")}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Log Behavior
          </Button>
        </div>

        {filteredBehaviors.length === 0 ? (
          <Empty
            title={behaviors.length === 0 ? "No behaviors logged yet" : "No behaviors match your filters"}
            message={behaviors.length === 0 
              ? "Start tracking your dog's behavior to build a history" 
              : "Try adjusting your search criteria or filters"
            }
            action={behaviors.length === 0 ? () => navigate("/log") : clearFilters}
            actionLabel={behaviors.length === 0 ? "Log First Behavior" : "Clear Filters"}
            icon="History"
          />
        ) : (
          <div className="space-y-4">
            {filteredBehaviors.map((behavior) => (
              <BehaviorCard
                key={behavior.id}
                behavior={behavior}
                onEdit={(behavior) => navigate("/log", { state: { behavior } })}
                onDelete={handleDeleteBehavior}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default History;