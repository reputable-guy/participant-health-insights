export interface MetricData {
  id: number;
  name: string;
  value: number;
  unit: string;
  comparisonValue: number;
  percentChange: number;
  status: 'success' | 'warning' | 'danger';
  historicalData: number[];
  tooltip?: string;
}

export interface CategoryData {
  id: string;
  title: string;
  icon: string;
  metrics: MetricData[];
}

export interface StudyInfo {
  currentDay: number;
  totalDays: number;
  daysRemaining: number;
  studyName: string;
}

export interface CorrelationMetric {
  name: string;
  percentChange: number;
  status: 'success' | 'warning' | 'danger';
  value: number;
}

export interface CorrelationFactor {
  id: number;
  factorName: string;
  lastTracked: string;
  status: boolean;
  metrics: CorrelationMetric[];
}

export type TimePeriod = 'day' | 'week' | 'month';

export interface HealthData {
  studyInfo: StudyInfo;
  categories: CategoryData[];
  correlationFactors: CorrelationFactor[];
}
