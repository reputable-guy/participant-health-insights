import { ChevronRight, ArrowUp, ArrowDown, Zap, Calendar, AlertCircle, Info } from "lucide-react";
import { CorrelationFactor } from "@/lib/types";
import MetricProgress from "./metric-progress";
import { Badge } from "./badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface CorrelationCardProps {
  factor: CorrelationFactor;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'text-[#4CAF50]';
    case 'warning':
      return 'text-[#FF9800]';
    case 'danger':
      return 'text-[#F44336]';
    default:
      return 'text-[#4CAF50]';
  }
};

const getProgressColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-[#4CAF50]';
    case 'warning':
      return 'bg-[#FF9800]';
    case 'danger':
      return 'bg-[#F44336]';
    default:
      return 'bg-[#4CAF50]';
  }
};

// Function to get plain language impact descriptions
const getImpactDescription = (percentChange: number, metricName: string) => {
  const absChange = Math.abs(percentChange);
  const direction = percentChange > 0 ? 'increased' : 'decreased';
  
  if (absChange > 20) {
    return `Your ${metricName.toLowerCase()} ${direction} significantly`;
  } else if (absChange > 10) {
    return `Your ${metricName.toLowerCase()} ${direction} moderately`;
  } else {
    return `Your ${metricName.toLowerCase()} ${direction} slightly`;
  }
};

const CorrelationCard = ({ factor }: CorrelationCardProps) => {
  // Calculate average impact level for this factor
  const avgImpact = factor.metrics.reduce((sum, m) => sum + Math.abs(m.percentChange), 0) / factor.metrics.length;
  const impactLevel = avgImpact > 15 ? 'High' : avgImpact > 8 ? 'Medium' : 'Low';
  const impactColor = impactLevel === 'High' ? 'bg-green-500/10 text-green-500' : 
                      impactLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-gray-500/10 text-gray-500';
  
  return (
    <div className="bg-surface rounded-xl p-4 mb-3 border border-border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{factor.factorName}</h3>
            <Badge variant="outline" className={impactColor}>
              {impactLevel} Impact
            </Badge>
          </div>
          <div className="flex items-center mt-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">Last tracked {factor.lastTracked}</span>
          </div>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="bg-primary/10 rounded-full p-1">
                <Info className="h-4 w-4 text-primary" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs max-w-[200px]">
                This shows how {factor.factorName.toLowerCase()} appears to affect your key health metrics.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-3">
        {factor.metrics.map((metric, index) => {
          const statusColor = getStatusColor(metric.status);
          const progressColor = getProgressColor(metric.status);
          const progressWidth = Math.min(Math.abs(metric.percentChange) * 5 + 50, 95);
          
          return (
            <div className="flex flex-col" key={index}>
              <div className="flex justify-between items-center text-sm mb-1">
                <div className="flex items-center">
                  {metric.percentChange > 0 ? 
                    <ArrowUp className="h-3.5 w-3.5 text-green-500 mr-1" /> : 
                    <ArrowDown className="h-3.5 w-3.5 text-red-500 mr-1" />
                  }
                  <span>{metric.name}</span>
                </div>
                <span className={statusColor}>
                  {metric.percentChange > 0 ? '+' : ''}{metric.percentChange}%
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex-grow">
                  <MetricProgress 
                    progressColor={progressColor} 
                    progressWidth={progressWidth} 
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="h-3.5 w-3.5 text-muted-foreground ml-2" />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs max-w-[200px]">
                        {getImpactDescription(metric.percentChange, metric.name)} when you tracked {factor.factorName.toLowerCase()}.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          );
        })}
        
        <div className="flex justify-center mt-2">
          <button className="text-sm text-primary flex items-center px-3 py-1 rounded-md hover:bg-primary/5 transition-colors">
            <Zap className="h-3.5 w-3.5 mr-1" />
            See Impact Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorrelationCard;
