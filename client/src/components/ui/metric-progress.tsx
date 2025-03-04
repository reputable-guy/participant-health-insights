interface MetricProgressProps {
  progressColor: string;
  progressWidth: number;
}

const MetricProgress = ({ progressColor, progressWidth }: MetricProgressProps) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5">
      <div 
        className={`${progressColor} h-1.5 rounded-full`} 
        style={{ width: `${progressWidth}%` }}
      ></div>
    </div>
  );
};

export default MetricProgress;
