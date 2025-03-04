import { ChevronUp, ChevronDown, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MetricData } from "@/lib/types";
import TooltipInfo from "@/components/ui/tooltip-info";
import MiniChart from "@/components/ui/mini-chart";

interface StudyFocusProps {
  studyName: string;
  primaryMetric: MetricData;
  hypothesis: string;
  goalValue: number;
  significance: number; // p-value or other statistical significance value
}

const StudyFocus = ({ 
  studyName, 
  primaryMetric, 
  hypothesis, 
  goalValue, 
  significance 
}: StudyFocusProps) => {
  const isHypothesisSupported = primaryMetric.percentChange > 0 && significance <= 0.05;
  const percentToGoal = Math.min(100, Math.round((primaryMetric.value / goalValue) * 100));
  
  return (
    <Card className="bg-surface border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary/10 px-4 py-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-primary">Study Focus</h3>
            <Badge variant={isHypothesisSupported ? "outline" : "destructive"} className={isHypothesisSupported ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}>
              {isHypothesisSupported ? "Hypothesis Supported" : "Hypothesis Not Supported"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{hypothesis}</p>
        </div>
        
        {/* Main content */}
        <div className="p-4">
          {/* Primary metric row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                {primaryMetric.status === 'success' ? (
                  <ChevronUp className="h-5 w-5 text-green-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{primaryMetric.name}</h3>
                  {primaryMetric.tooltip && (
                    <div className="ml-1.5">
                      <TooltipInfo content={primaryMetric.tooltip} />
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center space-x-1">
                  <span>Target: {goalValue} {primaryMetric.unit}</span>
                  <span>•</span>
                  <span>Current: {primaryMetric.value} {primaryMetric.unit}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end">
                <span className={`text-lg font-semibold ${
                  primaryMetric.percentChange > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {primaryMetric.percentChange > 0 ? '+' : ''}{primaryMetric.percentChange}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                vs. baseline
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${percentToGoal}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Starting point: {primaryMetric.comparisonValue} {primaryMetric.unit}</span>
              <span>Goal: {goalValue} {primaryMetric.unit}</span>
            </div>
          </div>
          
          {/* Trend */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Trend over study period</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                p={significance}
              </span>
            </div>
            <div className="h-20">
              <MiniChart data={primaryMetric.historicalData} color="var(--primary)" />
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Statistical notes */}
          <div className="text-sm flex items-start">
            <Info className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
            <p className="text-muted-foreground">
              {isHypothesisSupported 
                ? `The data shows a statistically significant improvement in ${primaryMetric.name.toLowerCase()} (p=${significance}), supporting our hypothesis.` 
                : `The data does not show a statistically significant improvement in ${primaryMetric.name.toLowerCase()} (p=${significance}), failing to support our hypothesis.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyFocus;