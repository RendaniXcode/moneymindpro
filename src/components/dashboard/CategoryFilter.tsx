
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  className
}) => {
  const getCategoryLabel = (category: string) => {
    return category === 'all' ? 'All Categories' : category.replace(/_/g, ' ');
  };

  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      'all': 'bg-slate-100 text-slate-800',
      'liquidity_ratios': 'bg-blue-100 text-blue-800',
      'profitability_ratios': 'bg-green-100 text-green-800',
      'solvency_ratios': 'bg-purple-100 text-purple-800',
      'efficiency_ratios': 'bg-amber-100 text-amber-800',
      'market_value_ratios': 'bg-indigo-100 text-indigo-800',
    };
    
    return categoryMap[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {/* Ensure "all" is always the first option */}
        <Badge
          key="all"
          onClick={() => onSelectCategory('')}
          className={cn(
            "cursor-pointer hover:opacity-80 transition-opacity",
            getCategoryColor('all'),
            selectedCategory === '' ? "ring-1 ring-black ring-offset-1" : ""
          )}
        >
          All Categories
        </Badge>
        
        {categories.filter(category => category !== 'all').map((category) => (
          <Badge
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "cursor-pointer hover:opacity-80 transition-opacity",
              getCategoryColor(category),
              selectedCategory === category ? "ring-1 ring-black ring-offset-1" : ""
            )}
          >
            {getCategoryLabel(category)}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
