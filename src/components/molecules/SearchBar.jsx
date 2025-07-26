import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ value, onChange, placeholder = "Search behaviors...", className }) => {
  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;