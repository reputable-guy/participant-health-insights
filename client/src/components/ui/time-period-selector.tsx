import { TimePeriod } from "@/lib/types";

interface TimePeriodSelectorProps {
  activePeriod: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const TimePeriodSelector = ({ activePeriod, onChange }: TimePeriodSelectorProps) => {
  return (
    <div className="flex space-x-1 bg-surface rounded-full p-1">
      <button 
        className={`px-3 py-1 text-xs rounded-full transition-colors ${
          activePeriod === 'day' 
            ? 'bg-primary text-white' 
            : 'hover:bg-surfaceHover text-muted-foreground'
        }`}
        onClick={() => onChange('day')}
      >
        Day
      </button>
      <button 
        className={`px-3 py-1 text-xs rounded-full transition-colors ${
          activePeriod === 'week' 
            ? 'bg-primary text-white' 
            : 'hover:bg-surfaceHover text-muted-foreground'
        }`}
        onClick={() => onChange('week')}
      >
        Week
      </button>
      <button 
        className={`px-3 py-1 text-xs rounded-full transition-colors ${
          activePeriod === 'month' 
            ? 'bg-primary text-white' 
            : 'hover:bg-surfaceHover text-muted-foreground'
        }`}
        onClick={() => onChange('month')}
      >
        Month
      </button>
    </div>
  );
};

export default TimePeriodSelector;
