import { cn } from "@/lib/utils";
import MiniChart from "./mini-chart";
import TooltipInfo from "./tooltip-info";
import { MetricData } from "@/lib/types";
import MetricProgress from "./metric-progress";
import { getProgressColor, getProgressWidth, getStatusColor } from "@/lib/ui-utils";

interface MetricCardProps {
  metric: MetricData;
  compact?: boolean;
  onClick?: () => void;
}

/**
 * Card component displaying key metric information
 * Used in both regular and compact versions
 */
const MetricCard = ({ metric, compact = false, onClick }: MetricCardProps) => {
  const statusColor = getStatusColor(metric.status);
  const progressColor = getProgressColor(metric.status);
  const progressWidth = getProgressWidth(metric.percentChange);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  if (compact) {
    return (
      <div 
        className="bg-surface rounded-xl p-3 transition-all hover:shadow-md cursor-pointer"
        onClick={handleClick}
      >
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
    <div 
      className="bg-surface rounded-xl p-4 transition-all hover:shadow-md cursor-pointer"
      onClick={handleClick}
    >
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
