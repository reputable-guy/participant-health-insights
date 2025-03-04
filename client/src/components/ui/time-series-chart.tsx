import { FC } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TimePeriodSelector from './time-period-selector';
import { MetricData, TimePeriod } from '@/lib/types';

interface TimeSeriesChartProps {
  title: string;
  metrics: MetricData[];
  activePeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

// Helper function to generate time series data
const generateTimeSeriesData = (metrics: MetricData[], period: TimePeriod) => {
  // Generate dates for the x-axis (going backward from today)
  const dates = [];
  const now = new Date();
  const dataPointCount = period === 'day' ? 24 : period === 'week' ? 7 : 30;
  
  // Generate time labels based on the period
  for (let i = dataPointCount - 1; i >= 0; i--) {
    let date: string;
    
    if (period === 'day') {
      date = `${23 - i}:00`;
    } else {
      const pastDate = new Date(now);
      pastDate.setDate(now.getDate() - i);
      date = pastDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
    
    dates.push(date);
  }
  
  // Generate data points for each metric over time
  return dates.map((date, index) => {
    const dataPoint: any = { date };
    
    metrics.forEach(metric => {
      // Base value with some seasonality
      let value = metric.value * (0.85 + 0.3 * Math.random());
      
      // Add a trend component (slight increase over time)
      const trendFactor = 1 + (index / dataPointCount) * 0.15;
      
      // Add some seasonality based on time of day/week/month
      const seasonalComponent = Math.sin(index * Math.PI / (dataPointCount / 2)) * 0.1;
      
      // Add some randomness
      const noise = (Math.random() - 0.5) * 0.05;
      
      // Combine all factors
      const adjustedValue = value * trendFactor * (1 + seasonalComponent + noise);
      
      // Round to one decimal place for cleaner display
      dataPoint[metric.name] = Math.round(adjustedValue * 10) / 10;
    });
    
    return dataPoint;
  });
};

const TimeSeriesChart: FC<TimeSeriesChartProps> = ({
  title,
  metrics,
  activePeriod,
  onPeriodChange
}) => {
  const timeSeriesData = generateTimeSeriesData(metrics, activePeriod);
  
  // Define a consistent color palette for the metrics
  const colorPalette = [
    "#4264fb", // primary blue
    "#12b888", // green
    "#dc3545", // red
    "#fd7e14", // orange
    "#6610f2", // purple
    "#17a2b8", // teal
    "#e83e8c", // pink
    "#6f42c1", // indigo
  ];
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <TimePeriodSelector 
            activePeriod={activePeriod}
            onChange={onPeriodChange}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeriesData}
              margin={{ top: 5, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                stroke="#666"
                tickMargin={10}
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#666" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                itemStyle={{ padding: 0 }}
                labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
              />
              {metrics.length > 1 && (
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconSize={10}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              )}
              
              {metrics.map((metric, index) => (
                <Line
                  key={metric.id}
                  type="monotone"
                  dataKey={metric.name}
                  name={`${metric.name} (${metric.unit})`}
                  stroke={colorPalette[index % colorPalette.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              ))}
              
              {/* Reference line for target value */}
              {metrics.length === 1 && metrics[0].comparisonValue > 0 && (
                <ReferenceLine 
                  y={metrics[0].comparisonValue} 
                  stroke="var(--primary)" 
                  strokeDasharray="3 3"
                  label={{
                    position: 'right',
                    value: 'Target',
                    fill: 'var(--primary)',
                    fontSize: 12
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesChart;