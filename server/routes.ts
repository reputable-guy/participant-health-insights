import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health data API endpoint
  app.get("/api/health-data", async (req, res) => {
    try {
      const period = req.query.period || 'day';
      const userId = 1; // For demo purposes, we're using a fixed userId
      
      const studyInfo = await storage.getStudyInfo(userId);
      const sleepMetrics = await storage.getHealthMetricsByCategory(userId, 'sleep');
      const activityMetrics = await storage.getHealthMetricsByCategory(userId, 'activity');
      const cardiovascularMetrics = await storage.getHealthMetricsByCategory(userId, 'cardiovascular');
      const stressMetrics = await storage.getHealthMetricsByCategory(userId, 'stress');
      const correlationFactors = await storage.getCorrelationFactors(userId);
      
      // Organize metrics by category
      const categories = [
        {
          id: 'sleep',
          title: 'Sleep',
          icon: 'moon',
          metrics: sleepMetrics,
        },
        {
          id: 'activity',
          title: 'Activity',
          icon: 'activity',
          metrics: activityMetrics,
        },
        {
          id: 'cardiovascular',
          title: 'Cardiovascular Health',
          icon: 'heart',
          metrics: cardiovascularMetrics,
        },
        {
          id: 'stress',
          title: 'Stress & Recovery',
          icon: 'diamond',
          metrics: stressMetrics,
        }
      ];
      
      res.json({
        studyInfo,
        categories,
        correlationFactors,
      });
    } catch (error) {
      console.error("Error fetching health data:", error);
      res.status(500).json({ message: "Failed to fetch health data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
