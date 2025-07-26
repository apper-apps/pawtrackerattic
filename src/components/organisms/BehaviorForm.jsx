import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import IntensitySlider from "@/components/molecules/IntensitySlider";
import behaviorService from "@/services/api/behaviorService";
import behaviorTypeService from "@/services/api/behaviorTypeService";
import triggerTypeService from "@/services/api/triggerTypeService";

const BehaviorForm = ({ initialBehavior, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "",
    customType: "",
    trigger: "",
    customTrigger: "",
    intensity: 3,
    location: "",
    notes: "",
    duration: "",
    timestamp: new Date().toISOString().slice(0, 16)
  });

  const [behaviorTypes, setBehaviorTypes] = useState([]);
  const [triggerTypes, setTriggerTypes] = useState([]);
  const [loading, setLoading] = useState(false);

useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [behaviors, triggers] = await Promise.all([
          behaviorTypeService.getAll(),
          triggerTypeService.getAll()
        ]);
        setBehaviorTypes(behaviors);
        setTriggerTypes(triggers);
      } catch (error) {
        console.error("Failed to load form data:", error);
        toast.error("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    if (initialBehavior) {
      setFormData({
        type: initialBehavior.type,
        customType: initialBehavior.customType || "",
        trigger: initialBehavior.trigger,
        customTrigger: initialBehavior.customTrigger || "",
        intensity: initialBehavior.intensity,
        location: initialBehavior.location || "",
        notes: initialBehavior.notes || "",
        duration: initialBehavior.duration || "",
        timestamp: new Date(initialBehavior.timestamp).toISOString().slice(0, 16)
      });
    }
  }, [initialBehavior]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const behaviorData = {
        ...formData,
        timestamp: new Date(formData.timestamp).toISOString(),
        duration: formData.duration ? parseInt(formData.duration) : null
      };

      let result;
      if (initialBehavior) {
        result = await behaviorService.update(initialBehavior.Id || initialBehavior.id, behaviorData);
        if (result) {
          toast.success("Behavior updated successfully!");
        }
      } else {
        result = await behaviorService.create(behaviorData);
        if (result) {
          toast.success("Behavior logged successfully!");
        }
      }

      if (result) {
        onSubmit?.(result);
      }
    } catch (error) {
      console.error("Error saving behavior:", error);
      toast.error("Failed to save behavior");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Behavior Type"
          value={formData.type}
          onChange={(e) => handleInputChange("type", e.target.value)}
          required
        >
          <option value="">Select behavior type</option>
          {behaviorTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
          <option value="custom">Custom behavior</option>
        </Select>

        {formData.type === "custom" && (
          <Input
            label="Custom Behavior"
            value={formData.customType}
            onChange={(e) => handleInputChange("customType", e.target.value)}
            placeholder="Enter custom behavior"
            required
          />
        )}

        <Select
          label="Trigger"
          value={formData.trigger}
          onChange={(e) => handleInputChange("trigger", e.target.value)}
          required
        >
          <option value="">Select trigger</option>
          {triggerTypes.map((trigger) => (
            <option key={trigger.id} value={trigger.name}>
              {trigger.name}
            </option>
          ))}
          <option value="custom">Custom trigger</option>
        </Select>

        {formData.trigger === "custom" && (
          <Input
            label="Custom Trigger"
            value={formData.customTrigger}
            onChange={(e) => handleInputChange("customTrigger", e.target.value)}
            placeholder="Enter custom trigger"
            required
          />
        )}

        <Input
          label="Location (Optional)"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          placeholder="Where did this happen?"
        />

        <Input
          label="Duration (minutes, optional)"
          type="number"
          min="1"
          value={formData.duration}
          onChange={(e) => handleInputChange("duration", e.target.value)}
          placeholder="How long did it last?"
        />

        <Input
          label="Date & Time"
          type="datetime-local"
          value={formData.timestamp}
          onChange={(e) => handleInputChange("timestamp", e.target.value)}
          required
        />
      </div>

      <IntensitySlider
        label="Intensity Level"
        value={formData.intensity}
        onChange={(value) => handleInputChange("intensity", value)}
      />

      <Textarea
        label="Notes (Optional)"
        value={formData.notes}
        onChange={(e) => handleInputChange("notes", e.target.value)}
        placeholder="Additional observations or context..."
        rows={3}
      />

      <div className="flex space-x-4 pt-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={loading}
        >
          {loading ? "Saving..." : (initialBehavior ? "Update Behavior" : "Log Behavior")}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default BehaviorForm;