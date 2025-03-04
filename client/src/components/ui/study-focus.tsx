import { ChevronUp, ChevronDown, Info, Users, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
  targetPercentChange: number; // The target percent change specified in hypothesis (e.g., 30%)
  significance: number; // p-value or other statistical significance value
  groupAvgChange?: number; // Average percent change for the study group
  confidenceInterval?: [number, number]; // 95% CI for individual's change
}

// Define various result statuses using everyday language
type ResultStatus = 
  | "strong-improvement"   // Clear benefits meeting target goals
  | "moderate-improvement" // Some benefits but below target
  | "no-clear-benefit";    // No clear evidence of benefits

const StudyFocus = ({ 
  studyName, 
  primaryMetric, 
  hypothesis, 
  goalValue, 
  targetPercentChange,
  significance,
  groupAvgChange = 8.3, // Default value if not provided
  confidenceInterval = [5.2, 18.1] // Default value if not provided
}: StudyFocusProps) => {
  // Determine result status based on statistical significance AND effect size
  const getResultStatus = (): ResultStatus => {
    const isStatSignificant = significance <= 0.05;
    const meetsEffectSize = primaryMetric.percentChange >= targetPercentChange;
    
    if (isStatSignificant && meetsEffectSize) {
      return "strong-improvement";
    } else if (isStatSignificant) {
      return "moderate-improvement";
    } else {
      return "no-clear-benefit";
    }
  };
  
  const resultStatus = getResultStatus();
  const percentToGoal = Math.min(100, Math.round((primaryMetric.value / goalValue) * 100));
  
  // Get appropriate badge styling based on result status
  const getBadgeProps = () => {
    switch (resultStatus) {
      case "strong-improvement":
        return {
          variant: "outline" as const,
          className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
          text: "Strong Improvement",
          icon: <CheckCircle className="h-4 w-4 mr-1.5" />
        };
      case "moderate-improvement":
        return {
          variant: "outline" as const,
          className: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
          text: "Moderate Improvement",
          icon: <AlertCircle className="h-4 w-4 mr-1.5" />
        };
      case "no-clear-benefit":
        return {
          variant: "destructive" as const,
          className: "",
          text: "No Clear Benefit",
          icon: <XCircle className="h-4 w-4 mr-1.5" />
        };
    }
  };
  
  const badgeProps = getBadgeProps();

  // Calculate how close to target percentage the user got
  const percentOfTargetAchieved = Math.round((primaryMetric.percentChange / targetPercentChange) * 100);
  
  // Get plain language result explanation
  const getResultExplanation = () => {
    switch (resultStatus) {
      case "strong-improvement":
        return `Your ${primaryMetric.name.toLowerCase()} improved by ${primaryMetric.percentChange}%, which meets or exceeds our goal of ${targetPercentChange}%. This strongly suggests the treatment was effective for you.`;
      case "moderate-improvement":
        return `Your ${primaryMetric.name.toLowerCase()} improved by ${primaryMetric.percentChange}%. While this is a real improvement, it's less than our goal of ${targetPercentChange}%. The treatment was somewhat effective for you.`;
      case "no-clear-benefit":
        return `Your ${primaryMetric.name.toLowerCase()} changed by ${primaryMetric.percentChange}%, but we can't be sure this wasn't due to chance. This suggests the treatment may not have had a clear benefit for you.`;
    }
  };

  // Get health implications text
  const getHealthImplications = () => {
    switch (resultStatus) {
      case "strong-improvement":
        return "Based on research, this level of improvement in deep sleep is associated with better memory, improved mood, and enhanced immune function.";
      case "moderate-improvement":
        return "Even this moderate improvement in deep sleep can contribute to better cognitive function and physical recovery.";
      case "no-clear-benefit":
        return "Don't be discouraged - everyone's body responds differently to treatments. The study included multiple metrics, and you may have seen benefits in other areas.";
    }
  };
  
  return (
    <Card className="bg-surface border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary/10 px-4 py-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-primary">Main Study Goal</h3>
            <Badge variant={badgeProps.variant} className={badgeProps.className}>
              <div className="flex items-center">
                {badgeProps.icon}
                {badgeProps.text}
              </div>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">We tested if: {hypothesis}</p>
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
                <div className="text-sm text-muted-foreground flex items-center space-x-2">
                  <span>Before: {primaryMetric.comparisonValue} {primaryMetric.unit}</span>
                  <span>→</span>
                  <span>After: {primaryMetric.value} {primaryMetric.unit}</span>
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
                change
              </span>
            </div>
          </div>
          
          {/* How You Compare Section */}
          <div className="mb-4 p-4 bg-gray-800/30 rounded-lg">
            <h4 className="font-medium mb-3">How You Compare</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Your results vs target */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Your Change</span>
                  <span className="text-sm">{primaryMetric.percentChange}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${Math.min(100, Math.abs(primaryMetric.percentChange))}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Study Target</span>
                  <span className="text-sm">{targetPercentChange}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-gray-400 rounded-full" 
                    style={{ width: `${Math.min(100, targetPercentChange)}%` }}
                  />
                </div>
              </div>
              
              {/* Your results vs group average */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Your Change</span>
                  <span className="text-sm">{primaryMetric.percentChange}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${Math.min(100, Math.abs(primaryMetric.percentChange))}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Group Average</span>
                  <span className="text-sm">{groupAvgChange}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-green-500/50 rounded-full" 
                    style={{ width: `${Math.min(100, groupAvgChange)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              {primaryMetric.percentChange > groupAvgChange 
                ? `Your improvement was ${Math.round((primaryMetric.percentChange / groupAvgChange - 1) * 100)}% better than the average participant.`
                : `Your improvement was ${Math.round((1 - primaryMetric.percentChange / groupAvgChange) * 100)}% less than the average participant.`
              }
            </p>
          </div>
          
          <Separator className="my-4" />
          
          {/* Results Summary */}
          <div>
            <h4 className="font-medium mb-2">What This Means For You</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <p>{getResultExplanation()}</p>
              </div>
              
              <div className="text-sm flex items-start bg-primary/5 p-3 rounded-lg">
                <Info className="h-4 w-4 mr-2 text-primary mt-0.5" />
                <p>{getHealthImplications()}</p>
              </div>
              
              {significance <= 0.05 && (
                <p className="text-xs text-muted-foreground">
                  Note: Your results were tested for statistical significance (p={significance}), which means we're confident the changes weren't just due to random chance.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyFocus;