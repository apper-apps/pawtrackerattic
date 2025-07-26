import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/atoms/Card";
import BehaviorForm from "@/components/organisms/BehaviorForm";

const LogBehavior = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialBehavior = location.state?.behavior;

  const handleSubmit = async (behaviorData) => {
    setIsSubmitting(true);
    // Small delay to show the submission state
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">
            {initialBehavior ? "Edit Behavior" : "Log New Behavior"}
          </h2>
          <p className="text-gray-600">
            {initialBehavior 
              ? "Update the details of this behavior entry"
              : "Record your dog's behavior with context and details"
            }
          </p>
        </div>

        <BehaviorForm
          initialBehavior={initialBehavior}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
};

export default LogBehavior;