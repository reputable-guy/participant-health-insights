// Mock PSQI (Pittsburgh Sleep Quality Index) survey data
export const psqiSurveyData = {
  surveyName: "Pittsburgh Sleep Quality Index (PSQI)",
  description: "A self-rated questionnaire which assesses sleep quality and disturbances over a 1-month time interval.",
  baselineDate: "January 10, 2025",
  endDate: "February 14, 2025",
  totalBaselineScore: 13,
  totalCurrentScore: 7,
  totalMaxScore: 21,
  percentChange: -46.2, // Negative value because lower PSQI scores are better (indicating better sleep quality)
  components: [
    {
      name: "Sleep Quality",
      baselineScore: 2,
      currentScore: 1,
      percentChange: -50,
      avgStudyScore: 1.4,
      maxPossibleScore: 3,
      higherIsBetter: false
    },
    {
      name: "Sleep Latency",
      baselineScore: 3,
      currentScore: 1,
      percentChange: -66.7,
      avgStudyScore: 1.7,
      maxPossibleScore: 3,
      higherIsBetter: false
    },
    {
      name: "Sleep Duration",
      baselineScore: 2,
      currentScore: 1,
      percentChange: -50,
      avgStudyScore: 1.6,
      maxPossibleScore: 3,
      higherIsBetter: false
    },
    {
      name: "Sleep Efficiency",
      baselineScore: 1,
      currentScore: 1,
      percentChange: 0,
      avgStudyScore: 1.2,
      maxPossibleScore: 3,
      higherIsBetter: false
    },
    {
      name: "Sleep Disturbances",
      baselineScore: 2,
      currentScore: 1,
      percentChange: -50,
      avgStudyScore: 1.8,
      maxPossibleScore: 3,
      higherIsBetter: false
    },
    {
      name: "Sleep Medication",
      baselineScore: 1,
      currentScore: 0,
      percentChange: -100,
      avgStudyScore: 0.8,
      maxPossibleScore: 3,
      higherIsBetter: false
    },
    {
      name: "Daytime Dysfunction",
      baselineScore: 2,
      currentScore: 2,
      percentChange: 0,
      avgStudyScore: 1.9,
      maxPossibleScore: 3,
      higherIsBetter: false
    }
  ],
  higherScoreIsBetter: false // For PSQI, lower scores are better
};

// Mock SF-36 (Short Form Health Survey) for additional survey data
export const sf36SurveyData = {
  surveyName: "SF-36 Health Survey",
  description: "A 36-item survey that evaluates eight health concepts including physical functioning and mental health.",
  baselineDate: "January 10, 2025",
  endDate: "February 14, 2025",
  totalBaselineScore: 65,
  totalCurrentScore: 82,
  totalMaxScore: 100,
  percentChange: 26.2, // Positive because higher SF-36 scores are better
  components: [
    {
      name: "Physical Functioning",
      baselineScore: 70,
      currentScore: 85,
      percentChange: 21.4,
      avgStudyScore: 79,
      maxPossibleScore: 100,
      higherIsBetter: true
    },
    {
      name: "Role-Physical",
      baselineScore: 50,
      currentScore: 75,
      percentChange: 50,
      avgStudyScore: 68,
      maxPossibleScore: 100,
      higherIsBetter: true
    },
    {
      name: "Bodily Pain",
      baselineScore: 60,
      currentScore: 80,
      percentChange: 33.3,
      avgStudyScore: 72,
      maxPossibleScore: 100,
      higherIsBetter: true
    },
    {
      name: "General Health",
      baselineScore: 65,
      currentScore: 80,
      percentChange: 23.1,
      avgStudyScore: 75,
      maxPossibleScore: 100,
      higherIsBetter: true
    },
    {
      name: "Vitality",
      baselineScore: 55,
      currentScore: 80,
      percentChange: 45.5,
      avgStudyScore: 70,
      maxPossibleScore: 100,
      higherIsBetter: true
    },
    {
      name: "Social Functioning",
      baselineScore: 70,
      currentScore: 85,
      percentChange: 21.4,
      avgStudyScore: 80,
      maxPossibleScore: 100,
      higherIsBetter: true
    },
    {
      name: "Role-Emotional",
      baselineScore: 67,
      currentScore: 83,
      percentChange: 23.9,
      avgStudyScore: 74,
      maxPossibleScore: 100,
      higherIsBetter: true
    },
    {
      name: "Mental Health",
      baselineScore: 72,
      currentScore: 87,
      percentChange: 20.8,
      avgStudyScore: 81,
      maxPossibleScore: 100,
      higherIsBetter: true
    }
  ],
  higherScoreIsBetter: true // For SF-36, higher scores are better
};