import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Moon, ActivityIcon, Heart, Diamond, Sparkles, HelpCircle, Users, Award } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { HealthData, MetricData } from "@/lib/types";
import { format } from "date-fns";

const Insights = () => {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [comparisonFilter, setComparisonFilter] = useState("All Participants");
  const [selectedMetric, setPrimaryMetric] = useState<MetricData | null>(null);
  // State for time period selection in Progress Over Time chart
  const [activePeriod, setActivePeriod] = useState<'day' | 'week' | 'month'>('week');
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/health-data`],
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
  const primaryMetric = sleepCategory?.metrics.find(m => m.name === 'Deep Sleep');

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
      
      <main className="p-4 space-y-6">
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
            
            {/* Your Progress Over Time */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Your Progress Over Time</h2>
              <TimeSeriesChart 
                title={primaryMetric ? `${primaryMetric.name} Trend` : "Deep Sleep Trend"} 
                metrics={primaryMetric ? [primaryMetric] : (sleepCategory?.metrics ? [sleepCategory.metrics[0]] : [])} 
                activePeriod={activePeriod}
                onPeriodChange={setActivePeriod}
              />
            </div>
            
            {/* Questions and Navigation */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Ask Questions Feature - Right in the overview */}
              <div className="col-span-1 md:col-span-3">
                <div className="bg-surface border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Have questions about your results?</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    Our AI assistant can answer questions about your study results and what they mean for your health.
                  </p>
                  
                  <Button onClick={() => setActiveCategory('ask')} className="flex gap-2 items-center">
                    <HelpCircle className="h-4 w-4" /> Ask a Question
                  </Button>
                </div>
              </div>
              
              {/* Jump to section navigation */}
              <div className="col-span-1 md:col-span-1">
                <h3 className="text-sm font-medium mb-2">Explore your results:</h3>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => setActiveCategory('key-changes')} className="flex gap-2 items-center justify-start">
                    <Award className="h-4 w-4" /> Key Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setActiveCategory('sleep')} className="flex gap-2 items-center justify-start">
                    <Moon className="h-4 w-4" /> Sleep
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setActiveCategory('activity')} className="flex gap-2 items-center justify-start">
                    <ActivityIcon className="h-4 w-4" /> Activity
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setActiveCategory('heart')} className="flex gap-2 items-center justify-start">
                    <Heart className="h-4 w-4" /> Heart
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Top Categories - Simplified View */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Your Key Metrics</h2>
              <div className="space-y-4">
                {sleepCategory && (
                  <CategoryHeader title="Sleep" icon={<Moon className="h-5 w-5" />}>
                    <div className="space-y-3">
                      {sleepCategory.metrics.slice(0, 2).map(metric => (
                        <MetricCard key={metric.id} metric={metric} />
                      ))}
                    </div>
                  </CategoryHeader>
                )}
                
                {activityCategory && (
                  <CategoryHeader title="Activity" icon={<ActivityIcon className="h-5 w-5" />}>
                    <div className="space-y-3">
                      <MetricCard metric={activityCategory.metrics[0]} />
                    </div>
                  </CategoryHeader>
                )}
              </div>
            </div>
            
            {/* Correlations Section */}
            <div className="mb-3">
              <CategoryHeader title="Key Correlations" icon={<Sparkles className="h-5 w-5" />}>
                <p className="text-sm text-muted-foreground mb-4">
                  These are factors that appeared to influence your results the most during the study.
                </p>
                {healthData.correlationFactors.map(factor => (
                  <CorrelationCard key={factor.id} factor={factor} />
                ))}
              </CategoryHeader>
            </div>
          </>
        )}
        
        {/* Key Changes Section */}
        {activeCategory === 'key-changes' && (
          <KeyChanges metrics={allMetrics} />
        )}
        
        {/* Sleep Section */}
        {activeCategory === 'sleep' && sleepCategory && (
          <>
            <CategoryHeader title="Sleep" icon={<Moon className="h-5 w-5" />}>
              <div className="space-y-3">
                {/* Featured metrics (full size) */}
                {sleepCategory.metrics.slice(0, 2).map(metric => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
                
                {/* Other metrics (compact grid) */}
                <div className="grid grid-cols-2 gap-3">
                  {sleepCategory.metrics.slice(2).map(metric => (
                    <MetricCard key={metric.id} metric={metric} compact />
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
              <MetricCard metric={activityCategory.metrics[0]} />
              
              {/* Other metrics (compact grid) */}
              <div className="grid grid-cols-2 gap-3">
                {activityCategory.metrics.slice(1).map(metric => (
                  <MetricCard key={metric.id} metric={metric} compact />
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
              <MetricCard metric={cardiovascularCategory.metrics[0]} />
              
              {/* Other metrics (compact grid) */}
              <div className="grid grid-cols-2 gap-3">
                {cardiovascularCategory.metrics.slice(1).map(metric => (
                  <MetricCard key={metric.id} metric={metric} compact />
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
              <MetricCard metric={stressCategory.metrics[0]} />
              
              {/* Other metrics (compact grid) */}
              <div className="grid grid-cols-2 gap-3">
                {stressCategory.metrics.slice(1).map(metric => (
                  <MetricCard key={metric.id} metric={metric} compact />
                ))}
              </div>
            </div>
          </CategoryHeader>
        )}
        
        {/* Ask Questions Section */}
        {activeCategory === 'ask' && (
          <AskQuestions studyName={healthData.studyInfo.studyName} />
        )}
      </main>
    </div>
  );
};

export default Insights;
