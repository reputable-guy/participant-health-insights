import { ChevronUp, ChevronDown, Info, Users, User } from "lucide-react";
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

// Define various hypothesis statuses
type HypothesisStatus = 
  | "fully-supported"   // Statistically significant & meets effect size goal
  | "partially-supported" // Statistically significant but below effect size goal
  | "not-supported";    // Not statistically significant

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
  // Determine hypothesis status based on statistical significance AND effect size
  const getHypothesisStatus = (): HypothesisStatus => {
    const isStatSignificant = significance <= 0.05;
    const meetsEffectSize = primaryMetric.percentChange >= targetPercentChange;
    
    if (isStatSignificant && meetsEffectSize) {
      return "fully-supported";
    } else if (isStatSignificant) {
      return "partially-supported";
    } else {
      return "not-supported";
    }
  };
  
  const hypothesisStatus = getHypothesisStatus();
  const percentToGoal = Math.min(100, Math.round((primaryMetric.value / goalValue) * 100));
  
  // Get appropriate badge styling based on hypothesis status
  const getBadgeProps = () => {
    switch (hypothesisStatus) {
      case "fully-supported":
        return {
          variant: "outline" as const,
          className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
          text: "Hypothesis Fully Supported"
        };
      case "partially-supported":
        return {
          variant: "outline" as const,
          className: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
          text: "Hypothesis Partially Supported"
        };
      case "not-supported":
        return {
          variant: "destructive" as const,
          className: "",
          text: "Hypothesis Not Supported"
        };
    }
  };
  
  const badgeProps = getBadgeProps();

  // Calculate how close to target percentage the user got
  const percentOfTargetAchieved = Math.round((primaryMetric.percentChange / targetPercentChange) * 100);
  
  // Get status description text
  const getStatusDescription = () => {
    switch (hypothesisStatus) {
      case "fully-supported":
        return `The data shows a statistically significant improvement in ${primaryMetric.name.toLowerCase()} (p=${significance}) and meets or exceeds the target improvement of ${targetPercentChange}%, fully supporting our hypothesis.`;
      case "partially-supported":
        return `The data shows a statistically significant improvement in ${primaryMetric.name.toLowerCase()} (p=${significance}), but the improvement (${primaryMetric.percentChange}%) is below the target of ${targetPercentChange}%, partially supporting our hypothesis.`;
      case "not-supported":
        return `The data does not show a statistically significant improvement in ${primaryMetric.name.toLowerCase()} (p=${significance}), failing to support our hypothesis.`;
    }
  };
  
  return (
    <Card className="bg-surface border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary/10 px-4 py-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-primary">Study Focus</h3>
            <Badge variant={badgeProps.variant} className={badgeProps.className}>
              {badgeProps.text}
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
          
          {/* Change goal progress */}
          <div className="mb-4 p-3 bg-gray-800/30 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Progress toward target change</span>
              <span className="text-sm">{percentOfTargetAchieved}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  percentOfTargetAchieved >= 100 
                    ? 'bg-green-500' 
                    : percentOfTargetAchieved >= 50 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, percentOfTargetAchieved)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Target: {targetPercentChange}% increase • Achieved: {primaryMetric.percentChange}%
            </div>
          </div>
          
          {/* Comparative analysis */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="bg-gray-800/30 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <User className="h-4 w-4 mr-1.5" />
                <span className="text-sm font-medium">Your Change</span>
              </div>
              <p className={`text-xl font-semibold ${
                primaryMetric.percentChange > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {primaryMetric.percentChange > 0 ? '+' : ''}{primaryMetric.percentChange}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                95% CI: [{confidenceInterval[0]}%, {confidenceInterval[1]}%]
              </p>
            </div>
            
            <div className="bg-gray-800/30 p-3 rounded-lg">
              <div className="flex items-center mb-1">
                <Users className="h-4 w-4 mr-1.5" />
                <span className="text-sm font-medium">Group Average</span>
              </div>
              <p className={`text-xl font-semibold ${
                groupAvgChange > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {groupAvgChange > 0 ? '+' : ''}{groupAvgChange}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {primaryMetric.percentChange > groupAvgChange 
                  ? `You're ${Math.round((primaryMetric.percentChange / groupAvgChange - 1) * 100)}% above average`
                  : `You're ${Math.round((1 - primaryMetric.percentChange / groupAvgChange) * 100)}% below average`
                }
              </p>
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
              {getStatusDescription()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyFocus;