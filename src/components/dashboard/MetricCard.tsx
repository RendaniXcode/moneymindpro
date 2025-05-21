
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Check, X } from 'lucide-react';

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
      status === 'approved' && "border-green-500",
      status === 'declined' && "border-red-500",
      className
    )}>
      <CardContent className="p-4">
        {status !== 'neutral' ? (
          <div className="flex flex-col items-center justify-center h-full">
            {/* Score Circle */}
            <div className={cn(
              "rounded-full w-24 h-24 flex items-center justify-center text-white font-bold text-3xl mb-4",
              status === 'approved' ? "bg-green-500" : "bg-red-500"
            )}>
              {typeof value === 'number' ? value : ''}
            </div>
            
            {/* Status Label */}
            <div className={cn(
              "flex items-center gap-2 font-bold text-xl",
              status === 'approved' ? "text-green-600" : "text-red-600"
            )}>
              {status === 'approved' ? (
                <>
                  <Check className="h-5 w-5" />
                  APPROVED
                </>
              ) : (
                <>
                  <X className="h-5 w-5" />
                  DECLINED
                </>
              )}
            </div>
            
            {description && (
              <p className="text-xs text-muted-foreground mt-2 text-center">{description}</p>
            )}
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
