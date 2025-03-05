import { MetricData } from './types';

/**
 * Get text color based on metric status
 */
export function getStatusColor(status: 'success' | 'warning' | 'danger'): string {
  switch (status) {
    case 'success':
      return 'text-green-500';
    case 'warning':
      return 'text-amber-500';
    case 'danger':
      return 'text-red-500';
    default:
      return 'text-green-500';
  }
}

/**
 * Get background color based on metric status
 */
export function getProgressColor(status: 'success' | 'warning' | 'danger'): string {
  switch (status) {
    case 'success':
      return 'bg-green-500';
    case 'warning':
      return 'bg-amber-500';
    case 'danger':
      return 'bg-red-500';
    default:
      return 'bg-green-500';
  }
}

/**
 * Calculate width for progress bars based on percentage change
 */
export function getProgressWidth(percentChange: number): number {
  return Math.min(Math.abs(percentChange) * 5 + 50, 95);
}

/**
 * Generate an interpretation message based on metric data
 */
export function getMetricInterpretation(metric: MetricData): string {
  if (metric.percentChange > 15) {
    return `Your ${metric.name.toLowerCase()} showed significant improvement during the study, with a ${metric.percentChange.toFixed(1)}% increase from your baseline measurements.`;
  } else if (metric.percentChange > 0) {
    return `Your ${metric.name.toLowerCase()} showed moderate improvement during the study, with a ${metric.percentChange.toFixed(1)}% increase from your baseline.`;
  } else if (metric.percentChange < 0) {
    return `Your ${metric.name.toLowerCase()} decreased by ${Math.abs(metric.percentChange).toFixed(1)}% during the study period.`;
  } else {
    return `Your ${metric.name.toLowerCase()} remained stable throughout the study period.`;
  }
}

/**
 * Get trend interpretation based on percentage change
 */
export function getTrendInterpretation(percentChange: number): string {
  if (percentChange > 0) {
    return "a positive response to the intervention.";
  } else if (percentChange < 0) {
    return "a potential area for further investigation.";
  } else {
    return "consistent values throughout the measurement period.";
  }
}

/**
 * Calculate baseline value from current value and percent change
 */
export function calculateBaselineValue(value: number, percentChange: number): number {
  return value - (value * percentChange / 100);
}