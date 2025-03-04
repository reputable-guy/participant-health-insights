import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Moon, ActivityIcon, Heart, Diamond, Sparkles } from "lucide-react";
import AppHeader from "@/components/app-header";
import CategoryHeader from "@/components/ui/category-header";
import MetricCard from "@/components/ui/metric-card";
import CorrelationCard from "@/components/ui/correlation-card";
import StudyFocus from "@/components/ui/study-focus";
import KeyChanges from "@/components/ui/key-changes";
import { HealthData } from "@/lib/types";

const Insights = () => {
  const [activeCategory, setActiveCategory] = useState('overview');
  
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
            {/* Study Focus Section */}
            {primaryMetric && (
              <StudyFocus 
                studyName={healthData.studyInfo.studyName}
                primaryMetric={primaryMetric}
                hypothesis="Using an acupressure mat for 20 minutes before bedtime will increase deep sleep duration by at least 30%."
                goalValue={2.2} // Target deep sleep hours
                significance={0.031} // p-value
              />
            )}
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-1">Study Duration</h3>
                <p className="text-xl font-semibold">{healthData.studyInfo.totalDays} Days</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-1">Key Findings</h3>
                <p className="text-xl font-semibold">{allMetrics.filter(m => Math.abs(m.percentChange) > 5).length}</p>
              </div>
            </div>
            
            {/* Top Categories */}
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
            
            {/* Correlations Section */}
            <CategoryHeader title="Key Correlations" icon={<Sparkles className="h-5 w-5" />}>
              {healthData.correlationFactors.map(factor => (
                <CorrelationCard key={factor.id} factor={factor} />
              ))}
            </CategoryHeader>
          </>
        )}
        
        {/* Key Changes Section */}
        {activeCategory === 'key-changes' && (
          <KeyChanges metrics={allMetrics} />
        )}
        
        {/* Sleep Section */}
        {activeCategory === 'sleep' && sleepCategory && (
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
      </main>
    </div>
  );
};

export default Insights;
