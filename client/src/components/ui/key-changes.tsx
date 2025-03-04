import { TrendingUp, TrendingDown, ArrowRight, Heart, Brain, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MetricData } from "@/lib/types";
import TooltipInfo from "@/components/ui/tooltip-info";
import MiniChart from "@/components/ui/mini-chart";

interface KeyChangesProps {
  metrics: MetricData[];
}

const KeyChanges = ({ metrics }: KeyChangesProps) => {
  // Sort metrics by absolute percent change (descending)
  const sortedMetrics = [...metrics].sort((a, b) => 
    Math.abs(b.percentChange) - Math.abs(a.percentChange)
  );
  
  // Get top positive and negative changes
  const positiveChanges = sortedMetrics
    .filter(m => m.percentChange > 0)
    .slice(0, 3);
    
  const negativeChanges = sortedMetrics
    .filter(m => m.percentChange < 0)
    .slice(0, 3);
  
  return (
    <Card className="bg-surface border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary/10 px-4 py-3">
          <h3 className="font-semibold text-primary">Your Biggest Changes</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The health metrics that changed the most during your study
          </p>
        </div>
        
        {/* Positive changes section */}
        <div className="p-4">
          <div className="flex items-center mb-3">
            <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
            <h4 className="font-medium">What Improved</h4>
          </div>
          
          {positiveChanges.length > 0 ? (
            <div className="space-y-4">
              {positiveChanges.map(metric => (
                <MetricChangeRow key={metric.id} metric={metric} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              No significant improvements detected
            </p>
          )}
        </div>
        
        <Separator />
        
        {/* Negative changes section */}
        <div className="p-4">
          <div className="flex items-center mb-3">
            <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
            <h4 className="font-medium">What Decreased</h4>
          </div>
          
          {negativeChanges.length > 0 ? (
            <div className="space-y-4">
              {negativeChanges.map(metric => (
                <MetricChangeRow key={metric.id} metric={metric} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              No significant decreases detected
            </p>
          )}
        </div>
        
        {/* Health implications section */}
        <div className="bg-gray-800/30 p-4">
          <h4 className="font-medium mb-2">What These Changes Mean</h4>
          <p className="text-sm">
            Changes above 10% are usually meaningful for your health. Even small improvements in 
            metrics like deep sleep or heart rate variability can have significant benefits for your 
            overall wellbeing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get an appropriate icon based on metric name
const getMetricIcon = (metricName: string) => {
  const name = metricName.toLowerCase();
  
  if (name.includes('heart') || name.includes('hrv') || name.includes('pulse')) {
    return <Heart className="h-4 w-4" />;
  }
  if (name.includes('sleep') || name.includes('rem') || name.includes('awake')) {
    return <Brain className="h-4 w-4" />;
  }
  return <Activity className="h-4 w-4" />;
};

const MetricChangeRow = ({ metric }: { metric: MetricData }) => {
  const isPositive = metric.percentChange > 0;
  const percentChangeClass = isPositive ? 'text-green-500' : 'text-red-500';
  
  // Get health impact text based on metric name and change percentage
  const getHealthImpact = () => {
    const absChange = Math.abs(metric.percentChange);
    const name = metric.name.toLowerCase();
    
    if (name.includes('deep sleep') && isPositive) {
      return "Better memory and recovery";
    }
    if (name.includes('rem') && isPositive) {
      return "Improved learning and mood";
    }
    if (name.includes('hrv') && isPositive) {
      return "Better stress resilience";
    }
    if (name.includes('resting heart rate') && !isPositive) {
      return "Improved cardiovascular health";
    }
    if (name.includes('steps') && isPositive) {
      return "Better cardiovascular health";
    }
    
    // Generic impacts
    if (absChange >= 20) {
      return isPositive ? "Major health benefit" : "Significant change";
    } else if (absChange >= 10) {
      return isPositive ? "Moderate health benefit" : "Moderate change";
    } else {
      return isPositive ? "Slight health benefit" : "Minimal change";
    }
  };
  
  const healthImpact = getHealthImpact();
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3">
            <Badge variant={isPositive ? "outline" : "secondary"} 
                  className={`h-8 w-8 flex items-center justify-center p-0 ${
                    isPositive ? 'bg-green-500/10 text-green-500' : ''
                  }`}>
              {getMetricIcon(metric.name)}
            </Badge>
          </div>
          <div>
            <div className="flex items-center">
              <h5 className="font-medium text-sm">{metric.name}</h5>
              {metric.tooltip && (
                <div className="ml-1.5">
                  <TooltipInfo content={metric.tooltip} />
                </div>
              )}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Before: {metric.comparisonValue} {metric.unit}</span>
              <ArrowRight className="h-3 w-3 mx-1" />
              <span>After: {metric.value} {metric.unit}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end">
            <span className={`text-sm font-semibold ${percentChangeClass}`}>
              {isPositive ? '+' : ''}{metric.percentChange}%
            </span>
          </div>
          <span className="text-xs text-muted-foreground">change</span>
        </div>
      </div>
      
      {/* Mini chart and health impact */}
      <div className="flex items-center justify-between mt-2 pl-11">
        <div className="w-24 h-12">
          <MiniChart data={metric.historicalData} color={isPositive ? "#10b981" : "#ef4444"} />
        </div>
        <div className="text-xs bg-primary/5 px-2 py-1 rounded">
          {healthImpact}
        </div>
      </div>
    </div>
  );
};

export default KeyChanges;