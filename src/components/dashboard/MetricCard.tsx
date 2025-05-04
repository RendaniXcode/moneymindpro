
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  description, 
  trend = 'neutral',
  trendValue,
  className
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && trendValue && (
              <div className={cn(
                "flex items-center text-sm",
                trend === 'up' && "text-success",
                trend === 'down' && "text-danger",
                trend === 'neutral' && "text-muted-foreground"
              )}>
                {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                {trendValue}
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
