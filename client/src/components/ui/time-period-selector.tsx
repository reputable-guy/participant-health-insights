import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { TimePeriod } from '@/lib/types';

interface TimePeriodSelectorProps {
  activePeriod: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const TimePeriodSelector: FC<TimePeriodSelectorProps> = ({ activePeriod, onChange }) => {
  return (
    <div className="inline-flex rounded-md shadow-sm">
      <Button
        variant={activePeriod === 'day' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('day')}
        className={`rounded-l-md rounded-r-none ${activePeriod === 'day' ? '' : 'text-muted-foreground'}`}
      >
        Daily
      </Button>
      <Button
        variant={activePeriod === 'week' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('week')}
        className={`rounded-none border-l-0 border-r-0 ${activePeriod === 'week' ? '' : 'text-muted-foreground'}`}
      >
        Weekly
      </Button>
      <Button
        variant={activePeriod === 'month' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('month')}
        className={`rounded-r-md rounded-l-none ${activePeriod === 'month' ? '' : 'text-muted-foreground'}`}
      >
        Monthly
      </Button>
    </div>
  );
};

export default TimePeriodSelector;