import { useState } from "react";
import { User, Menu, Filter } from "lucide-react";
import { StudyInfo } from "@/lib/types";
import TimePeriodSelector from "./ui/time-period-selector";
import { TimePeriod } from "@/lib/types";

interface AppHeaderProps {
  studyInfo: StudyInfo;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const AppHeader = ({ 
  studyInfo, 
  timePeriod, 
  onTimePeriodChange,
  activeCategory,
  onCategoryChange
}: AppHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  return (
    <div className="sticky top-0 z-50 bg-background">
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center">
          <button className="w-8 h-8 rounded-full bg-surface flex items-center justify-center mr-4">
            <User className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center">
            <img 
              src="https://img.icons8.com/fluency/48/000000/sleeping-pill.png" 
              alt="Logo" 
              className="h-6 w-6"
            />
            <h1 className="ml-2 text-lg font-semibold">{studyInfo.studyName}</h1>
          </div>
        </div>
        <button>
          <Menu className="h-6 w-6 text-foreground" />
        </button>
      </header>
      
      {/* Study Info Bar */}
      <div className="flex justify-between px-4 py-2 bg-surface">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#4CAF50] mr-2"></div>
          <span className="text-sm text-muted-foreground">
            Day of study: <span className="text-foreground">{studyInfo.currentDay}/{studyInfo.totalDays}</span>
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#FF9800] mr-2"></div>
          <span className="text-sm text-muted-foreground">{studyInfo.daysRemaining} days before</span>
        </div>
      </div>
      
      {/* Filter Bar */}
      <div className="px-4 py-2 flex justify-between items-center">
        <button 
          className="flex items-center text-sm px-4 py-2 rounded-full bg-surface hover:bg-surfaceHover transition"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter Health Metrics
        </button>
        
        <TimePeriodSelector 
          activePeriod={timePeriod} 
          onChange={onTimePeriodChange} 
        />
      </div>
      
      {/* Category Tabs */}
      <div className="pt-2 px-4 border-b border-gray-800 flex overflow-x-auto hide-scrollbar">
        <button 
          className={`pb-2 mr-6 ${activeCategory === 'overview' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => onCategoryChange('overview')}
        >
          Overview
        </button>
        <button 
          className={`pb-2 mr-6 ${activeCategory === 'sleep' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => onCategoryChange('sleep')}
        >
          Sleep
        </button>
        <button 
          className={`pb-2 mr-6 ${activeCategory === 'activity' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => onCategoryChange('activity')}
        >
          Activity
        </button>
        <button 
          className={`pb-2 mr-6 ${activeCategory === 'heart' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => onCategoryChange('heart')}
        >
          Heart
        </button>
        <button 
          className={`pb-2 mr-6 ${activeCategory === 'respiratory' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => onCategoryChange('respiratory')}
        >
          Respiratory
        </button>
        <button 
          className={`pb-2 ${activeCategory === 'stress' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => onCategoryChange('stress')}
        >
          Stress
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
