import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
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
          <h3 className="font-semibold text-primary">Most Significant Changes</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Metrics with the most notable changes during the study period
          </p>
        </div>
        
        {/* Positive changes section */}
        <div className="p-4">
          <div className="flex items-center mb-3">
            <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
            <h4 className="font-medium">Biggest Improvements</h4>
          </div>
          
          {positiveChanges.length > 0 ? (
            <div className="space-y-3">
              {positiveChanges.map(metric => (
                <MetricChangeRow key={metric.id} metric={metric} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              No significant positive changes detected
            </p>
          )}
        </div>
        
        <Separator />
        
        {/* Negative changes section */}
        <div className="p-4">
          <div className="flex items-center mb-3">
            <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
            <h4 className="font-medium">Biggest Declines</h4>
          </div>
          
          {negativeChanges.length > 0 ? (
            <div className="space-y-3">
              {negativeChanges.map(metric => (
                <MetricChangeRow key={metric.id} metric={metric} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              No significant negative changes detected
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MetricChangeRow = ({ metric }: { metric: MetricData }) => {
  const isPositive = metric.percentChange > 0;
  const percentChangeClass = isPositive ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-3">
          <Badge variant={isPositive ? "outline" : "secondary"} className="h-8 w-8 flex items-center justify-center p-0">
            {metric.name.charAt(0)}
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
            <span>{metric.comparisonValue} {metric.unit}</span>
            <ArrowRight className="h-3 w-3 mx-1" />
            <span>{metric.value} {metric.unit}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="w-16 h-10 mr-3">
          <MiniChart data={metric.historicalData} color={isPositive ? "#10b981" : "#ef4444"} />
        </div>
        <span className={`text-sm font-semibold ${percentChangeClass}`}>
          {isPositive ? '+' : ''}{metric.percentChange}%
        </span>
      </div>
    </div>
  );
};

export default KeyChanges;