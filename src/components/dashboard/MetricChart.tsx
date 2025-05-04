
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from "recharts";
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";

interface MetricChartProps {
  title: string;
  defaultType?: 'bar' | 'line' | 'area';
  data: Array<Record<string, any>>;
  dataKey: string;
  color?: string;
  className?: string;
  showControls?: boolean;
}

const MetricChart: React.FC<MetricChartProps> = ({ 
  title,
  defaultType = 'line',
  data,
  dataKey,
  color = "#3b82f6",
  className,
  showControls = true
}) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>(defaultType);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {showControls && (
            <div className="flex space-x-1">
              <Button 
                variant={chartType === 'line' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setChartType('line')}
                className="h-8"
              >
                Line
              </Button>
              <Button 
                variant={chartType === 'bar' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setChartType('bar')}
                className="h-8"
              >
                Bar
              </Button>
              <Button 
                variant={chartType === 'area' ? "default" : "outline"} 
                size="sm" 
                onClick={() => setChartType('area')}
                className="h-8"
              >
                Area
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-1">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={color} 
                  strokeWidth={2} 
                  dot={{ r: 4, strokeWidth: 1 }}
                />
              </LineChart>
            ) : (
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey={dataKey} 
                  fill={color} 
                  fillOpacity={0.4}
                  stroke={color} 
                  strokeWidth={2}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricChart;
