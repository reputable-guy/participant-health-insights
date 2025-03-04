import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStudyResponse, generateSuggestedQuestions } from './openai';

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

  // OpenAI-powered Ask questions endpoint
  app.post("/api/ask-question", async (req, res) => {
    try {
      const { question, studyName } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: "Question is required" });
      }
      
      // In a real app, we would fetch this data from the database for the specific user
      // For now, we'll use mock data
      const studyDetails = {
        primaryMetric: "Deep Sleep",
        percentChange: 14.2,
        significance: 0.031,
        totalDays: 28,
        goalValue: 2.1
      };
      
      const answer = await generateStudyResponse(
        question,
        studyName || "Acupressure Sleep Study",
        studyDetails
      );
      
      res.status(200).json({ question, answer });
    } catch (error) {
      console.error("Error processing question:", error);
      res.status(500).json({ 
        error: "An error occurred while processing your question"
      });
    }
  });

  // Generate suggested questions based on study context
  app.get("/api/suggested-questions", async (req, res) => {
    try {
      const { studyName, metric, category } = req.query;
      
      const questions = await generateSuggestedQuestions(
        String(studyName || "Sleep Study"),
        String(metric || "Deep Sleep"),
        String(category || "Sleep")
      );
      
      res.status(200).json({ questions });
    } catch (error) {
      console.error("Error generating suggested questions:", error);
      res.status(500).json({ 
        error: "An error occurred while generating questions",
        questions: [
          "How can I improve my sleep quality?",
          "What does deep sleep tell me about my health?",
          "Are my sleep results normal?",
          "How often should I monitor my sleep?",
          "What lifestyle changes affect sleep the most?"
        ]
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
