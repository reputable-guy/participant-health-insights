import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { TimePeriod } from '@/lib/types';

interface TimePeriodSelectorProps {
  activePeriod: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const TimePeriodSelector: FC<TimePeriodSelectorProps> = ({ activePeriod, onChange }) => {
  return (
    <div className="flex gap-0.5 rounded-md overflow-hidden border">
      <Button
        variant={activePeriod === 'day' ? 'default' : 'ghost'}
        className="rounded-none h-8 px-3"
        onClick={() => onChange('day')}
        size="sm"
      >
        Day
      </Button>
      <Button
        variant={activePeriod === 'week' ? 'default' : 'ghost'}
        className="rounded-none h-8 px-3"
        onClick={() => onChange('week')}
        size="sm"
      >
        Week
      </Button>
      <Button
        variant={activePeriod === 'month' ? 'default' : 'ghost'}
        className="rounded-none h-8 px-3"
        onClick={() => onChange('month')}
        size="sm"
      >
        Month
      </Button>
    </div>
  );
};

export default TimePeriodSelector;