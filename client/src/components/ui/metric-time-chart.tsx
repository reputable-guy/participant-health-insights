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
  ReferenceLine,
  Label
} from 'recharts';
import { MetricData, TimePeriod } from '@/lib/types';

interface MetricTimeChartProps {
  metric: MetricData;
  activePeriod: TimePeriod;
}

/**
 * Component for rendering a time chart showing pre-study and during-study data
 * with a gradient line color transition at the study start point
 */
const MetricTimeChart: FC<MetricTimeChartProps> = ({ metric, activePeriod }) => {
  // Generate data points for the chart based on the metric
  const timeSeriesData = [
    { time: "3 weeks before", value: Math.round(metric.value * 0.7), phase: "pre" },
    { time: "2 weeks before", value: Math.round(metric.value * 0.75), phase: "pre" },
    { time: "1 week before", value: Math.round(metric.value * 0.8), phase: "pre" },
    { time: "Study week 1", value: Math.round(metric.value * 0.85), phase: "during" },
    { time: "Study week 2", value: Math.round(metric.value * 0.92), phase: "during" },
    { time: "Study week 3", value: Math.round(metric.value * 0.96), phase: "during" },
    { time: "Study end", value: metric.value, phase: "during" }
  ];

  // Calculate the percentage of pre-study data points for gradient color transition
  const preStudyPercentage = (3 / 7) * 100; // 3 pre-study points out of 7 total

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        data={timeSeriesData}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
        <XAxis 
          dataKey="time"
          tick={{ fontSize: 12 }}
          tickMargin={10}
        />
        <YAxis 
          domain={[0, Math.ceil(metric.value * 1.2)]}
          tickFormatter={(value) => `${value}${metric.unit}`}
          label={{ value: `${metric.unit}`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: "#111", borderColor: "#333" }}
          formatter={(value) => [`${value} ${metric.unit}`, metric.name]}
          labelFormatter={(label) => `Time: ${label}`}
        />
        
        {/* Study start reference line */}
        <ReferenceLine x="Study week 1" stroke="#666" strokeDasharray="3 3">
          <Label value="Study Start" position="top" fill="#888" />
        </ReferenceLine>
        
        {/* Single line with different colors for pre and during study */}
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#888" />
            <stop offset={`${preStudyPercentage}%`} stopColor="#888" />
            <stop offset={`${preStudyPercentage + 0.01}%`} stopColor="#4264fb" />
            <stop offset="100%" stopColor="#4264fb" />
          </linearGradient>
        </defs>
        
        {/* Main line with gradient color */}
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="url(#colorGradient)" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 8 }}
          name={metric.name}
        />
        
        {/* Pre-study dots (gray) */}
        <Line 
          type="monotone"
          dataKey="value"
          data={timeSeriesData.filter(d => d.phase === "pre")}
          stroke="none"
          dot={{ fill: "#888", r: 5 }}
          activeDot={false}
          name="Pre-study"
        />
        
        {/* During-study dots (blue) */}
        <Line 
          type="monotone"
          dataKey="value"
          data={timeSeriesData.filter(d => d.phase === "during")}
          stroke="none"
          dot={{ fill: "#4264fb", r: 5 }}
          activeDot={false}
          name="During-study"
        />
        
        {/* Legend items */}
        <Legend
          content={() => {
            return (
              <div className="flex flex-col items-start text-sm mt-2">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  <span>Pre-study baseline</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  <span>{metric.name}</span>
                </div>
              </div>
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MetricTimeChart;