import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Moon, ActivityIcon, Heart, Wind, Diamond, Sparkles } from "lucide-react";
import AppHeader from "@/components/app-header";
import CategoryHeader from "@/components/ui/category-header";
import MetricCard from "@/components/ui/metric-card";
import CorrelationCard from "@/components/ui/correlation-card";
import { HealthData, TimePeriod } from "@/lib/types";

const Insights = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('day');
  const [activeCategory, setActiveCategory] = useState('overview');
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/health-data?period=${timePeriod}`],
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

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <AppHeader 
        studyInfo={healthData.studyInfo}
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <main className="p-4 space-y-4">
        {/* Sleep Section */}
        {(activeCategory === 'overview' || activeCategory === 'sleep') && sleepCategory && (
          <CategoryHeader 
            title="Sleep" 
            icon={<Moon className="h-5 w-5" />}
          >
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
        {(activeCategory === 'overview' || activeCategory === 'activity') && activityCategory && (
          <CategoryHeader 
            title="Activity" 
            icon={<ActivityIcon className="h-5 w-5" />}
          >
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
        {(activeCategory === 'overview' || activeCategory === 'heart') && cardiovascularCategory && (
          <CategoryHeader 
            title="Cardiovascular Health" 
            icon={<Heart className="h-5 w-5" />}
          >
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
        {(activeCategory === 'overview' || activeCategory === 'stress') && stressCategory && (
          <CategoryHeader 
            title="Stress & Recovery" 
            icon={<Diamond className="h-5 w-5" />}
          >
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
        
        {/* Correlations Section */}
        {(activeCategory === 'overview') && (
          <CategoryHeader 
            title="Factors & Correlations" 
            icon={<Sparkles className="h-5 w-5" />}
          >
            {healthData.correlationFactors.map(factor => (
              <CorrelationCard key={factor.id} factor={factor} />
            ))}
          </CategoryHeader>
        )}
      </main>
    </div>
  );
};

export default Insights;
