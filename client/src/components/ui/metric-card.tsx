import { cn } from "@/lib/utils";
import MiniChart from "./mini-chart";
import TooltipInfo from "./tooltip-info";
import { MetricData } from "@/lib/types";
import MetricProgress from "./metric-progress";

interface MetricCardProps {
  metric: MetricData;
  compact?: boolean;
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

const MetricCard = ({ metric, compact = false }: MetricCardProps) => {
  const statusColor = getStatusColor(metric.status);
  const progressColor = getProgressColor(metric.status);
  const progressWidth = Math.min(Math.abs(metric.percentChange) * 5 + 50, 95);
  
  if (compact) {
    return (
      <div className="bg-surface rounded-xl p-3">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <h3 className="text-sm font-medium">{metric.name}</h3>
          </div>
          <span className={`${statusColor} text-xs font-semibold`}>
            {metric.percentChange > 0 ? '+' : ''}{metric.percentChange}%
          </span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-foreground">{metric.value} {metric.unit}</span>
          <span className="text-muted-foreground">vs. {metric.comparisonValue} {metric.unit}</span>
        </div>
        <MetricProgress 
          progressColor={progressColor} 
          progressWidth={progressWidth} 
        />
      </div>
    );
  }
  
  return (
    <div className="bg-surface rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h3 className="font-medium">{metric.name}</h3>
          {metric.tooltip && <TooltipInfo content={metric.tooltip} />}
        </div>
        <div className="flex items-center">
          <MiniChart 
            data={metric.historicalData} 
            color={progressColor.replace('bg-', '')} 
          />
          <span className={`ml-2 ${statusColor} font-semibold`}>
            {metric.percentChange > 0 ? '+' : ''}{metric.percentChange}%
          </span>
        </div>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-foreground font-semibold">{metric.value} {metric.unit}</span>
        <span className="text-muted-foreground">vs. {metric.comparisonValue} {metric.unit}</span>
      </div>
      <MetricProgress 
        progressColor={progressColor} 
        progressWidth={progressWidth} 
      />
    </div>
  );
};

export default MetricCard;
