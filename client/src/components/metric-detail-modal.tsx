import { FC } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MetricTimeChart from "@/components/ui/metric-time-chart";
import TimePeriodSelector from "@/components/ui/time-period-selector";
import { MetricData, TimePeriod } from "@/lib/types";

interface MetricDetailModalProps {
  metric: MetricData;
  activePeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  onClose: () => void;
}

/**
 * Modal for displaying detailed metric information with time series chart
 */
const MetricDetailModal: FC<MetricDetailModalProps> = ({
  metric,
  activePeriod,
  onPeriodChange,
  onClose
}) => {
  // Calculate baseline value
  const baselineValue = Number(metric.value - (metric.value * metric.percentChange / 100)).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header with close button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{metric.name} Progress</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Metrics at a glance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Current Value</div>
              <div className="text-2xl font-bold">{metric.value} {metric.unit}</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Change</div>
              <div className={`text-2xl font-bold ${metric.percentChange > 0 ? 'text-green-500' : metric.percentChange < 0 ? 'text-red-500' : ''}`}>
                {metric.percentChange > 0 ? '+' : ''}{metric.percentChange.toFixed(1)}%
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Baseline Value</div>
              <div className="text-2xl font-bold">
                {baselineValue} {metric.unit}
              </div>
            </div>
          </div>
          
          {/* Time period selector */}
          <div className="flex justify-end">
            <TimePeriodSelector 
              activePeriod={activePeriod}
              onChange={onPeriodChange}
            />
          </div>
          
          {/* Main chart area using our custom component */}
          <div className="border border-border rounded-lg p-4 h-[350px] bg-card">
            <div className="h-full flex flex-col">
              <div className="text-sm font-medium mb-2">
                {metric.name} Progress Over Time
              </div>
              
              <div className="h-full w-full">
                <MetricTimeChart 
                  metric={metric}
                  activePeriod={activePeriod}
                />
              </div>
            </div>
          </div>
          
          {/* Interpretation of data */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Data Interpretation</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {metric.percentChange > 15 ? 
                `Your ${metric.name.toLowerCase()} showed significant improvement during the study, with a ${metric.percentChange.toFixed(1)}% increase from your baseline measurements.` :
                metric.percentChange > 0 ?
                `Your ${metric.name.toLowerCase()} showed moderate improvement during the study, with a ${metric.percentChange.toFixed(1)}% increase from your baseline.` :
                metric.percentChange < 0 ?
                `Your ${metric.name.toLowerCase()} decreased by ${Math.abs(metric.percentChange).toFixed(1)}% during the study period.` :
                `Your ${metric.name.toLowerCase()} remained stable throughout the study period.`
              }
            </p>
            <p className="text-sm text-muted-foreground">
              The chart above shows your measurements before the study began (gray) compared to during the study period (colored). The trend indicates 
              {metric.percentChange > 0 
                ? " a positive response to the intervention."
                : metric.percentChange < 0
                ? " a potential area for further investigation."
                : " consistent values throughout the measurement period."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricDetailModal;