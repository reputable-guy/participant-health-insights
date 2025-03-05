import { useState } from "react";
import { User, Menu, Award, ChevronLeft } from "lucide-react";
import { StudyInfo } from "@/lib/types";

interface AppHeaderProps {
  studyInfo: StudyInfo;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const AppHeader = ({ 
  studyInfo, 
  activeCategory,
  onCategoryChange
}: AppHeaderProps) => {
  
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
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
      </header>
      
      {/* Study Results Banner */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary/10">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-primary mr-2" />
          <span className="font-medium">Study Complete</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Final Results
        </div>
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
          className={`pb-2 mr-6 ${activeCategory === 'other-factors' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => onCategoryChange('other-factors')}
        >
          Other Factors
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
          className={`pb-2 mr-6 ${activeCategory === 'stress' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => onCategoryChange('stress')}
        >
          Stress
        </button>
        <button 
          className={`pb-2 ${activeCategory === 'ask' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => onCategoryChange('ask')}
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
