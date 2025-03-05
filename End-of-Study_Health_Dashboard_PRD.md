# Product Requirements Document (PRD)
# End-of-Study Health Metrics Dashboard

**Document Version:** 1.0  
**Last Updated:** March 5, 2025  
**Status:** Approved

## 1. Overview

### 1.1 Product Vision
The End-of-Study Health Metrics Dashboard transforms complex health data from clinical studies into a user-friendly, actionable insights platform. It presents comprehensive post-study results from Tryvital's API in a clear, participant-friendly format that emphasizes meaningful outcomes while maintaining scientific integrity.

### 1.2 Target Users
- Study participants who have completed clinical trials
- Individuals with varying levels of health literacy (no medical background assumed)
- Users accessing the dashboard on various devices (mobile, tablet, desktop)

### 1.3 Business Objectives
- Improve participant understanding of study outcomes
- Increase participant satisfaction with study experience
- Provide actionable insights that may lead to sustained behavior change
- Maintain scientific integrity while making data accessible
- Prevent participant bias by showing results only after study completion

## 2. Key Features & Functionality

### 2.1 User Interface Components

#### 2.1.1 Navigation Structure
- **Tab-based navigation** with logical health categories
  - Overview (default landing view)
  - Sleep
  - Activity 
  - Heart
  - Stress
  - Other Factors
- **Sticky header** for persistent access to navigation
- **"Study Complete" banner** indicates that results represent final outcomes

#### 2.1.2 Sticky Chat/Q&A Interface
- **Persistent chat bar** at the top of the screen that follows as users scroll
- **Natural language question input** with single-click submission
- **Most recent answer displayed** with option to view history
- **Suggested questions** based on study context to guide users

#### 2.1.3 Overview Section
- **Study goal summary** with hypothesis and outcome
- **Key stats summary** (duration, findings)
- **"What Improved" section** with:
  - Percentage changes (clearly marked with "+" for increases)
  - Before/After value comparison
  - Trend visualization
  - Health impact label explaining significance
- **"What Decreased" section** with similar layout but red indicators

#### 2.1.4 Category Detail Pages
- **Dedicated section for each health category** (Sleep, Activity, etc.)
- **Full metrics display** with:
  - Primary metrics shown in full cards
  - Secondary metrics in compact grid format
  - Clear percentage change indicators
  - Historical mini-charts
- **Peer comparison tools** allowing users to:
  - Select specific metrics for comparison
  - Filter by demographic groups
  - View their results in context of broader study population

#### 2.1.5 Other Factors Section
- **List of tracked lifestyle factors** that may have influenced results
- **Correlation cards** showing:
  - Factor name
  - Last tracked date
  - Status indicator
  - Associated metrics and their changes

### 2.2 Data Visualization

#### 2.2.1 Metric Cards
- **Status-colored cards** (green for improvement, red for decline, yellow for caution)
- **Percentage change indicators** with appropriate directional symbols
- **Before/After value display** with clear transition indicators
- **Mini-charts** showing historical trends
- **Health impact labels** translating numeric changes into meaningful health context

#### 2.2.2 Comparison Charts
- **Peer comparison visualizations** showing user's results vs. study averages
- **Demographic filtering** to compare with relevant subgroups
- **Primary vs. goal visualization** showing progress toward study targets

#### 2.2.3 Time Series Charts
- **Progress tracking over time** with:
  - Selectable time periods (day/week/month views)
  - Multiple metric overlay options
  - Clear labeling and legends

### 2.3 Intelligent Q&A System

#### 2.3.1 OpenAI Integration
- **Natural language processing** for participant questions
- **Context-aware responses** that incorporate:
  - User's personal metrics
  - Study goals and methodology
  - Scientific health knowledge
- **Suggested questions** based on user's metrics and common inquiries

#### 2.3.2 Question History
- **Saved interaction history** accessible within the app
- **Ability to revisit previous answers**

## 3. Technical Requirements

### 3.1 Frontend Implementation

#### 3.1.1 Core Technologies
- **React** with functional components and hooks
- **TypeScript** for type safety
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** with customized theme
- **Shadcn UI** component library
- **Wouter** for routing

#### 3.1.2 Component Architecture
- **Modular components** for reuse across sections
- **Responsive design** principles for all screen sizes
- **Consistent theming** via theme.json configuration

### 3.2 Backend Implementation

#### 3.2.1 API Structure
- **RESTful endpoints** for data access
- **/api/health-data** - Main data endpoint for all metrics
- **/api/ask-question** - Endpoint for Q&A functionality
- **/api/suggested-questions** - Dynamically generated relevant questions

#### 3.2.2 Data Processing
- **Calculated metrics** derived from raw health data
- **In-memory storage** with structured interfaces
- **OpenAI integration** for question answering

### 3.3 Data Requirements

#### 3.3.1 Data Models
- **StudyInfo** - Study metadata (name, duration, timing)
- **HealthMetric** - Individual health measurements with historical data
- **CategoryData** - Groupings of related metrics
- **CorrelationFactor** - Tracked lifestyle variables
- **Q&A History** - Record of participant questions and answers

## 4. User Experience Details

### 4.1 First-Time User Experience
- **Overview section serves as landing page**
- **Study goal and outcome prominently displayed**
- **Most important metrics highlighted**
- **Suggested questions to start engagement**

### 4.2 Information Hierarchy
1. Study completion status and overall outcome
2. What improved/decreased during the study (key changes)
3. Category-specific detailed metrics
4. Correlation with lifestyle factors
5. Q&A for deeper understanding

### 4.3 Visual Design Principles
- **Color-coded status indicators** (green=improvement, red=decline, yellow=caution)
- **Clean, minimal interface** with focused content areas
- **Clear typography hierarchy** for data readability
- **Consistent iconography** for intuitive understanding
- **Appropriately spaced sections** to prevent information overload

### 4.4 Accessibility Considerations
- **Color combinations** that work for colorblind users
- **Text alternatives** for visual elements
- **Keyboard navigation** support
- **Screen reader compatibility**
- **Responsive layout** for various devices and screen sizes

## 5. Implementation Notes

### 5.1 Development Priorities
1. **Core data display** and navigation structure
2. **Metric visualization components**
3. **Q&A functionality** with OpenAI integration
4. **Responsive design optimization**
5. **Enhanced visual polish** and animations

### 5.2 Known Limitations
- Results are only displayed after study completion
- Historical data limited to the study duration
- Correlations shown do not imply causation (important to communicate to users)

### 5.3 Future Enhancements (Post v1.0)
- **Export functionality** for personal records
- **Additional visualization options** for deeper data exploration
- **Integration with personal health apps** for continued tracking
- **Machine learning-powered personalized recommendations**
- **Animated transitions** between data views
- **Enhanced chart interactivity** with hover states and tooltips

## 6. Success Metrics

### 6.1 User Engagement
- Average session duration > 5 minutes
- Q&A feature used by > 60% of participants
- Multiple tabs explored by > 75% of users

### 6.2 User Satisfaction
- Post-study survey satisfaction rating > 4.2/5
- < 5% dropout rate during dashboard exploration
- Positive qualitative feedback on clarity and usefulness

### 6.3 Business Impact
- Increased participant retention for future studies
- Higher completion rates of post-study surveys
- Positive word-of-mouth leading to easier recruitment

## Appendix A: UI Component Reference

### Key UI Components
- **AppHeader** - Main navigation and study status
- **CategoryHeader** - Section headers with icons and descriptions
- **MetricCard** - Primary display for individual metrics
- **KeyChanges** - Specialized "What Improved/Decreased" section
- **StudyFocus** - Study goal and outcome display
- **PeerComparison** - Comparative visualization tools
- **AskQuestions** - Q&A interface components
- **TimeSeriesChart** - Historical data visualization
- **CorrelationCard** - Other factors display

## Appendix B: Design Assets

Design assets and additional screenshots are available in the project repository under `/attached_assets`.

---

*This PRD is a living document and may be updated as development progresses. All features described represent the target implementation, and technical constraints may require adjustments during development.*