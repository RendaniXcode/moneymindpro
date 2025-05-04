
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InsightsCardProps {
  title: string;
  insights: string[];
  className?: string;
  type?: 'insights' | 'recommendations';
}

const InsightsCard: React.FC<InsightsCardProps> = ({ 
  title, 
  insights = [], 
  className,
  type = 'insights' 
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex gap-2 items-baseline">
              <Badge 
                variant="outline" 
                className={type === 'insights' ? "bg-blue-50 text-blue-800" : "bg-amber-50 text-amber-800"}
              >
                {type === 'insights' ? `Insight ${index + 1}` : `Rec ${index + 1}`}
              </Badge>
              <span className="text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default InsightsCard;
