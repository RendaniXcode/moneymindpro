
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChartLine, TrendingUp } from "lucide-react";

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange, className }) => {
  const timeRanges = [
    { value: "quarterly", label: "Quarterly", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { value: "yearly", label: "Yearly", icon: <ChartLine className="h-4 w-4 mr-2" /> },
    { value: "5year", label: "5 Year Trend", icon: <TrendingUp className="h-4 w-4 mr-2" /> }
  ];
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <div className="flex items-center gap-2">
        {timeRanges.map((range) => (
          <Button
            key={range.value}
            variant={value === range.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(range.value)}
            className="flex items-center gap-1"
          >
            {range.icon}
            <span className="hidden sm:inline">{range.label}</span>
          </Button>
        ))}
      </div>
      
      <div className="sm:hidden">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                <div className="flex items-center">
                  {range.icon}
                  <span>{range.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimeRangeSelector;
