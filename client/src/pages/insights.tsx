import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Moon, Activity, ActivityIcon, Heart, Diamond, Sparkles, HelpCircle, Users, Award, MessageSquare, Loader2, ChevronRight, ArrowRight, ArrowUp, ChevronDown, ClipboardList, X } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label } from 'recharts';
import AppHeader from "@/components/app-header";
import CategoryHeader from "@/components/ui/category-header";
import MetricCard from "@/components/ui/metric-card";
import CorrelationCard from "@/components/ui/correlation-card";
import StudyFocus from "@/components/ui/study-focus";
import KeyChanges from "@/components/ui/key-changes";
import StudyImpact from "@/components/ui/study-impact";
import PeerComparison from "@/components/ui/peer-comparison";
import AskQuestions from "@/components/ui/ask-questions";
import TimeSeriesChart from "@/components/ui/time-series-chart";
import MiniChart from "@/components/ui/mini-chart";
import SurveyCard from "@/components/ui/survey-card";
import MetricTimeChart from "@/components/ui/metric-time-chart";
import MetricDetailModal from "@/components/metric-detail-modal";
import TimePeriodSelector from "@/components/ui/time-period-selector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HealthData, MetricData, TimePeriod } from "@/lib/types";
import { format } from "date-fns";
import { psqiSurveyData, sf36SurveyData } from "@/lib/mock-survey-data";

const Insights = () => {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [comparisonFilter, setComparisonFilter] = useState("All Participants");
  const [selectedMetric, setPrimaryMetric] = useState<MetricData | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [askedQuestions, setAskedQuestions] = useState<{question: string, answer: string}[]>([]);
  // State for time period selection in Progress Over Time chart
  const [activePeriod, setActivePeriod] = useState<'day' | 'week' | 'month'>('week');
  // State for tracking which metric chart is being viewed
  const [viewingMetricChart, setViewingMetricChart] = useState<MetricData | null>(null);
  
  const { data, isLoading, error } = useQuery<HealthData>({
    queryKey: [`/api/health-data`],
  });
  
  // Mutation for asking questions
  const askQuestionMutation = useMutation({
    mutationFn: async (question: string) => {
      const studyName = data?.studyInfo?.studyName || "Acupressure Mat Study";
      
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          question,
          studyName
        })
      });
      if (!response.ok) {
        throw new Error('Failed to send question');
      }
      return response.json();
    },
    onSuccess: (data: {question: string, answer: string}) => {
      const newQuestion = {
        question: data.question,
        answer: data.answer
      };
      setAskedQuestions(prev => [newQuestion, ...prev]);
      setCustomQuestion("");
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="animate-pulse p-4">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="h-[200px] bg-gray-700 rounded mb-4"></div>
          <div className="h-[200px] bg-gray-700 rounded mb-4"></div>
          <div className="h-[200px] bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold text-red-500">Error loading data</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  const healthData = data as HealthData;
  
  const sleepCategory = healthData?.categories.find(cat => cat.id === 'sleep');
  const activityCategory = healthData?.categories.find(cat => cat.id === 'activity');
  const cardiovascularCategory = healthData?.categories.find(cat => cat.id === 'cardiovascular');
  const stressCategory = healthData?.categories.find(cat => cat.id === 'stress');

  // Identify primary metric for study focus
  // For this example, we're using Deep Sleep as the primary metric
  const primaryMetric = selectedMetric || sleepCategory?.metrics.find(m => m.name === 'Deep Sleep');

  // Combine all metrics into a single array for key changes section
  const allMetrics = [
    ...(sleepCategory?.metrics || []),
    ...(activityCategory?.metrics || []),
    ...(cardiovascularCategory?.metrics || []),
    ...(stressCategory?.metrics || [])
  ];

  // Get completion date (for demo, we'll use current date minus 5 days)
  const completionDate = format(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 'MMMM d, yyyy');

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <AppHeader 
        studyInfo={healthData.studyInfo}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {/* Sticky chat bar at the top */}
      <div className="sticky top-16 z-10 bg-background shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2">
          {/* Questions input area */}
          <div className="flex items-center border-b border-border pb-2">
            <Textarea 
              placeholder="Ask any question about your results..." 
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="min-h-0 h-10 py-2 resize-none flex-grow mr-2"
              onKeyDown={(e) => {
                // Submit on Enter (without shift key)
                if (e.key === 'Enter' && !e.shiftKey && customQuestion.trim()) {
                  e.preventDefault();
                  askQuestionMutation.mutate(customQuestion);
                }
              }}
            />
            <Button 
              onClick={() => {
                if (customQuestion.trim()) {
                  askQuestionMutation.mutate(customQuestion);
                }
              }}
              disabled={!customQuestion.trim() || askQuestionMutation.isPending}
              size="sm"
            >
              {askQuestionMutation.isPending ? 
                <Loader2 className="h-4 w-4 animate-spin" /> : 
                <MessageSquare className="h-4 w-4" />
              }
            </Button>
          </div>
          
          {/* Most recent answer display (only shows the last answer) */}
          {askedQuestions.length > 0 && (
            <div className="py-2 max-h-[200px] overflow-y-auto border-b border-border">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm font-medium mb-1">{askedQuestions[0].question}</p>
                <p className="text-sm whitespace-pre-line">{askedQuestions[0].answer}</p>
                
                {/* Show more answers button */}
                {askedQuestions.length > 1 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="px-0 text-xs mt-1"
                    onClick={() => setActiveCategory('ask')}
                  >
                    View {askedQuestions.length - 1} more answered question{askedQuestions.length > 2 ? 's' : ''}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <main className="p-4 space-y-6">
        {/* Metric Details with Progress Chart using dedicated component */}
        {viewingMetricChart && (
          <MetricDetailModal
            metric={viewingMetricChart}
            activePeriod={activePeriod}
            onPeriodChange={setActivePeriod}
            onClose={() => setViewingMetricChart(null)}
          />
        )}
        {/* Overview Section */}
        {activeCategory === 'overview' && (
          <>
            {/* How to read your results guide */}
            <div className="mb-6 bg-surface p-3 rounded-lg border border-border">
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                How to read your results
              </h3>
              <p className="text-sm text-muted-foreground">
                This dashboard shows your personal results from the {healthData.studyInfo.studyName}. 
                Start with the main study goal below, then explore your key metrics and trends.
                Use the tabs above to dive deeper into specific health categories.
              </p>
            </div>
            
            {/* Key Stats Summary - More Prominent */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-primary/10 rounded-lg p-4 flex flex-col justify-center items-center">
                <h3 className="text-sm font-medium mb-1 text-center">Study Duration</h3>
                <p className="text-2xl font-semibold">{healthData.studyInfo.totalDays} Days</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 flex flex-col justify-center items-center">
                <h3 className="text-sm font-medium mb-1 text-center">Key Findings</h3>
                <p className="text-2xl font-semibold">{allMetrics.filter(m => Math.abs(m.percentChange) > 5).length}</p>
              </div>
            </div>
            
            {/* Main Study Focus - The most important part */}
            {primaryMetric && (
              <div className="mb-6">
                <StudyFocus 
                  studyName={healthData.studyInfo.studyName}
                  primaryMetric={primaryMetric}
                  hypothesis="Using an acupressure mat for 20 minutes before bedtime will increase deep sleep duration by at least 30%."
                  goalValue={2.2} // Target deep sleep hours
                  targetPercentChange={30} // From hypothesis: "at least 30%"
                  significance={0.031} // p-value
                  groupAvgChange={8.3} // Average study group change
                  confidenceInterval={[5.2, 18.1]} // 95% CI for individual's results
                />
              </div>
            )}
            
            {/* Navigation panel - At the top of the useful content */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Explore your results:</h3>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setActiveCategory('sleep')} className="flex gap-2 items-center">
                  <Moon className="h-4 w-4" /> Sleep
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveCategory('activity')} className="flex gap-2 items-center">
                  <ActivityIcon className="h-4 w-4" /> Activity
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveCategory('heart')} className="flex gap-2 items-center">
                  <Heart className="h-4 w-4" /> Heart
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveCategory('stress')} className="flex gap-2 items-center">
                  <Diamond className="h-4 w-4" /> Stress
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveCategory('surveys')} className="flex gap-2 items-center">
                  <ClipboardList className="h-4 w-4" /> Surveys
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveCategory('other-factors')} className="flex gap-2 items-center">
                  <Sparkles className="h-4 w-4" /> Other Factors
                </Button>
              </div>
            </div>
            
            {/* Key changes section - Styled like the screenshot */}
            <div className="mb-6 space-y-6">
              {/* What Improved Section */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4 flex items-center text-green-500">
                  <ArrowUp className="h-5 w-5 mr-2" /> What Improved
                </h2>
                
                <div className="space-y-6">
                  {/* Improved metrics */}
                  {allMetrics
                    .filter(m => m.percentChange > 0)
                    .sort((a, b) => b.percentChange - a.percentChange)
                    .slice(0, 3)
                    .map(metric => (
                      <div key={metric.id} className="flex items-start">
                        {/* Icon */}
                        <div className="bg-green-800/40 p-2 rounded-full mr-3">
                          <ActivityIcon className="h-6 w-6 text-green-500" />
                        </div>
                        
                        {/* Metric info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-base">{metric.name}</h3>
                              <div className="text-sm text-gray-400 mt-1">
                                Before: {Number(metric.value - (metric.value * metric.percentChange / 100)).toFixed(0)} {metric.unit}
                                <span className="mx-2">→</span>
                                After: {metric.value} {metric.unit}
                              </div>
                            </div>
                            <div className="text-green-500 font-bold">
                              +{metric.percentChange.toFixed(1)}%
                              <div className="text-xs text-gray-400 text-right mt-1">change</div>
                            </div>
                          </div>
                          
                          {/* Simplified chart */}
                          <div className="mt-3 mb-1">
                            <svg width="100%" height="24" viewBox="0 0 100 24" className="text-green-500 stroke-current">
                              <path d="M0,20 C30,15 60,25 100,5" fill="none" strokeWidth="2" />
                            </svg>
                          </div>
                          
                          {/* Health benefit label */}
                          <div className="text-sm text-gray-300 mt-1 text-right">
                            {metric.percentChange > 30 ? 'Major health benefit' : 
                              metric.percentChange > 15 ? 'Better cardiovascular health' : 
                                'Health improvement'}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* What Decreased Section */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4 flex items-center text-red-500">
                  <ChevronDown className="h-5 w-5 mr-2" /> What Decreased
                </h2>
                
                <div className="space-y-6">
                  {/* Decreased metrics */}
                  {allMetrics
                    .filter(m => m.percentChange < 0)
                    .sort((a, b) => a.percentChange - b.percentChange)
                    .slice(0, 2)
                    .map(metric => (
                      <div key={metric.id} className="flex items-start">
                        {/* Icon */}
                        <div className="bg-red-800/40 p-2 rounded-full mr-3">
                          <Activity className="h-6 w-6 text-red-500" />
                        </div>
                        
                        {/* Metric info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-base">{metric.name}</h3>
                              <div className="text-sm text-gray-400 mt-1">
                                Before: {Number(metric.value - (metric.value * metric.percentChange / 100)).toFixed(0)} {metric.unit}
                                <span className="mx-2">→</span>
                                After: {metric.value} {metric.unit}
                              </div>
                            </div>
                            <div className="text-red-500 font-bold">
                              {metric.percentChange.toFixed(1)}%
                              <div className="text-xs text-gray-400 text-right mt-1">change</div>
                            </div>
                          </div>
                          
                          {/* Simplified chart */}
                          <div className="mt-3 mb-1">
                            <svg width="100%" height="24" viewBox="0 0 100 24" className="text-red-500 stroke-current">
                              <path d="M0,5 C30,15 60,5 100,20" fill="none" strokeWidth="2" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Sleep Section */}
        {activeCategory === 'sleep' && sleepCategory && (
          <>
            <CategoryHeader title="Sleep" icon={<Moon className="h-5 w-5" />}>
              <div className="space-y-3">
                {/* Featured metrics (full size) */}
                {sleepCategory.metrics.slice(0, 2).map(metric => (
                  <div key={metric.id} onClick={() => setViewingMetricChart(metric)} className="cursor-pointer">
                    <MetricCard metric={metric} />
                  </div>
                ))}
                
                {/* Other metrics (compact grid) */}
                <div className="grid grid-cols-2 gap-3">
                  {sleepCategory.metrics.slice(2).map(metric => (
                    <div key={metric.id} onClick={() => setViewingMetricChart(metric)} className="cursor-pointer">
                      <MetricCard metric={metric} compact />
                    </div>
                  ))}
                </div>
              </div>
            </CategoryHeader>
            
            {/* Peer Comparison for any selected sleep metric */}
            <div className="my-6">
              <h3 className="text-base font-medium mb-3">Compare With Others</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {sleepCategory.metrics.map(metric => (
                  <Button
                    key={metric.id}
                    variant={primaryMetric && primaryMetric.id === metric.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPrimaryMetric(metric)}
                    className="text-xs h-7"
                  >
                    {metric.name}
                  </Button>
                ))}
              </div>
              {primaryMetric && (
                <PeerComparison 
                  metric={primaryMetric} 
                  activeFilter={comparisonFilter}
                  onFilterChange={setComparisonFilter}
                />
              )}
            </div>
          </>
        )}
        
        {/* Activity Section */}
        {activeCategory === 'activity' && activityCategory && (
          <CategoryHeader title="Activity" icon={<ActivityIcon className="h-5 w-5" />}>
            <div className="space-y-3">
              {/* Featured metrics (full size) */}
              <div onClick={() => setViewingMetricChart(activityCategory.metrics[0])} className="cursor-pointer">
                <MetricCard metric={activityCategory.metrics[0]} />
              </div>
              
              {/* Other metrics (compact grid) */}
              <div className="grid grid-cols-2 gap-3">
                {activityCategory.metrics.slice(1).map(metric => (
                  <div key={metric.id} onClick={() => setViewingMetricChart(metric)} className="cursor-pointer">
                    <MetricCard metric={metric} compact />
                  </div>
                ))}
              </div>
            </div>
          </CategoryHeader>
        )}
        
        {/* Cardiovascular Health */}
        {activeCategory === 'heart' && cardiovascularCategory && (
          <CategoryHeader title="Cardiovascular Health" icon={<Heart className="h-5 w-5" />}>
            <div className="space-y-3">
              {/* Featured metrics (full size) */}
              <div onClick={() => setViewingMetricChart(cardiovascularCategory.metrics[0])} className="cursor-pointer">
                <MetricCard metric={cardiovascularCategory.metrics[0]} />
              </div>
              
              {/* Other metrics (compact grid) */}
              <div className="grid grid-cols-2 gap-3">
                {cardiovascularCategory.metrics.slice(1).map(metric => (
                  <div key={metric.id} onClick={() => setViewingMetricChart(metric)} className="cursor-pointer">
                    <MetricCard metric={metric} compact />
                  </div>
                ))}
              </div>
            </div>
          </CategoryHeader>
        )}
        
        {/* Stress & Recovery */}
        {activeCategory === 'stress' && stressCategory && (
          <CategoryHeader title="Stress & Recovery" icon={<Diamond className="h-5 w-5" />}>
            <div className="space-y-3">
              {/* Featured metrics (full size) */}
              <div onClick={() => setViewingMetricChart(stressCategory.metrics[0])} className="cursor-pointer">
                <MetricCard metric={stressCategory.metrics[0]} />
              </div>
              
              {/* Other metrics (compact grid) */}
              <div className="grid grid-cols-2 gap-3">
                {stressCategory.metrics.slice(1).map(metric => (
                  <div key={metric.id} onClick={() => setViewingMetricChart(metric)} className="cursor-pointer">
                    <MetricCard metric={metric} compact />
                  </div>
                ))}
              </div>
            </div>
          </CategoryHeader>
        )}
        
        {/* Surveys Section */}
        {activeCategory === 'surveys' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <ClipboardList className="h-6 w-6 mr-2 text-primary" />
              Validated Survey Results
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              These surveys were completed at the beginning and end of the study to assess changes in your subjective health metrics.
            </p>
            
            {/* PSQI Survey Card */}
            <SurveyCard 
              surveyName={psqiSurveyData.surveyName}
              description={psqiSurveyData.description}
              baselineDate={psqiSurveyData.baselineDate}
              endDate={psqiSurveyData.endDate}
              totalBaselineScore={psqiSurveyData.totalBaselineScore}
              totalCurrentScore={psqiSurveyData.totalCurrentScore}
              totalMaxScore={psqiSurveyData.totalMaxScore}
              percentChange={psqiSurveyData.percentChange}
              components={psqiSurveyData.components}
              higherScoreIsBetter={psqiSurveyData.higherScoreIsBetter}
            />
            
            {/* SF-36 Survey Card */}
            <SurveyCard 
              surveyName={sf36SurveyData.surveyName}
              description={sf36SurveyData.description}
              baselineDate={sf36SurveyData.baselineDate}
              endDate={sf36SurveyData.endDate}
              totalBaselineScore={sf36SurveyData.totalBaselineScore}
              totalCurrentScore={sf36SurveyData.totalCurrentScore}
              totalMaxScore={sf36SurveyData.totalMaxScore}
              percentChange={sf36SurveyData.percentChange}
              components={sf36SurveyData.components}
              higherScoreIsBetter={sf36SurveyData.higherScoreIsBetter}
            />
          </div>
        )}
        
        {/* Other Factors Section (previously Correlations) */}
        {activeCategory === 'other-factors' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Other Factors</h2>
            <p className="text-sm text-muted-foreground mb-4">
              These are factors that appeared to influence your results the most during the study. They are tracked in the app and may correlate with changes in your metrics.
            </p>
            <div className="space-y-4">
              {healthData.correlationFactors.map(factor => (
                <CorrelationCard key={factor.id} factor={factor} />
              ))}
            </div>
          </div>
        )}
        
        {/* Ask Questions Section - Shows full history */}
        {activeCategory === 'ask' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Questions & Answers</h2>
              <p className="text-muted-foreground mb-4">
                Here you can view all your previous questions about your study results.
              </p>
              
              {/* Display all past questions and answers */}
              {askedQuestions.length > 0 ? (
                <div className="space-y-4">
                  {askedQuestions.map((qa, index) => (
                    <div key={index} className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 p-4 flex items-start">
                        <MessageSquare className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{qa.question}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-background">
                        <p className="whitespace-pre-line">{qa.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-border rounded-lg p-8 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">No questions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Ask your first question using the chat bar at the top of the page.
                  </p>
                  <Button 
                    onClick={() => {
                      // Focus the textarea in the chat input
                      const textarea = document.querySelector('textarea');
                      if (textarea) textarea.focus();
                    }}
                  >
                    Ask a question
                  </Button>
                </div>
              )}
            </div>
            
            {/* Suggested questions section - simplified */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                Suggested Questions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 text-left"
                  onClick={() => {
                    const question = "What does deep sleep do for my body?";
                    askQuestionMutation.mutate(question);
                  }}
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span className="text-sm">What does deep sleep do for my body?</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 text-left"
                  onClick={() => {
                    const question = "How can I maintain these health benefits?";
                    askQuestionMutation.mutate(question);
                  }}
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span className="text-sm">How can I maintain these health benefits?</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 text-left"
                  onClick={() => {
                    const question = "Why did my sleep improve with the acupressure mat?";
                    askQuestionMutation.mutate(question);
                  }}
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Why did my sleep improve with the acupressure mat?</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 text-left"
                  onClick={() => {
                    const question = "What does my data tell you about my sleep patterns?";
                    askQuestionMutation.mutate(question);
                  }}
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span className="text-sm">What does my data tell you about my sleep patterns?</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Insights;