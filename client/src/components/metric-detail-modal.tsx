import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MetricData, TimePeriod } from '@/lib/types';
import { calculateBaselineValue, getMetricInterpretation, getTrendInterpretation } from '@/lib/ui-utils';
import MetricTimeChart from '@/components/ui/metric-time-chart';

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
  const baselineValue = calculateBaselineValue(metric.value, metric.percentChange);
  
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
                {baselineValue.toFixed(1)} {metric.unit}
              </div>
            </div>
          </div>
          
          {/* Time period selector */}
          <div className="flex justify-end">
            <div className="inline-flex rounded-md shadow-sm">
              <Button
                variant={activePeriod === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPeriodChange('day')}
                className={`rounded-l-md rounded-r-none ${activePeriod === 'day' ? '' : 'text-muted-foreground'}`}
              >
                Daily
              </Button>
              <Button
                variant={activePeriod === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPeriodChange('week')}
                className={`rounded-none border-l-0 border-r-0 ${activePeriod === 'week' ? '' : 'text-muted-foreground'}`}
              >
                Weekly
              </Button>
              <Button
                variant={activePeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPeriodChange('month')}
                className={`rounded-r-md rounded-l-none ${activePeriod === 'month' ? '' : 'text-muted-foreground'}`}
              >
                Monthly
              </Button>
            </div>
          </div>
          
          {/* Main chart area using Recharts */}
          <div className="border border-border rounded-lg p-4 h-[350px] bg-card">
            <div className="h-full flex flex-col">
              <div className="text-sm font-medium mb-2 flex items-center justify-between">
                <div>{metric.name} Progress Over Time</div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    <span>Pre-study</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                    <span>During study</span>
                  </div>
                </div>
              </div>
              
              <div className="h-full w-full">
                <MetricTimeChart metric={metric} activePeriod={activePeriod} />
              </div>
            </div>
          </div>
          
          {/* Interpretation of data */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Data Interpretation</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {getMetricInterpretation(metric)}
            </p>
            <p className="text-sm text-muted-foreground">
              The chart above shows your measurements before the study began (gray) compared to during the study period (colored). 
              The trend indicates {getTrendInterpretation(metric.percentChange)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricDetailModal;