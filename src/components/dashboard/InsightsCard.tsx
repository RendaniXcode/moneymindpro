
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ChevronDown, ChevronUp, InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface InsightsCardProps {
  title: string;
  insights: string[];
  className?: string;
  type?: 'insights' | 'recommendations';
  expandable?: boolean;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ 
  title, 
  insights = [], 
  className,
  type = 'insights',
  expandable = false 
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const displayInsights = expandable && !expanded ? insights.slice(0, 3) : insights;
  const hasMore = expandable && insights.length > 3;

  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === 'insights' ? (
              <InfoIcon className="h-5 w-5 text-blue-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            {title}
          </div>
          
          {hasMore && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              {expanded ? (
                <>Show Less <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Show More <ChevronDown className="h-4 w-4" /></>
              )}
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {displayInsights.map((insight, index) => (
            <li key={index} className="flex gap-2 items-baseline animate-fadeIn">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "cursor-help",
                        type === 'insights' 
                          ? "bg-blue-50 text-blue-800 hover:bg-blue-100" 
                          : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                      )}
                    >
                      {type === 'insights' ? `Insight ${index + 1}` : `Rec ${index + 1}`}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px]">
                      {type === 'insights' 
                        ? 'Based on financial data analysis' 
                        : 'Strategic recommendation based on financial trends'
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default InsightsCard;
