
import React from 'react';
import { cn } from '@/lib/utils';

interface CreditScoreCardProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CreditScoreCard: React.FC<CreditScoreCardProps> = ({ 
  score, 
  size = 'md',
  className 
}) => {
  // Determine color and rating based on score
  const getColorClass = () => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 65) return 'from-blue-500 to-blue-600';
    if (score >= 50) return 'from-amber-500 to-amber-600';
    if (score >= 35) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };
  
  const getRating = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 35) return 'Fair';
    return 'Poor';
  };

  // Calculate size based on prop
  const sizeClasses = {
    sm: 'h-14 w-14 text-lg',
    md: 'h-20 w-20 text-2xl',
    lg: 'h-28 w-28 text-3xl'
  };
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className={cn(
          "rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br shadow-md",
          getColorClass(),
          sizeClasses[size]
        )}
      >
        {score}
      </div>
      <div className="text-sm font-medium mt-1">
        {getRating()}
      </div>
    </div>
  );
};

export default CreditScoreCard;
