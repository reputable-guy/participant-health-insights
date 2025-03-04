import { ChevronRight } from "lucide-react";
import { CorrelationFactor } from "@/lib/types";
import MetricProgress from "./metric-progress";

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

const CorrelationCard = ({ factor }: CorrelationCardProps) => {
  return (
    <div className="bg-surface rounded-xl p-4 mb-3">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h3 className="font-medium">{factor.factorName}</h3>
          <div className="ml-2 flex">
            <div className={`w-2 h-2 rounded-full ${factor.status ? 'bg-[#4CAF50]' : 'bg-gray-600'} mr-1`}></div>
            <div className={`w-2 h-2 rounded-full ${!factor.status ? 'bg-[#4CAF50]' : 'bg-gray-600'}`}></div>
          </div>
          <span className="text-xs text-muted-foreground ml-2">Last tracked {factor.lastTracked}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {factor.metrics.map((metric, index) => {
          const statusColor = getStatusColor(metric.status);
          const progressColor = getProgressColor(metric.status);
          const progressWidth = Math.min(Math.abs(metric.percentChange) * 5 + 50, 95);
          
          return (
            <div className="flex flex-col" key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{metric.name}</span>
                <span className={statusColor}>
                  {metric.percentChange > 0 ? '+' : ''}{metric.percentChange}%
                </span>
              </div>
              <MetricProgress 
                progressColor={progressColor} 
                progressWidth={progressWidth} 
              />
            </div>
          );
        })}
        
        <div className="flex justify-center mt-1">
          <button className="text-sm text-primary flex items-center">
            See All
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorrelationCard;
