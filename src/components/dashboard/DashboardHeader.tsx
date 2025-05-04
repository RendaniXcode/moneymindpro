
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarRange, RefreshCw, Download, Filter } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
  onExport?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle,
  onApplyFilters,
  onResetFilters,
  onExport 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" /> 2024
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={onApplyFilters}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={onExport}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
