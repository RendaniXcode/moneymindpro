
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
  status?: 'approved' | 'declined' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  description, 
  trend = 'neutral',
  trendValue,
  className,
  status = 'neutral'
}) => {
  return (
    <Card className={cn(
      "overflow-hidden relative",
      status === 'approved' && "border-green-500 bg-green-50",
      status === 'declined' && "border-red-500 bg-red-50",
      className
    )}>
      <CardContent className="p-4">
        {status !== 'neutral' ? (
          <div className={cn(
            "font-bold text-2xl flex items-center justify-center h-full",
            status === 'approved' && "text-green-600",
            status === 'declined' && "text-red-600"
          )}>
            {status === 'approved' ? 'APPROVED' : 'DECLINED'}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
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
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
