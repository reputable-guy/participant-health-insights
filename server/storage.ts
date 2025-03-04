import { 
  users, 
  type User, 
  type InsertUser, 
  healthMetrics, 
  type HealthMetric, 
  type InsertHealthMetric,
  studyInfo,
  type StudyInfo,
  type InsertStudyInfo,
  correlationFactors,
  type CorrelationFactor,
  type InsertCorrelationFactor
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Health Metrics methods
  getHealthMetric(id: number): Promise<HealthMetric | undefined>;
  getHealthMetricsByUserId(userId: number): Promise<HealthMetric[]>;
  getHealthMetricsByCategory(userId: number, category: string): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  
  // Study Info methods
  getStudyInfo(userId: number): Promise<StudyInfo | undefined>;
  createStudyInfo(info: InsertStudyInfo): Promise<StudyInfo>;
  
  // Correlation Factors methods
  getCorrelationFactor(id: number): Promise<CorrelationFactor | undefined>;
  getCorrelationFactors(userId: number): Promise<CorrelationFactor[]>;
  createCorrelationFactor(factor: InsertCorrelationFactor): Promise<CorrelationFactor>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthMetrics: Map<number, HealthMetric>;
  private studyInfos: Map<number, StudyInfo>;
  private correlationFactors: Map<number, CorrelationFactor>;
  
  currentId: number;
  currentMetricId: number;
  currentStudyInfoId: number;
  currentCorrelationFactorId: number;

  constructor() {
    this.users = new Map();
    this.healthMetrics = new Map();
    this.studyInfos = new Map();
    this.correlationFactors = new Map();
    
    this.currentId = 1;
    this.currentMetricId = 1;
    this.currentStudyInfoId = 1;
    this.currentCorrelationFactorId = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Health Metrics methods
  async getHealthMetric(id: number): Promise<HealthMetric | undefined> {
    return this.healthMetrics.get(id);
  }
  
  async getHealthMetricsByUserId(userId: number): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(
      (metric) => metric.userId === userId
    );
  }
  
  async getHealthMetricsByCategory(userId: number, category: string): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(
      (metric) => metric.userId === userId && metric.category === category
    );
  }
  
  async createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.currentMetricId++;
    const newMetric: HealthMetric = { ...metric, id };
    this.healthMetrics.set(id, newMetric);
    return newMetric;
  }
  
  // Study Info methods
  async getStudyInfo(userId: number): Promise<StudyInfo | undefined> {
    return Array.from(this.studyInfos.values()).find(
      (info) => info.userId === userId
    );
  }
  
  async createStudyInfo(info: InsertStudyInfo): Promise<StudyInfo> {
    const id = this.currentStudyInfoId++;
    const newInfo: StudyInfo = { ...info, id };
    this.studyInfos.set(id, newInfo);
    return newInfo;
  }
  
  // Correlation Factors methods
  async getCorrelationFactor(id: number): Promise<CorrelationFactor | undefined> {
    return this.correlationFactors.get(id);
  }
  
  async getCorrelationFactors(userId: number): Promise<CorrelationFactor[]> {
    return Array.from(this.correlationFactors.values()).filter(
      (factor) => factor.userId === userId
    );
  }
  
  async createCorrelationFactor(factor: InsertCorrelationFactor): Promise<CorrelationFactor> {
    const id = this.currentCorrelationFactorId++;
    const newFactor: CorrelationFactor = { ...factor, id };
    this.correlationFactors.set(id, newFactor);
    return newFactor;
  }
  
  // Initialize with sample data for demonstration
  private initSampleData() {
    // Create sample user
    const user: User = {
      id: 1,
      username: 'testuser',
      password: 'password',
    };
    this.users.set(user.id, user);
    
    // Create sample study info
    const sampleStudyInfo: StudyInfo = {
      id: 1,
      userId: 1,
      currentDay: 7,
      totalDays: 30,
      daysRemaining: 23,
      studyName: 'Acupressure Mat For Better Sleep',
    };
    this.studyInfos.set(sampleStudyInfo.id, sampleStudyInfo);
    
    // Create sample health metrics - Sleep metrics
    const sleepMetrics = [
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'sleep',
        name: 'Deep Sleep',
        value: 1.8,
        unit: 'hours',
        comparisonValue: 1.1,
        percentChange: 11.6,
        status: 'success',
        minValue: 0,
        maxValue: 3,
        historicalData: [15, 12, 10, 8, 5, 7, 5],
        tooltip: 'Deep sleep is essential for physical recovery and memory consolidation. Aim for 1.5-2 hours per night.'
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'sleep',
        name: 'HRV',
        value: 95,
        unit: 'ms',
        comparisonValue: 52,
        percentChange: 10.3,
        status: 'warning',
        minValue: 20,
        maxValue: 150,
        historicalData: [10, 12, 8, 7, 11, 6, 9],
        tooltip: 'Heart Rate Variability indicates autonomic nervous system health. Higher values typically indicate better recovery.'
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'sleep',
        name: 'Breathing Rate',
        value: 0.8,
        unit: 'bpm',
        comparisonValue: 13,
        percentChange: 8.3,
        status: 'success',
        minValue: 0,
        maxValue: 20,
        historicalData: [10, 12, 14, 11, 13, 12, 11],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'sleep',
        name: 'Resting Heart Rate',
        value: 68,
        unit: 'bpm',
        comparisonValue: 70,
        percentChange: 5.3,
        status: 'success',
        minValue: 40,
        maxValue: 100,
        historicalData: [72, 71, 69, 68, 70, 67, 68],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'sleep',
        name: 'Sleep Efficiency',
        value: 87,
        unit: '%',
        comparisonValue: 85,
        percentChange: 2.6,
        status: 'success',
        minValue: 0,
        maxValue: 100,
        historicalData: [82, 84, 83, 85, 86, 87, 87],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'sleep',
        name: 'Awake Time',
        value: 0.8,
        unit: 'hours',
        comparisonValue: 0.7,
        percentChange: 2.9,
        status: 'success',
        minValue: 0,
        maxValue: 3,
        historicalData: [0.9, 0.8, 1.0, 0.7, 0.6, 0.7, 0.8],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'sleep',
        name: 'REM Sleep',
        value: 1.4,
        unit: 'hours',
        comparisonValue: 1.5,
        percentChange: 1.2,
        status: 'warning',
        minValue: 0,
        maxValue: 3,
        historicalData: [1.3, 1.4, 1.5, 1.4, 1.3, 1.5, 1.4],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'sleep',
        name: 'Total Sleep',
        value: 7.5,
        unit: 'hours',
        comparisonValue: 7.2,
        percentChange: 6.9,
        status: 'success',
        minValue: 0,
        maxValue: 10,
        historicalData: [7.1, 7.3, 7.2, 7.4, 7.2, 7.6, 7.5],
      },
    ];
    
    // Activity metrics
    const activityMetrics = [
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'activity',
        name: 'Daily Steps',
        value: 9842,
        unit: '',
        comparisonValue: 8608,
        percentChange: 14.3,
        status: 'success',
        minValue: 0,
        maxValue: 15000,
        historicalData: [12, 15, 10, 8, 5, 7, 3],
        tooltip: '10,000 steps daily is recommended for good cardiovascular health and weight management.'
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'activity',
        name: 'Active Calories',
        value: 486,
        unit: 'kcal',
        comparisonValue: 432,
        percentChange: 12.5,
        status: 'success',
        minValue: 0,
        maxValue: 1000,
        historicalData: [450, 420, 470, 480, 500, 460, 486],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'activity',
        name: 'Activity Minutes',
        value: 42,
        unit: 'min',
        comparisonValue: 40,
        percentChange: 4.8,
        status: 'warning',
        minValue: 0,
        maxValue: 120,
        historicalData: [35, 40, 45, 38, 42, 44, 42],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'activity',
        name: 'Floors Climbed',
        value: 11,
        unit: '',
        comparisonValue: 9,
        percentChange: 22.2,
        status: 'success',
        minValue: 0,
        maxValue: 30,
        historicalData: [8, 10, 9, 12, 11, 10, 11],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'activity',
        name: 'Distance',
        value: 6.2,
        unit: 'km',
        comparisonValue: 5.8,
        percentChange: 7.1,
        status: 'success',
        minValue: 0,
        maxValue: 15,
        historicalData: [5.5, 6, 5.8, 6.3, 5.9, 6.1, 6.2],
      },
    ];
    
    // Cardiovascular metrics
    const cardiovascularMetrics = [
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'cardiovascular',
        name: 'VO₂ Max',
        value: 42.5,
        unit: 'ml/kg/min',
        comparisonValue: 39.8,
        percentChange: 6.8,
        status: 'success',
        minValue: 30,
        maxValue: 60,
        historicalData: [10, 12, 15, 10, 8, 7, 5],
        tooltip: 'VO₂ Max represents the maximum amount of oxygen your body can use during exercise. Higher values indicate better cardiorespiratory fitness.'
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'cardiovascular',
        name: 'HR Recovery',
        value: 32,
        unit: 'bpm',
        comparisonValue: 29,
        percentChange: 8.2,
        status: 'success',
        minValue: 10,
        maxValue: 50,
        historicalData: [28, 30, 27, 31, 29, 33, 32],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'cardiovascular',
        name: 'Zone Minutes',
        value: 24,
        unit: 'min',
        comparisonValue: 22,
        percentChange: 3.5,
        status: 'warning',
        minValue: 0,
        maxValue: 60,
        historicalData: [20, 18, 25, 22, 24, 21, 24],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'cardiovascular',
        name: 'Blood Pressure',
        value: 118,
        unit: '',
        comparisonValue: 120,
        percentChange: -1.2,
        status: 'warning',
        minValue: 90,
        maxValue: 140,
        historicalData: [122, 120, 119, 118, 121, 117, 118],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'cardiovascular',
        name: 'Cardio Load',
        value: 3.8,
        unit: '',
        comparisonValue: 3.6,
        percentChange: 6.9,
        status: 'success',
        minValue: 1,
        maxValue: 5,
        historicalData: [3.6, 3.7, 3.9, 3.5, 3.7, 3.8, 3.8],
      },
    ];
    
    // Stress metrics
    const stressMetrics = [
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'stress',
        name: 'Stress Score',
        value: 23,
        unit: '',
        comparisonValue: 26,
        percentChange: -12.4,
        status: 'success',
        minValue: 0,
        maxValue: 100,
        historicalData: [5, 8, 6, 4, 7, 5, 3],
        tooltip: 'Stress Score combines heart rate variability, sleep quality, and activity levels to estimate your body\'s stress level. Lower scores indicate less stress.'
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'stress',
        name: 'Readiness',
        value: 82,
        unit: '',
        comparisonValue: 75,
        percentChange: 9.6,
        status: 'success',
        minValue: 0,
        maxValue: 100,
        historicalData: [76, 78, 74, 80, 79, 81, 82],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'stress',
        name: 'Recovery Time',
        value: 5,
        unit: 'hours',
        comparisonValue: 6,
        percentChange: -16.7,
        status: 'success',
        minValue: 0,
        maxValue: 24,
        historicalData: [7, 6, 5, 7, 6, 5, 5],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'stress',
        name: 'Meditation',
        value: 20,
        unit: 'min',
        comparisonValue: 15,
        percentChange: 33.3,
        status: 'success',
        minValue: 0,
        maxValue: 60,
        historicalData: [15, 15, 20, 15, 20, 20, 20],
      },
      {
        id: this.currentMetricId++,
        userId: 1,
        date: new Date(),
        category: 'stress',
        name: 'Body Battery',
        value: 74,
        unit: '',
        comparisonValue: 71,
        percentChange: 4.2,
        status: 'warning',
        minValue: 0,
        maxValue: 100,
        historicalData: [65, 70, 75, 68, 72, 71, 74],
      },
    ];
    
    // Store all metrics
    [...sleepMetrics, ...activityMetrics, ...cardiovascularMetrics, ...stressMetrics].forEach(metric => {
      this.healthMetrics.set(metric.id, metric);
    });
    
    // Correlation factors
    const correlationFactors = [
      {
        id: this.currentCorrelationFactorId++,
        userId: 1,
        factorName: 'Illness',
        lastTracked: new Date().toISOString().split('T')[0],
        status: true,
        metrics: [
          {
            name: 'Deep Sleep',
            percentChange: 17.8,
            status: 'success',
            value: 1.8
          },
          {
            name: 'Heart Rate Variability',
            percentChange: 10.7,
            status: 'warning',
            value: 95
          },
          {
            name: 'Breathing Rate',
            percentChange: 6.2,
            status: 'success',
            value: 0.8
          },
          {
            name: 'REM Sleep',
            percentChange: -5.2,
            status: 'danger',
            value: 1.4
          }
        ]
      },
      {
        id: this.currentCorrelationFactorId++,
        userId: 1,
        factorName: 'Meditation',
        lastTracked: new Date().toISOString().split('T')[0],
        status: true,
        metrics: [
          {
            name: 'Deep Sleep',
            percentChange: 17.8,
            status: 'success',
            value: 1.8
          },
          {
            name: 'Heart Rate Variability',
            percentChange: 15.2,
            status: 'success',
            value: 95
          },
          {
            name: 'Breathing Rate',
            percentChange: 6.2,
            status: 'success',
            value: 0.8
          },
          {
            name: 'REM Sleep',
            percentChange: -5.2,
            status: 'danger',
            value: 1.4
          }
        ]
      }
    ];
    
    correlationFactors.forEach(factor => {
      this.correlationFactors.set(factor.id, factor);
    });
  }
}

export const storage = new MemStorage();
