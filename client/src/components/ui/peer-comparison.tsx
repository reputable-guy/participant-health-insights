import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Users, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricData } from "@/lib/types";

// Define comparison data structure
interface ComparisonGroup {
  name: string;
  value: number;
  isUser?: boolean;
}

interface PeerComparisonProps {
  metric: MetricData;
  demographicGroups?: {
    [key: string]: ComparisonGroup[];
  };
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const PeerComparison = ({
  metric,
  demographicGroups = {
    "All Participants": [
      { name: "All Participants", value: metric.comparisonValue * 0.9 },
      { name: "You", value: metric.value, isUser: true },
    ],
    "By Age Group": [
      { name: "18-25", value: metric.comparisonValue * 0.85 },
      { name: "26-35", value: metric.comparisonValue * 0.95 },
      { name: "36-45", value: metric.value * 0.98, isUser: true },
      { name: "46-55", value: metric.comparisonValue * 1.05 },
      { name: "56+", value: metric.comparisonValue * 1.1 },
    ],
    "By Activity Level": [
      { name: "Sedentary", value: metric.comparisonValue * 0.7 },
      { name: "Light", value: metric.comparisonValue * 0.9 },
      { name: "Moderate", value: metric.value * 0.99, isUser: true },
      { name: "Active", value: metric.comparisonValue * 1.2 },
    ],
    "By Sleep Quality": [
      { name: "Poor", value: metric.comparisonValue * 0.6 },
      { name: "Fair", value: metric.comparisonValue * 0.8 },
      { name: "Good", value: metric.value * 1.02, isUser: true },
      { name: "Excellent", value: metric.comparisonValue * 1.3 },
    ]
  },
  activeFilter = "All Participants",
  onFilterChange = () => {}
}: PeerComparisonProps) => {
  const comparisonData = demographicGroups[activeFilter];
  
  // Find user's percentile rank within the current filter group
  const getUserPercentile = () => {
    if (activeFilter === "All Participants") {
      // For simplicity in the demo, we're hardcoding a percentile
      return 73;
    }
    
    // Get user value
    const userGroup = comparisonData.find(group => group.isUser);
    if (!userGroup) return 50;
    
    const userValue = userGroup.value;
    
    // Count how many values are below the user's value
    const valuesBelow = comparisonData.filter(group => group.value < userValue).length;
    
    // Calculate percentile (excluding the user's own data point)
    return Math.round((valuesBelow / (comparisonData.length - 1)) * 100);
  };
  
  const userPercentile = getUserPercentile();
  
  // Determine where the user ranks
  const getUserRankText = () => {
    if (userPercentile >= 90) return "Top 10%";
    if (userPercentile >= 75) return "Top 25%";
    if (userPercentile >= 50) return "Above Average";
    if (userPercentile >= 25) return "Below Average";
    return "Bottom 25%";
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-xs text-muted-foreground">
            {metric.name}: {data.value.toFixed(1)} {metric.unit}
          </p>
          {data.isUser && (
            <p className="text-xs text-primary mt-1">This is you</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Generate descriptive insight based on the comparison
  const getInsight = () => {
    const userValue = comparisonData.find(group => group.isUser)?.value || 0;
    const avgValue = comparisonData.reduce((sum, item) => sum + (item.isUser ? 0 : item.value), 0) / 
                     (comparisonData.length - 1); // Exclude user from average
    
    const percentDiff = ((userValue - avgValue) / avgValue) * 100;
    
    if (percentDiff > 15) {
      return `Your ${metric.name.toLowerCase()} is significantly higher than other participants in the ${activeFilter.toLowerCase()} group.`;
    } else if (percentDiff > 5) {
      return `Your ${metric.name.toLowerCase()} is somewhat higher than other participants in the ${activeFilter.toLowerCase()} group.`;
    } else if (percentDiff < -15) {
      return `Your ${metric.name.toLowerCase()} is significantly lower than other participants in the ${activeFilter.toLowerCase()} group.`;
    } else if (percentDiff < -5) {
      return `Your ${metric.name.toLowerCase()} is somewhat lower than other participants in the ${activeFilter.toLowerCase()} group.`;
    } else {
      return `Your ${metric.name.toLowerCase()} is similar to other participants in the ${activeFilter.toLowerCase()} group.`;
    }
  };
  
  return (
    <Card className="bg-surface border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-primary/10 px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold text-primary">How You Compare</h3>
            </div>
            
            <Badge variant="outline" className="bg-primary/5">
              {getUserRankText()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            See how your {metric.name.toLowerCase()} compares to others
          </p>
        </div>
        
        {/* Comparison chart */}
        <div className="px-4 pt-4">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#666' }}
                />
                <YAxis 
                  hide={true}
                  domain={[
                    0,
                    Math.max(...comparisonData.map(item => item.value)) * 1.1
                  ]}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={comparisonData.find(group => group.isUser)?.value || 0}
                  stroke="var(--primary)"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--muted)"
                  radius={[4, 4, 0, 0]}
                  // Use the shape prop for custom coloring
                  shape={(props: any) => {
                    const { x, y, width, height, value, payload } = props;
                    const fill = payload.isUser ? "var(--primary)" : "var(--muted)";
                    return (
                      <rect 
                        x={x} 
                        y={y} 
                        width={width} 
                        height={height} 
                        fill={fill} 
                        radius={[4, 4, 0, 0]}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-primary/5 p-3 rounded-lg my-3 text-sm">
            {getInsight()}
          </div>
        </div>
        
        {/* Filter buttons */}
        <div className="px-4 pb-4">
          <div className="flex items-center mb-2">
            <Filter className="h-4 w-4 text-muted-foreground mr-1.5" />
            <span className="text-sm text-muted-foreground">Filter comparison</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {Object.keys(demographicGroups).map(filter => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(filter)}
                className="text-xs h-7"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeerComparison;