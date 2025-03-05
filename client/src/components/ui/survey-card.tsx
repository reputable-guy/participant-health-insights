import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// PSQI components and their descriptions
const componentDescriptions: Record<string, string> = {
  'Sleep Quality': 'Subjective rating of overall sleep quality',
  'Sleep Latency': 'Time it takes to fall asleep',
  'Sleep Duration': 'Actual hours of sleep per night',
  'Sleep Efficiency': 'Percentage of time in bed spent sleeping',
  'Sleep Disturbances': 'Frequency of sleep disruptions',
  'Sleep Medication': 'Use of medications to aid sleep',
  'Daytime Dysfunction': 'Problems with daytime functioning due to sleepiness',
  
  // SF-36 components
  'Physical Functioning': 'Ability to perform physical activities',
  'Role-Physical': 'Problems with work or daily activities due to physical health',
  'Bodily Pain': 'Pain severity and its interference with normal activities',
  'General Health': 'Personal evaluation of health status, prospects, and resistance to illness',
  'Vitality': 'Energy and fatigue level',
  'Social Functioning': 'Extent of physical/emotional problems interfering with social activities',
  'Role-Emotional': 'Problems with work or daily activities due to emotional health',
  'Mental Health': 'General mental health including depression, anxiety, and positive well-being'
};

interface SurveyComponentScore {
  name: string;
  baselineScore: number;
  currentScore: number;
  percentChange: number;
  avgStudyScore: number;
  maxPossibleScore: number;
  higherIsBetter: boolean;
}

interface SurveyCardProps {
  surveyName: string;
  description: string;
  baselineDate: string;
  endDate: string;
  totalBaselineScore: number;
  totalCurrentScore: number;
  totalMaxScore: number;
  percentChange: number;
  components: SurveyComponentScore[];
  higherScoreIsBetter: boolean;
}

const SurveyCard: React.FC<SurveyCardProps> = ({
  surveyName,
  description,
  baselineDate,
  endDate,
  totalBaselineScore,
  totalCurrentScore,
  totalMaxScore,
  percentChange,
  components,
  higherScoreIsBetter
}) => {
  // Format percentChange for display
  const formattedPercentChange = Math.abs(percentChange).toFixed(1);
  
  // Determine if the change is positive (based on whether higher scores are better)
  const isPositiveChange = (percentChange > 0 && higherScoreIsBetter) || 
                          (percentChange < 0 && !higherScoreIsBetter);
  
  // Set classes based on change direction
  const changeTextClass = isPositiveChange ? "text-green-500" : "text-red-500";
  const changeIconClass = isPositiveChange ? "text-green-500" : "text-red-500";
  
  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{surveyName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`text-right ${changeTextClass}`}>
            <div className="flex items-center justify-end">
              {isPositiveChange ? (
                <ArrowUp className={`h-5 w-5 mr-1 ${changeIconClass}`} />
              ) : (
                <ArrowDown className={`h-5 w-5 mr-1 ${changeIconClass}`} />
              )}
              <span className="text-lg font-bold">{formattedPercentChange}%</span>
            </div>
            <p className="text-xs">
              {isPositiveChange ? 'Improvement' : 'Decline'}
            </p>
          </div>
        </div>
        
        {/* Date range */}
        <div className="text-sm text-muted-foreground mt-2">
          {baselineDate} — {endDate}
        </div>
        
        {/* Total score comparison */}
        <div className="mt-4 p-4 bg-muted/40 rounded-lg">
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">Total Score</div>
            <div className="text-sm">
              {totalCurrentScore}/{totalMaxScore} {higherScoreIsBetter ? '(higher is better)' : '(lower is better)'}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-1">
            <div className="text-xs text-muted-foreground w-20">Baseline:</div>
            <Progress 
              value={(totalBaselineScore / totalMaxScore) * 100} 
              className="h-2.5" 
            />
            <div className="text-xs font-medium w-10">{totalBaselineScore}</div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground w-20">Current:</div>
            <Progress 
              value={(totalCurrentScore / totalMaxScore) * 100} 
              className={cn("h-2.5", isPositiveChange ? "bg-green-500" : "bg-red-500")}
            />
            <div className="text-xs font-medium w-10">{totalCurrentScore}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <h3 className="text-sm font-medium mb-4">Score Components</h3>
        
        <div className="space-y-4">
          {components.map((component) => {
            // Calculate if this component changed positively
            const isComponentPositive = (component.percentChange > 0 && higherScoreIsBetter) || 
                                     (component.percentChange < 0 && !higherScoreIsBetter);
            
            return (
              <div key={component.name} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="font-medium">{component.name}</div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="ml-1.5 inline-flex">
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">{componentDescriptions[component.name] || 'Component of the survey score'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className={isComponentPositive ? "text-green-500" : "text-red-500"}>
                    {isComponentPositive ? '+' : ''}
                    {component.percentChange}%
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground mb-1.5">Before</div>
                    <div className="text-sm font-medium">{component.baselineScore}/{component.maxPossibleScore}</div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground mb-1.5">After</div>
                    <div className={cn("text-sm font-medium", 
                      isComponentPositive ? "text-green-500" : "text-red-500")}>
                      {component.currentScore}/{component.maxPossibleScore}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground mb-1.5">Study Avg</div>
                    <div className="text-sm font-medium">{component.avgStudyScore}/{component.maxPossibleScore}</div>
                  </div>
                </div>
                
                {/* Progress bars for visual comparison */}
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-14 text-xs text-muted-foreground">Before:</div>
                    <Progress 
                      value={(component.baselineScore / component.maxPossibleScore) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-14 text-xs text-muted-foreground">After:</div>
                    <Progress 
                      value={(component.currentScore / component.maxPossibleScore) * 100} 
                      className={cn("h-2", isComponentPositive ? "bg-green-500" : "bg-red-500")}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-14 text-xs text-muted-foreground">Study Avg:</div>
                    <Progress 
                      value={(component.avgStudyScore / component.maxPossibleScore) * 100} 
                      className="h-2 bg-blue-500/50" 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyCard;