import { useMemo } from "react";

interface MiniChartProps {
  data: number[];
  color: string;
}

const MiniChart = ({ data, color }: MiniChartProps) => {
  const normalizedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Normalize data to fit in the chart height (0-20)
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    return data.map(value => 15 - ((value - min) / range) * 10);
  }, [data]);
  
  // Create path from data points
  const path = useMemo(() => {
    if (normalizedData.length === 0) return "";
    
    const width = 60;
    const segments = normalizedData.length - 1;
    const stepSize = width / segments;
    
    return normalizedData.map((point, i) => {
      const x = i * stepSize;
      const y = point;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ");
  }, [normalizedData]);

  if (!data || data.length === 0) {
    return <div className="w-[60px] h-5"></div>;
  }

  return (
    <div className="w-[60px] h-5 relative">
      <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 60 20">
        <path d={path} stroke={color} strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};

export default MiniChart;
